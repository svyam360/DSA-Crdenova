package com.crednova.dsalending.auth.service;

import com.crednova.dsalending.auth.dto.AuthLoginRequest;
import com.crednova.dsalending.auth.dto.AuthLoginResponse;

public interface AuthService {
    AuthLoginResponse login(AuthLoginRequest request);
}
