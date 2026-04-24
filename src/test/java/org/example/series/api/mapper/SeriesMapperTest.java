package org.example.series.api.mapper;

import org.example.series.api.dto.SeriesResponse;
import org.example.series.core.model.Series;
import org.example.series.core.model.Studio;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SeriesMapperTest {

    @Test
    void shouldMapEntityToResponse() {

        Studio studio = new Studio();
        studio.setName("Netflix");

        Series series = new Series(
                "Stranger Things",
                "Drama",
                4,
                8.7,
                2016,
                false,
                studio
        );

        SeriesResponse dto = SeriesMapper.toResponse(series);

        assertEquals("Stranger Things", dto.getTitle());
        assertEquals("Netflix", dto.getStudio().name());
        assertEquals(4, dto.getSeasons());
        assertEquals(8.7, dto.getRating());
        assertEquals(2016, dto.getYear());
        assertFalse(dto.isFinished());
    }

    @Test
    void shouldMapList() {

        Studio studio = new Studio();
        studio.setName("Netflix");

        List<Series> list = List.of(
                new Series("A","Drama", 1, 7.0, 2020, false, studio),
                new Series("B", "Drama",2, 8.0, 2021, true, studio)
        );

        List<SeriesResponse> responses =
                list.stream()
                        .map(SeriesMapper::toResponse)
                        .toList();

        assertEquals(2, responses.size());
    }
}
