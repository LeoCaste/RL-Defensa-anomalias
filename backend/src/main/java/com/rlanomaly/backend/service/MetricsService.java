package com.rlanomaly.backend.service;

import com.rlanomaly.backend.enums.AgentAction;
import com.rlanomaly.backend.enums.EventLabel;
import com.rlanomaly.backend.model.NetworkEvent;
import com.rlanomaly.backend.model.SimulationMetrics;
import org.springframework.stereotype.Service;

@Service
public class MetricsService {
    private SimulationMetrics metrics = emptyMetrics();

    public SimulationMetrics record(NetworkEvent event, AgentAction action, double reward) {
        metrics.setEpisodes(metrics.getEpisodes() + 1);
        metrics.setTotalReward(metrics.getTotalReward() + reward);
        metrics.setAverageReward(metrics.getTotalReward() / metrics.getEpisodes());

        switch (action) {
            case ALLOW -> metrics.setAllowedEvents(metrics.getAllowedEvents() + 1);
            case MONITOR -> metrics.setMonitoredEvents(metrics.getMonitoredEvents() + 1);
            case BLOCK -> metrics.setBlockedEvents(metrics.getBlockedEvents() + 1);
        }

        boolean threat = isThreat(event);
        if (threat && action == AgentAction.BLOCK) {
            metrics.setTruePositives(metrics.getTruePositives() + 1);
        } else if (threat && action == AgentAction.ALLOW) {
            metrics.setFalseNegatives(metrics.getFalseNegatives() + 1);
        } else if (!threat && action == AgentAction.BLOCK) {
            metrics.setFalsePositives(metrics.getFalsePositives() + 1);
        } else if (!threat && action != AgentAction.BLOCK) {
            metrics.setTrueNegatives(metrics.getTrueNegatives() + 1);
        }

        long correct = metrics.getTruePositives() + metrics.getTrueNegatives();
        metrics.setAccuracy((double) correct / metrics.getEpisodes());
        return snapshot();
    }

    public SimulationMetrics current() {
        return snapshot();
    }

    public void reset() {
        metrics = emptyMetrics();
    }

    private boolean isThreat(NetworkEvent event) {
        return event.getRealLabel() == EventLabel.ANOMALY || event.getRealLabel() == EventLabel.CRITICAL;
    }

    private SimulationMetrics snapshot() {
        return SimulationMetrics.builder()
                .episodes(metrics.getEpisodes())
                .totalReward(metrics.getTotalReward())
                .averageReward(metrics.getAverageReward())
                .accuracy(metrics.getAccuracy())
                .falsePositives(metrics.getFalsePositives())
                .falseNegatives(metrics.getFalseNegatives())
                .truePositives(metrics.getTruePositives())
                .trueNegatives(metrics.getTrueNegatives())
                .monitoredEvents(metrics.getMonitoredEvents())
                .blockedEvents(metrics.getBlockedEvents())
                .allowedEvents(metrics.getAllowedEvents())
                .build();
    }

    private SimulationMetrics emptyMetrics() {
        return SimulationMetrics.builder().build();
    }
}
