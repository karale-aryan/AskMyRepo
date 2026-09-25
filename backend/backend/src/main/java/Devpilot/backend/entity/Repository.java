package Devpilot.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "repositories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "owner", "name"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "github_repo_id")
    private Long githubUrlId;

    @Column(nullable = false)
    private String owner;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_private")
    private boolean isPrivate;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "default_branch")
    private String defaultBranch;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "html_url")
    private String htmlUrl;

    private String language;

    @Enumerated(EnumType.STRING)
    @Column(name = "index_status", nullable = false)
    @Builder.Default
    private IndexStatus indexStatus = IndexStatus.PENDING;

    @Column(name = "indexed_at")
    private Instant indexedAt;

    @Column(name = "chunk_count")
    @Builder.Default
    private int chunkCount = 0;

    @Column(name = "files_total")
    @Builder.Default
    private int filesTotal = 0;

    @Column(name = "files_processed")
    @Builder.Default
    private int filesProcessed = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
        if (this.indexStatus == null) {
            this.indexStatus = IndexStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}