package com.rlanomaly.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationMetrics {
    private long episodes;
    private double totalReward;
    private double averageReward;
    private double accuracy;
    private long falsePositives;
    private long falseNegatives;
    private long truePositives;
    private long trueNegatives;
    private long monitoredEvents;
    private long blockedEvents;
    private long allowedEvents;
}
