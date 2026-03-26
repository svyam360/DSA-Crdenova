package com.crednova.dsalending.document.dto;

import com.crednova.dsalending.document.entity.DocumentType;
import com.crednova.dsalending.document.entity.DocumentVerificationStatus;
import java.time.LocalDateTime;

public class DocumentResponse {
    private Long id;
    private Long applicationId;
    private DocumentType docType;
    private String fileName;
    private String fileUrl;
    private Boolean aadhaarMasked;
    private DocumentVerificationStatus verificationStatus;
    private String remarks;
    private LocalDateTime uploadedAt;
    private LocalDateTime verifiedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public DocumentType getDocType() { return docType; }
    public void setDocType(DocumentType docType) { this.docType = docType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Boolean getAadhaarMasked() { return aadhaarMasked; }
    public void setAadhaarMasked(Boolean aadhaarMasked) { this.aadhaarMasked = aadhaarMasked; }
    public DocumentVerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(DocumentVerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}
