package com.pistonpay.repository;

import com.pistonpay.entity.Rental;
import com.pistonpay.enums.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByStatus(RentalStatus status);
    List<Rental> findByCustomerId(Long customerId);
    List<Rental> findByCustomer_UserId(Long userId);
}
