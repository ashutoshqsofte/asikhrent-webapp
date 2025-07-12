-- 1. Create tenants table
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  rent_amount NUMERIC
);

-- 2. Create users table for login
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- 3. Create rent_payments table (NEW)
CREATE TABLE rent_payments (
  id SERIAL PRIMARY KEY,                        -- Unique ID for each payment
  tenant_id INTEGER REFERENCES tenants(id),     -- Links to the tenant
  amount NUMERIC(10, 2) NOT NULL,               -- Rent amount paid
  date_paid DATE NOT NULL                       -- Date the payment was made
);