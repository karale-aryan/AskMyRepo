package Devpilot.backend.dto;

import java.time.Instant;
import java.util.UUID;

import Devpilot.backend.entity.ChatMessage;

public record ChatMessageResponse(
        UUID id,
        String role,
        String content,
        Instant createdAt) {

    public static ChatMessageResponse from(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt());
    }
}
