package com.pistonpay.service;

import com.pistonpay.dto.CreateVehicleRequest;
import com.pistonpay.entity.Vehicle;
import com.pistonpay.enums.VehicleStatus;
import com.pistonpay.repository.VehicleRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void shouldCreateVehicleWithAvailableStatus() {
        CreateVehicleRequest request = new CreateVehicleRequest(
            "OD-02-AB-1234",
            "Honda City",
            "Sedan",
            new BigDecimal("2500")
        );

        Vehicle saved = new Vehicle();
        saved.setId(1L);
        saved.setStatus(VehicleStatus.AVAILABLE);

        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(saved);

        Vehicle result = vehicleService.create(request);

        Assertions.assertEquals(1L, result.getId());
        Assertions.assertEquals(VehicleStatus.AVAILABLE, result.getStatus());
    }

    @Test
    void shouldListAvailableVehicles() {
        Vehicle v1 = new Vehicle();
        v1.setId(1L);
        v1.setStatus(VehicleStatus.AVAILABLE);

        when(vehicleRepository.findByStatus(VehicleStatus.AVAILABLE)).thenReturn(List.of(v1));

        List<Vehicle> result = vehicleService.listByStatus(VehicleStatus.AVAILABLE);

        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(VehicleStatus.AVAILABLE, result.getFirst().getStatus());
    }
}
