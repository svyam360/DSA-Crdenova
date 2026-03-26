package com.crednova.dsalending.document.repository;

import com.crednova.dsalending.document.entity.ApplicationDocument;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, Long> {
    List<ApplicationDocument> findByApplicationId(Long applicationId);
}
