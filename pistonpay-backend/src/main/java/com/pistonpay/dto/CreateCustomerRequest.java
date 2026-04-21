package com.pistonpay.dto;

public record CreateCustomerRequest(
    String name,
    String email,
    String phone,
    String address,
    String drivingLicense,
    Long userId
) {}
