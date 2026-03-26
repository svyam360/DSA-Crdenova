package com.crednova.dsalending.document.dto;

import com.crednova.dsalending.document.entity.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DocumentUploadRequest {
    @NotNull
    private DocumentType docType;
    @NotBlank
    private String fileName;
    @NotBlank
    private String fileUrl;
    private Boolean aadhaarMasked;

    public DocumentType getDocType() { return docType; }
    public void setDocType(DocumentType docType) { this.docType = docType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Boolean getAadhaarMasked() { return aadhaarMasked; }
    public void setAadhaarMasked(Boolean aadhaarMasked) { this.aadhaarMasked = aadhaarMasked; }
}
