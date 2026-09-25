package Devpilot.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

/**
 * Calls Gemini's native embedContent REST API directly.
 * This bypasses Spring AI's OpenAI adapter which fails because
 * the Gemini OpenAI-compatible endpoint omits the "index" field
 * in embedding responses, causing deserialization errors.
 */
@Service
@Slf4j
public class GeminiEmbeddingService {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GeminiEmbeddingService(
            @Value("${spring.ai.openai.api-key}") String apiKey,
            @Value("${app.embedding.model:text-embedding-004}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Generate an embedding for document storage (indexing).
     */
    public String embedDocument(String text) {
        return embed(text, "RETRIEVAL_DOCUMENT");
    }

    /**
     * Generate an embedding for a search query.
     */
    public String embedQuery(String text) {
        return embed(text, "RETRIEVAL_QUERY");
    }

    @SuppressWarnings("unchecked")
    private String embed(String text, String taskType) {
        // Truncate text to avoid exceeding token limits
        String truncated = text.length() > 8000 ? text.substring(0, 8000) : text;

        Map<String, Object> requestBody = Map.of(
                "content", Map.of(
                        "parts", List.of(Map.of("text", truncated))),
                "taskType", taskType);

        Map<String, Object> response = restClient.post()
                .uri("/models/{model}:embedContent?key={key}", model, apiKey)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null || !response.containsKey("embedding")) {
            throw new RuntimeException("Gemini embedding API returned no embedding");
        }

        Map<String, Object> embedding = (Map<String, Object>) response.get("embedding");
        List<Number> values = (List<Number>) embedding.get("values");

        if (values == null || values.isEmpty()) {
            throw new RuntimeException("Gemini embedding API returned empty values");
        }

        // Format as PostgreSQL vector literal: [0.1,0.2,0.3,...]
        return values.stream()
                .map(Number::toString)
                .collect(Collectors.joining(",", "[", "]"));
    }
}
