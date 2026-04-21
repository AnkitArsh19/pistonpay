package com.pistonpay.service;

import com.pistonpay.entity.Invoice;
import com.pistonpay.entity.Rental;
import com.pistonpay.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice getById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + id));
    }

    public Invoice getByRental(Rental rental) {
        return invoiceRepository.findByRental(rental)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found for rental: " + rental.getId()));
    }

    public List<Invoice> listAll() {
        return invoiceRepository.findAll();
    }

    public Invoice markAsPaid(Long id) {
        Invoice invoice = getById(id);
        invoice.setStatus("PAID");
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> listByUserId(Long userId) {
        return invoiceRepository.findByRental_Customer_UserId(userId);
    }
}
