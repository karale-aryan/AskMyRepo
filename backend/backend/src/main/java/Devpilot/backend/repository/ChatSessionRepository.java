package Devpilot.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Devpilot.backend.entity.ChatSession;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {

    List<ChatSession> findByUserIdAndRepositoryIdOrderByUpdatedAtDesc(UUID userId, UUID repositoryId);

    Optional<ChatSession> findFirstByUserIdAndRepositoryIdOrderByUpdatedAtDesc(UUID userId, UUID repositoryId);

    Optional<ChatSession> findByIdAndUserId(UUID id, UUID userId);
}
