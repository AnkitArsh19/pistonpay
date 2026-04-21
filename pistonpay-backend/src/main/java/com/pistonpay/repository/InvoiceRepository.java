package com.pistonpay.repository;

import com.pistonpay.entity.Invoice;
import com.pistonpay.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByRental(Rental rental);
    List<Invoice> findByRental_Customer_UserId(Long userId);
}
