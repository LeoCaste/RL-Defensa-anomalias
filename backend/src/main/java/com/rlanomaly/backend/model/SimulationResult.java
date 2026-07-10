package com.rlanomaly.backend.model;

import com.rlanomaly.backend.enums.AgentAction;
import com.rlanomaly.backend.enums.RewardOutcomeType;
import com.rlanomaly.backend.enums.RiskState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationResult {
    private long episode;
    private NetworkEvent event;
    private RiskState state;
    private AgentAction action;
    private boolean exploration;
    private double selectedQValue;
    private Double previousQValue;
    private Double updatedQValue;
    private double reward;
    private RewardOutcomeType outcomeType;
    private String explanation;
    private RiskState nextState;
    private SimulationMetrics metrics;
    private List<QTableEntry> qTable;
    private List<PolicyEntry> learnedPolicy;
}
