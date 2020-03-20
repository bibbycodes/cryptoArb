CREATE TABLE coinbase_ticker (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL DEFAULT 'coinbase',
  timestamp BIGINT NOT NULL,
  product_id VARCHAR(10),
  price NUMERIC,
  open_24h NUMERIC,
  volume_24h NUMERIC,
  low_24h NUMERIC,
  high_24h NUMERIC,
  volume_30d NUMERIC,
  best_bid NUMERIC,
  best_ask NUMERIC,
  side VARCHAR(20),
  trade_id NUMERIC,
  last_size NUMERIC
);