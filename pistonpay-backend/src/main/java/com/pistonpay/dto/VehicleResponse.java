package com.pistonpay.dto;

import java.math.BigDecimal;

public record VehicleResponse(
    Long id,
    String registrationNumber,
    String model,
    String category,
    BigDecimal dailyRate,
    String status
) {}
