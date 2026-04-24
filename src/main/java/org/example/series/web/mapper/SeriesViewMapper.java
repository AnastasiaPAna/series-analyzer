package org.example.series.web.mapper;

import org.example.series.core.model.Series;
import org.example.series.web.viewmodel.SeriesViewModel;

import java.util.List;

/**
 * Mapper responsible for converting domain model (Series)
 * into Web ViewModel objects.
 *
 * This layer isolates UI from internal domain structure.
 * If domain model changes, web layer remains stable.
 */
public class SeriesViewMapper {

    /**
     * Converts single Series domain object
     * into SeriesViewModel used by Thymeleaf templates.
     *
     * @param s domain model object
     * @return view model object
     */
    public static SeriesViewModel toViewModel(Series s) {
        return new SeriesViewModel(
                s.getTitle(),
                s.getStudio().getName(),
                s.getSeasons(),
                s.getRating(),
                s.isFinished()
        );
    }

    /**
     * Converts list of Series domain objects
     * into list of SeriesViewModel objects.
     *
     * @param list domain model list
     * @return list of view models
     */
    public static List<SeriesViewModel> toViewModelList(List<Series> list) {
        return list.stream()
                .map(SeriesViewMapper::toViewModel)
                .toList();
    }
}
