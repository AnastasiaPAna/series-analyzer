package org.example.series.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SeriesStateValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidSeriesState {

    String message() default "Invalid series state";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
