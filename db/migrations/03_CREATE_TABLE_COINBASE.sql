CREATE TABLE coinbase_ticker (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL DEFAULT 'coinbase',
  timestamp BIGINT NOT NULL,
  product_id VARCHAR(10),
  price NUMERIC(10,10),
  open_24h NUMERIC(10,10),
  volume_24h NUMERIC(10,10),
  low_24h NUMERIC(10,10),
  high_24h NUMERIC(10,10),
  volume_30d NUMERIC(10,10),
  best_bid NUMERIC(10,10),
  best_ask NUMERIC(10,10),
  side VARCHAR(20),
  trade_id NUMERIC(10,10),
  last_size NUMERIC(10,10)
);