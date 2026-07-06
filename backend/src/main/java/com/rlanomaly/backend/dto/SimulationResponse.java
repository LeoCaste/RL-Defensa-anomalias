package com.rlanomaly.backend.dto;

import com.rlanomaly.backend.model.AgentConfig;
import com.rlanomaly.backend.model.NetworkEvent;
import com.rlanomaly.backend.model.PolicyEntry;
import com.rlanomaly.backend.model.QTableEntry;
import com.rlanomaly.backend.model.SimulationMetrics;
import com.rlanomaly.backend.model.SimulationResult;

import java.util.List;

public record SimulationResponse(
        SimulationResult currentResult,
        AgentConfig config,
        SimulationMetrics metrics,
        long executedEpisodes,
        List<QTableEntry> qTable,
        List<PolicyEntry> learnedPolicy,
        List<Double> rewardHistory,
        List<NetworkEvent> recentHistory
) {
}
