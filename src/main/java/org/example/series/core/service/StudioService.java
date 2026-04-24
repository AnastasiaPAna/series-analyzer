package org.example.series.core.service;

import org.example.series.api.exception.ConflictException;
import org.example.series.api.exception.NotFoundException;
import org.example.series.core.model.Studio;
import org.example.series.core.repository.StudioRepository;
import org.springframework.stereotype.Service;

import java.util.List;



/**
 * Core service containing business logic for studio management (CRUD, uniqueness checks).
 */
@Service

public class StudioService {

    private final StudioRepository repository;

    public StudioService(StudioRepository repository) {
        this.repository = repository;
    }

    public List<Studio> findAll() {
        return repository.findAll();
    }

    public Studio findByName(String name) {
        return repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new NotFoundException("Studio not found: " + name));
    }

    public Studio create(String name, String country) {

        if (repository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Studio with this name already exists");
        }

        Studio studio = new Studio(name, country);

        return repository.save(studio);
    }

    public Studio update(Long id, String name, String country) {

        Studio studio = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Studio not found"));

        // uniqueness control for studio name (task requirement)
        repository.findByNameIgnoreCase(name)
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new ConflictException("Studio with this name already exists");
                });

        studio.setName(name);
        studio.setCountry(country);

        return repository.save(studio);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Studio not found");
        }
        repository.deleteById(id);
    }
}
