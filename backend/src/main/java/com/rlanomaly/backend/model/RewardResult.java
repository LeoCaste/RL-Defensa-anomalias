package com.rlanomaly.backend.model;

import com.rlanomaly.backend.enums.RewardOutcomeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardResult {
    private double reward;
    private RewardOutcomeType outcomeType;
    private String explanation;
}
