package com.rlanomaly.backend.service;

import com.rlanomaly.backend.enums.EnvironmentDifficulty;
import com.rlanomaly.backend.enums.EventLabel;
import com.rlanomaly.backend.enums.EventType;
import com.rlanomaly.backend.enums.RiskState;
import com.rlanomaly.backend.model.AgentConfig;
import com.rlanomaly.backend.model.NetworkEvent;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class NetworkEnvironmentService {
    private static final double DEFAULT_ANOMALY_PROBABILITY = 0.25;
    private static final EnvironmentDifficulty DEFAULT_DIFFICULTY = EnvironmentDifficulty.MEDIUM;

    public NetworkEvent generateEvent(AgentConfig config) {
        double anomalyProbability = config != null ? config.getAnomalyProbability() : DEFAULT_ANOMALY_PROBABILITY;
        EnvironmentDifficulty difficulty = config != null ? config.getEnvironmentDifficulty() : DEFAULT_DIFFICULTY;

        return generateEvent(anomalyProbability, difficulty);
    }

    public NetworkEvent generateEvent(double anomalyProbability, EnvironmentDifficulty difficulty) {
        double boundedAnomalyProbability = clamp(anomalyProbability, 0.0, 1.0);
        EnvironmentDifficulty effectiveDifficulty = difficulty != null ? difficulty : DEFAULT_DIFFICULTY;
        EventLabel label = selectLabel(boundedAnomalyProbability, effectiveDifficulty);

        return switch (label) {
            case NORMAL -> generateNormalEvent(effectiveDifficulty);
            case SUSPICIOUS -> generateSuspiciousEvent(effectiveDifficulty);
            case ANOMALY -> generateAnomalyEvent(effectiveDifficulty);
            case CRITICAL -> generateCriticalEvent(effectiveDifficulty);
        };
    }

    private EventLabel selectLabel(double anomalyProbability, EnvironmentDifficulty difficulty) {
        double suspiciousProbability = switch (difficulty) {
            case EASY -> 0.15;
            case MEDIUM -> 0.25;
            case HARD -> 0.35;
        };
        double criticalShare = switch (difficulty) {
            case EASY -> 0.20;
            case MEDIUM -> 0.30;
            case HARD -> 0.40;
        };
        double roll = random().nextDouble();

        if (roll < anomalyProbability) {
            return random().nextDouble() < criticalShare ? EventLabel.CRITICAL : EventLabel.ANOMALY;
        }

        return random().nextDouble() < suspiciousProbability ? EventLabel.SUSPICIOUS : EventLabel.NORMAL;
    }

    private NetworkEvent generateNormalEvent(EnvironmentDifficulty difficulty) {
        SignalRange range = ranges(difficulty).get(EventLabel.NORMAL);

        return baseEvent(EventType.NORMAL_TRAFFIC, EventLabel.NORMAL, RiskState.NORMAL, range)
                .targetPort(pickCommonPort())
                .build();
    }

    private NetworkEvent generateSuspiciousEvent(EnvironmentDifficulty difficulty) {
        SignalRange range = ranges(difficulty).get(EventLabel.SUSPICIOUS);
        EventType eventType = pick(EventType.LOGIN_ATTEMPT, EventType.UNKNOWN_ACCESS, EventType.DATA_TRANSFER);

        return baseEvent(eventType, EventLabel.SUSPICIOUS, RiskState.SUSPICIOUS, range)
                .targetPort(pickCommonOrAdminPort())
                .build();
    }

    private NetworkEvent generateAnomalyEvent(EnvironmentDifficulty difficulty) {
        SignalRange range = ranges(difficulty).get(EventLabel.ANOMALY);
        EventType eventType = pick(EventType.PORT_SCAN, EventType.BRUTE_FORCE, EventType.UNKNOWN_ACCESS);

        return baseEvent(eventType, EventLabel.ANOMALY, RiskState.RISKY, range)
                .targetPort(pickScannedPort())
                .build();
    }

    private NetworkEvent generateCriticalEvent(EnvironmentDifficulty difficulty) {
        SignalRange range = ranges(difficulty).get(EventLabel.CRITICAL);
        EventType eventType = pick(EventType.BRUTE_FORCE, EventType.DATA_EXFILTRATION);

        return baseEvent(eventType, EventLabel.CRITICAL, RiskState.CRITICAL, range)
                .targetPort(pickSensitivePort())
                .build();
    }

    private NetworkEvent.NetworkEventBuilder baseEvent(
            EventType eventType,
            EventLabel label,
            RiskState riskState,
            SignalRange range
    ) {
        return NetworkEvent.builder()
                .id(UUID.randomUUID().toString())
                .eventType(eventType)
                .failedLogins(randomInt(range.minFailedLogins(), range.maxFailedLogins()))
                .connectionFrequency(randomInt(range.minConnectionFrequency(), range.maxConnectionFrequency()))
                .ipReputation(randomInt(range.minIpReputation(), range.maxIpReputation()))
                .trafficVolume(randomLong(range.minTrafficVolume(), range.maxTrafficVolume()))
                .realLabel(label)
                .riskState(riskState)
                .timestamp(Instant.now());
    }

    private Map<EventLabel, SignalRange> ranges(EnvironmentDifficulty difficulty) {
        // HARD intentionally overlaps ranges more than EASY to create ambiguous observations.
        Map<EventLabel, SignalRange> ranges = new EnumMap<>(EventLabel.class);

        switch (difficulty) {
            case EASY -> {
                ranges.put(EventLabel.NORMAL, new SignalRange(0, 1, 1, 20, 75, 100, 500, 15_000));
                ranges.put(EventLabel.SUSPICIOUS, new SignalRange(1, 3, 18, 45, 45, 74, 10_000, 80_000));
                ranges.put(EventLabel.ANOMALY, new SignalRange(4, 8, 55, 120, 15, 44, 70_000, 300_000));
                ranges.put(EventLabel.CRITICAL, new SignalRange(9, 18, 130, 260, 0, 20, 250_000, 900_000));
            }
            case MEDIUM -> {
                ranges.put(EventLabel.NORMAL, new SignalRange(0, 2, 1, 35, 65, 100, 500, 35_000));
                ranges.put(EventLabel.SUSPICIOUS, new SignalRange(1, 5, 25, 70, 35, 80, 20_000, 140_000));
                ranges.put(EventLabel.ANOMALY, new SignalRange(3, 10, 55, 145, 10, 55, 80_000, 450_000));
                ranges.put(EventLabel.CRITICAL, new SignalRange(7, 20, 100, 300, 0, 30, 250_000, 1_200_000));
            }
            case HARD -> {
                ranges.put(EventLabel.NORMAL, new SignalRange(0, 3, 1, 50, 55, 100, 500, 70_000));
                ranges.put(EventLabel.SUSPICIOUS, new SignalRange(0, 7, 20, 95, 25, 85, 15_000, 220_000));
                ranges.put(EventLabel.ANOMALY, new SignalRange(2, 12, 45, 170, 8, 65, 60_000, 600_000));
                ranges.put(EventLabel.CRITICAL, new SignalRange(5, 22, 80, 320, 0, 45, 180_000, 1_400_000));
            }
        }

        return ranges;
    }

    private int pickCommonPort() {
        return pick(80, 443, 53, 123);
    }

    private int pickCommonOrAdminPort() {
        return pick(22, 80, 443, 8080, 3306);
    }

    private int pickScannedPort() {
        return pick(21, 22, 23, 25, 3389, 5432, randomInt(1024, 65535));
    }

    private int pickSensitivePort() {
        return pick(22, 23, 3389, 3306, 5432, 6379, 27017);
    }

    @SafeVarargs
    private final <T> T pick(T... values) {
        return values[random().nextInt(values.length)];
    }

    private int randomInt(int minInclusive, int maxInclusive) {
        return random().nextInt(minInclusive, maxInclusive + 1);
    }

    private long randomLong(long minInclusive, long maxInclusive) {
        return random().nextLong(minInclusive, maxInclusive + 1);
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private ThreadLocalRandom random() {
        return ThreadLocalRandom.current();
    }

    private record SignalRange(
            int minFailedLogins,
            int maxFailedLogins,
            int minConnectionFrequency,
            int maxConnectionFrequency,
            int minIpReputation,
            int maxIpReputation,
            long minTrafficVolume,
            long maxTrafficVolume
    ) {
    }
}
