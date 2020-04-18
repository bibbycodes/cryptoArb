CREATE TABLE viables_trades (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL DEFAULT 'binance',
  fiat_a VARCHAR(10),
  fiat_b VARCHAR(10),
  crypto VARCHAR(10),
  converter VARCHAR(10),
  trade_1_pair VARCHAR(10),
  trade_2_pair VARCHAR(10),
  trade_3_pair VARCHAR(10),
  trade_4_pair VARCHAR(10)
);