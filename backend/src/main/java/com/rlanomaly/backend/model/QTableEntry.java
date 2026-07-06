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
public class QTableEntry {
    private RiskState state;
    private AgentAction action;
    private double qValue;
}
