package com.crednova.dsalending.commission.repository;

import com.crednova.dsalending.commission.entity.PayoutBatch;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayoutBatchRepository extends JpaRepository<PayoutBatch, Long> {
    Optional<PayoutBatch> findTopByOrderByIdDesc();
}
