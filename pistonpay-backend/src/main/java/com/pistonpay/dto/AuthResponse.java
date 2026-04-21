package com.pistonpay.dto;

public record AuthResponse(
    String token,
    String username,
    String role,
    Long userId
) {}
