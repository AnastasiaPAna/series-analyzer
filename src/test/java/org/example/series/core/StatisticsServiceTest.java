package org.example.series.core;

import org.example.series.core.model.Series;
import org.example.series.core.model.Studio;
import org.example.series.core.service.StatisticsService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class StatisticsServiceTest {

    @Test
    void shouldCountByStudio() {

        Studio netflix = new Studio();
        netflix.setName("Netflix");

        Studio hbo = new Studio();
        hbo.setName("HBO");

        List<Series> list = List.of(
                new Series("A","Drama", 1, 7.0, 2020, false, netflix),
                new Series("B","Drama", 2, 8.0, 2021, true, netflix),
                new Series("C","Drama", 3, 9.0, 2019, false, hbo)
        );

        Map<String, Long> result =
                StatisticsService.countByAttribute(list, "studio");

        assertEquals(2L, result.get("Netflix"));
        assertEquals(1L, result.get("HBO"));
    }

    @Test
    void shouldCountByGenre() {
        Studio studio = new Studio();
        studio.setName("Netflix");

        List<Series> list = List.of(
                new Series("A", "Drama", 1, 7.0, 2020, false, studio),
                new Series("B", "Drama", 2, 8.0, 2021, true, studio),
                new Series("C", "Sci-Fi", 3, 9.0, 2019, false, studio)
        );

        Map<String, Long> result =
                StatisticsService.countByAttribute(list, "genre");

        assertEquals(2L, result.get("Drama"));
        assertEquals(1L, result.get("Sci-Fi"));
    }

    @Test
    void shouldReturnEmptyMapForEmptyList() {
        Map<String, Long> result = StatisticsService.countByAttribute(List.of(), "studio");

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void shouldThrowForUnsupportedAttribute() {
        assertThrows(IllegalArgumentException.class,
                () -> StatisticsService.countByAttribute(List.of(), "abc"));
    }
}
