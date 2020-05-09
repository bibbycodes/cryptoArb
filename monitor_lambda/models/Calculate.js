class Calculate {
  static relativeDifference(sourceAmount, destinationAmount) {
    let difference = destinationAmount - sourceAmount
    let relativeDifference = ((difference / sourceAmount) * 100).toFixed(2)
    return relativeDifference
  }

  // Without using BNB for fees, Binance deducts fees from the base currency 
  // for a buy and from the quote currency for the sell. 
  // When using BNB for fees, Binance deducts from your BNB balance for buys and sells.
  static subtractFees(fee, tradeAmount) {
    return tradeAmount - (tradeAmount * fee)
  }

}

module.exports = Calculate