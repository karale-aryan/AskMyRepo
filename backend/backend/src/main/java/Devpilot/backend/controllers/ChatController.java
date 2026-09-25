package Devpilot.backend.controllers;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Devpilot.backend.dto.ChatMessageRequest;
import Devpilot.backend.dto.ChatMessageResponse;
import Devpilot.backend.dto.ChatSessionResponse;
import Devpilot.backend.entity.ChatMessage;
import Devpilot.backend.entity.ChatSession;
import Devpilot.backend.services.ChatService;
import Devpilot.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final CurrentUser currentUser;

    @PostMapping("/sessions")
    public ResponseEntity<ChatSessionResponse> getOrCreateSession(
            @RequestParam UUID repositoryId) {
        UUID userId = currentUser.require().getId();
        ChatSession session = chatService.getOrCreateSession(userId, repositoryId);
        return ResponseEntity.ok(ChatSessionResponse.from(session));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable UUID sessionId) {
        List<ChatMessage> messages = chatService.getMessages(sessionId);
        List<ChatMessageResponse> response = messages.stream()
                .map(ChatMessageResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable UUID sessionId,
            @RequestBody ChatMessageRequest request) {
        UUID userId = currentUser.require().getId();
        ChatMessage response = chatService.chat(sessionId, userId, request.content());
        return ResponseEntity.ok(ChatMessageResponse.from(response));
    }
}
