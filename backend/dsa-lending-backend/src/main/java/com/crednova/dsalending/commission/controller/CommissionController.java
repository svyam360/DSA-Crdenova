package com.crednova.dsalending.commission.controller;

import com.crednova.dsalending.commission.dto.CommissionRecordResponse;
import com.crednova.dsalending.commission.dto.PayoutBatchResponse;
import com.crednova.dsalending.commission.service.CommissionService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/commissions")
public class CommissionController {

    private final CommissionService commissionService;

    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    @GetMapping
    public List<CommissionRecordResponse> list() {
        return commissionService.listRecords();
    }

    @PostMapping("/sync")
    public String sync() {
        commissionService.syncForVerifiedApplications();
        return "Commission records synchronized";
    }

    @PostMapping("/{id}/pay")
    public CommissionRecordResponse markPaid(@PathVariable Long id) {
        return commissionService.markPaid(id);
    }

    @PostMapping("/batch-payout")
    public PayoutBatchResponse generateBatch() {
        return commissionService.generateBatchPayout();
    }

    @GetMapping("/batches")
    public List<PayoutBatchResponse> batches() {
        return commissionService.listBatches();
    }
}
