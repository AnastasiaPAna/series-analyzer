package org.example.series.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.series.api.dto.SeriesRequest;

import java.time.Year;

/**
 * Bean validation helper for validating series state constraints.
 */
public class SeriesStateValidator implements ConstraintValidator<ValidSeriesState, SeriesRequest> {

    @Override
    public boolean isValid(SeriesRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }

        Boolean finished = request.getFinished();
        if (finished == null) {
            return true;
        }

        boolean valid = true;
        int currentYear = Year.now().getValue();
        int maxPlannedYear = currentYear + 3;

        context.disableDefaultConstraintViolation();

        if (request.getYear() < 1950) {
            context.buildConstraintViolationWithTemplate("Year must be 1950 or later for this catalog")
                    .addPropertyNode("year")
                    .addConstraintViolation();
            valid = false;
        }

        if (request.getYear() > maxPlannedYear) {
            context.buildConstraintViolationWithTemplate(
                            "Release year is too far in future. Use a year no later than " + maxPlannedYear)
                    .addPropertyNode("year")
                    .addConstraintViolation();
            valid = false;
        }

        String genreValue = request.getGenre() == null ? "" : request.getGenre().trim();
        String[] genres = genreValue.isBlank()
                ? new String[0]
                : genreValue.split("\\s*,\\s*");

        if (genres.length < 1 || genres.length > 3) {
            context.buildConstraintViolationWithTemplate("Select from 1 to 3 genres")
                    .addPropertyNode("genre")
                    .addConstraintViolation();
            valid = false;
        }

        if (Boolean.TRUE.equals(finished) && request.getYear() > currentYear) {
            context.buildConstraintViolationWithTemplate(
                            "Future year means a planned release, so the series cannot be marked as finished")
                    .addPropertyNode("year")
                    .addConstraintViolation();
            valid = false;
        }

        return valid;
    }
}
