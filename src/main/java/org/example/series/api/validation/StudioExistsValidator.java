package org.example.series.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.series.core.repository.StudioRepository;
import org.springframework.stereotype.Component;



/**
 * Validator for {@link StudioExists}.
 */
@Component

public class StudioExistsValidator implements ConstraintValidator<StudioExists, Long> {

    private final StudioRepository studioRepository;

    public StudioExistsValidator(StudioRepository studioRepository) {
        this.studioRepository = studioRepository;
    }

    @Override
    public boolean isValid(Long value, ConstraintValidatorContext context) {

        if (value == null) {
            return false;
        }

        return studioRepository.existsById(value);
    }
}
