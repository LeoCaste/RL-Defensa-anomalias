package com.rlanomaly.backend.service;

import com.rlanomaly.backend.enums.AgentAction;
import com.rlanomaly.backend.enums.RiskState;
import com.rlanomaly.backend.model.ActionSelection;
import com.rlanomaly.backend.model.AgentConfig;
import com.rlanomaly.backend.model.PolicyEntry;
import com.rlanomaly.backend.model.QTableEntry;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class QLearningAgentService {
    private static final double DEFAULT_ALPHA = 0.1;
    private static final double DEFAULT_GAMMA = 0.9;
    private static final double DEFAULT_EPSILON = 0.1;

    private final Map<RiskState, Map<AgentAction, Double>> qTable = new EnumMap<>(RiskState.class);

    public QLearningAgentService() {
        reset();
    }

    public ActionSelection chooseAction(RiskState state, AgentConfig config) {
        RiskState effectiveState = requireState(state);
        double epsilon = config != null ? config.getEpsilon() : DEFAULT_EPSILON;
        boolean exploration = random().nextDouble() < clamp(epsilon, 0.0, 1.0);
        AgentAction action = exploration ? randomAction() : bestAction(effectiveState);

        return ActionSelection.builder()
                .action(action)
                .exploration(exploration)
                .qValue(qValue(effectiveState, action))
                .build();
    }

    public double updateQValue(
            RiskState state,
            AgentAction action,
            double reward,
            RiskState nextState,
            AgentConfig config
    ) {
        RiskState effectiveState = requireState(state);
        RiskState effectiveNextState = requireState(nextState);
        AgentAction effectiveAction = requireAction(action);
        double alpha = config != null ? config.getAlpha() : DEFAULT_ALPHA;
        double gamma = config != null ? config.getGamma() : DEFAULT_GAMMA;
        double currentQ = qValue(effectiveState, effectiveAction);
        double updatedQ = currentQ + alpha * (reward + gamma * maxQ(effectiveNextState) - currentQ);

        qTable.get(effectiveState).put(effectiveAction, updatedQ);

        return updatedQ;
    }

    public List<QTableEntry> getQTable() {
        List<QTableEntry> entries = new ArrayList<>();

        for (RiskState state : RiskState.values()) {
            for (AgentAction action : AgentAction.values()) {
                entries.add(QTableEntry.builder()
                        .state(state)
                        .action(action)
                        .qValue(qValue(state, action))
                        .build());
            }
        }

        return entries;
    }

    public List<PolicyEntry> getPolicy() {
        List<PolicyEntry> policy = new ArrayList<>();

        for (RiskState state : RiskState.values()) {
            AgentAction action = bestAction(state);
            policy.add(PolicyEntry.builder()
                    .state(state)
                    .bestAction(action)
                    .expectedValue(qValue(state, action))
                    .build());
        }

        return policy;
    }

    public void reset() {
        qTable.clear();

        for (RiskState state : RiskState.values()) {
            Map<AgentAction, Double> actionValues = new EnumMap<>(AgentAction.class);
            for (AgentAction action : AgentAction.values()) {
                actionValues.put(action, 0.0);
            }
            qTable.put(state, actionValues);
        }
    }

    private AgentAction bestAction(RiskState state) {
        AgentAction bestAction = AgentAction.values()[0];
        double bestValue = qValue(state, bestAction);

        for (AgentAction action : AgentAction.values()) {
            double candidateValue = qValue(state, action);
            if (candidateValue > bestValue) {
                bestAction = action;
                bestValue = candidateValue;
            }
        }

        return bestAction;
    }

    private double maxQ(RiskState state) {
        double maxValue = Double.NEGATIVE_INFINITY;

        for (AgentAction action : AgentAction.values()) {
            maxValue = Math.max(maxValue, qValue(state, action));
        }

        return maxValue;
    }

    private double qValue(RiskState state, AgentAction action) {
        return qTable.get(state).get(action);
    }

    private AgentAction randomAction() {
        AgentAction[] actions = AgentAction.values();
        return actions[random().nextInt(actions.length)];
    }

    private RiskState requireState(RiskState state) {
        if (state == null) {
            throw new IllegalArgumentException("state is required");
        }
        return state;
    }

    private AgentAction requireAction(AgentAction action) {
        if (action == null) {
            throw new IllegalArgumentException("action is required");
        }
        return action;
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private ThreadLocalRandom random() {
        return ThreadLocalRandom.current();
    }
}
