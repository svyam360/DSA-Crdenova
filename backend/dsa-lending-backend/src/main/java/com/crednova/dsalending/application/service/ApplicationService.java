package com.crednova.dsalending.application.service;

import com.crednova.dsalending.application.dto.ApplicationCreateRequest;
import com.crednova.dsalending.application.dto.ApplicationResponse;
import com.crednova.dsalending.application.dto.EligibilityRequest;
import com.crednova.dsalending.application.dto.EligibilityResponse;
import com.crednova.dsalending.application.dto.KycResponse;
import com.crednova.dsalending.application.dto.KycUpdateRequest;
import java.util.List;

public interface ApplicationService {
    EligibilityResponse evaluate(EligibilityRequest request);
    ApplicationResponse create(ApplicationCreateRequest request);
    List<ApplicationResponse> list();
    ApplicationResponse getById(Long id);
    KycResponse getKyc(Long applicationId);
    KycResponse updateKyc(Long applicationId, KycUpdateRequest request);
    KycResponse verifyPan(Long applicationId);
    KycResponse verifyCkyc(Long applicationId);
}
