package Devpilot.backend.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Devpilot.backend.dto.GitHubRepoResponse;
import Devpilot.backend.entity.IndexStatus;
import Devpilot.backend.entity.Repository;
import Devpilot.backend.entity.User;
import Devpilot.backend.exceptions.BadRequestException;
import Devpilot.backend.exceptions.NotFoundException;
import Devpilot.backend.repository.CodeChunkRepository;
import Devpilot.backend.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RepositoryService {

    private final RepositoryRepository repositoryRepository;
    private final CodeChunkRepository codeChunkRepository;
    private final GitHubService gitHubService;
    private final UserService userService;
    private final IndexingService indexingService;

    public List<Repository> listUserRepositories(UUID userId) {
        return repositoryRepository.findByUserId(userId);
    }

    public List<GitHubRepoResponse> listGitHubRepositories(User user) {
        String token = userService.decryptAccessToken(user);
        return gitHubService.fetchUserRepositories(token);
    }

    @Transactional
    public Repository addRepository(UUID userId, long githubId) {
        // Check if already added
        repositoryRepository.findByUserIdAndGithubUrlId(userId, githubId)
                .ifPresent(existing -> {
                    throw new BadRequestException("Repository already added", "githubId");
                });

        User user = userService.requiredById(userId);
        String token = userService.decryptAccessToken(user);

        GitHubRepoResponse ghRepo = gitHubService.fetchRepositoryById(githubId, token);
        if (ghRepo == null) {
            throw new NotFoundException("GitHub repository not found", "githubId");
        }

        Repository repo = Repository.builder()
                .userId(userId)
                .githubUrlId(ghRepo.id())
                .owner(ghRepo.owner().login())
                .name(ghRepo.name())
                .fullName(ghRepo.fullName())
                .isPrivate(ghRepo.isPrivate())
                .description(ghRepo.description())
                .htmlUrl(ghRepo.htmlUrl())
                .language(ghRepo.language())
                .defaultBranch(ghRepo.defaultBranch())
                .indexStatus(IndexStatus.PENDING)
                .build();

        return repositoryRepository.save(repo);
    }

    @Transactional
    public void removeRepository(UUID repoId, UUID userId) {
        Repository repo = repositoryRepository.findByIdAndUserId(repoId, userId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));
        codeChunkRepository.deleteByRepositoryId(repo.getId());
        repositoryRepository.delete(repo);
    }

    public Repository getRepositoryById(UUID repoId) {
        return repositoryRepository.findById(repoId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));
    }

    public Repository getRepositoryByIdAndUser(UUID repoId, UUID userId) {
        return repositoryRepository.findByIdAndUserId(repoId, userId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));
    }

    public void triggerIndexing(UUID repoId, UUID userId) {
        Repository repo = getRepositoryByIdAndUser(repoId, userId);
        if (repo.getIndexStatus() == IndexStatus.INDEXING) {
            throw new BadRequestException("Repository is already being indexed");
        }

        User user = userService.requiredById(userId);
        String token = userService.decryptAccessToken(user);

        repo.setIndexStatus(IndexStatus.INDEXING);
        repo.setErrorMessage(null);
        repo.setFilesTotal(0);
        repo.setFilesProcessed(0);
        repo.setChunkCount(0);
        repositoryRepository.save(repo);

        // Run async
        indexingService.indexRepository(repo.getId(), token);
    }
}
