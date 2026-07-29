package com.kapsomoita.church.content.repository;

import com.kapsomoita.church.content.domain.ContentEnums.LeaderTeam;
import com.kapsomoita.church.content.domain.Leader;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaderRepository extends JpaRepository<Leader, UUID> {

    @Query("""
            SELECT l FROM Leader l LEFT JOIN FETCH l.photo
            WHERE l.published = TRUE
            ORDER BY l.team ASC, l.sortOrder ASC
            """)
    List<Leader> findPublished();

    @Query("""
            SELECT l FROM Leader l LEFT JOIN FETCH l.photo
            WHERE l.published = TRUE AND l.team = :team
            ORDER BY l.sortOrder ASC
            """)
    List<Leader> findPublishedByTeam(@Param("team") LeaderTeam team);

    @Query("SELECT l FROM Leader l LEFT JOIN FETCH l.photo ORDER BY l.team ASC, l.sortOrder ASC")
    List<Leader> findAllOrdered();

    @Query("SELECT l FROM Leader l LEFT JOIN FETCH l.photo WHERE l.id = :id")
    Optional<Leader> findByIdWithPhoto(@Param("id") UUID id);
}
