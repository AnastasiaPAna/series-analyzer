package org.example.series.core;

import org.example.series.core.loader.SeriesLoader;
import org.example.series.core.model.Series;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SeriesLoaderTest {

    @TempDir
    Path tempDir;

    @Test
    void shouldLoadSingleSeries() {

        // Loader now works via static method
        List<Series> list =
                SeriesLoader.loadAll(List.of("data/series.json"));

        assertNotNull(list);
        assertFalse(list.isEmpty());

        Series series = list.get(0);

        assertNotNull(series.getTitle());
        assertTrue(series.getSeasons() > 0);
        assertTrue(series.getYear() > 1900);
        assertNotNull(series.getStudio());
    }

    @Test
    void shouldReturnEmptyListWhenFileIsEmpty() throws Exception {
        Path file = tempDir.resolve("empty.json");
        Files.writeString(file, "   \n\t  ");

        List<Series> list = SeriesLoader.loadList(file);

        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    void shouldThrowWhenJsonIsInvalid() throws Exception {
        Path file = tempDir.resolve("broken.json");
        Files.writeString(file, "{ this is not valid json ");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> SeriesLoader.loadList(file));
        assertTrue(ex.getMessage().contains("Failed to parse file"));
    }

    @Test
    void shouldHandleMissingAttributesAsNulls() throws Exception {
        // Missing required fields: title and studio
        Path file = tempDir.resolve("missing_fields.json");
        Files.writeString(file, """
                {
                  \"genre\": \"Drama\",
                  \"seasons\": 1,
                  \"rating\": 7.0,
                  \"year\": 2020,
                  \"finished\": false
                }
                """);

        List<Series> list = SeriesLoader.loadList(file);

        assertEquals(1, list.size());
        Series s = list.get(0);

        assertNull(s.getTitle());
        assertNull(s.getStudio());
        assertEquals("Drama", s.getGenre());
        assertEquals(1, s.getSeasons());
    }
}
