package com.kapsomoita.church.livestream.repository;

import com.kapsomoita.church.livestream.domain.Livestream;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivestreamRepository extends JpaRepository<Livestream, Integer> {

    Optional<Livestream> findById(Integer id);
}
