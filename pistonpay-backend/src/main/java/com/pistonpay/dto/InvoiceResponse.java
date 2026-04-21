package com.pistonpay.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InvoiceResponse(
    Long id,
    Long rentalId,
    BigDecimal totalAmount,
    BigDecimal tax,
    BigDecimal grandTotal,
    LocalDate invoiceDate,
    String status
) {}
