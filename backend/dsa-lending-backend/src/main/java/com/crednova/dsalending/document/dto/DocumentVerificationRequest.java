package com.crednova.dsalending.document.dto;

import com.crednova.dsalending.document.entity.DocumentVerificationStatus;
import jakarta.validation.constraints.NotNull;

public class DocumentVerificationRequest {
    @NotNull
    private DocumentVerificationStatus status;
    private String remarks;

    public DocumentVerificationStatus getStatus() { return status; }
    public void setStatus(DocumentVerificationStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
