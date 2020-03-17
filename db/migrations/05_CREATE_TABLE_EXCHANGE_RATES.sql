CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10),
  rate NUMERIC(10,4),
)