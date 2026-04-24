package org.example.series.api.controller;

import org.example.series.api.dto.SeriesResponse;
import org.example.series.api.dto.StudioResponse;
import org.example.series.api.service.SeriesApiService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import org.springframework.data.domain.Pageable;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;

@WebMvcTest(SeriesController.class)
class SeriesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeriesApiService service;

    @Test
    void getAll_shouldReturn200() throws Exception {

        when(service.getAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/series"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllPaged_shouldReturnPage() throws Exception {
        SeriesResponse response = new SeriesResponse(
                1L,
                "Dark",
                "Sci-Fi",
                3,
                8.7,
                2017,
                true,
                new StudioResponse(1L, "Netflix", "USA")
        );

        Pageable pageable = PageRequest.of(0, 10, org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC,
                "rating"
        ));

        when(service.search(isNull(), isNull(), isNull(), isNull(), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(response), pageable, 1));

        mockMvc.perform(get("/api/v1/series")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sort", "rating,desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Dark"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void top_shouldAcceptLimitAlias() throws Exception {
        SeriesResponse response = new SeriesResponse(
                1L,
                "Dark",
                "Sci-Fi",
                3,
                8.7,
                2017,
                true,
                new StudioResponse(1L, "Netflix", "USA")
        );

        when(service.top(1)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/series/top").param("limit", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Dark"));
    }
}
