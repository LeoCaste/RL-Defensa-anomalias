package com.rlanomaly.backend.service;

import com.rlanomaly.backend.dto.ExperimentRequest;
import com.rlanomaly.backend.dto.ExperimentResponse;
import com.rlanomaly.backend.dto.SimulationResponse;
import com.rlanomaly.backend.entity.ExperimentRun;
import com.rlanomaly.backend.repository.ExperimentRunRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ExperimentService {
    private final ExperimentRunRepository repository;
    private final SimulationService simulationService;

    public ExperimentService(ExperimentRunRepository repository, SimulationService simulationService) {
        this.repository = repository;
        this.simulationService = simulationService;
    }

    public List<ExperimentResponse> list() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ExperimentResponse saveCurrent(ExperimentRequest request) {
        SimulationResponse status = simulationService.status();
        ExperimentRun run = new ExperimentRun();
        run.setName(request.name());
        run.setEpisodes(status.metrics().getEpisodes());
        run.setAlpha(status.config().getAlpha());
        run.setGamma(status.config().getGamma());
        run.setEpsilon(status.config().getEpsilon());
        run.setAnomalyProbability(status.config().getAnomalyProbability());
        run.setDifficulty(status.config().getEnvironmentDifficulty());
        run.setTotalReward(status.metrics().getTotalReward());
        run.setAverageReward(status.metrics().getAverageReward());
        run.setAccuracy(status.metrics().getAccuracy());
        run.setFalsePositives(status.metrics().getFalsePositives());
        run.setFalseNegatives(status.metrics().getFalseNegatives());
        run.setCreatedAt(Instant.now());
        return toResponse(repository.save(run));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ExperimentResponse toResponse(ExperimentRun run) {
        return new ExperimentResponse(
                run.getId(),
                run.getName(),
                null,
                com.rlanomaly.backend.model.AgentConfig.builder()
                        .alpha(run.getAlpha())
                        .gamma(run.getGamma())
                        .epsilon(run.getEpsilon())
                        .anomalyProbability(run.getAnomalyProbability())
                        .environmentDifficulty(run.getDifficulty())
                        .build(),
                com.rlanomaly.backend.model.SimulationMetrics.builder()
                        .episodes(run.getEpisodes())
                        .totalReward(run.getTotalReward())
                        .averageReward(run.getAverageReward())
                        .accuracy(run.getAccuracy())
                        .falsePositives(run.getFalsePositives())
                        .falseNegatives(run.getFalseNegatives())
                        .build(),
                List.of(),
                List.of(),
                run.getCreatedAt()
        );
    }
}
