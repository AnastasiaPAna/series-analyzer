package org.example.series.web.viewmodel;

/**
 * ViewModel used only for rendering data in HTML templates (Thymeleaf).
 *
 * This class represents presentation layer model.
 * It is intentionally separated from:
 *
 * - Core domain model (Series)
 * - REST API DTO (SeriesResponse)
 *
 * Why?
 *  - UI may require different fields
 *  - UI may require formatted values
 *  - Domain model must stay clean and independent
 */
/**
 * View model for rendering series in HTML templates.
 */
public class SeriesViewModel {
    /**
     * Series title displayed in UI.
     */
    private String title;

    /**
     * Genre string (can contain multiple genres).
     */
    private String genre;

    /**
     * Number of seasons.
     */
    private int seasons;

    /**
     * Rating value (e.g. 8.5).
     */
    private double rating;

    /**
     * Indicates whether the series is finished.
     */
    private boolean finished;

    /**
     * Constructor used by SeriesViewMapper.
     *
     * @param title series title
     * @param genre genre string
     * @param seasons number of seasons
     * @param rating rating value
     * @param finished finished flag
     */
    public SeriesViewModel(String title,
                           String genre,
                           int seasons,
                           double rating,
                           boolean finished) {
        this.title = title;
        this.genre = genre;
        this.seasons = seasons;
        this.rating = rating;
        this.finished = finished;
    }

    public String getTitle() { return title; }
    public String getGenre() { return genre; }
    public int getSeasons() { return seasons; }
    public double getRating() { return rating; }
    public boolean isFinished() { return finished; }

    /**
     * Derived field example (optional enhancement).
     * Can be used in template instead of raw boolean.
     */
    public String getStatusLabel() {
        return finished ? "Finished" : "Ongoing";
    }

    /**
     * Converts rating (0–10 scale) into 5-star representation.
     * Example:
     *  8.6 -> ★★★★☆
     */
    public String getRatingStars() {
        int stars = (int) Math.round(rating / 2.0); // convert 10-scale to 5-scale
        return "★".repeat(Math.max(0, stars)) +
                "☆".repeat(Math.max(0, 5 - stars));
    }
}
