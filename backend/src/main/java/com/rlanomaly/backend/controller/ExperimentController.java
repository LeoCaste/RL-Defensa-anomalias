package com.rlanomaly.backend.controller;

import com.rlanomaly.backend.dto.ExperimentRequest;
import com.rlanomaly.backend.dto.ExperimentResponse;
import com.rlanomaly.backend.service.ExperimentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/experiments")
public class ExperimentController {
    private final ExperimentService experimentService;

    public ExperimentController(ExperimentService experimentService) {
        this.experimentService = experimentService;
    }

    @GetMapping
    public List<ExperimentResponse> list() {
        return experimentService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExperimentResponse save(@Valid @RequestBody ExperimentRequest request) {
        return experimentService.saveCurrent(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        experimentService.delete(id);
    }
}
