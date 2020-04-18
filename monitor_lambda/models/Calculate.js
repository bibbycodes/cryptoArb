class Calculate {
  static relativeDifference(source, destination) {
    let difference = destination - source
    let relativeDifference = ((difference / source) * 100).toFixed(2)
    return [relativeDifference]
  }

  // Without using BNB for fees, Binance deducts fees from the base currency 
  // for a buy and from the quote currency for the sell. 
  // When using BNB for fees, Binance deducts from your BNB balance for buys and sells.
  static subtractFees(fee, tradeAmount) {
    return tradeAmount - (tradeAmount * fee)
  }

  circularArbRate(trade) {

  }
}

module.exports = Calculate