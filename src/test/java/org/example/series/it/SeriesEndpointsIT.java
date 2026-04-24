package org.example.series.it;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SeriesEndpointsIT extends BaseIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper objectMapper;

    private List<String> studioIds() throws Exception {
        String json = mvc.perform(get("/api/v1/studios"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode arr = objectMapper.readTree(json);
        List<String> ids = new ArrayList<>();
        for (JsonNode n : arr) {
            ids.add(n.get("id").asText());
        }
        return ids;
    }

    private String createSeries(String title, String genre, int seasons, double rating, int year, boolean finished, String studioId) throws Exception {
        String createBody = "{" +
                "\"title\":\"" + title + "\"," +
                "\"genre\":\"" + genre + "\"," +
                "\"seasons\":" + seasons + "," +
                "\"rating\":" + rating + "," +
                "\"year\":" + year + "," +
                "\"finished\":" + finished + "," +
                "\"studioId\":" + studioId +
                "}";

        String created = mvc.perform(post("/api/v1/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andReturn().getResponse().getContentAsString();

        return created.replaceAll(".*\\\"id\\\":(\\d+).*", "$1");
    }

    @Test
    void seriesCrud_fullFlow() throws Exception {
        String studioId = studioIds().get(0);

        String createBody = "{"
                + "\"title\":\"Test Series\"," 
                + "\"genre\":\"Drama\"," 
                + "\"seasons\":1," 
                + "\"rating\":8.1," 
                + "\"year\":2020," 
                + "\"finished\":false," 
                + "\"studioId\":" + studioId
                + "}";

        String created = mvc.perform(post("/api/v1/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.studio.id").exists())
                .andReturn().getResponse().getContentAsString();

        String id = created.replaceAll(".*\\\"id\\\":(\\d+).*", "$1");

        mvc.perform(get("/api/v1/series/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Series"));

        mvc.perform(put("/api/v1/series/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody.replace("Test Series", "Test Series Updated")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Series Updated"));

        mvc.perform(delete("/api/v1/series/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_shouldRejectFinishedSeriesInFutureYear() throws Exception {
        String studioId = studioIds().get(0);

        String body = "{"
                + "\"title\":\"Future Series\","
                + "\"genre\":\"Drama\","
                + "\"seasons\":1,"
                + "\"rating\":8.3,"
                + "\"year\":2027,"
                + "\"finished\":true,"
                + "\"studioId\":" + studioId
                + "}";

        mvc.perform(post("/api/v1/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.year").exists());
    }

    @Test
    void create_shouldRejectTooOldYear() throws Exception {
        String studioId = studioIds().get(0);

        String body = "{"
                + "\"title\":\"Archive Series\","
                + "\"genre\":\"Drama\","
                + "\"seasons\":1,"
                + "\"rating\":7.3,"
                + "\"year\":1949,"
                + "\"finished\":false,"
                + "\"studioId\":" + studioId
                + "}";

        mvc.perform(post("/api/v1/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.year").exists());
    }

    @Test
    void listEndpoint_shouldReturnPagedStructure() throws Exception {
        String body = "{\"page\":1,\"size\":5,\"sortBy\":\"id\",\"direction\":\"ASC\"}";
        mvc.perform(post("/api/v1/series/_list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.list").exists())
                .andExpect(jsonPath("$.totalPages").exists());
    }

    @Test
    void listEndpoint_shouldSupportFilters() throws Exception {
        List<String> studios = studioIds();
        String s1 = studios.get(0);
        String s2 = studios.get(1);

        String id1 = createSeries("Filter A", "Drama", 1, 9.1, 2020, false, s1);
        String id2 = createSeries("Filter B", "Comedy", 1, 7.0, 2020, false, s2);

        // filter by studioId + minRating should return only series from s1 with rating >= 8
        String body = "{" +
                "\"studioId\":" + s1 + "," +
                "\"minRating\":8.0," +
                "\"page\":1," +
                "\"size\":10," +
                "\"sortBy\":\"id\"," +
                "\"direction\":\"ASC\"" +
                "}";

        mvc.perform(post("/api/v1/series/_list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.list.length()").value(1))
                .andExpect(jsonPath("$.list[0].title").value("Filter A"));

        // cleanup
        mvc.perform(delete("/api/v1/series/{id}", id1)).andExpect(status().isNoContent());
        mvc.perform(delete("/api/v1/series/{id}", id2)).andExpect(status().isNoContent());
    }

    @Test
    void reportEndpoint_shouldReturnCsvFile() throws Exception {
        String body = "{\"format\":\"csv\"}";
        mvc.perform(post("/api/v1/series/_report")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "text/csv"))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("attachment;")));
    }

    @Test
    void reportEndpoint_async_shouldReturnJobIdAndAllowDownload() throws Exception {
        String body = "{\"format\":\"csv\",\"async\":true}";

        String resp = mvc.perform(post("/api/v1/series/_report")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.jobId").exists())
                .andExpect(jsonPath("$.downloadUrl").exists())
                .andReturn().getResponse().getContentAsString();

        JsonNode json = objectMapper.readTree(resp);
        String jobId = json.get("jobId").asText();

        mvc.perform(get("/api/v1/series/_report/{jobId}", jobId))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "text/csv"))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString("attachment;")));
    }

    @Test
    void uploadEndpoint_shouldImportJson() throws Exception {
        byte[] json = Files.readAllBytes(new ClassPathResource("import-series.json").getFile().toPath());
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "import-series.json",
                "application/json",
                json
        );

        mvc.perform(multipart("/api/v1/series/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.failed").exists());
    }

    @Test
    void uploadEndpoint_shouldRejectInvalidJson() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "broken.json",
                "application/json",
                "{not valid json".getBytes()
        );

        mvc.perform(multipart("/api/v1/series/upload").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    void uploadEndpoint_shouldRejectEmptyFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.json",
                "application/json",
                new byte[0]
        );

        mvc.perform(multipart("/api/v1/series/upload").file(file))
                .andExpect(status().isBadRequest());
    }

    @Test
    void topAndSearchEndpoints_shouldWork() throws Exception {
        String studioId = studioIds().get(0);

        String a = createSeries("Top A", "Drama", 1, 8.0, 2020, false, studioId);
        String b = createSeries("Top B", "Drama", 1, 9.5, 2021, false, studioId);

        mvc.perform(get("/api/v1/series/top").param("n", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Top B"));

        mvc.perform(get("/api/v1/series/search").param("query", "Top A"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Top A"));

        // cleanup
        mvc.perform(delete("/api/v1/series/{id}", a)).andExpect(status().isNoContent());
        mvc.perform(delete("/api/v1/series/{id}", b)).andExpect(status().isNoContent());
    }
}
