package com.crednova.dsalending.document.service.impl;

import com.crednova.dsalending.application.entity.ApplicationStatus;
import com.crednova.dsalending.application.entity.LoanApplication;
import com.crednova.dsalending.application.repository.LoanApplicationRepository;
import com.crednova.dsalending.common.exception.BusinessException;
import com.crednova.dsalending.common.exception.ResourceNotFoundException;
import com.crednova.dsalending.document.dto.DocumentResponse;
import com.crednova.dsalending.document.dto.DocumentUploadRequest;
import com.crednova.dsalending.document.dto.DocumentVerificationRequest;
import com.crednova.dsalending.document.entity.ApplicationDocument;
import com.crednova.dsalending.document.entity.DocumentType;
import com.crednova.dsalending.document.entity.DocumentVerificationStatus;
import com.crednova.dsalending.document.repository.ApplicationDocumentRepository;
import com.crednova.dsalending.document.service.DocumentService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private static final Set<DocumentType> MANDATORY_DOCS = Set.of(
        DocumentType.PAN,
        DocumentType.AADHAAR,
        DocumentType.BANK_STATEMENT
    );

    private final ApplicationDocumentRepository documentRepository;
    private final LoanApplicationRepository applicationRepository;

    public DocumentServiceImpl(ApplicationDocumentRepository documentRepository,
                               LoanApplicationRepository applicationRepository) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public DocumentResponse upload(Long applicationId, DocumentUploadRequest request) {
        LoanApplication app = findApplication(applicationId);
        if (request.getDocType() == DocumentType.AADHAAR && !Boolean.TRUE.equals(request.getAadhaarMasked())) {
            throw new BusinessException("Aadhaar must be masked before upload");
        }

        ApplicationDocument doc = new ApplicationDocument();
        doc.setApplication(app);
        doc.setDocType(request.getDocType());
        doc.setFileName(request.getFileName());
        doc.setFileUrl(request.getFileUrl());
        doc.setIsAadhaarMasked(request.getAadhaarMasked());
        doc.setVerificationStatus(DocumentVerificationStatus.PENDING);

        ApplicationDocument saved = documentRepository.save(doc);
        app.setStatus(ApplicationStatus.DOCS_PENDING);
        applicationRepository.save(app);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> listByApplication(Long applicationId) {
        findApplication(applicationId);
        return documentRepository.findByApplicationId(applicationId).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public DocumentResponse verify(Long documentId, DocumentVerificationRequest request) {
        ApplicationDocument doc = documentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + documentId));

        doc.setVerificationStatus(request.getStatus());
        doc.setRemarks(request.getRemarks());
        if (request.getStatus() == DocumentVerificationStatus.VERIFIED) {
            doc.setVerifiedAt(LocalDateTime.now());
        }
        ApplicationDocument saved = documentRepository.save(doc);
        refreshApplicationStatus(saved.getApplication().getId());
        return toResponse(saved);
    }

    private void refreshApplicationStatus(Long applicationId) {
        LoanApplication app = findApplication(applicationId);
        List<ApplicationDocument> docs = documentRepository.findByApplicationId(applicationId);

        boolean hasMandatory = MANDATORY_DOCS.stream()
            .allMatch(docType -> docs.stream().anyMatch(d -> d.getDocType() == docType));

        boolean allMandatoryVerified = MANDATORY_DOCS.stream().allMatch(docType -> docs.stream()
            .anyMatch(d -> d.getDocType() == docType && d.getVerificationStatus() == DocumentVerificationStatus.VERIFIED));

        if (hasMandatory && allMandatoryVerified) {
            app.setStatus(ApplicationStatus.DOCS_VERIFIED);
        } else {
            app.setStatus(ApplicationStatus.DOCS_PENDING);
        }
        applicationRepository.save(app);
    }

    private LoanApplication findApplication(Long applicationId) {
        return applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + applicationId));
    }

    private DocumentResponse toResponse(ApplicationDocument doc) {
        DocumentResponse response = new DocumentResponse();
        response.setId(doc.getId());
        response.setApplicationId(doc.getApplication().getId());
        response.setDocType(doc.getDocType());
        response.setFileName(doc.getFileName());
        response.setFileUrl(doc.getFileUrl());
        response.setAadhaarMasked(doc.getIsAadhaarMasked());
        response.setVerificationStatus(doc.getVerificationStatus());
        response.setRemarks(doc.getRemarks());
        response.setUploadedAt(doc.getUploadedAt());
        response.setVerifiedAt(doc.getVerifiedAt());
        return response;
    }
}
