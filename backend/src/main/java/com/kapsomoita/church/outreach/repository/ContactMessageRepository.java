package com.kapsomoita.church.outreach.repository;

import com.kapsomoita.church.outreach.domain.ContactMessage;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    @Query("""
           SELECT m FROM ContactMessage m
           WHERE (:search IS NULL OR
                  LOWER(m.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(m.subject)  LIKE LOWER(CONCAT('%', :search, '%')) OR
                  LOWER(m.email)    LIKE LOWER(CONCAT('%', :search, '%')))
           """)
    Page<ContactMessage> search(@Param("search") String search, Pageable pageable);
}
