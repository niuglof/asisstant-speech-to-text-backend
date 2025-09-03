
#!/bin/bash

# Replace with your actual JWT token after logging in
TOKEN="I26Ecawq0gwvo7bI0RQcRre7D3xLiDWy6smb25IcDAiYEFHYk1tSheUxQ71i385M"

# --- Authentication ---

# Login to get a token
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "your_password"
}'


# --- Users ---

# Create a new user
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{
  "email": "newuser@example.com",
  "msisdn": "+1234567890",
  "dni": "12345678A",
  "first_name": "New",
  "last_name": "User",
  "password_hash": "password123"
}'

# Get all users

curl -X GET http://localhost:3000/api/users -H "Authorization: Bearer I26Ecawq0gwvo7bI0RQcRre7D3xLiDWy6smb25IcDAiYEFHYk1tSheUxQ71i385M"

# Get a single user (replace :id with an actual user ID)
curl -X GET http://localhost:3000/api/users/a-uuid-goes-here -H "Authorization: Bearer $TOKEN"

# Update a user (replace :id with an actual user ID)
curl -X PUT http://localhost:3000/api/users/a-uuid-goes-here -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{
  "first_name": "Updated Name"
}'

# Delete a user (replace :id with an actual user ID)
curl -X DELETE http://localhost:3000/api/users/a-uuid-goes-here -H "Authorization: Bearer $TOKEN"


# --- Generic Subscription Routes ---
# The following are examples for the 'subscription_plans' model.
# You can replace 'subscription_plans' with any of the other model names:
# oauth_providers, user_oauth_accounts, user_sessions, login_attempts, 
# subscriptions, payment_methods, invoices, payments, coupons, 
# subscription_coupons, subscription_events

# Create a new subscription plan
curl -X POST http://localhost:3000/api/subscription_plans -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{
  "name": "Basic Plan",
  "price": 9.99,
  "billing_period": "monthly"
}'

# Get all subscription plans
curl -X GET http://localhost:3000/api/subscription_plans -H "Authorization: Bearer $TOKEN"

# Get a single subscription plan (replace :id with an actual plan ID)
curl -X GET http://localhost:3000/api/subscription_plans/a-uuid-goes-here -H "Authorization: Bearer $TOKEN"

# Update a subscription plan (replace :id with an actual plan ID)
curl -X PUT http://localhost:3000/api/subscription_plans/a-uuid-goes-here -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{
  "price": 12.99
}'

# Delete a subscription plan (replace :id with an actual plan ID)
curl -X DELETE http://localhost:3000/api/subscription_plans/a-uuid-goes-here -H "Authorization: Bearer $TOKEN"



     curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer I26Ecawq0gwvo7bI0RQcRre7D3xLiDWy6smb25IcDAiYEFHYk1tSheUxQ71i385M" \
     -d '{
       "email": "newuser_example@email.com",
       "msisdn": "+19876543210",
       "dni": "98765432Z",
       "first_name": "New",
       "last_name": "User",
      "password_hash": "securepassword123"
    }'


        curl -X POST http://localhost:3000/api/login \
        -H "Content-Type: application/json" \
        -d '{
          "email": "juan.perez@email.com",
          "password": "password123"
        }'