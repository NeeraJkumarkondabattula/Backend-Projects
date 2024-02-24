# E-commerce API Documentation

This document outlines the endpoints available in the E-commerce API.

## Base URL

The base URL for all endpoints is: `http://localhost:3000` (replace with actual base URL if deployed).

## Authentication

Before accessing protected endpoints, users must obtain a JWT token by registering and logging in.

### Register User

- **Endpoint:** `POST /register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }

