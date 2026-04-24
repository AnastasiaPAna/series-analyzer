package org.example.series.core.repository;

import org.example.series.core.model.Studio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository for studio entity.
 */
public interface StudioRepository extends JpaRepository<Studio, Long> {

    Optional<Studio> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
