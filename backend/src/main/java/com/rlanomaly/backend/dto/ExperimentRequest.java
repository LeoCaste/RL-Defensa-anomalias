package com.rlanomaly.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ExperimentRequest(
        @NotBlank String name
) {
}
