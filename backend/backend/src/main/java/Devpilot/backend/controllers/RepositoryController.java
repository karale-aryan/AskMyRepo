package Devpilot.backend.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Devpilot.backend.dto.AddRepositoryRequest;
import Devpilot.backend.dto.GitHubRepoResponse;
import Devpilot.backend.dto.RepositoryResponse;
import Devpilot.backend.entity.Repository;
import Devpilot.backend.entity.User;
import Devpilot.backend.security.CurrentUser;
import Devpilot.backend.services.RepositoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/repositories")
@RequiredArgsConstructor
public class RepositoryController {

    private final RepositoryService repositoryService;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<List<RepositoryResponse>> listRepositories() {
        UUID userId = currentUser.require().getId();
        List<Repository> repos = repositoryService.listUserRepositories(userId);
        List<RepositoryResponse> response = repos.stream()
                .map(RepositoryResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/github")
    public ResponseEntity<List<GitHubRepoResponse>> listGitHubRepositories() {
        User user = currentUser.require().getUser();
        List<GitHubRepoResponse> repos = repositoryService.listGitHubRepositories(user);
        return ResponseEntity.ok(repos);
    }

    @PostMapping
    public ResponseEntity<RepositoryResponse> addRepository(@RequestBody AddRepositoryRequest request) {
        UUID userId = currentUser.require().getId();
        Repository repo = repositoryService.addRepository(userId, request.githubId());
        return ResponseEntity.status(HttpStatus.CREATED).body(RepositoryResponse.from(repo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeRepository(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        repositoryService.removeRepository(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepositoryResponse> getRepository(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        Repository repo = repositoryService.getRepositoryByIdAndUser(id, userId);
        return ResponseEntity.ok(RepositoryResponse.from(repo));
    }

    @PostMapping("/{id}/index")
    public ResponseEntity<RepositoryResponse> triggerIndexing(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        repositoryService.triggerIndexing(id, userId);
        Repository repo = repositoryService.getRepositoryById(id);
        return ResponseEntity.ok(RepositoryResponse.from(repo));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<RepositoryResponse> getStatus(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        Repository repo = repositoryService.getRepositoryByIdAndUser(id, userId);
        return ResponseEntity.ok(RepositoryResponse.from(repo));
    }
}
