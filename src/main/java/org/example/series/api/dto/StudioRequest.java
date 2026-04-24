package org.example.series.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * StudioRequest component.
 */
public record StudioRequest(

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 255,
                message = "Name must be between 2 and 255 characters")
        @Pattern(
                regexp = "^(?=.*[A-Za-zА-Яа-яЇїІіЄєҐґ])[A-Za-zА-Яа-яЇїІіЄєҐґ0-9 .,'-]+$",
                message = "Name must contain letters and may include numbers, spaces, dots or hyphens"
        )
        String name,

        @NotBlank(message = "Country is required")
        @Size(min = 2, max = 255,
                message = "Country must be between 2 and 255 characters")
        @Pattern(
                regexp = "^(?=.*[A-Za-zА-Яа-яЇїІіЄєҐґ])[A-Za-zА-Яа-яЇїІіЄєҐґ0-9 .,'-]+$",
                message = "Name must contain letters and may include numbers, spaces, dots or hyphens"
        )
        String country

) {}

