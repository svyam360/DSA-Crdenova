package com.crednova.dsalending.lead.controller;

import com.crednova.dsalending.lead.dto.LeadCreateRequest;
import com.crednova.dsalending.lead.dto.LeadResponse;
import com.crednova.dsalending.lead.dto.LeadStatusUpdateRequest;
import com.crednova.dsalending.lead.dto.LeadUpdateRequest;
import com.crednova.dsalending.lead.service.LeadService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeadResponse create(@Valid @RequestBody LeadCreateRequest request) {
        return leadService.create(request);
    }

    @GetMapping
    public List<LeadResponse> list() {
        return leadService.list();
    }

    @GetMapping("/{id}")
    public LeadResponse get(@PathVariable Long id) {
        return leadService.getById(id);
    }

    @PutMapping("/{id}")
    public LeadResponse update(@PathVariable Long id, @Valid @RequestBody LeadUpdateRequest request) {
        return leadService.update(id, request);
    }

    @PutMapping("/{id}/status")
    public LeadResponse updateStatus(@PathVariable Long id, @Valid @RequestBody LeadStatusUpdateRequest request) {
        return leadService.updateStatus(id, request.getStatus());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        leadService.delete(id);
    }
}
