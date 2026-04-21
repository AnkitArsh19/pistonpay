import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Customers
export const getCustomers = () => API.get('/customers');
export const getCustomer = (id) => API.get(`/customers/${id}`);
export const getCustomerByUser = (userId) => API.get(`/customers/user/${userId}`);
export const createCustomer = (data) => API.post('/customers', data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);

// Vehicles
export const getVehicles = (status) => API.get('/vehicles', { params: status ? { status } : {} });
export const getVehicle = (id) => API.get(`/vehicles/${id}`);
export const createVehicle = (data) => API.post('/vehicles', data);
export const updateVehicle = (id, data) => API.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);

// Rentals
export const getRentals = (status) => API.get('/rentals', { params: status ? { status } : {} });
export const getRental = (id) => API.get(`/rentals/${id}`);
export const getRentalsByUser = (userId) => API.get(`/rentals/user/${userId}`);
export const createRental = (data) => API.post('/rentals', data);
export const returnRental = (id, endDate) => API.put(`/rentals/${id}/return`, { endDate });
export const cancelRental = (id) => API.put(`/rentals/${id}/cancel`);

// Invoices
export const getInvoices = () => API.get('/invoices');
export const getInvoice = (id) => API.get(`/invoices/${id}`);
export const getInvoicesByUser = (userId) => API.get(`/invoices/user/${userId}`);
export const getInvoiceByRental = (rentalId) => API.get(`/invoices/rental/${rentalId}`);
export const payInvoice = (id) => API.put(`/invoices/${id}/pay`);

export default API;
