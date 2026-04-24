package org.example.series.it;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StudioEndpointsIT extends BaseIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Test
    void getAllStudios_shouldReturnSeededData() throws Exception {
        mvc.perform(get("/api/v1/studios"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").exists());
    }

    @Test
    void createUpdateDeleteStudio_fullFlow() throws Exception {
        String body = "{\"name\":\"Test Studio\",\"country\":\"UA\"}";

        // create
        String created = mvc.perform(post("/api/v1/studios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andReturn().getResponse().getContentAsString();

        // naive id extraction (keeps test lightweight)
        String id = created.replaceAll(".*\\\"id\\\":(\\d+).*", "$1");

        // update
        mvc.perform(put("/api/v1/studios/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Studio Updated\",\"country\":\"UA\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Studio Updated"));

        // delete
        mvc.perform(delete("/api/v1/studios/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void studioName_shouldBeUnique_onCreateAndUpdate() throws Exception {
        // create studio A
        String created = mvc.perform(post("/api/v1/studios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Unique Studio\",\"country\":\"UA\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String id = created.replaceAll(".*\\\"id\\\":(\\d+).*", "$1");

        // duplicate create -> 409
        mvc.perform(post("/api/v1/studios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"unique studio\",\"country\":\"UA\"}"))
                .andExpect(status().isConflict());

        // create studio B
        String created2 = mvc.perform(post("/api/v1/studios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Other Studio\",\"country\":\"UA\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String id2 = created2.replaceAll(".*\\\"id\\\":(\\d+).*", "$1");

        // update B to name of A -> 409
        mvc.perform(put("/api/v1/studios/{id}", id2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"UNIQUE STUDIO\",\"country\":\"UA\"}"))
                .andExpect(status().isConflict());

        // cleanup
        mvc.perform(delete("/api/v1/studios/{id}", id)).andExpect(status().isNoContent());
        mvc.perform(delete("/api/v1/studios/{id}", id2)).andExpect(status().isNoContent());
    }
}
