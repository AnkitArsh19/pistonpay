package com.pistonpay.dto;

import java.time.LocalDate;

public record CreateRentalRequest(
    Long customerId,
    Long vehicleId,
    LocalDate startDate
) {}
