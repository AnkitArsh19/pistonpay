package com.pistonpay.dto;

import com.pistonpay.enums.Role;

public record RegisterRequest(
    String username,
    String password,
    Role role
) {}
