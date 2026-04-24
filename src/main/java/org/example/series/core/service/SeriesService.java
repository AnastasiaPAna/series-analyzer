package org.example.series.core.service;

import org.example.series.api.exception.NotFoundException;
import org.example.series.core.model.Series;
import org.example.series.core.model.Studio;
import org.example.series.core.repository.SeriesRepository;
import org.example.series.core.repository.StudioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;



/**
 * Core service containing business logic for series management (CRUD, filtering, top/search).
 */
@Service

public class SeriesService {

    private final SeriesRepository repository;
    private final StudioRepository studioRepository;

    public SeriesService(SeriesRepository repository,
                         StudioRepository studioRepository) {
        this.repository = repository;
        this.studioRepository = studioRepository;
    }

    @Transactional
    public Series create(Series series, Long studioId) {
        Studio studio = studioRepository.findById(studioId)
                .orElseThrow(() -> new NotFoundException("Studio not found"));

        series.setStudio(studio);
        return repository.save(series);
    }

    public List<Series> findAll() {
        return repository.findAll();
    }

    public Series findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Series not found"));
    }

    public Series findByTitle(String title) {
        return repository.findFirstByTitleContainingIgnoreCaseOrderByIdAsc(title)
                .orElseThrow(() -> new NotFoundException("Series not found"));
    }

    @Transactional
    public Series update(Long id, Series updated, Long studioId) {

        Series existing = findById(id);

        existing.setTitle(updated.getTitle());
        existing.setGenre(updated.getGenre());
        existing.setRating(updated.getRating());
        existing.setSeasons(updated.getSeasons());
        existing.setYear(updated.getYear());
        existing.setFinished(updated.isFinished());

        if (studioId != null) {
            Studio studio = studioRepository.findById(studioId)
                    .orElseThrow(() -> new NotFoundException("Studio not found"));
            existing.setStudio(studio);
        }

        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Series not found");
        }
        repository.deleteById(id);
    }

    public List<Series> topNByRating(int n) {
        // Efficient DB-level sorting + limiting
        return repository.findAllByOrderByRatingDesc(PageRequest.of(0, n));
    }

    public Page<Series> search(
            Long studioId,
            Double minRating,
            Integer year,
            String genre,
            Pageable pageable) {

        Specification<Series> spec = Specification.where(null);

        if (studioId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("studio").get("id"), studioId));
        }

        if (minRating != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("rating"), minRating));
        }

        if (year != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("year"), year));
        }

        if (genre != null && !genre.isBlank()) {
            String like = "%" + genre.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("genre")), like));
        }

        return repository.findAll(spec, pageable);
    }
}
