package com.rlanomaly.backend.model;

import com.rlanomaly.backend.enums.AgentAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionSelection {
    private AgentAction action;
    private boolean exploration;
    private double qValue;
}
