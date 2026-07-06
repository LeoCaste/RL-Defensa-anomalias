package com.rlanomaly.backend.model;

import com.rlanomaly.backend.enums.AgentAction;
import com.rlanomaly.backend.enums.RiskState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyEntry {
    private RiskState state;
    private AgentAction bestAction;
    private double expectedValue;
}
