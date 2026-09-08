package Devpilot.backend.dto;

import java.util.UUID;

import Devpilot.backend.entity.User;

public record UserResponse(
        UUID id,
        String githubUsername,
        String displayName,
        String avatarUrl,
        String tokenScopes) {

    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getGithubUsername(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getTokenScopes());
    }
}