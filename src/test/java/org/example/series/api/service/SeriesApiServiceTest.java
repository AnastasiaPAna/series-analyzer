package org.example.series.api.service;

import org.example.series.api.dto.SeriesRequest;
import org.example.series.core.export.ReportStore;
import org.example.series.core.model.Series;
import org.example.series.core.model.Studio;
import org.example.series.core.service.SeriesService;
import org.example.series.core.service.StudioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import jakarta.validation.Validator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SeriesApiServiceTest {

    private SeriesService seriesService;
    private SeriesApiService service;

    @BeforeEach
    void setup() {
        seriesService = mock(SeriesService.class);
        StudioService studioService = mock(StudioService.class);
        ReportStore reportStore = mock(ReportStore.class);
        Validator validator = mock(Validator.class);

        service = new SeriesApiService(
                seriesService,
                studioService,
                reportStore,
                validator
        );
    }

    @Test
    void shouldReturnAll() {

        Studio studio = new Studio();
        studio.setName("Netflix");

        when(seriesService.findAll())
                .thenReturn(List.of(
                        new Series("A","Drama", 1, 7.0, 2020, false, studio)
                ));

        var result = service.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void shouldSearchByTitle() {

        Studio studio = new Studio();
        studio.setName("Netflix");

        Series series =
                new Series("Stranger Things","Drama", 4, 8.7, 2016, false, studio);

        when(seriesService.findByTitle("Stranger"))
                .thenReturn(series);

        var result = service.search("Stranger");

        assertEquals("Stranger Things", result.getTitle());
    }

    @Test
    void shouldCreateSeries() {

        Studio studio = new Studio();
        studio.setName("Netflix");

        SeriesRequest request = new SeriesRequest();
        request.setTitle("Dark");
        request.setSeasons(3);
        request.setRating(8.8);
        request.setYear(2017);
        request.setStudioId(1L);

        Series saved =
                new Series("Dark", "Drama", 3, 8.8, 2017, false, studio);

        when(seriesService.create(any(), eq(1L)))
                .thenReturn(saved);

        var response = service.create(request);

        assertEquals("Dark", response.getTitle());
    }
}
