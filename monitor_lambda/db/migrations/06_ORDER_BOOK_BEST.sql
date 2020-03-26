CREATE TABLE order_book_best (
  id SERIAL PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  exchange VARCHAR(120) NOT NULL,
  pair VARCHAR(10) NOT NULL,
  ask_price NUMERIC,
  ask_volume NUMERIC,
  bid_price NUMERIC,
  bid_volume NUMERIC
);