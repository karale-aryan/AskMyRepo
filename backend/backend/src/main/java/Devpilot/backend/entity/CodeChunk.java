package Devpilot.backend.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "code_chunk")
public class CodeChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "repository_id", nullable = false)
    private UUID repositoryId;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "chunk_index", nullable = false)
    private int chunkIndex;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "embedding", columnDefinition = "vector(768)")
    private String embedding;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    // Explicit Getters
    public UUID getId() { return id; }
    public UUID getRepositoryId() { return repositoryId; }
    public String getFilePath() { return filePath; }
    public int getChunkIndex() { return chunkIndex; }
    public String getContent() { return content; }
    public String getEmbedding() { return embedding; }
    public Instant getCreatedAt() { return createdAt; }

    // Explicit Setters
    public void setId(UUID id) { this.id = id; }
    public void setRepositoryId(UUID repositoryId) { this.repositoryId = repositoryId; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public void setChunkIndex(int chunkIndex) { this.chunkIndex = chunkIndex; }
    public void setContent(String content) { this.content = content; }
    public void setEmbedding(String embedding) { this.embedding = embedding; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

