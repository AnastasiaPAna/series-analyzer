package org.example.series.api.dto;

/**
 * SeriesResponse component.
 */
public class SeriesResponse {

    private Long id;
    private String title;
    private String genre;
    private int seasons;
    private double rating;
    private int year;
    private boolean finished;
    private StudioResponse studio;

    public SeriesResponse(Long id,
                          String title,
                          String genre,
                          int seasons,
                          double rating,
                          int year,
                          boolean finished,
                          StudioResponse studio) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.seasons = seasons;
        this.rating = rating;
        this.year = year;
        this.finished = finished;
        this.studio = studio;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getGenre() { return genre; }
    public int getSeasons() { return seasons; }
    public double getRating() { return rating; }
    public int getYear() { return year; }
    public boolean isFinished() { return finished; }
    public StudioResponse getStudio() { return studio; }
}
