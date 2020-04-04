const Calculate = require('./Calculate')
const Format = require('./Format')
const MonitorRest = require('./MonitorRest')
const Generate = require('./Generate')

// EUR/BTC  = 5500
// BTC/NGN  = 2600000
// NGN/BUSD = 460
// EUR/BUSD = 1.2



class Arb {
  constructor(startCurr, endCurr, crypto, converter) {
    this.startCurr = startCurr
    this.endCurr = endCurr
    this.crypto = crypto
    this.converter = converter
    this.tradePairs = Generate.tradePairs(startCurr, endCurr, crypto, converter)
    this.rates = {}
    this.ratesArr = []
  }

  async getRates() {
    let pairs = []

    for (let trade in this.tradePairs) {
      pairs.push(this.tradePairs[trade].pair)
    }

    for (let i = 0; i < pairs.length; i++) {
      let rate = await MonitorRest.orderBook('binance', pairs[i])
      this.rates[rate.pair] = rate
      this.ratesArr.push(rate)
    }

    return this.rates
  }

  getArb() {
    let EURBTC = this.ratesArr[0].ask
    let BTCNGN = this.ratesArr[1].bid
    let NGNBNB = this.ratesArr[2].ask
    let BNBEUR = this.ratesArr[3].bid

    let converterAmount = BTCNGN / NGNBNB
    let endCurrAmount

    if (this.converter == "BUSD") {
      endCurrAmount = converterAmount / BNBEUR
    } else {
      endCurrAmount = converterAmount * BNBEUR
    }
    return Calculate.relativeDifference(endCurrAmount, EURBTC)
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}

module.exports = Arb