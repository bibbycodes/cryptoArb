CREATE TABLE binance_ticker (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL DEFAULT 'binance',
  pair VARCHAR(10) NOT NULL,
  base VARCHAR(10) NOT NULL,
  quote VARCHAR(10) NOT NULL,
  timestamp BIGINT NOT NULL,
  last_price NUMERIC,
  open_price NUMERIC,
  high_price NUMERIC,
  low_price NUMERIC,
  volume NUMERIC,
  quote_volume NUMERIC,
  change NUMERIC,
  change_percent NUMERIC,
  bid_price NUMERIC,
  ask_price NUMERIC,
  ask_volume NUMERIC
);