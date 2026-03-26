package com.crednova.dsalending.commission.dto;

import com.crednova.dsalending.commission.entity.PayoutStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommissionRecordResponse {
    private Long id;
    private Long applicationId;
    private String applicationNo;
    private String customerName;
    private String dsaName;
    private String agentName;
    private BigDecimal disbursedAmount;
    private BigDecimal commissionPct;
    private BigDecimal commissionAmount;
    private BigDecimal gstRate;
    private BigDecimal gstAmount;
    private BigDecimal tdsRate;
    private BigDecimal tdsAmount;
    private BigDecimal netPayout;
    private PayoutStatus payoutStatus;
    private LocalDateTime payoutDate;
    private String payoutBatchId;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getApplicationNo() { return applicationNo; }
    public void setApplicationNo(String applicationNo) { this.applicationNo = applicationNo; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getDsaName() { return dsaName; }
    public void setDsaName(String dsaName) { this.dsaName = dsaName; }
    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }
    public BigDecimal getDisbursedAmount() { return disbursedAmount; }
    public void setDisbursedAmount(BigDecimal disbursedAmount) { this.disbursedAmount = disbursedAmount; }
    public BigDecimal getCommissionPct() { return commissionPct; }
    public void setCommissionPct(BigDecimal commissionPct) { this.commissionPct = commissionPct; }
    public BigDecimal getCommissionAmount() { return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount) { this.commissionAmount = commissionAmount; }
    public BigDecimal getGstRate() { return gstRate; }
    public void setGstRate(BigDecimal gstRate) { this.gstRate = gstRate; }
    public BigDecimal getGstAmount() { return gstAmount; }
    public void setGstAmount(BigDecimal gstAmount) { this.gstAmount = gstAmount; }
    public BigDecimal getTdsRate() { return tdsRate; }
    public void setTdsRate(BigDecimal tdsRate) { this.tdsRate = tdsRate; }
    public BigDecimal getTdsAmount() { return tdsAmount; }
    public void setTdsAmount(BigDecimal tdsAmount) { this.tdsAmount = tdsAmount; }
    public BigDecimal getNetPayout() { return netPayout; }
    public void setNetPayout(BigDecimal netPayout) { this.netPayout = netPayout; }
    public PayoutStatus getPayoutStatus() { return payoutStatus; }
    public void setPayoutStatus(PayoutStatus payoutStatus) { this.payoutStatus = payoutStatus; }
    public LocalDateTime getPayoutDate() { return payoutDate; }
    public void setPayoutDate(LocalDateTime payoutDate) { this.payoutDate = payoutDate; }
    public String getPayoutBatchId() { return payoutBatchId; }
    public void setPayoutBatchId(String payoutBatchId) { this.payoutBatchId = payoutBatchId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
