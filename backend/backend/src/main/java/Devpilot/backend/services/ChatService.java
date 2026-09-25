package Devpilot.backend.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Devpilot.backend.entity.ChatMessage;
import Devpilot.backend.entity.ChatSession;
import Devpilot.backend.entity.CodeChunk;
import Devpilot.backend.entity.Repository;
import Devpilot.backend.exceptions.NotFoundException;
import Devpilot.backend.repository.ChatMessageRepository;
import Devpilot.backend.repository.ChatSessionRepository;
import Devpilot.backend.repository.CodeChunkRepository;
import Devpilot.backend.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final CodeChunkRepository codeChunkRepository;
    private final RepositoryRepository repositoryRepository;
    private final IndexingService indexingService;
    private final ChatClient chatClient;

    private static final int MAX_CONTEXT_CHUNKS = 5;

    @Transactional
    public ChatSession getOrCreateSession(UUID userId, UUID repositoryId) {
        return chatSessionRepository
                .findFirstByUserIdAndRepositoryIdOrderByUpdatedAtDesc(userId, repositoryId)
                .orElseGet(() -> {
                    Repository repo = repositoryRepository.findById(repositoryId)
                            .orElseThrow(() -> new NotFoundException("Repository not found"));
                    ChatSession session = ChatSession.builder()
                            .userId(userId)
                            .repositoryId(repositoryId)
                            .title("Chat about " + repo.getFullName())
                            .build();
                    return chatSessionRepository.save(session);
                });
    }

    public List<ChatMessage> getMessages(UUID sessionId) {
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    @Transactional
    public ChatMessage chat(UUID sessionId, UUID userId, String userMessage) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new NotFoundException("Chat session not found"));

        // Save user message
        ChatMessage userMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .role("user")
                .content(userMessage)
                .build();
        chatMessageRepository.save(userMsg);

        // RAG: Find relevant code chunks
        String context = "";
        try {
            String queryEmbedding = indexingService.generateQueryEmbedding(userMessage);
            List<CodeChunk> relevantChunks = codeChunkRepository.findSimilarChunks(
                    session.getRepositoryId(), queryEmbedding, MAX_CONTEXT_CHUNKS);

            // Build context from chunks
            context = relevantChunks.stream()
                    .map(CodeChunk::getContent)
                    .collect(Collectors.joining("\n\n---\n\n"));
        } catch (Exception e) {
            log.warn("Failed to retrieve relevant code chunks: {}", e.getMessage());
        }

        // Get conversation history (last 10 messages for context, excluding the just-saved user message)
        List<ChatMessage> history = chatMessageRepository
                .findBySessionIdOrderByCreatedAtAsc(sessionId);
        List<ChatMessage> recentHistory;
        if (history.size() > 1) {
            int historyEnd = history.size() - 1; // exclude the message we just saved
            int historyStart = Math.max(0, historyEnd - 10);
            recentHistory = history.subList(historyStart, historyEnd);
        } else {
            recentHistory = List.of();
        }

        // Fetch repository metadata for context
        Repository repo = repositoryRepository.findById(session.getRepositoryId())
                .orElse(null);

        // Build prompt
        StringBuilder promptBuilder = new StringBuilder();

        // Add repo metadata
        if (repo != null) {
            promptBuilder.append("## Repository Info\n\n");
            promptBuilder.append("- **Name:** ").append(repo.getFullName()).append("\n");
            if (repo.getDescription() != null && !repo.getDescription().isBlank()) {
                promptBuilder.append("- **Description:** ").append(repo.getDescription()).append("\n");
            }
            if (repo.getLanguage() != null) {
                promptBuilder.append("- **Primary Language:** ").append(repo.getLanguage()).append("\n");
            }
            promptBuilder.append("\n");
        }

        promptBuilder.append("## Relevant Code Context\n\n");
        if (context.isEmpty()) {
            promptBuilder.append("No relevant code chunks were found in the index. ")
                    .append("Answer based on any repository metadata available above.\n\n");
        } else {
            promptBuilder.append(context).append("\n\n");
        }

        // Add conversation history
        if (!recentHistory.isEmpty()) {
            promptBuilder.append("## Recent Conversation\n\n");
            for (ChatMessage msg : recentHistory) {
                promptBuilder.append(msg.getRole().equals("user") ? "**User:** " : "**Assistant:** ");
                promptBuilder.append(msg.getContent()).append("\n\n");
            }
        }

        promptBuilder.append("## Current Question\n\n");
        promptBuilder.append(userMessage);

        // Call AI
        String aiResponse;
        try {
            aiResponse = chatClient.prompt()
                    .user(promptBuilder.toString())
                    .call()
                    .content();

            if (aiResponse == null || aiResponse.isBlank()) {
                aiResponse = "I received an empty response. Please try asking again.";
            }
        } catch (Exception e) {
            log.error("AI call failed: {}", e.getMessage(), e);
            aiResponse = "I'm sorry, I encountered an error while processing your question. Please try again.";
        }

        // Save assistant message
        ChatMessage assistantMsg = ChatMessage.builder()
                .sessionId(sessionId)
                .role("assistant")
                .content(aiResponse)
                .build();
        chatMessageRepository.save(assistantMsg);

        // Update session timestamp
        session.setTitle(deriveTitle(userMessage));
        chatSessionRepository.save(session);

        return assistantMsg;
    }

    private String deriveTitle(String firstMessage) {
        if (firstMessage.length() <= 60) {
            return firstMessage;
        }
        return firstMessage.substring(0, 57) + "...";
    }
}
