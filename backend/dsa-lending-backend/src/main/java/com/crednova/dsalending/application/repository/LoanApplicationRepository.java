package com.crednova.dsalending.application.repository;

import com.crednova.dsalending.application.entity.LoanApplication;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    Optional<LoanApplication> findTopByOrderByIdDesc();
}
