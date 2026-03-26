package com.crednova.dsalending.document.controller;

import com.crednova.dsalending.document.dto.DocumentResponse;
import com.crednova.dsalending.document.dto.DocumentUploadRequest;
import com.crednova.dsalending.document.dto.DocumentVerificationRequest;
import com.crednova.dsalending.document.service.DocumentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/applications/{applicationId}/documents")
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentResponse upload(
        @PathVariable Long applicationId,
        @Valid @RequestBody DocumentUploadRequest request
    ) {
        return documentService.upload(applicationId, request);
    }

    @GetMapping("/applications/{applicationId}/documents")
    public List<DocumentResponse> list(@PathVariable Long applicationId) {
        return documentService.listByApplication(applicationId);
    }

    @PutMapping("/documents/{documentId}/verify")
    public DocumentResponse verify(
        @PathVariable Long documentId,
        @Valid @RequestBody DocumentVerificationRequest request
    ) {
        return documentService.verify(documentId, request);
    }
}
