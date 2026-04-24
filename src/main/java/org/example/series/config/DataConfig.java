package org.example.series.config;

import org.example.series.core.loader.SeriesLoader;
import org.example.series.core.model.Series;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration class responsible for loading
 * application data at startup.
 *
 * This class creates a Spring-managed bean containing
 * the in-memory dataset of Series objects.
 *
 * The dataset is loaded once during application bootstrap
 * and shared across the entire application.
 */
/**
 * Spring configuration for seed data/loading config.
 */
@Configuration
public class DataConfig {

    /**
     * Loads series data from the "data" folder.
     *
     * This bean is injected into API service layer
     * and acts as an in-memory data source.
     *
     * @return list of Series objects
     */
    @Bean
    public List<Series> seriesData() {

        // Load all JSON files from "data" directory
        return SeriesLoader.loadFromFolder("data");
    }
}
