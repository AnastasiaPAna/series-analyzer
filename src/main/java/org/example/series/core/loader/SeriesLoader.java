package org.example.series.core.loader;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.reflect.TypeToken;
import org.example.series.core.model.Series;

import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

/**
 * Utility for streaming/efficient loading of series from JSON files.
 */
public class SeriesLoader {

    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class,
                    (JsonDeserializer<LocalDateTime>) (json, type, context) ->
                            LocalDateTime.parse(json.getAsString()))
            .create();

    private static final Type LIST_TYPE = new TypeToken<List<Series>>() {}.getType();

    /** Read file that can be either: { ... } OR [ { ... }, { ... } ] */
    public static List<Series> loadList(String path) {
        return loadList(Path.of(path));
    }

    /**
     * Backward-compatible helper for the legacy console runner.
     * Loads each file from the given list and concatenates the results.
     */
    public static List<Series> loadAll(List<String> paths) {
        if (paths == null || paths.isEmpty()) return List.of();
        List<Series> result = new ArrayList<>();
        for (String p : paths) {
            if (p == null || p.isBlank()) continue;
            result.addAll(loadList(p));
        }
        return result;
    }

    public static List<Series> loadList(Path file) {
        try (Reader r = Files.newBufferedReader(file)) {
            // detect first non-space char
            String first = firstNonWhitespaceChar(file);
            if ("[".equals(first)) {
                List<Series> list = GSON.fromJson(r, LIST_TYPE);
                return list == null ? List.of() : list;
            } else {
                Series one = GSON.fromJson(r, Series.class);
                return one == null ? List.of() : List.of(one);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse file: " + file, e);
        }
    }

    /** Loads all .json from folder; each file may contain object or array */
    public static List<Series> loadFromFolder(String folderPath) {
        return loadFromFolder(Path.of(folderPath), 4);
    }

    public static List<Series> loadFromFolder(Path folder, int threads) {
        ExecutorService pool = Executors.newFixedThreadPool(threads);

        try (var paths = Files.list(folder)) {

            List<Path> files = paths
                    .filter(p -> p.toString().endsWith(".json"))
                    .toList();

            List<Future<List<Series>>> futures = new ArrayList<>();
            for (Path f : files) {
                futures.add(pool.submit(() -> loadList(f)));
            }

            List<Series> result = new ArrayList<>();
            for (Future<List<Series>> fut : futures) {
                result.addAll(fut.get());
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to load from folder: " + folder, e);
        } finally {
            pool.shutdown();
        }
    }

    private static String firstNonWhitespaceChar(Path file) throws Exception {
        // read small prefix
        String content = Files.readString(file);
        for (int i = 0; i < content.length(); i++) {
            char c = content.charAt(i);
            if (!Character.isWhitespace(c)) return String.valueOf(c);
        }
        return "";
    }
}
