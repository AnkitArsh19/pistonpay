# PistonPay

PistonPay is a robust car rental billing system developed as a project for the Industrial Development Course provided by ExcelR. This platform provides role-based access for both Administrators and Standard Users to manage vehicle rentals and processing invoices.

## Technologies Used

* **Backend**: Java 25, Spring Boot, Spring Security (JWT), Spring Data JPA
* **Database**: PostgreSQL
* **Frontend**: React, Vite, Axios
* **Architecture**: RESTful APIs utilizing Java Records for Data Transfer Objects (DTOs)

## Features

* **Role-Based Access Control**: Separate workflows for `ADMIN` and `USER` roles.
* **Vehicle Management**: Admins can add, update, and remove vehicles.
* **Customer Profiles**: Users can register and maintain their personal customer details.
* **Rental System**: Admins can assign available vehicles to users and track active rentals.
* **Invoicing**: Automatic generation of invoices upon rental completion, which users can then view and pay.

## Getting Started

### Prerequisites
* Java 25+
* Node.js 18+
* PostgreSQL Database

### Running the Backend
1. Navigate to the `pistonpay-backend` directory.
2. Ensure your PostgreSQL instance is running and matches the credentials in `application.properties`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Running the Frontend
1. Navigate to the `pistonpay-frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development Context

This application was developed to demonstrate enterprise application architecture, secure authentication patterns, and modern frontend integration as part of an industrial training curriculum.
