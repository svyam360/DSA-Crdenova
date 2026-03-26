package com.crednova.dsalending.document.service;

import com.crednova.dsalending.document.dto.DocumentResponse;
import com.crednova.dsalending.document.dto.DocumentUploadRequest;
import com.crednova.dsalending.document.dto.DocumentVerificationRequest;
import java.util.List;

public interface DocumentService {
    DocumentResponse upload(Long applicationId, DocumentUploadRequest request);
    List<DocumentResponse> listByApplication(Long applicationId);
    DocumentResponse verify(Long documentId, DocumentVerificationRequest request);
}
