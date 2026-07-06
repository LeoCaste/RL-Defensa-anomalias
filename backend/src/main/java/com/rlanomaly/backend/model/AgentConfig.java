package com.rlanomaly.backend.model;

import com.rlanomaly.backend.enums.EnvironmentDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentConfig {
    private double alpha;
    private double gamma;
    private double epsilon;
    private double anomalyProbability;
    private EnvironmentDifficulty environmentDifficulty;
}
