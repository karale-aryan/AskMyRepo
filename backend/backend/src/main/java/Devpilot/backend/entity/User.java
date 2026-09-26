package Devpilot.backend.entity;

import java.util.UUID;
import java.time.Instant;

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
@Table(name = "users")
@Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "github_id", nullable = false, unique = true)
  private long githubId;

  @Column(name = "github_username", length = 255)
  private String githubUsername;

  @Column(name = "display_name", nullable = false, length = 255)
  private String displayName;

  @Column(name = "avatar_url", nullable = false, length = 255)
  private String avatarUrl;

  @Column(name = "access_token", nullable = false, columnDefinition = "TEXT")
  private String accessToken;

  @Column(name = "token_scopes", nullable = false, length = 100)
  private String tokenScopes;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }

  // Explicit Getters
  public UUID getId() { return id; }
  public long getGithubId() { return githubId; }
  public String getGithubUsername() { return githubUsername; }
  public String getDisplayName() { return displayName; }
  public String getAvatarUrl() { return avatarUrl; }
  public String getAccessToken() { return accessToken; }
  public String getTokenScopes() { return tokenScopes; }
  public Instant getCreatedAt() { return createdAt; }

  // Explicit Setters
  public void setId(UUID id) { this.id = id; }
  public void setGithubId(long githubId) { this.githubId = githubId; }
  public void setGithubUsername(String githubUsername) { this.githubUsername = githubUsername; }
  public void setDisplayName(String displayName) { this.displayName = displayName; }
  public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
  public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
  public void setTokenScopes(String tokenScopes) { this.tokenScopes = tokenScopes; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

