package com.pistonpay.service;

import com.pistonpay.dto.CreateCustomerRequest;
import com.pistonpay.entity.Customer;
import com.pistonpay.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer create(CreateCustomerRequest request) {
        Customer customer = new Customer();
        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        customer.setDrivingLicense(request.drivingLicense());
        customer.setUserId(request.userId());
        return customerRepository.save(customer);
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
    }

    public Customer getByUserId(Long userId) {
        return customerRepository.findByUserId(userId).orElse(null);
    }

    public List<Customer> listAll() {
        return customerRepository.findAll();
    }

    public Customer update(Long id, CreateCustomerRequest request) {
        Customer customer = getById(id);
        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        customer.setDrivingLicense(request.drivingLicense());
        return customerRepository.save(customer);
    }

    public void delete(Long id) {
        Customer customer = getById(id);
        customerRepository.delete(customer);
    }
}
