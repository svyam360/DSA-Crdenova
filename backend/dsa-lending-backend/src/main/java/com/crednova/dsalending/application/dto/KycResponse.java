package com.crednova.dsalending.application.dto;

import java.time.LocalDateTime;

public class KycResponse {

    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        FAILED
    }

    private Long applicationId;
    private String panNumber;
    private String ckycNumber;
    private VerificationStatus panStatus;
    private VerificationStatus ckycStatus;
    private LocalDateTime updatedAt;

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
    public String getCkycNumber() { return ckycNumber; }
    public void setCkycNumber(String ckycNumber) { this.ckycNumber = ckycNumber; }
    public VerificationStatus getPanStatus() { return panStatus; }
    public void setPanStatus(VerificationStatus panStatus) { this.panStatus = panStatus; }
    public VerificationStatus getCkycStatus() { return ckycStatus; }
    public void setCkycStatus(VerificationStatus ckycStatus) { this.ckycStatus = ckycStatus; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
