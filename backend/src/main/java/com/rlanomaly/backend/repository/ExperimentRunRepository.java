package com.rlanomaly.backend.repository;

import com.rlanomaly.backend.entity.ExperimentRun;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperimentRunRepository extends JpaRepository<ExperimentRun, Long> {
}
