package org.example.series.core.spec;

import org.example.series.core.model.Series;
import org.springframework.data.jpa.domain.Specification;

/**
 * JPA Specification builder for series filtering.
 */
public class SeriesSpecification {

    public static Specification<Series> hasStudio(Long studioId) {
        return (root, query, cb) ->
                studioId == null ? null :
                        cb.equal(root.get("studio").get("id"), studioId);
    }

    public static Specification<Series> ratingGreaterThan(Double rating) {
        return (root, query, cb) ->
                rating == null ? null :
                        cb.greaterThanOrEqualTo(root.get("rating"), rating);
    }

    public static Specification<Series> hasYear(Integer year) {
        return (root, query, cb) ->
                year == null ? null :
                        cb.equal(root.get("year"), year);
    }
}
