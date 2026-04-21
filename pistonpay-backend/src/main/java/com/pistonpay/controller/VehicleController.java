package com.pistonpay.controller;

import com.pistonpay.dto.CreateVehicleRequest;
import com.pistonpay.dto.VehicleResponse;
import com.pistonpay.entity.Vehicle;
import com.pistonpay.enums.VehicleStatus;
import com.pistonpay.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse create(@RequestBody CreateVehicleRequest request) {
        return toResponse(vehicleService.create(request));
    }

    @GetMapping("/{id}")
    public VehicleResponse getById(@PathVariable Long id) {
        return toResponse(vehicleService.getById(id));
    }

    @GetMapping
    public List<VehicleResponse> list(@RequestParam(required = false) VehicleStatus status) {
        return vehicleService.listByStatus(status).stream()
                .map(this::toResponse)
                .toList();
    }

    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Long id, @RequestBody CreateVehicleRequest request) {
        return toResponse(vehicleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vehicleService.delete(id);
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getRegistrationNumber(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getDailyRate(),
                vehicle.getStatus().name()
        );
    }
}
