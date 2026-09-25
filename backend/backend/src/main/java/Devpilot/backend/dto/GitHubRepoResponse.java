package Devpilot.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GitHubRepoResponse(
        long id,
        String name,
        @JsonProperty("full_name") String fullName,
        @JsonProperty("private") boolean isPrivate,
        String description,
        @JsonProperty("html_url") String htmlUrl,
        String language,
        @JsonProperty("default_branch") String defaultBranch,
        Owner owner) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Owner(String login) {
    }
}
