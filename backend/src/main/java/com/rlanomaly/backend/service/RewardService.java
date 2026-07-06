package com.rlanomaly.backend.service;

import com.rlanomaly.backend.enums.AgentAction;
import com.rlanomaly.backend.enums.EventLabel;
import com.rlanomaly.backend.enums.RewardOutcomeType;
import com.rlanomaly.backend.enums.RiskState;
import com.rlanomaly.backend.model.NetworkEvent;
import com.rlanomaly.backend.model.RewardResult;
import org.springframework.stereotype.Service;

@Service
public class RewardService {
    public RewardResult calculateReward(NetworkEvent event, AgentAction action) {
        if (event == null) {
            throw new IllegalArgumentException("event is required");
        }
        if (action == null) {
            throw new IllegalArgumentException("action is required");
        }

        EventLabel label = event.getRealLabel();
        RiskState riskState = event.getRiskState();

        if (isNormal(label, riskState)) {
            return rewardForNormal(action);
        }
        if (isSuspicious(label, riskState)) {
            return rewardForSuspicious(action);
        }
        if (isHighRisk(label, riskState)) {
            return rewardForHighRisk(action, label, riskState);
        }

        return result(-1.0, RewardOutcomeType.MINOR_ERROR, "La decision no coincide con una categoria de riesgo clara.");
    }

    private RewardResult rewardForNormal(AgentAction action) {
        return switch (action) {
            case ALLOW -> result(2.0, RewardOutcomeType.CORRECT, "Trafico normal permitido correctamente.");
            case MONITOR -> result(-0.5, RewardOutcomeType.MINOR_ERROR, "Monitorear trafico normal consume recursos sin necesidad.");
            case BLOCK -> result(-3.0, RewardOutcomeType.FALSE_POSITIVE, "Trafico normal bloqueado: falso positivo.");
        };
    }

    private RewardResult rewardForSuspicious(AgentAction action) {
        return switch (action) {
            case ALLOW -> result(-1.0, RewardOutcomeType.MINOR_ERROR, "Evento sospechoso permitido sin observacion adicional.");
            case MONITOR -> result(1.5, RewardOutcomeType.PRUDENT_DECISION, "Evento sospechoso monitoreado: decision prudente.");
            case BLOCK -> result(-1.5, RewardOutcomeType.MINOR_ERROR, "Bloquear un evento sospechoso puede ser excesivo.");
        };
    }

    private RewardResult rewardForHighRisk(AgentAction action, EventLabel label, RiskState riskState) {
        double blockReward = isCritical(label, riskState) ? 5.0 : 4.0;
        double allowPenalty = isCritical(label, riskState) ? -6.0 : -5.0;

        return switch (action) {
            case ALLOW -> result(allowPenalty, RewardOutcomeType.FALSE_NEGATIVE, "Amenaza permitida: falso negativo de alto impacto.");
            case MONITOR -> result(-1.0, RewardOutcomeType.MINOR_ERROR, "Monitorear una amenaza clara retrasa la contencion.");
            case BLOCK -> result(blockReward, RewardOutcomeType.CORRECT, "Amenaza bloqueada correctamente.");
        };
    }

    private boolean isNormal(EventLabel label, RiskState riskState) {
        return label == EventLabel.NORMAL || riskState == RiskState.NORMAL;
    }

    private boolean isSuspicious(EventLabel label, RiskState riskState) {
        return label == EventLabel.SUSPICIOUS || riskState == RiskState.SUSPICIOUS;
    }

    private boolean isHighRisk(EventLabel label, RiskState riskState) {
        return label == EventLabel.ANOMALY
                || label == EventLabel.CRITICAL
                || riskState == RiskState.RISKY
                || riskState == RiskState.CRITICAL;
    }

    private boolean isCritical(EventLabel label, RiskState riskState) {
        return label == EventLabel.CRITICAL || riskState == RiskState.CRITICAL;
    }

    private RewardResult result(double reward, RewardOutcomeType outcomeType, String explanation) {
        return RewardResult.builder()
                .reward(reward)
                .outcomeType(outcomeType)
                .explanation(explanation)
                .build();
    }
}
