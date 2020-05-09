CREATE TABLE arb_rates_2 (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL DEFAULT 'binance',
  timestamp BIGINT NOT NULL,
  coin_1 VARCHAR(10),
  coin_2 VARCHAR(10),
  coin_3 VARCHAR(10),
  coin_4 VARCHAR(10),
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
  trade_4_pair VARCHAR(10),
  outcome_1 NUMERIC,
  outcome_2 NUMERIC,
  outcome_3 NUMERIC,
  outcome_4 NUMERIC
);