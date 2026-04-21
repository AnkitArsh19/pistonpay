package com.pistonpay.service;

import com.pistonpay.dto.CreateCustomerRequest;
import com.pistonpay.entity.Customer;
import com.pistonpay.repository.CustomerRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void shouldCreateCustomer() {
        CreateCustomerRequest request = new CreateCustomerRequest(
            "Ankit Sharma",
            "ankit@example.com",
            "9876543210",
            "Address",
            "DL-12345",
            1L
        );

        Customer saved = new Customer();
        saved.setId(1L);
        saved.setName(request.name());
        saved.setEmail(request.email());
        saved.setPhone(request.phone());

        when(customerRepository.save(any(Customer.class))).thenReturn(saved);

        Customer result = customerService.create(request);

        Assertions.assertEquals(1L, result.getId());
        Assertions.assertEquals("Ankit Sharma", result.getName());
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void shouldUpdateCustomer() {
        CreateCustomerRequest request = new CreateCustomerRequest(
            "Updated Name",
            "updated@example.com",
            "9000000000",
            "New Address",
            "DL-99999",
            2L
        );

        Customer existing = new Customer();
        existing.setId(2L);
        existing.setName("Old Name");
        existing.setEmail("old@example.com");
        existing.setPhone("9999999999");

        when(customerRepository.findById(2L)).thenReturn(Optional.of(existing));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Customer updated = customerService.update(2L, request);

        Assertions.assertEquals("Updated Name", updated.getName());
        Assertions.assertEquals("updated@example.com", updated.getEmail());
        Assertions.assertEquals("9000000000", updated.getPhone());
    }
}
