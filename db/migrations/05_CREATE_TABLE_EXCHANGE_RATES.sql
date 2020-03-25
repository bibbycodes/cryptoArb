CREATE TABLE tw_exchange_rates (
  id SERIAL PRIMARY KEY,
  source VARCHAR(10),
  target VARCHAR(10),
  rate NUMERIC
);