package org.example.series.core.service;

import org.example.series.core.model.Series;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for computing aggregated statistics over series dataset.
 */
public class StatisticsService {

    public static List<Series> filterByRating(List<Series> list, double minRating) {
        return list.stream()
                .filter(s -> s.getRating() >= minRating)
                .toList();
    }

    public static List<Series> filterByFinished(List<Series> list, boolean finished) {
        return list.stream()
                .filter(s -> s.isFinished() == finished)
                .toList();
    }

    public static List<Series> topNByRating(List<Series> list, int n) {
        return list.stream()
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .limit(n)
                .toList();
    }

    public static List<Series> findByTitleContains(List<Series> list, String keyword) {
        return list.stream()
                .filter(s -> s.getTitle()
                        .toLowerCase()
                        .contains(keyword.toLowerCase()))
                .toList();
    }

    public static List<Series> sortByRatingDesc(List<Series> list) {
        return list.stream()
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .toList();
    }

    public static double averageRating(List<Series> list) {
        return list.stream()
                .mapToDouble(Series::getRating)
                .average()
                .orElse(0);
    }

    public static int maxSeasons(List<Series> list) {
        return list.stream()
                .mapToInt(Series::getSeasons)
                .max()
                .orElse(0);
    }

    
    /**
     * Counts series grouped by the requested attribute.
     *
     * @param list list of series
     * @param attribute attribute name (e.g., "genre", "studio")
     * @return map: group key -> count
     * @throws IllegalArgumentException if attribute is not supported
     */
    public static Map<String, Long> countByAttribute(List<Series> list, String attribute) {

        return switch (attribute.toLowerCase()) {

            case "title" ->
                    list.stream().collect(Collectors.groupingBy(
                            Series::getTitle,
                            Collectors.counting()
                    ));

            case "studio" ->
                    list.stream().collect(Collectors.groupingBy(
                            s -> s.getStudio().getName(),
                            Collectors.counting()
                    ));

            case "genre" ->
                    list.stream().collect(Collectors.groupingBy(
                            Series::getGenre,
                            Collectors.counting()
                    ));

            case "seasons" ->
                    list.stream().collect(Collectors.groupingBy(
                            s -> String.valueOf(s.getSeasons()),
                            Collectors.counting()
                    ));

            case "rating" ->
                    list.stream().collect(Collectors.groupingBy(
                            s -> String.valueOf(s.getRating()),
                            Collectors.counting()
                    ));

            case "year" ->
                    list.stream().collect(Collectors.groupingBy(
                            s -> String.valueOf(s.getYear()),
                            Collectors.counting()
                    ));

            case "finished" ->
                    list.stream().collect(Collectors.groupingBy(
                            s -> String.valueOf(s.isFinished()),
                            Collectors.counting()
                    ));

            default ->
                    throw new IllegalArgumentException("Unsupported attribute: " + attribute);
        };
    }
}
