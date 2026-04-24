package org.example.series.core.repository;

import org.example.series.core.model.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for series entity.
 */
public interface SeriesRepository extends JpaRepository<Series, Long>,
        JpaSpecificationExecutor<Series> {

    Optional<Series> findFirstByTitleContainingIgnoreCaseOrderByIdAsc(String title);

    List<Series> findAllByOrderByRatingDesc(Pageable pageable);

}