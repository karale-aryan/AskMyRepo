package Devpilot.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import Devpilot.backend.entity.CodeChunk;

@Repository
public interface CodeChunkRepository extends JpaRepository<CodeChunk, UUID> {

    @Query(value = """
            SELECT * FROM code_chunk
            WHERE repository_id = :repoId
            ORDER BY embedding <=> CAST(:embedding AS vector)
            LIMIT :limit
            """, nativeQuery = true)
    List<CodeChunk> findSimilarChunks(
            @Param("repoId") UUID repoId,
            @Param("embedding") String embedding,
            @Param("limit") int limit);

    @Transactional
    @Modifying
    @Query("DELETE FROM CodeChunk c WHERE c.repositoryId = :repoId")
    void deleteByRepositoryId(@Param("repoId") UUID repoId);

    int countByRepositoryId(UUID repositoryId);
}
