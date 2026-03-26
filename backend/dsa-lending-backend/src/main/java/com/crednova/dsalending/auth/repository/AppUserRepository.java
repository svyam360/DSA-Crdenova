package com.crednova.dsalending.auth.repository;

import com.crednova.dsalending.auth.entity.AppUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCaseAndRoleAndActiveTrue(String email, String role);
    Optional<AppUser> findByEmailIgnoreCaseAndActiveTrue(String email);
}
