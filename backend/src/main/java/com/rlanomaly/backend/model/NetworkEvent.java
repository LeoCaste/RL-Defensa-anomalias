package com.rlanomaly.backend.model;

import com.rlanomaly.backend.enums.EventLabel;
import com.rlanomaly.backend.enums.EventType;
import com.rlanomaly.backend.enums.RiskState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NetworkEvent {
    private String id;
    private EventType type;
    private EventLabel label;
    private RiskState riskState;
    private double anomalyScore;
    private int sourceReputation;
    private int requestRate;
    private long bytesTransferred;
    private Instant timestamp;
}
