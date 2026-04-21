package com.pistonpay.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RentalResponse(
    Long id,
    Long customerId,
    String customerName,
    Long vehicleId,
    String vehicleModel,
    LocalDate startDate,
    LocalDate endDate,
    Integer totalDays,
    BigDecimal totalAmount,
    String status
) {}
