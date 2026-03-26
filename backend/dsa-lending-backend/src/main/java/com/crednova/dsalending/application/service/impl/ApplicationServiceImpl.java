package com.crednova.dsalending.application.service.impl;

import com.crednova.dsalending.application.dto.ApplicationCreateRequest;
import com.crednova.dsalending.application.dto.ApplicationResponse;
import com.crednova.dsalending.application.dto.EligibilityRequest;
import com.crednova.dsalending.application.dto.EligibilityResponse;
import com.crednova.dsalending.application.dto.KycResponse;
import com.crednova.dsalending.application.dto.KycUpdateRequest;
import com.crednova.dsalending.application.entity.ApplicationStatus;
import com.crednova.dsalending.application.entity.LoanApplication;
import com.crednova.dsalending.application.repository.LoanApplicationRepository;
import com.crednova.dsalending.application.service.ApplicationService;
import com.crednova.dsalending.common.exception.BusinessException;
import com.crednova.dsalending.common.exception.ResourceNotFoundException;
import com.crednova.dsalending.lead.entity.Lead;
import com.crednova.dsalending.lead.entity.LeadStatus;
import com.crednova.dsalending.lead.repository.LeadRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {
    private static final Pattern PAN_PATTERN = Pattern.compile("^[A-Z]{5}[0-9]{4}[A-Z]$");
    private static final Pattern CKYC_PATTERN = Pattern.compile("^[0-9]{14}$");


    private final LoanApplicationRepository loanApplicationRepository;
    private final LeadRepository leadRepository;

    public ApplicationServiceImpl(LoanApplicationRepository loanApplicationRepository, LeadRepository leadRepository) {
        this.loanApplicationRepository = loanApplicationRepository;
        this.leadRepository = leadRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public EligibilityResponse evaluate(EligibilityRequest request) {
        BigDecimal foir = request.getMonthlyIncome().compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : request.getMonthlyObligations().multiply(BigDecimal.valueOf(100))
                .divide(request.getMonthlyIncome(), 2, RoundingMode.HALF_UP);

        boolean eligible = foir.compareTo(BigDecimal.valueOf(60)) <= 0 && request.getCibilScore() >= 700;
        BigDecimal surplus = request.getMonthlyIncome().subtract(request.getMonthlyObligations());
        if (surplus.compareTo(BigDecimal.ZERO) < 0) {
            surplus = BigDecimal.ZERO;
        }
        BigDecimal recommended = surplus.multiply(BigDecimal.valueOf(50000));

        EligibilityResponse response = new EligibilityResponse();
        response.setFoir(foir);
        response.setEligible(eligible);
        response.setRecommendedAmount(recommended);
        return response;
    }

    @Override
    public ApplicationResponse create(ApplicationCreateRequest request) {
        Lead lead = leadRepository.findById(request.getLeadId())
            .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id " + request.getLeadId()));

        if (lead.getStatus() == LeadStatus.REJECTED || lead.getStatus() == LeadStatus.CONVERTED) {
            throw new BusinessException("Cannot create application for lead in status " + lead.getStatus());
        }

        EligibilityRequest eligibilityRequest = new EligibilityRequest();
        eligibilityRequest.setMonthlyIncome(request.getMonthlyIncome());
        eligibilityRequest.setMonthlyObligations(request.getMonthlyObligations());
        eligibilityRequest.setCibilScore(request.getCibilScore());
        EligibilityResponse eligibility = evaluate(eligibilityRequest);
        if (!eligibility.isEligible()) {
            throw new BusinessException("Application cannot be created: eligibility criteria not met");
        }
        if (request.getRequestedAmount().compareTo(eligibility.getRecommendedAmount()) > 0) {
            throw new BusinessException("Application cannot be created: requested amount exceeds eligible amount");
        }

        LoanApplication app = new LoanApplication();
        app.setApplicationNo(nextApplicationNo());
        app.setLead(lead);
        app.setRequestedAmount(request.getRequestedAmount());
        app.setEligibleAmount(eligibility.getRecommendedAmount());
        app.setMonthlyIncome(request.getMonthlyIncome());
        app.setMonthlyObligations(request.getMonthlyObligations());
        app.setCibilScore(request.getCibilScore());
        app.setPanNumber(request.getPanNumber());
        app.setCkycNumber(request.getCkycNumber());
        app.setStatus(ApplicationStatus.LOGGED_IN);

        LoanApplication saved = loanApplicationRepository.save(app);

        if (lead.getStatus() != LeadStatus.LOGGED_IN) {
            lead.setStatus(LeadStatus.LOGGED_IN);
            leadRepository.save(lead);
        }

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> list() {
        return loanApplicationRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getById(Long id) {
        LoanApplication app = loanApplicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + id));
        return toResponse(app);
    }

    @Override
    @Transactional(readOnly = true)
    public KycResponse getKyc(Long applicationId) {
        return toKycResponse(findApplication(applicationId), LocalDateTime.now());
    }

    @Override
    public KycResponse updateKyc(Long applicationId, KycUpdateRequest request) {
        LoanApplication app = findApplication(applicationId);
        if (request.getPanNumber() != null) {
            app.setPanNumber(request.getPanNumber());
        }
        if (request.getCkycNumber() != null) {
            app.setCkycNumber(request.getCkycNumber());
        }
        LoanApplication saved = loanApplicationRepository.save(app);
        return toKycResponse(saved, LocalDateTime.now());
    }

    @Override
    @Transactional(readOnly = true)
    public KycResponse verifyPan(Long applicationId) {
        return toKycResponse(findApplication(applicationId), LocalDateTime.now());
    }

    @Override
    @Transactional(readOnly = true)
    public KycResponse verifyCkyc(Long applicationId) {
        return toKycResponse(findApplication(applicationId), LocalDateTime.now());
    }

    private String nextApplicationNo() {
        long nextId = loanApplicationRepository.findTopByOrderByIdDesc().map(a -> a.getId() + 1).orElse(1L);
        return "APP" + String.format("%05d", nextId);
    }

    private ApplicationResponse toResponse(LoanApplication app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setApplicationNo(app.getApplicationNo());
        response.setLeadId(app.getLead().getId());
        response.setCustomerName(app.getLead().getCustomerName());
        response.setLoanType(app.getLead().getLoanType().name());
        response.setRequestedAmount(app.getRequestedAmount());
        response.setEligibleAmount(app.getEligibleAmount());
        response.setMonthlyIncome(app.getMonthlyIncome());
        response.setMonthlyObligations(app.getMonthlyObligations());
        response.setCibilScore(app.getCibilScore());
        response.setPanNumber(app.getPanNumber());
        response.setCkycNumber(app.getCkycNumber());
        response.setStatus(app.getStatus());
        response.setCreatedAt(app.getCreatedAt());
        response.setUpdatedAt(app.getUpdatedAt());
        return response;
    }

    private LoanApplication findApplication(Long applicationId) {
        return loanApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + applicationId));
    }

    private KycResponse toKycResponse(LoanApplication app, LocalDateTime updatedAt) {
        KycResponse response = new KycResponse();
        response.setApplicationId(app.getId());
        response.setPanNumber(app.getPanNumber());
        response.setCkycNumber(app.getCkycNumber());
        response.setPanStatus(getPanStatus(app.getPanNumber()));
        response.setCkycStatus(getCkycStatus(app.getCkycNumber()));
        response.setUpdatedAt(updatedAt);
        return response;
    }

    private KycResponse.VerificationStatus getPanStatus(String panNumber) {
        if (panNumber == null || panNumber.isBlank()) {
            return KycResponse.VerificationStatus.PENDING;
        }
        return PAN_PATTERN.matcher(panNumber.toUpperCase()).matches()
            ? KycResponse.VerificationStatus.VERIFIED
            : KycResponse.VerificationStatus.FAILED;
    }

    private KycResponse.VerificationStatus getCkycStatus(String ckycNumber) {
        if (ckycNumber == null || ckycNumber.isBlank()) {
            return KycResponse.VerificationStatus.PENDING;
        }
        return CKYC_PATTERN.matcher(ckycNumber).matches()
            ? KycResponse.VerificationStatus.VERIFIED
            : KycResponse.VerificationStatus.FAILED;
    }
}
