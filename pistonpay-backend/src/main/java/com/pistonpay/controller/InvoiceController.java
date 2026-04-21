package com.pistonpay.controller;

import com.pistonpay.dto.InvoiceResponse;
import com.pistonpay.entity.Invoice;
import com.pistonpay.entity.Rental;
import com.pistonpay.service.InvoiceService;
import com.pistonpay.service.RentalService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final RentalService rentalService;

    public InvoiceController(InvoiceService invoiceService, RentalService rentalService) {
        this.invoiceService = invoiceService;
        this.rentalService = rentalService;
    }

    @GetMapping("/{id}")
    public InvoiceResponse getById(@PathVariable Long id) {
        return toResponse(invoiceService.getById(id));
    }

    @GetMapping
    public List<InvoiceResponse> list() {
        return invoiceService.listAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/user/{userId}")
    public List<InvoiceResponse> listByUserId(@PathVariable Long userId) {
        return invoiceService.listByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/rental/{rentalId}")
    public InvoiceResponse getByRental(@PathVariable Long rentalId) {
        Rental rental = rentalService.getById(rentalId);
        return toResponse(invoiceService.getByRental(rental));
    }

    @PutMapping("/{id}/pay")
    public InvoiceResponse markAsPaid(@PathVariable Long id) {
        return toResponse(invoiceService.markAsPaid(id));
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getRental().getId(),
                invoice.getTotalAmount(),
                invoice.getTax(),
                invoice.getGrandTotal(),
                invoice.getInvoiceDate(),
                invoice.getStatus()
        );
    }
}
