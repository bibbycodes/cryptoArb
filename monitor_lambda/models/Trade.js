const ccxt =require('ccxt')
const Calculate = require('./Calculate')

class Trade {
  constructor(tradeObject, tickers) {
    Object.assign(this, tradeObject)
    this.ask = tickers[this.symbol].ask
    this.bid = tickers[this.symbol].bid
    this.change =  tickers[this.symbol].change
    this.baseVolume = tickers[this.symbol].baseVolume
    this.quoteVolume = tickers[this.symbol].quoteVolume
    // this.setFee()
  }

  setFee() {
    if (this.side == "buy") {
      console.log("deduct from base currency")
    } else {
      console.log("deduct from quote currency")
    }
  }
}

module.exports = Trade