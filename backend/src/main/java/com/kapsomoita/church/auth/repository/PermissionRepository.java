package com.kapsomoita.church.auth.repository;

import com.kapsomoita.church.auth.domain.Permission;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    Optional<Permission> findByName(String name);

    List<Permission> findAllByNameIn(Collection<String> names);

    List<Permission> findAllByResourceOrderByActionAsc(String resource);

    List<Permission> findAllByOrderByResourceAscActionAsc();
}
