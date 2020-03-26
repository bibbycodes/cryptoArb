CREATE TABLE tw_exchange_rates_history (
  id SERIAL PRIMARY KEY,
  source VARCHAR(10),
  target VARCHAR(10),
  rate NUMERIC,
  timestamp BIGINT NOT NULL
);