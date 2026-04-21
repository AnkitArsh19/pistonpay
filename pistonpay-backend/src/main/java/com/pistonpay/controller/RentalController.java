package com.pistonpay.controller;

import com.pistonpay.dto.CreateRentalRequest;
import com.pistonpay.dto.RentalResponse;
import com.pistonpay.entity.Rental;
import com.pistonpay.enums.RentalStatus;
import com.pistonpay.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RentalResponse create(@RequestBody CreateRentalRequest request) {
        return toResponse(rentalService.createRental(request));
    }

    @GetMapping("/{id}")
    public RentalResponse getById(@PathVariable Long id) {
        return toResponse(rentalService.getById(id));
    }

    @GetMapping
    public List<RentalResponse> list(@RequestParam(required = false) RentalStatus status) {
        List<Rental> rentals = (status != null)
                ? rentalService.listByStatus(status)
                : rentalService.listAll();
        return rentals.stream().map(this::toResponse).toList();
    }

    @GetMapping("/user/{userId}")
    public List<RentalResponse> listByUserId(@PathVariable Long userId) {
        return rentalService.listByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @PutMapping("/{id}/return")
    public RentalResponse completeRental(@PathVariable Long id, @RequestBody Map<String, String> body) {
        LocalDate endDate = LocalDate.parse(body.get("endDate"));
        return toResponse(rentalService.completeRental(id, endDate));
    }

    @PutMapping("/{id}/cancel")
    public RentalResponse cancelRental(@PathVariable Long id) {
        return toResponse(rentalService.cancelRental(id));
    }

    private RentalResponse toResponse(Rental rental) {
        return new RentalResponse(
                rental.getId(),
                rental.getCustomer().getId(),
                rental.getCustomer().getName(),
                rental.getVehicle().getId(),
                rental.getVehicle().getModel(),
                rental.getStartDate(),
                rental.getEndDate(),
                rental.getTotalDays(),
                rental.getTotalAmount(),
                rental.getStatus().name()
        );
    }
}
