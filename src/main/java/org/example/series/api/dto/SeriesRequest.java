package org.example.series.api.dto;

import jakarta.validation.constraints.*;
import org.example.series.api.validation.StudioExists;
import org.example.series.api.validation.ValidSeriesState;

/**
 * SeriesRequest component.
 */
@ValidSeriesState
public class SeriesRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(min = 2, max = 120, message = "Title must be between 2 and 120 characters")
    @Pattern(regexp = "^[\\p{L}0-9 .:'-]+$", message = "Title contains invalid characters")
    private String title;

    @Min(value = 1, message = "Seasons must be at least 1")
    @Max(value = 60, message = "Seasons cannot exceed 60")
    private int seasons;

    @DecimalMin(value = "0.0", inclusive = true, message = "Rating must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Rating must be <= 10")
    @Digits(integer = 2, fraction = 1, message = "Rating must have max 1 decimal place")
    private double rating;

    @Min(value = 1950, message = "Year must not be before 1950")
    @Max(value = 2100, message = "Year is too far in future")
    private int year;

    @NotNull(message = "Finished flag must be provided")
    private Boolean finished;

    @NotNull(message = "Studio ID is required")
    @Positive(message = "Studio ID must be positive")
    @StudioExists
    private Long studioId;

    @NotBlank(message = "Genre must not be blank")
    @Size(min = 2, max = 80, message = "Genre must be between 2 and 80 characters")
    @Pattern(regexp = "^[\\p{L}0-9, .:'-]+$", message = "Genre contains invalid characters")
    private String genre;

    @Size(max = 500, message = "Trailer URL is too long")
    @Pattern(
            regexp = "^(|https?://(www\\.)?(youtube\\.com|youtu\\.be)/.+)$",
            message = "Trailer URL must be a valid YouTube link"
    )
    private String trailerUrl;

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getSeasons() { return seasons; }
    public void setSeasons(int seasons) { this.seasons = seasons; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public Boolean getFinished() { return finished; }
    public void setFinished(Boolean finished) { this.finished = finished; }

    public Long getStudioId() { return studioId; }
    public void setStudioId(Long studioId) { this.studioId = studioId; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
}
