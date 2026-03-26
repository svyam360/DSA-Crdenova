package com.crednova.dsalending.lead.dto;

import com.crednova.dsalending.lead.entity.LeadStatus;
import jakarta.validation.constraints.NotNull;

public class LeadStatusUpdateRequest {
    @NotNull
    private LeadStatus status;

    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }
}
