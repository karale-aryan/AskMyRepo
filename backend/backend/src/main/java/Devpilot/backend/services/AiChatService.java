package Devpilot.backend.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AiChatService {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public AiChatService(
            @Value("${spring.ai.openai.base-url:https://openrouter.ai/api/v1}") String baseUrl,
            @Value("${spring.ai.openai.api-key:${OPENROUTER_API_KEY:${SPRING_AI_OPENAI_API_KEY:}}}") String apiKey,
            @Value("${spring.ai.openai.chat.options.model:${AI_MODEL:openrouter/free}}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("HTTP-Referer", "https://askmyrepo-mu.vercel.app")
                .defaultHeader("X-Title", "AskMyRepo")
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @SuppressWarnings("unchecked")
    public String chat(String systemPrompt, String userPrompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    )
            );

            log.info("Sending chat request to AI model: {}", model);

            Map<String, Object> response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    if (message != null && message.get("content") != null) {
                        String content = message.get("content").toString().trim();
                        if (!content.isEmpty()) {
                            return content;
                        }
                    }
                }
            }

            log.warn("AI model response contained no text content: {}", response);
            return "I received an empty response from the AI model. Please try asking again.";
        } catch (Exception e) {
            log.error("AI chat generation error: {}", e.getMessage(), e);
            throw new RuntimeException("AI chat generation failed: " + e.getMessage(), e);
        }
    }
}
