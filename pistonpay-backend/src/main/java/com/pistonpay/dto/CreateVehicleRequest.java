package com.pistonpay.dto;

import java.math.BigDecimal;

public record CreateVehicleRequest(
    String registrationNumber,
    String model,
    String category,
    BigDecimal dailyRate
) {}
