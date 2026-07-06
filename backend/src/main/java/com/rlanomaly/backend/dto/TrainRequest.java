package com.rlanomaly.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;

public record TrainRequest(
        @Positive int episodes,
        @DecimalMin("0.0") @DecimalMax("1.0") double alpha,
        @DecimalMin("0.0") @DecimalMax("1.0") double gamma,
        @DecimalMin("0.0") @DecimalMax("1.0") double epsilon,
        @DecimalMin("0.0") @DecimalMax("1.0") double anomalyProbability
) {
}
