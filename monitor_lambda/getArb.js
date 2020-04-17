const Arb = require('./models/Arb')
const dbConn = require('./models/dbConn')
const ccxt = require('ccxt')
const Email = require('./models/Email')
const Generate = require('./models/Generate')
const Format = require('./models/Format')

// exports.func = () => {
  async function test() {
    let binance = new ccxt['binance']()
    let markets = await binance.loadMarkets()
    let recipients = ['admin@afriex.co', 'scrapyscraperng@gmail.com']
    let viableTrades = [
      [ 'EUR', 'NGN', 'BTC', 'BNB' ],
      [ 'NGN', 'EUR', 'BTC', 'BNB' ],
      [ 'EUR', 'NGN', 'BTC', 'BUSD' ],
      [ 'NGN', 'EUR', 'BTC', 'BUSD' ],
      [ 'SNT', 'NEO', 'ETH', 'BTC' ],
      [ 'NEO', 'SNT', 'ETH', 'BTC' ],
      [ 'BNB', 'LTC', 'ETH', 'BTC' ],
      [ 'LTC', 'BNB', 'ETH', 'BTC' ],
      [ 'ETH', 'BNB', 'LTC', 'BTC' ],
      [ 'BTC', 'BNB', 'LTC', 'ETH' ],
      [ 'NEO', 'LTC', 'ETH', 'BTC' ],
      [ 'LTC', 'NEO', 'ETH', 'BTC' ],
      [ 'NEO', 'BNB', 'ETH', 'BTC' ],
      [ 'BNB', 'NEO', 'ETH', 'BTC' ],
      [ 'ETH', 'NEO', 'BNB', 'BTC' ],
      [ 'BTC', 'NEO', 'BNB', 'ETH' ],
      [ 'LTC', 'NEO', 'BNB', 'BTC' ],
      [ 'LTC', 'NEO', 'BNB', 'ETH' ],
      [ 'QTUM', 'LTC', 'ETH', 'BTC' ],
      [ 'LTC', 'QTUM', 'ETH', 'BTC' ],
      [ 'QTUM', 'BNB', 'ETH', 'BTC' ],
      [ 'BNB', 'QTUM', 'ETH', 'BTC' ],
      [ 'ETH', 'QTUM', 'BNB', 'BTC' ],
      [ 'BTC', 'QTUM', 'BNB', 'ETH' ],
      [ 'LTC', 'QTUM', 'BNB', 'BTC' ],
      [ 'LTC', 'QTUM', 'BNB', 'ETH' ],
      [ 'QTUM', 'NEO', 'ETH', 'BTC' ],
      [ 'NEO', 'QTUM', 'ETH', 'BTC' ],
      [ 'QTUM', 'NEO', 'BNB', 'BTC' ],
      [ 'NEO', 'QTUM', 'BNB', 'BTC' ],
      [ 'QTUM', 'NEO', 'BNB', 'ETH' ],
      [ 'NEO', 'QTUM', 'BNB', 'ETH' ],
      [ 'EOS', 'LTC', 'ETH', 'BTC' ],
      [ 'LTC', 'EOS', 'ETH', 'BTC' ],
      [ 'EOS', 'BNB', 'ETH', 'BTC' ],
      [ 'BNB', 'EOS', 'ETH', 'BTC' ],
      [ 'ETH', 'EOS', 'BNB', 'BTC' ],
      [ 'BTC', 'EOS', 'BNB', 'ETH' ],
      [ 'LTC', 'EOS', 'BNB', 'BTC' ],
      [ 'LTC', 'EOS', 'BNB', 'ETH' ],
      [ 'EOS', 'NEO', 'ETH', 'BTC' ],
      [ 'NEO', 'EOS', 'ETH', 'BTC' ],
      [ 'EOS', 'NEO', 'BNB', 'BTC' ],
      [ 'NEO', 'EOS', 'BNB', 'BTC' ],
      [ 'EOS', 'NEO', 'BNB', 'ETH' ],
      [ 'NEO', 'EOS', 'BNB', 'ETH' ],
      [ 'EOS', 'QTUM', 'ETH', 'BTC' ],
      [ 'QTUM', 'EOS', 'ETH', 'BTC' ],
      [ 'EOS', 'QTUM', 'BNB', 'BTC' ],
      [ 'QTUM', 'EOS', 'BNB', 'BTC' ],
    ]

    // When provided with an exchange rate, currency pairs indicate how much of the 
    // quote currency is needed to buy one unit of the provided base currency. 
    // For example, reading EUR/USD = 1.55 means that _1 is equal to $1.55. 
    // This directly says that in order to purchase _1, a buyer must pay $1.55. 
    // The currency pair quotation is read in the same manner when selling the base currency. 
    // If a seller wants to sell _1, he will get $1.55 for it.

    function outcome(quoteCurrAmount, tradePrice) {
      return quoteCurrAmount / tradePrice
    }

    for (let trade of viableTrades) {
      let tradePairs = Generate.validatedTradePairs(trade[0], trade[1], trade[2], trade[3], markets)
      let arb = new Arb(tradePairs)
      arb.getRates().then(rates => {
        let arbRate = arb.getArb(300)
        console.log(`Arb Rate: ${JSON.stringify(arbRate)}`, `Coins: ${trade}`)
      //   arbs.push({arbRate, trade })
      })
      // .catch(err => console.log(err.message))
    }
      // .then(async result => {
        //   let rates = result.rates
        //   let busdArbRate = result.busdArbRate
        //   let tradePairs = result.tradePairs
        //   let queryString = Format.arbDbString(trade[0], trade[1], trade[2], trade[3], rates, busdArbRate)
        //   let db = new dbConn()
        //   await db.query(queryString)
      //   let endTime = Date.now()
      //   console.log(`Time elapsed for ${trade}: ${endTime - startTime}ms`)
      //   return { rates, busdArbRate, tradePairs }
      // })
      // .then(async res => {
      //   let message = `ArbRate: ${res.busdArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
      //   await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BUSD EUR NGN: ${res.busdArbRate}`, message)
      // })
      
  }

  // busd.getRates()
  // .then(rates => {
  //   let tradePairs = busd.tradePairs
  //   let busdArbRate = busd.getArb()
  //   return { rates, tradePairs, busdArbRate }
  // })
  // .then(async result => {
  //   let rates = result.rates
  //   let busdArbRate = result.busdArbRate
  //   let tradePairs = result.tradePairs
  //   let queryString = Format.arbDbString('EUR', 'NGN', 'BTC', 'BUSD', rates, busdArbRate)
  //   let db = new dbConn()
  //   await db.query(queryString)
  //   return { rates, busdArbRate, tradePairs }
  // })
  // .then(async res => {
  //   let message = `ArbRate: ${res.busdArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
  //   await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BUSD EUR NGN: ${res.busdArbRate}`, message)
  // })

  // bnb.getRates()
  //   .then(rates => {
  //     let tradePairs = bnb.tradePairs
  //     let bnbArbRate = bnb.getArb()
  //     return { rates, tradePairs, bnbArbRate }
  //   })
  //   .then(async result => {
  //     let rates = result.rates
  //     let bnbArbRate = result.bnbArbRate
  //     let tradePairs = result.tradePairs
  //     let queryString = Format.arbDbString('EUR', 'NGN', 'BTC', 'BNB', rates, bnbArbRate)
  //     let db = new dbConn()
  //     await db.query(queryString)
  //     return { rates, bnbArbRate, tradePairs }
  //   })
  //   .then(async res => {
  //     let message = `ArbRate: ${res.bnbArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
  //     await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BNB EUR NGN: ${res.bnbArbRate}`, message)
  //   })
// }

test()



