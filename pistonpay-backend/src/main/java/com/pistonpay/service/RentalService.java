package com.pistonpay.service;

import com.pistonpay.dto.CreateRentalRequest;
import com.pistonpay.entity.Customer;
import com.pistonpay.entity.Invoice;
import com.pistonpay.entity.Rental;
import com.pistonpay.entity.Vehicle;
import com.pistonpay.enums.RentalStatus;
import com.pistonpay.enums.VehicleStatus;
import com.pistonpay.repository.InvoiceRepository;
import com.pistonpay.repository.RentalRepository;
import com.pistonpay.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RentalService {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");

    private final RentalRepository rentalRepository;
    private final CustomerService customerService;
    private final VehicleService vehicleService;
    private final VehicleRepository vehicleRepository;
    private final InvoiceRepository invoiceRepository;

    public RentalService(RentalRepository rentalRepository,
                         CustomerService customerService,
                         VehicleService vehicleService,
                         VehicleRepository vehicleRepository,
                         InvoiceRepository invoiceRepository) {
        this.rentalRepository = rentalRepository;
        this.customerService = customerService;
        this.vehicleService = vehicleService;
        this.vehicleRepository = vehicleRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Transactional
    public Rental createRental(CreateRentalRequest request) {
        Customer customer = customerService.getById(request.customerId());
        Vehicle vehicle = vehicleService.getById(request.vehicleId());

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new IllegalArgumentException("Vehicle is not available for rental");
        }

        Rental rental = new Rental();
        rental.setCustomer(customer);
        rental.setVehicle(vehicle);
        rental.setStartDate(request.startDate());
        rental.setStatus(RentalStatus.ACTIVE);

        vehicle.setStatus(VehicleStatus.RENTED);
        vehicleRepository.save(vehicle);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental completeRental(Long rentalId, LocalDate endDate) {
        Rental rental = getById(rentalId);
        if (rental.getStatus() != RentalStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active rentals can be completed");
        }

        rental.setEndDate(endDate);
        int totalDays = (int) Math.max(1, ChronoUnit.DAYS.between(rental.getStartDate(), endDate));
        rental.setTotalDays(totalDays);

        BigDecimal totalAmount = rental.getVehicle().getDailyRate()
                .multiply(BigDecimal.valueOf(totalDays))
                .setScale(2, RoundingMode.HALF_UP);
        rental.setTotalAmount(totalAmount);
        rental.setStatus(RentalStatus.COMPLETED);

        // Create invoice
        BigDecimal tax = totalAmount.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = totalAmount.add(tax).setScale(2, RoundingMode.HALF_UP);

        Invoice invoice = new Invoice();
        invoice.setRental(rental);
        invoice.setTotalAmount(totalAmount);
        invoice.setTax(tax);
        invoice.setGrandTotal(grandTotal);
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setStatus("PENDING");
        invoiceRepository.save(invoice);

        // Release vehicle
        Vehicle vehicle = rental.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental cancelRental(Long rentalId) {
        Rental rental = getById(rentalId);
        if (rental.getStatus() != RentalStatus.ACTIVE) {
            throw new IllegalArgumentException("Only active rentals can be cancelled");
        }

        rental.setStatus(RentalStatus.CANCELLED);

        Vehicle vehicle = rental.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        return rentalRepository.save(rental);
    }

    public Rental getById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found with id: " + id));
    }

    public List<Rental> listAll() {
        return rentalRepository.findAll();
    }

    public List<Rental> listByStatus(RentalStatus status) {
        return rentalRepository.findByStatus(status);
    }

    public List<Rental> listByCustomer(Long customerId) {
        return rentalRepository.findByCustomerId(customerId);
    }

    public List<Rental> listByUserId(Long userId) {
        return rentalRepository.findByCustomer_UserId(userId);
    }
}
