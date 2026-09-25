package Devpilot.backend.dto;

import java.time.Instant;
import java.util.UUID;

import Devpilot.backend.entity.ChatSession;

public record ChatSessionResponse(
        UUID id,
        UUID repositoryId,
        String title,
        Instant createdAt,
        Instant updatedAt) {

    public static ChatSessionResponse from(ChatSession session) {
        return new ChatSessionResponse(
                session.getId(),
                session.getRepositoryId(),
                session.getTitle(),
                session.getCreatedAt(),
                session.getUpdatedAt());
    }
}
