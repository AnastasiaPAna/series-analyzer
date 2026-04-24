package org.example.series.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StudioExistsValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface StudioExists {

    String message() default "Studio does not exist";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
