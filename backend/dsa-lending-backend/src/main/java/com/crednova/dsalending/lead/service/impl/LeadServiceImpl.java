package com.crednova.dsalending.lead.service.impl;

import com.crednova.dsalending.common.exception.BusinessException;
import com.crednova.dsalending.common.exception.ResourceNotFoundException;
import com.crednova.dsalending.lead.dto.LeadCreateRequest;
import com.crednova.dsalending.lead.dto.LeadResponse;
import com.crednova.dsalending.lead.dto.LeadUpdateRequest;
import com.crednova.dsalending.lead.entity.Lead;
import com.crednova.dsalending.lead.entity.LeadStatus;
import com.crednova.dsalending.lead.repository.LeadRepository;
import com.crednova.dsalending.lead.service.LeadService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LeadServiceImpl implements LeadService {

    private static final Map<LeadStatus, Set<LeadStatus>> ALLOWED_TRANSITIONS = Map.of(
        LeadStatus.NEW, Set.of(LeadStatus.CONTACTED, LeadStatus.REJECTED),
        LeadStatus.CONTACTED, Set.of(LeadStatus.QUALIFIED, LeadStatus.REJECTED),
        LeadStatus.QUALIFIED, Set.of(LeadStatus.LOGGED_IN, LeadStatus.REJECTED),
        LeadStatus.LOGGED_IN, Set.of(LeadStatus.CONVERTED, LeadStatus.REJECTED),
        LeadStatus.CONVERTED, Set.of(),
        LeadStatus.REJECTED, Set.of()
    );

    private final LeadRepository leadRepository;

    public LeadServiceImpl(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @Override
    public LeadResponse create(LeadCreateRequest request) {
        if (leadRepository.existsByMobileAndLoanType(request.getMobile(), request.getLoanType())) {
            throw new BusinessException("Duplicate lead found for same mobile + loan type");
        }

        Lead lead = new Lead();
        lead.setLeadCode(nextLeadCode());
        lead.setCustomerName(request.getCustomerName());
        lead.setMobile(request.getMobile());
        lead.setEmail(request.getEmail());
        lead.setLoanType(request.getLoanType());
        lead.setLoanAmount(request.getLoanAmount());
        lead.setSource(request.getSource());
        lead.setCity(request.getCity());
        lead.setState(request.getState());
        lead.setDsaName(request.getDsaName());
        lead.setAgentName(request.getAgentName());
        lead.setStatus(LeadStatus.NEW);

        return toResponse(leadRepository.save(lead));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadResponse> list() {
        return leadRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    @Override
    public LeadResponse update(Long id, LeadUpdateRequest request) {
        Lead lead = findEntity(id);
        if (request.getCustomerName() != null && !request.getCustomerName().isBlank()) {
            lead.setCustomerName(request.getCustomerName());
        }
        if (request.getMobile() != null && !request.getMobile().isBlank()) {
            lead.setMobile(request.getMobile());
        }
        if (request.getEmail() != null) {
            lead.setEmail(request.getEmail());
        }
        if (request.getSource() != null) {
            lead.setSource(request.getSource());
        }
        if (request.getCity() != null) {
            lead.setCity(request.getCity());
        }
        if (request.getState() != null) {
            lead.setState(request.getState());
        }
        return toResponse(leadRepository.save(lead));
    }

    @Override
    public LeadResponse updateStatus(Long id, LeadStatus newStatus) {
        Lead lead = findEntity(id);
        LeadStatus current = lead.getStatus();
        if (current == newStatus) {
            return toResponse(lead);
        }
        Set<LeadStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(newStatus)) {
            throw new BusinessException("Invalid status transition: " + current + " -> " + newStatus);
        }
        lead.setStatus(newStatus);
        return toResponse(leadRepository.save(lead));
    }

    @Override
    public void delete(Long id) {
        Lead lead = findEntity(id);
        leadRepository.delete(lead);
    }

    private Lead findEntity(Long id) {
        return leadRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id " + id));
    }

    private String nextLeadCode() {
        long nextId = leadRepository.findTopByOrderByIdDesc().map(existing -> existing.getId() + 1).orElse(1L);
        return "LD" + String.format("%05d", nextId);
    }

    private LeadResponse toResponse(Lead lead) {
        LeadResponse response = new LeadResponse();
        response.setId(lead.getId());
        response.setLeadCode(lead.getLeadCode());
        response.setCustomerName(lead.getCustomerName());
        response.setMobile(lead.getMobile());
        response.setEmail(lead.getEmail());
        response.setLoanType(lead.getLoanType());
        response.setLoanAmount(lead.getLoanAmount());
        response.setStatus(lead.getStatus());
        response.setSource(lead.getSource());
        response.setCity(lead.getCity());
        response.setState(lead.getState());
        response.setDsaName(lead.getDsaName());
        response.setAgentName(lead.getAgentName());
        response.setCreatedAt(lead.getCreatedAt());
        response.setUpdatedAt(lead.getUpdatedAt());
        return response;
    }
}
