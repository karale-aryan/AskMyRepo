package Devpilot.backend.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Devpilot.backend.entity.CodeChunk;
import Devpilot.backend.entity.IndexStatus;
import Devpilot.backend.entity.Repository;
import Devpilot.backend.repository.CodeChunkRepository;
import Devpilot.backend.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndexingService {

    private final RepositoryRepository repositoryRepository;
    private final CodeChunkRepository codeChunkRepository;
    private final GitHubService gitHubService;
    private final GeminiEmbeddingService geminiEmbeddingService;

    @Value("${app.indexing.max-file-bytes:102400}")
    private int maxFileBytes;

    @Value("${app.indexing.chunk-size:800}")
    private int chunkSize;

    @Value("${app.indexing.chunk-overlap:100}")
    private int chunkOverlap;

    private static final Set<String> INDEXABLE_EXTENSIONS = Set.of(
            ".java", ".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".rs", ".rb",
            ".c", ".cpp", ".h", ".hpp", ".cs", ".swift", ".kt", ".scala",
            ".php", ".html", ".css", ".scss", ".sql", ".sh", ".bash",
            ".yaml", ".yml", ".json", ".xml", ".md", ".txt", ".toml",
            ".gradle", ".properties", ".env", ".dockerfile", ".vue", ".svelte");

    @Async("indexingExecutor")
    public void indexRepository(UUID repoId, String accessToken) {
        Repository repo = repositoryRepository.findById(repoId).orElse(null);
        if (repo == null) {
            log.error("Repository {} not found for indexing", repoId);
            return;
        }

        try {
            log.info("Starting indexing for repository: {}", repo.getFullName());

            // Delete existing chunks
            codeChunkRepository.deleteByRepositoryId(repoId);

            // Fetch file tree
            List<Map<String, Object>> tree = gitHubService.fetchRepoTree(
                    repo.getOwner(), repo.getName(), repo.getDefaultBranch(), accessToken);

            // Filter indexable files
            List<String> filePaths = tree.stream()
                    .filter(item -> "blob".equals(item.get("type")))
                    .map(item -> (String) item.get("path"))
                    .filter(this::isIndexableFile)
                    .filter(path -> {
                        // Skip very large files based on tree size info
                        Object size = tree.stream()
                                .filter(item -> path.equals(item.get("path")))
                                .findFirst()
                                .map(item -> item.get("size"))
                                .orElse(null);
                        if (size instanceof Number) {
                            return ((Number) size).intValue() <= maxFileBytes;
                        }
                        return true;
                    })
                    .toList();

            repo.setFilesTotal(filePaths.size());
            repositoryRepository.save(repo);

            int totalChunks = 0;
            int filesProcessed = 0;

            for (String filePath : filePaths) {
                try {
                    String content = gitHubService.fetchFileContent(
                            repo.getOwner(), repo.getName(), filePath, repo.getDefaultBranch(), accessToken);

                    if (content == null || content.isBlank()) {
                        filesProcessed++;
                        continue;
                    }

                    // Chunk the content
                    List<String> chunks = chunkText(content, chunkSize, chunkOverlap);

                    for (int i = 0; i < chunks.size(); i++) {
                        String chunkContent = "File: " + filePath + "\n\n" + chunks.get(i);
                        String embeddingStr = generateEmbedding(chunkContent);

                        CodeChunk chunk = CodeChunk.builder()
                                .repositoryId(repoId)
                                .filePath(filePath)
                                .chunkIndex(i)
                                .content(chunkContent)
                                .embedding(embeddingStr)
                                .build();
                        codeChunkRepository.save(chunk);
                        totalChunks++;
                    }

                    filesProcessed++;
                    repo.setFilesProcessed(filesProcessed);
                    repo.setChunkCount(totalChunks);
                    repositoryRepository.save(repo);

                } catch (Exception e) {
                    log.warn("Error indexing file {}: {}", filePath, e.getMessage());
                    filesProcessed++;
                }
            }

            repo.setIndexStatus(IndexStatus.INDEXED);
            repo.setIndexedAt(Instant.now());
            repo.setChunkCount(totalChunks);
            repo.setFilesProcessed(filesProcessed);
            repositoryRepository.save(repo);

            log.info("Indexing complete for {}: {} files, {} chunks", repo.getFullName(), filesProcessed,
                    totalChunks);

        } catch (Exception e) {
            log.error("Indexing failed for repository {}: {}", repo.getFullName(), e.getMessage(), e);
            repo.setIndexStatus(IndexStatus.FAILED);
            repo.setErrorMessage(e.getMessage());
            repositoryRepository.save(repo);
        }
    }

    private boolean isIndexableFile(String path) {
        if (path == null)
            return false;
        // Skip common non-code directories
        if (path.startsWith("node_modules/") || path.startsWith(".git/") ||
                path.startsWith("vendor/") || path.startsWith("dist/") ||
                path.startsWith("build/") || path.startsWith("target/") ||
                path.contains("/__pycache__/") || path.startsWith(".idea/") ||
                path.startsWith(".vscode/")) {
            return false;
        }
        // Check extension
        int dotIdx = path.lastIndexOf('.');
        if (dotIdx < 0)
            return false;
        String ext = path.substring(dotIdx).toLowerCase();
        return INDEXABLE_EXTENSIONS.contains(ext);
    }

    private List<String> chunkText(String text, int size, int overlap) {
        List<String> chunks = new ArrayList<>();
        if (text.length() <= size) {
            chunks.add(text);
            return chunks;
        }

        int start = 0;
        while (start < text.length()) {
            int end = Math.min(start + size, text.length());
            chunks.add(text.substring(start, end));
            start += size - overlap;
        }
        return chunks;
    }

    private String generateEmbedding(String text) {
        return geminiEmbeddingService.embedDocument(text);
    }

    // Public method for ChatService to generate embeddings for queries
    public String generateQueryEmbedding(String query) {
        return geminiEmbeddingService.embedQuery(query);
    }
}
