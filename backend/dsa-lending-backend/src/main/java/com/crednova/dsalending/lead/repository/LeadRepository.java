package com.crednova.dsalending.lead.repository;

import com.crednova.dsalending.lead.entity.Lead;
import com.crednova.dsalending.lead.entity.LoanType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    boolean existsByMobileAndLoanType(String mobile, LoanType loanType);
    Optional<Lead> findTopByOrderByIdDesc();
}
