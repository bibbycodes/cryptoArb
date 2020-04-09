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

    let startTime = Date.now()

    for (let trade in this.tradePairs) {
      pairs.push(this.tradePairs[trade].pair) // turn array into object
    }

    [
      this.rates[`trade${1}`], 
      this.rates[`trade${2}`], 
      this.rates[`trade${3}`], 
      this.rates[`trade${4}`]
    ] = await Promise.all([
          MonitorRest.orderBook('binance', pairs[0]),
          MonitorRest.orderBook('binance', pairs[1]), 
          MonitorRest.orderBook('binance', pairs[2]), 
          MonitorRest.orderBook('binance', pairs[3])
    ])

    let endTime = Date.now()

    console.log(`Time Elapsed: ${(endTime - startTime) / 1000} seconds`)
    return this.rates
  }

  getArb() {
    // console.log(this.rates)
    let trade1 = this.rates['trade1'].ask //eurbtc
    console.log(`Trade 1 ${this.rates['trade1'].pair}`, trade1)
    let trade2 = this.rates['trade2'].bid //btcngn
    console.log(`Trade 2 ${this.rates['trade2'].pair}`, trade2)
    let trade3 = this.rates['trade3'].ask //ngnbnb
    console.log(`Trade 3 ${this.rates['trade3'].pair}`, trade3)
    let trade4 = this.rates['trade4'].bid //bnbeur
    console.log(`Trade 4 ${this.rates['trade4'].pair}`, trade4)

    // inverse
    let reverseTrade1 = this.rates['trade4'].ask
    console.log(`Reverse 1 = ${this.rates['trade4'].pair}`, reverseTrade1)
    let reverseTrade2 = this.rates['trade3'].bid
    console.log(`Reverse 2 = ${this.rates['trade3'].pair}`, reverseTrade2)
    let reverseTrade3 = this.rates['trade2'].ask
    console.log(`Reverse 3 = ${this.rates['trade2'].pair}`, reverseTrade3)
    let reverseTrade4 = this.rates['trade1'].bid
    console.log(`Reverse 4 = ${this.rates['trade1'].pair}`, reverseTrade4)

     let reverseConverter = reverseTrade2/reverseTrade3
     let endReverseAmount = reverseConverter * reverseTrade4

    let converterAmount = trade2 / trade3 //converter amount = how much bnb you need 482
    let endCurrAmount

    if (this.converter == "BUSD") { ///does this make sense
      endCurrAmount = converterAmount / trade4
    } else {
      endCurrAmount = converterAmount * trade4
    } //ngnbnb or ngnbtc
    return {"arbRate": Calculate.relativeDifference(endCurrAmount, trade1), "baseRate": trade3}
  }

  add(ticker) {
    this.symbols[`${ticker.pair} ${ticker.exchange}`] = ticker
  }
}

let busd = new Arb('EUR', 'NGN', 'BTC', 'BUSD')
let bnb = new Arb('EUR', 'NGN', 'BTC', 'BNB')

bnb.getRates().then(() =>{
   console.log(bnb.getArb())
})

module.exports = Arb