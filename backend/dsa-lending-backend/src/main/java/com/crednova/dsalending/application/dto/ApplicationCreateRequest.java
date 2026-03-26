package com.crednova.dsalending.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ApplicationCreateRequest {
    @NotNull
    private Long leadId;
    @NotNull @DecimalMin("1")
    private BigDecimal requestedAmount;
    @NotNull @DecimalMin("1")
    private BigDecimal monthlyIncome;
    @NotNull @DecimalMin("0")
    private BigDecimal monthlyObligations;
    @NotNull @Min(300) @Max(900)
    private Integer cibilScore;
    private String panNumber;
    private String ckycNumber;

    public Long getLeadId() { return leadId; }
    public void setLeadId(Long leadId) { this.leadId = leadId; }
    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }
    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public BigDecimal getMonthlyObligations() { return monthlyObligations; }
    public void setMonthlyObligations(BigDecimal monthlyObligations) { this.monthlyObligations = monthlyObligations; }
    public Integer getCibilScore() { return cibilScore; }
    public void setCibilScore(Integer cibilScore) { this.cibilScore = cibilScore; }
    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
    public String getCkycNumber() { return ckycNumber; }
    public void setCkycNumber(String ckycNumber) { this.ckycNumber = ckycNumber; }
}
