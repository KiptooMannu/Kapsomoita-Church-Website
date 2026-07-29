package com.kapsomoita.church.auth.repository;

import com.kapsomoita.church.auth.domain.Role;
import com.kapsomoita.church.auth.domain.RoleName;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    @EntityGraph(attributePaths = {"permissions"})
    Optional<Role> findByName(String name);

    @EntityGraph(attributePaths = {"permissions"})
    List<Role> findAllByNameIn(Collection<String> names);

    @EntityGraph(attributePaths = {"permissions"})
    @Override
    List<Role> findAll();

    boolean existsByName(String name);

    default Optional<Role> findByRoleName(RoleName roleName) {
        return findByName(roleName.name());
    }
}
