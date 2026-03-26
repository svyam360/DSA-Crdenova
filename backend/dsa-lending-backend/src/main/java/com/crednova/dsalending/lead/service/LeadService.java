package com.crednova.dsalending.lead.service;

import com.crednova.dsalending.lead.dto.LeadCreateRequest;
import com.crednova.dsalending.lead.dto.LeadResponse;
import com.crednova.dsalending.lead.dto.LeadUpdateRequest;
import com.crednova.dsalending.lead.entity.LeadStatus;
import java.util.List;

public interface LeadService {
    LeadResponse create(LeadCreateRequest request);
    List<LeadResponse> list();
    LeadResponse getById(Long id);
    LeadResponse update(Long id, LeadUpdateRequest request);
    LeadResponse updateStatus(Long id, LeadStatus newStatus);
    void delete(Long id);
}
