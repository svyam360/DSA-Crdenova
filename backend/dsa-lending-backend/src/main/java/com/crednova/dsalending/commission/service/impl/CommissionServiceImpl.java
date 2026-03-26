package com.crednova.dsalending.commission.service.impl;

import com.crednova.dsalending.application.entity.ApplicationStatus;
import com.crednova.dsalending.application.entity.LoanApplication;
import com.crednova.dsalending.application.repository.LoanApplicationRepository;
import com.crednova.dsalending.commission.dto.CommissionRecordResponse;
import com.crednova.dsalending.commission.dto.PayoutBatchResponse;
import com.crednova.dsalending.commission.entity.CommissionRecord;
import com.crednova.dsalending.commission.entity.PayoutBatch;
import com.crednova.dsalending.commission.entity.PayoutStatus;
import com.crednova.dsalending.commission.repository.CommissionRecordRepository;
import com.crednova.dsalending.commission.repository.PayoutBatchRepository;
import com.crednova.dsalending.commission.service.CommissionService;
import com.crednova.dsalending.common.exception.BusinessException;
import com.crednova.dsalending.common.exception.ResourceNotFoundException;
import com.crednova.dsalending.lead.entity.LoanType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommissionServiceImpl implements CommissionService {

    private static final BigDecimal GST_RATE = BigDecimal.valueOf(18);
    private static final BigDecimal TDS_RATE = BigDecimal.valueOf(5);

    private final CommissionRecordRepository commissionRecordRepository;
    private final PayoutBatchRepository payoutBatchRepository;
    private final LoanApplicationRepository applicationRepository;

    public CommissionServiceImpl(CommissionRecordRepository commissionRecordRepository,
                                 PayoutBatchRepository payoutBatchRepository,
                                 LoanApplicationRepository applicationRepository) {
        this.commissionRecordRepository = commissionRecordRepository;
        this.payoutBatchRepository = payoutBatchRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommissionRecordResponse> listRecords() {
        return commissionRecordRepository.findAll().stream().map(this::toRecordResponse).toList();
    }

    @Override
    public void syncForVerifiedApplications() {
        List<LoanApplication> verifiedApps = applicationRepository.findAll().stream()
            .filter(app -> app.getStatus() == ApplicationStatus.DOCS_VERIFIED)
            .toList();

        for (LoanApplication app : verifiedApps) {
            if (commissionRecordRepository.findByApplication(app).isPresent()) {
                continue;
            }
            CommissionRecord record = buildRecord(app);
            commissionRecordRepository.save(record);
        }
    }

    @Override
    public CommissionRecordResponse markPaid(Long commissionId) {
        CommissionRecord record = commissionRecordRepository.findById(commissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Commission record not found with id " + commissionId));
        record.setPayoutStatus(PayoutStatus.PAID);
        record.setPayoutDate(LocalDateTime.now());
        return toRecordResponse(commissionRecordRepository.save(record));
    }

    @Override
    public PayoutBatchResponse generateBatchPayout() {
        List<CommissionRecord> pending = commissionRecordRepository.findByPayoutStatus(PayoutStatus.PENDING);
        if (pending.isEmpty()) {
            throw new BusinessException("No pending commission records available for payout batch");
        }

        String batchCode = nextBatchCode();
        BigDecimal totalAmount = pending.stream()
            .map(CommissionRecord::getNetPayout)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        PayoutBatch batch = new PayoutBatch();
        batch.setBatchCode(batchCode);
        batch.setRecordCount(pending.size());
        batch.setTotalAmount(totalAmount);
        PayoutBatch savedBatch = payoutBatchRepository.save(batch);

        for (CommissionRecord record : pending) {
            record.setPayoutStatus(PayoutStatus.PAID);
            record.setPayoutDate(LocalDateTime.now());
            record.setBatchCode(batchCode);
        }
        commissionRecordRepository.saveAll(pending);
        return toBatchResponse(savedBatch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayoutBatchResponse> listBatches() {
        return payoutBatchRepository.findAll().stream().map(this::toBatchResponse).toList();
    }

    private CommissionRecord buildRecord(LoanApplication app) {
        BigDecimal disbursedAmount = app.getEligibleAmount().max(app.getRequestedAmount());
        BigDecimal commissionPct = commissionPctForLoanType(app.getLead().getLoanType());
        BigDecimal commissionAmount = percentage(disbursedAmount, commissionPct);
        BigDecimal gstAmount = percentage(commissionAmount, GST_RATE);
        BigDecimal tdsAmount = percentage(commissionAmount, TDS_RATE);
        BigDecimal netPayout = commissionAmount.add(gstAmount).subtract(tdsAmount);

        CommissionRecord record = new CommissionRecord();
        record.setApplication(app);
        record.setDsaName(app.getLead().getDsaName());
        record.setAgentName(app.getLead().getAgentName());
        record.setDisbursedAmount(disbursedAmount);
        record.setCommissionPct(commissionPct);
        record.setCommissionAmount(commissionAmount);
        record.setGstRate(GST_RATE);
        record.setGstAmount(gstAmount);
        record.setTdsRate(TDS_RATE);
        record.setTdsAmount(tdsAmount);
        record.setNetPayout(netPayout);
        record.setPayoutStatus(PayoutStatus.PENDING);
        return record;
    }

    private BigDecimal commissionPctForLoanType(LoanType loanType) {
        switch (loanType) {
            case HOME:
                return BigDecimal.valueOf(0.80);
            case PERSONAL:
                return BigDecimal.valueOf(1.20);
            case BUSINESS:
                return BigDecimal.valueOf(1.00);
            case CAR:
                return BigDecimal.valueOf(0.90);
            case EDUCATION:
                return BigDecimal.valueOf(0.70);
            default:
                return BigDecimal.valueOf(1.00);
        }
    }

    private BigDecimal percentage(BigDecimal base, BigDecimal pct) {
        return base.multiply(pct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private String nextBatchCode() {
        long nextId = payoutBatchRepository.findTopByOrderByIdDesc().map(batch -> batch.getId() + 1).orElse(1L);
        return "BATCH" + String.format("%05d", nextId);
    }

    private CommissionRecordResponse toRecordResponse(CommissionRecord record) {
        CommissionRecordResponse response = new CommissionRecordResponse();
        response.setId(record.getId());
        response.setApplicationId(record.getApplication().getId());
        response.setApplicationNo(record.getApplication().getApplicationNo());
        response.setCustomerName(record.getApplication().getLead().getCustomerName());
        response.setDsaName(record.getDsaName());
        response.setAgentName(record.getAgentName());
        response.setDisbursedAmount(record.getDisbursedAmount());
        response.setCommissionPct(record.getCommissionPct());
        response.setCommissionAmount(record.getCommissionAmount());
        response.setGstRate(record.getGstRate());
        response.setGstAmount(record.getGstAmount());
        response.setTdsRate(record.getTdsRate());
        response.setTdsAmount(record.getTdsAmount());
        response.setNetPayout(record.getNetPayout());
        response.setPayoutStatus(record.getPayoutStatus());
        response.setPayoutDate(record.getPayoutDate());
        response.setPayoutBatchId(record.getBatchCode());
        response.setCreatedAt(record.getCreatedAt());
        return response;
    }

    private PayoutBatchResponse toBatchResponse(PayoutBatch batch) {
        PayoutBatchResponse response = new PayoutBatchResponse();
        response.setId(batch.getId());
        response.setBatchCode(batch.getBatchCode());
        response.setRecordCount(batch.getRecordCount());
        response.setTotalAmount(batch.getTotalAmount());
        response.setGeneratedAt(batch.getGeneratedAt());
        return response;
    }
}
