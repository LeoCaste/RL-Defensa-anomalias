package com.rlanomaly.backend.service;

import com.rlanomaly.backend.dto.ConfigRequest;
import com.rlanomaly.backend.dto.SimulationResponse;
import com.rlanomaly.backend.dto.TrainRequest;
import com.rlanomaly.backend.enums.EnvironmentDifficulty;
import com.rlanomaly.backend.model.ActionSelection;
import com.rlanomaly.backend.model.AgentConfig;
import com.rlanomaly.backend.model.NetworkEvent;
import com.rlanomaly.backend.model.RewardResult;
import com.rlanomaly.backend.model.SimulationResult;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

@Service
public class SimulationService {
    private static final int RECENT_HISTORY_LIMIT = 20;
    private static final AgentConfig DEFAULT_CONFIG = AgentConfig.builder()
            .alpha(0.1)
            .gamma(0.9)
            .epsilon(0.1)
            .anomalyProbability(0.25)
            .environmentDifficulty(EnvironmentDifficulty.MEDIUM)
            .build();

    private final NetworkEnvironmentService environmentService;
    private final QLearningAgentService agentService;
    private final RewardService rewardService;
    private final MetricsService metricsService;
    private final List<Double> rewardHistory = new ArrayList<>();
    private final Deque<SimulationResult> recentHistory = new ArrayDeque<>();
    private AgentConfig config = copy(DEFAULT_CONFIG);
    private SimulationResult currentResult;

    public SimulationService(
            NetworkEnvironmentService environmentService,
            QLearningAgentService agentService,
            RewardService rewardService,
            MetricsService metricsService
    ) {
        this.environmentService = environmentService;
        this.agentService = agentService;
        this.rewardService = rewardService;
        this.metricsService = metricsService;
    }

    public synchronized SimulationResponse step() {
        SimulationResult result = executeStep();
        currentResult = result;
        return status();
    }

    public synchronized SimulationResponse train(TrainRequest request) {
        config = AgentConfig.builder()
                .alpha(request.alpha())
                .gamma(request.gamma())
                .epsilon(request.epsilon())
                .anomalyProbability(request.anomalyProbability())
                .environmentDifficulty(config.getEnvironmentDifficulty())
                .build();

        for (int i = 0; i < request.episodes(); i++) {
            currentResult = executeStep();
        }

        return status();
    }

    public synchronized SimulationResponse reset() {
        agentService.reset();
        metricsService.reset();
        rewardHistory.clear();
        recentHistory.clear();
        currentResult = null;
        return status();
    }

    public synchronized SimulationResponse updateConfig(ConfigRequest request) {
        config = AgentConfig.builder()
                .alpha(request.alpha())
                .gamma(request.gamma())
                .epsilon(request.epsilon())
                .anomalyProbability(request.anomalyProbability())
                .environmentDifficulty(request.environmentDifficulty())
                .build();
        return status();
    }

    public synchronized SimulationResponse status() {
        return new SimulationResponse(
                currentResult,
                copy(config),
                metricsService.current(),
                metricsService.current().getEpisodes(),
                agentService.getQTable(),
                agentService.getPolicy(),
                List.copyOf(rewardHistory),
                List.copyOf(recentHistory)
        );
    }

    private SimulationResult executeStep() {
        NetworkEvent event = environmentService.generateEvent(config);
        ActionSelection selection = agentService.chooseAction(event.getRiskState(), config);
        RewardResult reward = rewardService.calculateReward(event, selection.getAction());
        NetworkEvent nextEvent = environmentService.generateEvent(config);
        double previousQValue = selection.getQValue();
        double updatedQValue = agentService.updateQValue(event.getRiskState(), selection.getAction(), reward.getReward(), nextEvent.getRiskState(), config);
        var metrics = metricsService.record(event, selection.getAction(), reward.getReward());
        rewardHistory.add(reward.getReward());

        SimulationResult result = SimulationResult.builder()
                .episode(metrics.getEpisodes())
                .event(event)
                .state(event.getRiskState())
                .action(selection.getAction())
                .exploration(selection.isExploration())
                .selectedQValue(selection.getQValue())
                .previousQValue(previousQValue)
                .updatedQValue(updatedQValue)
                .reward(reward.getReward())
                .outcomeType(reward.getOutcomeType())
                .explanation(explain(event, selection, reward))
                .nextState(nextEvent.getRiskState())
                .metrics(metrics)
                .qTable(agentService.getQTable())
                .learnedPolicy(agentService.getPolicy())
                .build();
        addRecent(result);
        return result;
    }

    private void addRecent(SimulationResult result) {
        recentHistory.addFirst(result);
        while (recentHistory.size() > RECENT_HISTORY_LIMIT) {
            recentHistory.removeLast();
        }
    }

    private String explain(NetworkEvent event, ActionSelection selection, RewardResult reward) {
        String mode = selection.isExploration() ? "exploracion epsilon-greedy" : "explotacion de la Q-table";
        return "Estado " + event.getRiskState() + ", accion " + selection.getAction()
                + " por " + mode + ". " + reward.getExplanation();
    }

    private static AgentConfig copy(AgentConfig source) {
        return AgentConfig.builder()
                .alpha(source.getAlpha())
                .gamma(source.getGamma())
                .epsilon(source.getEpsilon())
                .anomalyProbability(source.getAnomalyProbability())
                .environmentDifficulty(source.getEnvironmentDifficulty())
                .build();
    }
}
