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
    console.log(`side: ${this.side}, base: ${this.base}, quote: ${this.quote}, ${this.symbol}, price: ${this.side == 'sell' ? this.bid : this.ask}`)
    
  }

  setFee() {
    if (this.side == "buy") {
      console.log("deduct from base currency")
    } else {
      console.log("deduct from quote currency")
    }
  }

  getAmount(previousAmount) {
    if (this.from == this.base) {
      return previousAmount * this.side == 'sell' ? this.bid : this.ask
    } else {
      return previousAmount
    }
  }

  async executeMarketOrder(exchange, amount) {
    if (this.side == 'sell') {
      console.log(this.getAmount(amount))
      // let order = await exchange.create_market_sell_order(this.symbol, this.getAmount(amount))
      // return order
    } else if (this.side == 'buy') {
      console.log(this.getAmount(amount))
      // let order = await exchange.create_market_buy_order(this.symbol, this.getAmount(amount))
      // return order
    }
    return "Failed"
  }

  // async executeLimitOrder(exchange, amount) {
  //   if (this.side == 'sell') {
  //     console.log(`Selling ${this.quote} for ${this.base}`)
  //     // let order = await exchange.create_limit_sell_order(this.symbol, amount, this.bid)
  //     // return order
  //   } else if (this.side == 'buy') {
  //     console.log(`Buying ${this.base} with ${this.this.quote}`)
  //     // let order = await exchange.create_imit_buy_order(this.symbol, amount, this.ask)
  //     // return order
  //   }
  //   return "Failed"
  // }
}

module.exports = Trade