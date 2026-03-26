package com.crednova.dsalending.application.dto;

import java.math.BigDecimal;

public class EligibilityResponse {
    private BigDecimal foir;
    private boolean eligible;
    private BigDecimal recommendedAmount;

    public BigDecimal getFoir() { return foir; }
    public void setFoir(BigDecimal foir) { this.foir = foir; }
    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }
    public BigDecimal getRecommendedAmount() { return recommendedAmount; }
    public void setRecommendedAmount(BigDecimal recommendedAmount) { this.recommendedAmount = recommendedAmount; }
}
