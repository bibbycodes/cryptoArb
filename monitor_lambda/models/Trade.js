const ccxt =require('ccxt')
const Calculate = require('./Calculate')

class Trade {
  constructor(tradeObject) {
    Object.assign(this, tradeObject)
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