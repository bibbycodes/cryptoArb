const Calculate = require('./Calculate')
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
    console.log(this.rates)
    let EURBTC = this.rates['BTC/EUR'].ask
    // console.log("EURBTC", EURBTC)
    let BTCNGN = this.rates['BTC/NGN'].bid
    // console.log("BTCNGN", BTCNGN)

    let NGNBNB = this.rates['BUSD/NGN'].ask
    // console.log("NGNBUSD", NGNBNB)
    let BNBEUR = this.rates['EUR/BUSD'].bid

    // console.log("BUSDEUR", BNBEUR)

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

let arb = new Arb('EUR', 'NGN', 'BTC', 'BNB')

arb.getRates().then(rates => {
  console.log(rates)
})

module.exports = Arb