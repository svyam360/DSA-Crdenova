package com.crednova.dsalending.commission.repository;

import com.crednova.dsalending.application.entity.LoanApplication;
import com.crednova.dsalending.commission.entity.CommissionRecord;
import com.crednova.dsalending.commission.entity.PayoutStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommissionRecordRepository extends JpaRepository<CommissionRecord, Long> {
    Optional<CommissionRecord> findByApplication(LoanApplication application);
    List<CommissionRecord> findByPayoutStatus(PayoutStatus payoutStatus);
}
