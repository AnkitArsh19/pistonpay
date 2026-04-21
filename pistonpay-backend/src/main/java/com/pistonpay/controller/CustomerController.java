package com.pistonpay.controller;

import com.pistonpay.dto.CreateCustomerRequest;
import com.pistonpay.dto.CustomerResponse;
import com.pistonpay.entity.Customer;
import com.pistonpay.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse create(@RequestBody CreateCustomerRequest request) {
        return toResponse(customerService.create(request));
    }

    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable Long id) {
        return toResponse(customerService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public CustomerResponse getByUserId(@PathVariable Long userId) {
        Customer customer = customerService.getByUserId(userId);
        return customer != null ? toResponse(customer) : null;
    }

    @GetMapping
    public List<CustomerResponse> list() {
        return customerService.listAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable Long id, @RequestBody CreateCustomerRequest request) {
        return toResponse(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        customerService.delete(id);
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getDrivingLicense()
        );
    }
}
