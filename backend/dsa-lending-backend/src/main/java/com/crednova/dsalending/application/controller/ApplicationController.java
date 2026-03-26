package com.crednova.dsalending.application.controller;

import com.crednova.dsalending.application.dto.ApplicationCreateRequest;
import com.crednova.dsalending.application.dto.ApplicationResponse;
import com.crednova.dsalending.application.dto.EligibilityRequest;
import com.crednova.dsalending.application.dto.EligibilityResponse;
import com.crednova.dsalending.application.dto.KycResponse;
import com.crednova.dsalending.application.dto.KycUpdateRequest;
import com.crednova.dsalending.application.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/eligibility")
    public EligibilityResponse evaluate(@Valid @RequestBody EligibilityRequest request) {
        return applicationService.evaluate(request);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse create(@Valid @RequestBody ApplicationCreateRequest request) {
        return applicationService.create(request);
    }

    @GetMapping
    public List<ApplicationResponse> list() {
        return applicationService.list();
    }

    @GetMapping("/{id}")
    public ApplicationResponse get(@PathVariable Long id) {
        return applicationService.getById(id);
    }

    @GetMapping("/{id}/kyc")
    public KycResponse getKyc(@PathVariable("id") Long id) {
        return applicationService.getKyc(id);
    }

    @PutMapping("/{id}/kyc")
    public KycResponse updateKyc(@PathVariable("id") Long id, @RequestBody KycUpdateRequest request) {
        return applicationService.updateKyc(id, request);
    }

    @PostMapping("/{id}/kyc/verify-pan")
    public KycResponse verifyPan(@PathVariable("id") Long id) {
        return applicationService.verifyPan(id);
    }

    @PostMapping("/{id}/kyc/verify-ckyc")
    public KycResponse verifyCkyc(@PathVariable("id") Long id) {
        return applicationService.verifyCkyc(id);
    }
}
