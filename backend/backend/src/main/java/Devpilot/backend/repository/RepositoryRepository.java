package Devpilot.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Devpilot.backend.entity.Repository;

public interface RepositoryRepository extends JpaRepository<Repository, UUID> {

    List<Repository> findByUserId(UUID userId);

    Optional<Repository> findByUserIdAndGithubUrlId(UUID userId, long githubUrlId);

    Optional<Repository> findByIdAndUserId(UUID id, UUID userId);
}
