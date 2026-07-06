package com.rlanomaly.backend.dto;

import com.rlanomaly.backend.model.AgentConfig;
import com.rlanomaly.backend.model.PolicyEntry;
import com.rlanomaly.backend.model.QTableEntry;
import com.rlanomaly.backend.model.SimulationMetrics;

import java.time.Instant;
import java.util.List;

public record ExperimentResponse(
        Long id,
        String name,
        String description,
        AgentConfig config,
        SimulationMetrics metrics,
        List<QTableEntry> qTable,
        List<PolicyEntry> learnedPolicy,
        Instant createdAt
) {
}
