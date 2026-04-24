package org.example.series.api.dto;

/**
 * DTO for JSON import (Task 1 format).
 * Example:
 * {
 *   "title": "...",
 *   "genre": "...",
 *   "seasons": 2,
 *   "rating": 8.1,
 *   "year": 2022,
 *   "finished": false,
 *   "studio": { "name": "Netflix", "country": "USA" }
 * }
 */
/**
 * SeriesImportItem component.
 */
public class SeriesImportItem {

    private String title;
    private String genre;
    private Integer seasons;
    private Double rating;
    private Integer year;
    private Boolean finished;
    private StudioImport studio;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public Integer getSeasons() { return seasons; }
    public void setSeasons(Integer seasons) { this.seasons = seasons; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Boolean getFinished() { return finished; }
    public void setFinished(Boolean finished) { this.finished = finished; }

    public StudioImport getStudio() { return studio; }
    public void setStudio(StudioImport studio) { this.studio = studio; }

    public static class StudioImport {
        private String name;
        private String country;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }
}
