package Devpilot.backend.dto;

import java.time.Instant;
import java.util.UUID;

import Devpilot.backend.entity.IndexStatus;
import Devpilot.backend.entity.Repository;

public record RepositoryResponse(
        UUID id,
        long githubUrlId,
        String owner,
        String name,
        String fullName,
        boolean isPrivate,
        String description,
        String htmlUrl,
        String language,
        String defaultBranch,
        IndexStatus indexStatus,
        Instant indexedAt,
        int chunkCount,
        int filesTotal,
        int filesProcessed,
        String errorMessage,
        Instant createdAt) {

    public static RepositoryResponse from(Repository repo) {
        return new RepositoryResponse(
                repo.getId(),
                repo.getGithubUrlId(),
                repo.getOwner(),
                repo.getName(),
                repo.getFullName(),
                repo.isPrivate(),
                repo.getDescription(),
                repo.getHtmlUrl(),
                repo.getLanguage(),
                repo.getDefaultBranch(),
                repo.getIndexStatus(),
                repo.getIndexedAt(),
                repo.getChunkCount(),
                repo.getFilesTotal(),
                repo.getFilesProcessed(),
                repo.getErrorMessage(),
                repo.getCreatedAt());
    }
}
