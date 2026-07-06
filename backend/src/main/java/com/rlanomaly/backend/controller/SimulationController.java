package com.rlanomaly.backend.controller;

import com.rlanomaly.backend.dto.ConfigRequest;
import com.rlanomaly.backend.dto.SimulationResponse;
import com.rlanomaly.backend.dto.TrainRequest;
import com.rlanomaly.backend.service.SimulationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {
    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @GetMapping("/status")
    public SimulationResponse status() {
        return simulationService.status();
    }

    @PostMapping("/step")
    public SimulationResponse step() {
        return simulationService.step();
    }

    @PostMapping("/train")
    public SimulationResponse train(@Valid @RequestBody TrainRequest request) {
        return simulationService.train(request);
    }

    @PostMapping("/reset")
    public SimulationResponse reset() {
        return simulationService.reset();
    }

    @PutMapping("/config")
    public SimulationResponse updateConfig(@Valid @RequestBody ConfigRequest request) {
        return simulationService.updateConfig(request);
    }
}
