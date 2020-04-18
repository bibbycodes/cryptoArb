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
    let rate1 = this.rates[0].ask //
    let rate2 = this.rates[1].bid //
    let rate3 = this.rates[2].ask 
    let rate4 = this.rates[3].bid //bnbeur

    let outcome = this.outcome(startAmount, rate1, this.tradePairs["trade1"])
    let outcome2 = this.outcome(outcome, rate2, this.tradePairs["trade2"])
    let outcome3 = this.outcome(outcome2, rate3, this.tradePairs["trade3"])
    let outcome4 = this.outcome(outcome3, rate4, this.tradePairs["trade4"])
    console.log(`${startAmount} ${this.tradePairs['trade1'].from} =>  ${outcome} ${this.tradePairs['trade1'].to}  => ${outcome2} ${this.tradePairs['trade2'].to} => ${outcome3} ${this.tradePairs['trade3'].to} => ${outcome4} ${this.tradePairs['trade4'].to}`)

    return Calculate.relativeDifference(startAmount, outcome4)
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}



module.exports = Arb