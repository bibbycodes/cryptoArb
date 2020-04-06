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
    //console.log(this.rates)
    let EURBTC = this.rates['BTC/EUR'].ask
    // console.log("EURBTC", EURBTC)
    let BTCNGN = this.rates['BTC/NGN'].bid
    // console.log("BTCNGN", BTCNGN)

    let NGNBNB = this.rates['BNB/NGN'].ask
    // console.log("NGNBNB", NGNBNB)
    let BNBEUR = this.rates['BNB/EUR'].bid

    // console.log("BUSDEUR", BNBEUR)

    let converterAmount = BTCNGN / NGNBNB // lot size of bnb
    let endCurrAmount 

    if (this.converter == "BUSD") {
      endCurrAmount = converterAmount / BUSDEUR
    } else {
      endCurrAmount = converterAmount * BNBEUR
    }
    return {"arbRate": Calculate.relativeDifference(endCurrAmount, EURBTC), "ngnBtcRate": BTCNGN}
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}

module.exports = Arb