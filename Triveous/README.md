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
  ```
  
Absolutely! Below is the README file format you can use to paste into GitHub:

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
  }```
  
### Response:
- **Status:** `201 Created`
- **Body:** `Newly created user object`
### Login User
- **Endpoint: `POST /login`
- **Description: Log in an existing user.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }```

### Response:
- **Status:** 200 OK
- **Body:** JWT token
### Categories
- **Get Category List
- **Endpoint:** GET /categories
- **Description:** Retrieve a list of categories.
### Response:
- **Status:** 200 OK
- **Body:** Array of category objects
- **Products
### Get Product List by Category
- **Endpoint:** GET /categories/{categoryId}/products
- **Description:** Retrieve a list of products for a given category.
### Response:
- **Status:** 200 OK
- **Body:** Array of product objects
### Cart Management
- **Add Product to Cart
- **Endpoint:** POST /cart/add
- **Description:** Add a product to the user's cart.
- **Request Body:**
 ```json
  {
    "userId": "user_id",
    "productId": "product_id",
    "quantity": 1
  }
```

### Response:
- **Status:** 200 OK
- **Body:** Updated cart object
### View Cart
- **Endpoint:** GET /cart
- **Description:** View the user's cart.
### Response:
- **Status:** 200 OK
- **Body:** Cart object
### Orders
### Place Order
- **Endpoint:** POST /orders/place
- **Description:** Place an order with products from the user's cart.
- **Request Body:**
  ```json
  {
  "userId": "user_id",
  "products": [
    {
      "productId": "product_id",
      "quantity": 1
    },
    {
      "productId": "another_product_id",
      "quantity": 2
    }
  ]
}```

### Response:
- **Status:** 200 OK
- **Body:** Newly created order object
### Get Order History
- **Endpoint:** GET /orders/history
- **Description:** Retrieve the order history for authenticated users.
### Response:
- **Status:** 200 OK
- **Body:** Array of order objects
### Get Order Details
- **Endpoint:** GET /orders/{orderId}
- **Description:** Retrieve detailed information about a specific order.
### Response:
- **Status:** 200 OK
- **Body:** Order object

