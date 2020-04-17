const Calculate = require('./Calculate')
const MonitorRest = require('./MonitorRest')

class Arb {
  constructor(tradePairs) {
    this.tradePairs = tradePairs
    this.rates = {}
  }

  
  async getRates(exchange) {
    let pairs = []
    for (let trade in this.tradePairs) {
      pairs.push(this.tradePairs[trade].pair)
    }

    let calls = [
      MonitorRest.orderBook(exchange, pairs[0]),
      MonitorRest.orderBook(exchange, pairs[1]), 
      MonitorRest.orderBook(exchange, pairs[2]), 
      MonitorRest.orderBook(exchange, pairs[3])
    ]

    let startTime = Date.now()
    let rates = await Promise.all(calls)
    Object.assign(this.rates, rates)
    let endTime = Date.now()
    // console.log(`Time Elapsed: ${(endTime - startTime) / 1000} seconds`)
    return this.rates
  }

  outcome(fromAmount, tradePrice, trade) {
    if (trade.to == trade.quote){
      return fromAmount * tradePrice
    } else{
      return fromAmount / tradePrice
    }
  }

  getArb(startAmount) {
    let trade1 = this.rates[0].ask //
    let trade2 = this.rates[1].bid //
    let trade3 = this.rates[2].ask 
    let trade4 = this.rates[3].bid //bnbeur

    let outcome = this.outcome(startAmount, trade1, this.tradePairs["trade1"])
    let outcome2 = this.outcome(outcome, trade2, this.tradePairs["trade2"])
    let outcome3 = this.outcome(outcome2, trade3, this.tradePairs["trade3"])
    let outcome4 = this.outcome(outcome3, trade4, this.tradePairs["trade4"])

    return Calculate.relativeDifference(startAmount, outcome4)
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}

module.exports = Arb