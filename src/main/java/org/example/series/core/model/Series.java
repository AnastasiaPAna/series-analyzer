package org.example.series.core.model;

import jakarta.persistence.*;



/**
 * JPA entity representing a TV series.
 */
@Entity
@Table(name = "series")

public class Series {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "studio_id", nullable = false)
    private Studio studio;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String genre;

    @Column(nullable = false)
    private int seasons;

    @Column(nullable = false)
    private double rating;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private boolean finished;

    public Series() {}

    public Series(String title,
                  String genre,
                  int seasons,
                  double rating,
                  int year,
                  boolean finished,
                  Studio studio) {
        this.title = title;
        this.genre = genre;
        this.seasons = seasons;
        this.rating = rating;
        this.year = year;
        this.finished = finished;
        this.studio = studio;
    }

    public Long getId() { return id; }

    public Studio getStudio() { return studio; }
    public void setStudio(Studio studio) { this.studio = studio; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public int getSeasons() { return seasons; }
    public void setSeasons(int seasons) { this.seasons = seasons; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public boolean isFinished() { return finished; }
    public void setFinished(boolean finished) { this.finished = finished; }
}
