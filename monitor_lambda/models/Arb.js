const Calculate = require('./Calculate')
const MonitorRest = require('./MonitorRest')
const Generate = require('./Generate')

// EUR/BTC  = 5500
// BTC/NGN  = 2600000
// NGN/BUSD = 460
// EUR/BUSD = 1.2

class Arb {
  constructor(tradePairs) {
    // this.startCurr = startCurr
    // this.endCurr = endCurr
    // this.crypto = crypto
    // this.converter = converter
    this.tradePairs = tradePairs
    this.rates = {}
  }

  async getRates() {
    let pairs = []

    let startTime = Date.now()

    for (let trade in this.tradePairs) {
      pairs.push(this.tradePairs[trade].pair)
    }

    // console.log(pairs)

    let calls = [
      MonitorRest.orderBook('binance', pairs[0]),
      MonitorRest.orderBook('binance', pairs[1]), 
      MonitorRest.orderBook('binance', pairs[2]), 
      MonitorRest.orderBook('binance', pairs[3])
    ]
      
    let rates = await Promise.all(calls)
    Object.assign(this.rates, rates)
    let endTime = Date.now()
    // console.log(`Time Elapsed: ${(endTime - startTime) / 1000} seconds`)
    return this.rates
  }

  outcome(fromAmount, tradePrice, trade) {
    console.log("trade", trade)
    if (trade.to == trade.quote){
      console.log('b')
      return fromAmount * tradePrice
    } else{
      console.log('c')
      return fromAmount / tradePrice
    }
  }

  getArb() {
    // console.log(this.rates)
    let trade1 = this.rates[0].ask //
    let trade2 = this.rates[1].bid //
    let trade3 = this.rates[2].ask 
    let trade4 = this.rates[3].bid //bnbeur
    let outcome = this.outcome(6000, trade1, this.tradePairs["trade1"])
    // console.log(trade1, trade2, trade3, trade4)
    // console.log(this.rates)
    // console.log(this.tradePairs)
    console.log("OutCome 1:", outcome)
    let outcome2 = this.outcome(outcome, trade2, this.tradePairs["trade2"])
    console.log("Outcome 2", outcome2)
    let outcome3 = this.outcome(outcome2, trade3, this.tradePairs["trade3"])
    console.log("Outcome 3", outcome3) //
    let outcome4 = this.outcome(outcome3, trade4, this.tradePairs["trade4"])
    console.log("Outcome 4", outcome4) //
    // let trade1Amount = trade1 * trade2
    // let converterAmount = trade1Amount / trade3
    // let endCurrAmount

    // if (this.converter == "BUSD") { // Needs to be generalised if less than 1?
    //   endCurrAmount = converterAmount / trade4
    // } else {
    //   endCurrAmount = converterAmount * trade4
    // } //ngnbnb or ngnbtc

    // return {"arbRate": Calculate.relativeDifference(endCurrAmount, trade1), "baseRate": trade3}
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}

module.exports = Arb