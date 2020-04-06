CREATE TABLE arb_rates (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL DEFAULT 'binance',
  timestamp BIGINT NOT NULL,
  fiat_a VARCHAR(10),
  fiat_b VARCHAR(10),
  crypto VARCHAR(10),
  converter VARCHAR(10),
  arb_rate NUMERIC,
  trade_1_ask NUMERIC,
  trade_1_bid NUMERIC,
  trade_2_ask NUMERIC,
  trade_2_bid NUMERIC,
  trade_3_ask NUMERIC,
  trade_3_bid NUMERIC,
  trade_4_ask NUMERIC,
  trade_4_bid NUMERIC,
  trade_1_pair VARCHAR(10),
  trade_2_pair VARCHAR(10),
  trade_3_pair VARCHAR(10),
  trade_4_pair VARCHAR(10)
);