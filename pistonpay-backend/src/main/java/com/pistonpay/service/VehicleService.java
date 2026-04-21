package com.pistonpay.service;

import com.pistonpay.dto.CreateVehicleRequest;
import com.pistonpay.entity.Vehicle;
import com.pistonpay.enums.VehicleStatus;
import com.pistonpay.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle create(CreateVehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationNumber(request.registrationNumber());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setDailyRate(request.dailyRate());
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with id: " + id));
    }

    public List<Vehicle> listAll() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> listByStatus(VehicleStatus status) {
        if (status == null) {
            return vehicleRepository.findAll();
        }
        return vehicleRepository.findByStatus(status);
    }

    public Vehicle update(Long id, CreateVehicleRequest request) {
        Vehicle vehicle = getById(id);
        vehicle.setRegistrationNumber(request.registrationNumber());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setDailyRate(request.dailyRate());
        return vehicleRepository.save(vehicle);
    }

    public void delete(Long id) {
        Vehicle vehicle = getById(id);
        vehicleRepository.delete(vehicle);
    }
}
