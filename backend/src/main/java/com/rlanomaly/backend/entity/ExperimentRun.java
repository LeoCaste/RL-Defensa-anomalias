package com.rlanomaly.backend.entity;

import com.rlanomaly.backend.enums.EnvironmentDifficulty;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.Instant;

@Entity
public class ExperimentRun {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private long episodes;
    private double alpha;
    private double gamma;
    private double epsilon;
    private double anomalyProbability;
    @Enumerated(EnumType.STRING)
    private EnvironmentDifficulty difficulty;
    private double totalReward;
    private double averageReward;
    private double accuracy;
    private long falsePositives;
    private long falseNegatives;
    private Instant createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getEpisodes() {
        return episodes;
    }

    public void setEpisodes(long episodes) {
        this.episodes = episodes;
    }

    public double getAlpha() {
        return alpha;
    }

    public void setAlpha(double alpha) {
        this.alpha = alpha;
    }

    public double getGamma() {
        return gamma;
    }

    public void setGamma(double gamma) {
        this.gamma = gamma;
    }

    public double getEpsilon() {
        return epsilon;
    }

    public void setEpsilon(double epsilon) {
        this.epsilon = epsilon;
    }

    public double getAnomalyProbability() {
        return anomalyProbability;
    }

    public void setAnomalyProbability(double anomalyProbability) {
        this.anomalyProbability = anomalyProbability;
    }

    public EnvironmentDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(EnvironmentDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public double getTotalReward() {
        return totalReward;
    }

    public void setTotalReward(double totalReward) {
        this.totalReward = totalReward;
    }

    public double getAverageReward() {
        return averageReward;
    }

    public void setAverageReward(double averageReward) {
        this.averageReward = averageReward;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public long getFalsePositives() {
        return falsePositives;
    }

    public void setFalsePositives(long falsePositives) {
        this.falsePositives = falsePositives;
    }

    public long getFalseNegatives() {
        return falseNegatives;
    }

    public void setFalseNegatives(long falseNegatives) {
        this.falseNegatives = falseNegatives;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
