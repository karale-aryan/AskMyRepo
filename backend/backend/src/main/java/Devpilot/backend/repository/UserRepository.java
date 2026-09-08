package Devpilot.backend.repository;

import java.util.Optional;
import java.util.UUID;
import Devpilot.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByGithubId(long githubId);
}