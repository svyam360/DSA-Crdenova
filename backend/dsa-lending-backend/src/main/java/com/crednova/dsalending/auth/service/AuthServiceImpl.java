package com.crednova.dsalending.auth.service;

import com.crednova.dsalending.auth.dto.AuthLoginRequest;
import com.crednova.dsalending.auth.dto.AuthLoginResponse;
import com.crednova.dsalending.auth.entity.AppUser;
import com.crednova.dsalending.auth.repository.AppUserRepository;
import com.crednova.dsalending.auth.security.JwtService;
import com.crednova.dsalending.common.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthLoginResponse login(AuthLoginRequest request) {
        AppUser user = appUserRepository
            .findByEmailIgnoreCaseAndRoleAndActiveTrue(request.getEmail(), request.getRole().name())
            .orElseThrow(() -> new BusinessException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Invalid credentials");
        }

        AuthLoginResponse response = new AuthLoginResponse();
        response.setSuccess(true);

        AuthLoginResponse.User responseUser = new AuthLoginResponse.User();
        responseUser.setId(user.getRole() + "_" + String.format("%03d", user.getId()));
        responseUser.setName(user.getFullName());
        responseUser.setEmail(user.getEmail());
        responseUser.setRole(user.getRole());

        response.setUser(responseUser);
        response.setToken(jwtService.generateToken(user.getId(), user.getEmail(), user.getRole()));
        return response;
    }
}
