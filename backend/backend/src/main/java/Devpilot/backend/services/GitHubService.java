package Devpilot.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import Devpilot.backend.dto.GitHubRepoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubService {

    private final RestClient githubRestClient;

    @Value("${app.github.api-delay-ms:50}")
    private long apiDelayMs;

    public List<GitHubRepoResponse> fetchUserRepositories(String accessToken) {
        GitHubRepoResponse[] repos = githubRestClient.get()
                .uri("/user/repos?per_page=100&sort=updated&direction=desc")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(GitHubRepoResponse[].class);
        return repos != null ? Arrays.asList(repos) : List.of();
    }

    public GitHubRepoResponse fetchRepository(String owner, String repo, String accessToken) {
        return githubRestClient.get()
                .uri("/repos/{owner}/{repo}", owner, repo)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(GitHubRepoResponse.class);
    }

    public GitHubRepoResponse fetchRepositoryById(long githubId, String accessToken) {
        return githubRestClient.get()
                .uri("/repositories/{id}", githubId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(GitHubRepoResponse.class);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> fetchRepoTree(String owner, String repo, String branch,
            String accessToken) {
        Map<String, Object> response = githubRestClient.get()
                .uri("/repos/{owner}/{repo}/git/trees/{branch}?recursive=1", owner, repo, branch)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {
                });
        if (response != null && response.containsKey("tree")) {
            return (List<Map<String, Object>>) response.get("tree");
        }
        return List.of();
    }

    public String fetchFileContent(String owner, String repo, String path, String branch,
            String accessToken) {
        try {
            if (apiDelayMs > 0) {
                Thread.sleep(apiDelayMs);
            }
            return githubRestClient.get()
                    .uri("/repos/{owner}/{repo}/contents/{path}?ref={branch}", owner, repo, path, branch)
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/vnd.github.v3.raw")
                    .retrieve()
                    .body(String.class);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while fetching file", e);
        } catch (Exception e) {
            log.warn("Failed to fetch file {}/{}: {}", repo, path, e.getMessage());
            return null;
        }
    }
}
