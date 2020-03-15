CREATE TABLE kraken_ticker (
  id SERIAL PRIMARY KEY,
  exchange VARCHAR(120) NOT NULL,
  pair VARCHAR(10) NOT NULL,
  timestamp BIGINT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  open_price NUMERIC(10, 4),
  open_price_24h NUMERIC(10, 4),
  close_price NUMERIC(10,4),
  close_lot_volume NUMERIC(10,4),
  high_price NUMERIC(10,4),
  high_price_24h NUMERIC(10,4),
  low_price NUMERIC(10,4),
  low_price_24h NUMERIC(10,4),
  volume_today NUMERIC(10,4),
  volume_24h NUMERIC(10,4),
  quote_volume NUMERIC(10,4),
  change NUMERIC(10,4),
  change_percent NUMERIC(10,4),
  bid_price NUMERIC(10,4),
  bid_lot_volume NUMERIC(10,4),
  bid_whole_lot_volume NUMERIC(10,4),
  ask_price NUMERIC(10,4),
  ask_lot_volume NUMERIC(10,4),
  ask_whole_lot_volume NUMERIC(10,4),
  weighted_averge_price NUMERIC(10,4),
  weighted_average_price_24h NUMERIC(10,4),
  number_of_trades INTEGER NOT NULL,
  number_of_trades_24h INTEGER NOT NULL,
);