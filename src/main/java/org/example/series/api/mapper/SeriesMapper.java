package org.example.series.api.mapper;

import org.example.series.api.dto.SeriesRequest;
import org.example.series.api.dto.SeriesResponse;
import org.example.series.api.dto.StudioResponse;
import org.example.series.core.model.Series;
import org.example.series.core.model.Studio;

/**
 * Mapper between Series entity and API DTOs.
 */
public class SeriesMapper {

    public static SeriesResponse toResponse(Series series) {

        Studio studio = series.getStudio();

        StudioResponse studioDto = new StudioResponse(
                studio.getId(),
                studio.getName(),
                studio.getCountry()
        );

        return new SeriesResponse(
                series.getId(),
                series.getTitle(),
                series.getGenre(),
                series.getSeasons(),
                series.getRating(),
                series.getYear(),
                series.isFinished(),
                studioDto
        );
    }

    public static Series toEntity(SeriesRequest request) {
        // finished у DTO Boolean -> entity boolean
        boolean finished = Boolean.TRUE.equals(request.getFinished());

        // studio тут null, бо ми проставляємо студію в SeriesService по studioId
        return new Series(
                request.getTitle(),
                request.getGenre(),
                request.getSeasons(),
                request.getRating(),
                request.getYear(),
                finished,
                null
        );
    }
}
