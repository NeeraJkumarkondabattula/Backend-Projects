# Backend Task: API Integration and Data Analysis

This project involves developing a backend API to fetch data from a third-party API, perform data analysis, and provide various endpoints to access the analyzed data.

## Technology Used
- Node.js (with Express.js framework)
- MySQL (Relational Database)

## Data Source
- **Third-Party API URL:** [https://s3.amazonaws.com/roxiler.com/product_transaction.json](https://s3.amazonaws.com/roxiler.com/product_transaction.json)
- **Request Method:** GET
- **Response Format:** JSON

## Initialization API

### Initialize Database with Seed Data
- **Endpoint:** `/initialize-database`
- **Method:** GET
- **Description:** Fetches JSON data from the third-party API and initializes the database with seed data.
- **Expected Output:** Success message upon successful initialization.

## Transaction Listing API

### List All Transactions
- **Endpoint:** `/transactions`
- **Method:** GET
- **Description:** Lists all transactions with support for search and pagination.
- **Query Parameters:**
  - `month` (optional): Month to filter transactions (January to December).
  - `search` (optional): Search text to match against product title/description/price.
  - `page` (optional, default: 1): Page number for pagination.
  - `perPage` (optional, default: 10): Number of transactions per page.
- **Expected Output:** JSON data containing matched product transactions based on search criteria and pagination.

## Statistics API

### Transaction Statistics for a Specific Month
- **Endpoint:** `/statistics/:month`
- **Method:** GET
- **Description:** Provides statistics for a specific month.
- **Parameters:**
  - `month`: Month to retrieve statistics (January to December).
- **Expected Output:**
  ```json
  {
    "totalSaleAmount": 5000.00,
    "totalSoldItems": 50,
    "totalNotSoldItems": 20
  }

## Bar Chart API
### Price Range Distribution for a Specific Month
- **Endpoint:** `/price-distribution/:month`
- **Method:** GET
- **Description:** Provides the number of items in different price ranges for a specific month.
- **Parameters:**
`month`: Month to analyze (January to December).
- **Expected Output:**
```json
{
  "0-100": 10,
  "101-200": 20,
  "201-300": 15,
}
```
## Pie Chart API
### Category Distribution for a Specific Month
- **Endpoint:** `/category-distribution/:month`
- **Method:** GET
- **Description:** Provides unique categories and the number of items in each category for a specific month.
- **Parameters:**
`month`: Month to analyze (January to December).
- **Expected Output:**
```json
{
  "Category1": 20,
  "Category2": 15,
  "Category3": 10,
}
```
