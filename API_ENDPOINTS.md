# API Endpoints for Subscription Service Backend

This document lists the available API endpoints for the Subscription Service backend, detailing their HTTP methods, paths, descriptions, authentication requirements, and example request/response bodies. This is intended for frontend consumption.

**Base URL:** `http://localhost:3000/api`

---

## Authentication Endpoints (`/api`)

These endpoints handle user authentication and token generation.

### 1. User Login

*   **Method:** `POST`
*   **Path:** `/api/login`
*   **Description:** Authenticates a user and returns a JWT token for accessing protected routes.
*   **Authentication:** None
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Response Body (Success):**
    ```json
    {
      "token": "<JWT_TOKEN_STRING>"
    }
    ```
*   **Response Body (Error - Invalid Credentials/Missing Input):**
    ```
    Invalid Credentials
    ```
    or
    ```
    All input is required
    ```

---

## User Management Endpoints (`/api/users`)

These endpoints allow for CRUD operations on user resources. All require JWT authentication.

### Authentication Requirement: JWT

Include the JWT token in the `Authorization` header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

### 1. Create New User

*   **Method:** `POST`
*   **Path:** `/api/users`
*   **Description:** Creates a new user in the system.
*   **Authentication:** JWT
*   **Request Body:**
    ```json
    {
      "email": "string",
      "msisdn": "string",
      "dni": "string",
      "first_name": "string",
      "last_name": "string",
      "phone": "string (optional)",
      "avatar_url": "string (optional)",
      "password_hash": "string"
    }
    ```
*   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "email": "string",
      "msisdn": "string",
      "dni": "string",
      "first_name": "string",
      "last_name": "string",
      "phone": "string",
      "avatar_url": "string",
      "is_active": "boolean",
      "email_verified": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

### 2. Get All Users

*   **Method:** `GET`
*   **Path:** `/api/users`
*   **Description:** Retrieves a list of all users.
*   **Authentication:** JWT
*   **Response Body (Success):**
    ```json
    [
      { /* User Object 1 */ },
      { /* User Object 2 */ }
    ]
    ```

### 3. Get User by ID

*   **Method:** `GET`
*   **Path:** `/api/users/:id`
*   **Description:** Retrieves a single user by their ID.
*   **Authentication:** JWT
*   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "email": "string",
      "msisdn": "string",
      "dni": "string",
      "first_name": "string",
      "last_name": "string",
      "phone": "string",
      "avatar_url": "string",
      "is_active": "boolean",
      "email_verified": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```
*   **Response Body (Error - Not Found):**
    ```json
    {
      "error": "User not found"
    }
    ```

### 4. Update User

*   **Method:** `PUT`
*   **Path:** `/api/users/:id`
*   **Description:** Updates an existing user's information.
*   **Authentication:** JWT
*   **Request Body:** (Partial user object with fields to update)
    ```json
    {
      "first_name": "string (optional)",
      "phone": "string (optional)"
      // ... other updatable fields
    }
    ```
*   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "email": "string",
      "first_name": "string",
      // ... updated user object
    }
    ```

### 5. Delete User (Soft Delete)

*   **Method:** `DELETE`
*   **Path:** `/api/users/:id`
*   **Description:** Soft deletes a user by setting their `deleted_at` timestamp. The record remains in the database but is not returned by default queries.
*   **Authentication:** JWT
*   **Response Body (Success):** `204 No Content`

---

## Generic Subscription Endpoints (`/api/<model_name>`)

These endpoints provide generic CRUD operations for various subscription-related models. Replace `<model_name>` with the pluralized lowercase name of the model (e.g., `subscription_plans`, `subscriptions`, `payment_methods`, `invoices`, `payments`, `coupons`, `oauth_providers`, `user_oauth_accounts`, `user_sessions`, `login_attempts`, `subscription_events`).

### Authentication Requirement: JWT

Include the JWT token in the `Authorization` header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

### 1. Create New `<Model>`

*   **Method:** `POST`
*   **Path:** `/api/<model_name>`
*   **Description:** Creates a new record for the specified model.
*   **Authentication:** JWT
*   **Request Body:** (JSON object matching the model's fields)
    ```json
    {
      "field1": "value1",
      "field2": "value2"
      // ... model-specific fields
    }
    ```
*   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "field1": "value1",
      // ... created model object
    }
    ```

### 2. Get All `<Models>`

*   **Method:** `GET`
*   **Path:** `/api/<model_name>`
*   **Description:** Retrieves a list of all records for the specified model.
*   **Authentication:** JWT
*   **Response Body (Success):**
    ```json
    [
      { /* Model Object 1 */ },
      { /* Model Object 2 */ }
    ]
    ```

### 3. Get `<Model>` by ID

*   **Method:** `GET`
*   **Path:** `/api/<model_name>/:id`
*   **Description:** Retrieves a single record for the specified model by its ID.
*   **Authentication:** JWT
*   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "field1": "value1",
      // ... model object
    }
    ```
*   **Response Body (Error - Not Found):**
    ```json
    {
      "error": "<ModelName> not found"
    }
    ```

### 4. Update `<Model>`

*   **Method:** `PUT`
*   **Path:** `/api/<model_name>/:id`
*   **Description:** Updates an existing record for the specified model.
*   **Authentication:** JWT
*   **Request Body:** (Partial JSON object with fields to update)
    ```json
    {
      "field_to_update": "new_value"
      // ... other updatable fields
    }
    ```
*   **Response Body (Success):**
    ```json
    {
      "id": "uuid",
      "field_to_update": "new_value",
      // ... updated model object
    }
    ```

### 5. Delete `<Model>` (Soft Delete)

*   **Method:** `DELETE`
*   **Path:** `/api/<model_name>/:id`
*   **Description:** Soft deletes a record for the specified model by setting its `deleted_at` timestamp.
*   **Authentication:** JWT
*   **Response Body (Success):** `204 No Content`

---

## External API Key Endpoints (`/api/external`)

These endpoints are designed for external services and require API Key authentication.

### Authentication Requirement: API Key

Include the API Key in the `X-API-Key` header:
`X-API-Key: <YOUR_API_KEY>`

### 1. Get External Status

*   **Method:** `GET`
*   **Path:** `/api/external/status`
*   **Description:** Provides a status check for external services.
*   **Authentication:** API Key
*   **Response Body (Success):**
    ```json
    {
      "message": "External API is healthy",
      "authenticatedBy": "string (description of the API key)"
    }
    ```
*   **Response Body (Error - Missing/Invalid API Key):**
    ```
    API Key is required
    ```
    or
    ```
    Invalid or inactive API Key
    ```
