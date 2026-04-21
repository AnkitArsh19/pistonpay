package com.pistonpay.repository;

import com.pistonpay.entity.Vehicle;
import com.pistonpay.enums.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(VehicleStatus status);
}
