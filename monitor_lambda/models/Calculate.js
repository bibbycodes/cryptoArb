class Calculate {
  static relativeDifference(source, destination) {
    let relativeDifference = ((source - destination) / (Math.max(source, destination)) * 100).toFixed(2)
    return [relativeDifference]
  }

  subtractFees(exchange, tradeAmount) {
    let fees = {
      binance : 0.01
    }
    
    return tradeAmount - (tradeAmount * fees[exchange])
  }

  circularArbRate(trade) {

  }
}

module.exports = Calculate