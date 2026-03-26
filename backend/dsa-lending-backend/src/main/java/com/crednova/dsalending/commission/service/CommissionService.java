package com.crednova.dsalending.commission.service;

import com.crednova.dsalending.commission.dto.CommissionRecordResponse;
import com.crednova.dsalending.commission.dto.PayoutBatchResponse;
import java.util.List;

public interface CommissionService {
    List<CommissionRecordResponse> listRecords();
    void syncForVerifiedApplications();
    CommissionRecordResponse markPaid(Long commissionId);
    PayoutBatchResponse generateBatchPayout();
    List<PayoutBatchResponse> listBatches();
}
