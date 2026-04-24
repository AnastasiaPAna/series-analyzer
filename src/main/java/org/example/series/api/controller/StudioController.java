package org.example.series.api.controller;

import jakarta.validation.Valid;
import org.example.series.api.dto.StudioRequest;
import org.example.series.api.dto.StudioResponse;
import org.example.series.core.model.Studio;
import org.example.series.core.service.StudioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for CRUD operations on studios.
 */
@RestController
@RequestMapping("/api/v1/studios")
public class StudioController {

    private final StudioService service;

    public StudioController(StudioService service) {
        this.service = service;
    }

    /**
     * Returns all studios.
     *
     * @return list of studio DTOs
     */
    @GetMapping
    public List<StudioResponse> getAll() {
        return service.findAll()
                .stream()
                .map(s -> new StudioResponse(s.getId(), s.getName(), s.getCountry()))
                .toList();
    }

    /**
     * Creates a new studio.
     *
     * @param request studio create request
     * @return created studio DTO
     */
    @PostMapping
    public ResponseEntity<StudioResponse> create(@Valid @RequestBody StudioRequest request) {

        Studio studio = service.create(request.name(), request.country());

        StudioResponse body = new StudioResponse(
                studio.getId(),
                studio.getName(),
                studio.getCountry()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /**
     * Updates an existing studio.
     *
     * @param id studio id
     * @param request studio update request
     * @return updated studio DTO
     */
    @PutMapping("/{id}")
    public StudioResponse update(@PathVariable Long id,
                                 @Valid @RequestBody StudioRequest request) {

        Studio studio = service.update(id, request.name(), request.country());

        return new StudioResponse(
                studio.getId(),
                studio.getName(),
                studio.getCountry()
        );
    }

    /**
     * Deletes a studio by id.
     *
     * @param id studio id
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
