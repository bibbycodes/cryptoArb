class Parse {
  static krakenTicker(ticker) {
    let object = {
      timestamp : Date.now(),
      ask_price : ticker[1].a[0],
      ask_lot_volume : ticker[1].a[2],
      ask_while_lot_volume : ticker[1].a[1],
      bid_price : ticker[1].b[0],
      bid_lot_volume : ticker[1].b[2],
      bid_whole_lot_volume : ticker[1].b[1],
      close_price : ticker[1].c[0],
      close_lot_volume : ticker[1].c[1],
      volume_today : ticker[1].v[0],
      volume_24h : ticker[1].v[1],
      weighted_average_price : ticker[1].p[0],
      weighted_average_price_24h : ticker[1].p[1],
      number_of_trades : ticker[1].t[0],
      number_of_trades_24h : ticker[1].t[1],
      low_price : ticker[1].l[0],
      low_price_24h : ticker[1].l[1],
      high_price : ticker[1].h[0],
      high_price_24h : ticker[1].h[1],
      open_price : ticker[1].o[0],
      open_price_24h : ticker[1].o[1],
      pair : ticker[3]
    }
    return object
  }
}

module.exports = Parser