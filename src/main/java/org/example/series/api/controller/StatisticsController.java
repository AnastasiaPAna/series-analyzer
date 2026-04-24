package org.example.series.api.controller;

import org.example.series.core.service.SeriesService;
import org.example.series.core.service.StatisticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller exposing statistics endpoints.
 */
@RestController
@RequestMapping("/api/v1/statistics")
public class StatisticsController {

    private final SeriesService seriesService;

    public StatisticsController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    /**
     * Returns statistics grouped by the given attribute.
     *
     * @param attribute attribute name supported by the service (e.g., genre, studio)
     * @return map: group key -> count
     */
    @GetMapping("/{attribute}")
    public Map<String, Long> statistics(@PathVariable String attribute) {
        return StatisticsService.countByAttribute(
                seriesService.findAll(),
                attribute
        );
    }
}
