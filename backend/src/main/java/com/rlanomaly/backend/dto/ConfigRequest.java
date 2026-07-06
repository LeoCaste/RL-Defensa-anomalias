package com.rlanomaly.backend.dto;

import com.rlanomaly.backend.enums.EnvironmentDifficulty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record ConfigRequest(
        @DecimalMin("0.0") @DecimalMax("1.0") double alpha,
        @DecimalMin("0.0") @DecimalMax("1.0") double gamma,
        @DecimalMin("0.0") @DecimalMax("1.0") double epsilon,
        @DecimalMin("0.0") @DecimalMax("1.0") double anomalyProbability,
        @NotNull EnvironmentDifficulty environmentDifficulty
) {
}
