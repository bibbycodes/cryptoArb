const Calculate = require('./Calculate')
const MonitorRest = require('./MonitorRest')
const Generate = require('./Generate')

// EUR/BTC  = 5500
// BTC/NGN  = 2600000
// NGN/BUSD = 460
// EUR/BUSD = 1.2

class Arb {
  constructor(startCurr, endCurr, crypto, converter) {
    // this.startCurr = startCurr
    // this.endCurr = endCurr
    // this.crypto = crypto
    this.converter = converter
    this.tradePairs = Generate.tradePairs(startCurr, endCurr, crypto, converter)
    this.rates = {}
  }

  async getRates() {
    let pairs = []

    for (let trade in this.tradePairs) {
      pairs.push(this.tradePairs[trade].pair)
    }

    for (let i = 0; i < pairs.length; i++) {
      let rate = await MonitorRest.orderBook('binance', pairs[i])
      this.rates[`trade${i + 1}`] = rate
    }

    return this.rates
  }

  getArb() {
    // console.log(this.rates)
    let trade1 = this.rates['trade1'].ask
    console.log(`${this.rates['trade1'].pair}`, trade1)
    let trade2 = this.rates['trade2'].bid
    console.log(`${this.rates['trade2'].pair}`, trade2)
    let trade3 = this.rates['trade3'].ask
    console.log(`${this.rates['trade3'].pair}`, trade3)
    let trade4 = this.rates['trade4'].bid
    console.log(`${this.rates['trade4'].pair}`, trade4)

    let converterAmount = trade2 / trade3
    let endCurrAmount

    if (this.converter == "BUSD") {
      endCurrAmount = converterAmount / trade4
    } else {
      endCurrAmount = converterAmount * trade4
    }
    return Calculate.relativeDifference(endCurrAmount, trade1)
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}

// let arb = new Arb('EUR', 'NGN', 'BTC', 'BNB')

// arb.getRates().then(rates => {
//   arb.getArb()
// })

module.exports = Arb