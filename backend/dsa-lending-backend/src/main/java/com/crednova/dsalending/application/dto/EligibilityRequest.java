package com.crednova.dsalending.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class EligibilityRequest {
    @NotNull @DecimalMin("1")
    private BigDecimal monthlyIncome;
    @NotNull @DecimalMin("0")
    private BigDecimal monthlyObligations;
    @NotNull @Min(300) @Max(900)
    private Integer cibilScore;

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public BigDecimal getMonthlyObligations() { return monthlyObligations; }
    public void setMonthlyObligations(BigDecimal monthlyObligations) { this.monthlyObligations = monthlyObligations; }
    public Integer getCibilScore() { return cibilScore; }
    public void setCibilScore(Integer cibilScore) { this.cibilScore = cibilScore; }
}
