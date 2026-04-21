package com.pistonpay.dto;

public record CustomerResponse(
    Long id,
    String name,
    String email,
    String phone,
    String address,
    String drivingLicense
) {}
