const Arb = require('./models/Arb')
const dbConn = require('./models/dbConn')
const ccxt = require('ccxt')
const Email = require('./models/Email')
const Generate = require('./models/Generate')
const Format = require('./models/Format')

// exports.func = () => {
  async function test() {
    let ex = "binance"
    let exchange = new ccxt[ex]()
    let markets = await exchange.loadMarkets()
    let recipients = ['admin@afriex.co', 'scrapyscraperng@gmail.com']
    let viableTrades = [ 
      // [ 'XRP', 'SNT', 'ETH', 'BTC' ],
      // [ 'XRP', 'SNT', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'XRP', 'SNT' ],
      // [ 'ETH', 'BTC', 'SNT', 'XRP' ],
      // [ 'BTC', 'ETH', 'XRP', 'SNT' ],
      // [ 'BTC', 'ETH', 'SNT', 'XRP' ],
      // [ 'SNT', 'XRP', 'ETH', 'BTC' ],
      // [ 'SNT', 'XRP', 'BTC', 'ETH' ],
      // [ 'LTC', 'SNT', 'ETH', 'BTC' ],
      [ 'LTC', 'SNT', 'BTC', 'ETH' ],
      [ 'ETH', 'BTC', 'LTC', 'SNT' ],
      [ 'ETH', 'BTC', 'SNT', 'LTC' ],
      [ 'BTC', 'ETH', 'LTC', 'SNT' ],
      [ 'BTC', 'ETH', 'SNT', 'LTC' ],
      [ 'SNT', 'LTC', 'ETH', 'BTC' ],
      [ 'SNT', 'LTC', 'BTC', 'ETH' ],
      [ 'LTC', 'XRP', 'ETH', 'BTC' ],
      [ 'LTC', 'XRP', 'BTC', 'ETH' ],
      // [ 'XRP', 'LTC', 'ETH', 'BTC' ],
      // [ 'XRP', 'LTC', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'LTC', 'XRP' ],
      // [ 'ETH', 'BTC', 'XRP', 'LTC' ],
      // [ 'BTC', 'ETH', 'LTC', 'XRP' ],
      // [ 'BTC', 'ETH', 'XRP', 'LTC' ],
      // [ 'EOS', 'SNT', 'ETH', 'BTC' ],
      // [ 'EOS', 'SNT', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'EOS', 'SNT' ],
      // [ 'ETH', 'BTC', 'SNT', 'EOS' ],
      // [ 'BTC', 'ETH', 'EOS', 'SNT' ],
      // [ 'BTC', 'ETH', 'SNT', 'EOS' ],
      // [ 'SNT', 'EOS', 'ETH', 'BTC' ],
      // [ 'SNT', 'EOS', 'BTC', 'ETH' ],
      // [ 'EOS', 'XRP', 'ETH', 'BTC' ],
      // [ 'EOS', 'XRP', 'BTC', 'ETH' ],
      // [ 'XRP', 'EOS', 'ETH', 'BTC' ],
      // [ 'XRP', 'EOS', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'EOS', 'XRP' ],
      // [ 'ETH', 'BTC', 'XRP', 'EOS' ],
      // [ 'BTC', 'ETH', 'EOS', 'XRP' ],
      // [ 'BTC', 'ETH', 'XRP', 'EOS' ],
      // [ 'EOS', 'LTC', 'ETH', 'BTC' ],
      // [ 'EOS', 'LTC', 'BTC', 'ETH' ],
      // [ 'LTC', 'EOS', 'ETH', 'BTC' ],
      // [ 'LTC', 'EOS', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'EOS', 'LTC' ],
      // [ 'ETH', 'BTC', 'LTC', 'EOS' ],
      // [ 'BTC', 'ETH', 'EOS', 'LTC' ],
      // [ 'BTC', 'ETH', 'LTC', 'EOS' ],
      // [ 'LINK', 'SNT', 'ETH', 'BTC' ],
      // [ 'LINK', 'SNT', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'LINK', 'SNT' ],
      // [ 'ETH', 'BTC', 'SNT', 'LINK' ],
      // [ 'BTC', 'ETH', 'LINK', 'SNT' ],
      // [ 'BTC', 'ETH', 'SNT', 'LINK' ],
      // [ 'SNT', 'LINK', 'ETH', 'BTC' ],
      // [ 'SNT', 'LINK', 'BTC', 'ETH' ],
      // [ 'LINK', 'XRP', 'ETH', 'BTC' ],
      // [ 'LINK', 'XRP', 'BTC', 'ETH' ],
      // [ 'XRP', 'LINK', 'ETH', 'BTC' ],
      // [ 'XRP', 'LINK', 'BTC', 'ETH' ],
      // [ 'ETH', 'BTC', 'LINK', 'XRP' ],
      // [ 'ETH', 'BTC', 'XRP', 'LINK' ],
      // [ 'BTC', 'ETH', 'LINK', 'XRP' ],
      // [ 'BTC', 'ETH', 'XRP', 'LINK' ],
    ]

    let volatile = [
      [ 'LRC', 'WTC', 'ETH', 'BTC' ],
      [ 'LRC', 'WTC', 'BTC', 'ETH' ],
      [ 'ETH', 'BTC', 'LRC', 'WTC' ],
      [ 'ETH', 'BTC', 'WTC', 'LRC' ],
      [ 'BTC', 'ETH', 'LRC', 'WTC' ],
      [ 'BTC', 'ETH', 'WTC', 'LRC' ],
      [ 'WTC', 'LRC', 'ETH', 'BTC' ],
      [ 'WTC', 'LRC', 'BTC', 'ETH' ],
      [ 'ENG', 'WTC', 'ETH', 'BTC' ],
      [ 'ENG', 'WTC', 'BTC', 'ETH' ],
      [ 'ETH', 'BTC', 'ENG', 'WTC' ],
      [ 'ETH', 'BTC', 'WTC', 'ENG' ],
      [ 'BTC', 'ETH', 'ENG', 'WTC' ],
      [ 'BTC', 'ETH', 'WTC', 'ENG' ],
      [ 'WTC', 'ENG', 'ETH', 'BTC' ],
      [ 'WTC', 'ENG', 'BTC', 'ETH' ],
      [ 'ENG', 'LRC', 'ETH', 'BTC' ],
      [ 'ENG', 'LRC', 'BTC', 'ETH' ],
      [ 'LRC', 'ENG', 'ETH', 'BTC' ],
      [ 'LRC', 'ENG', 'BTC', 'ETH' ],
      [ 'ETH', 'BTC', 'ENG', 'LRC' ],
      [ 'ETH', 'BTC', 'LRC', 'ENG' ],
      [ 'BTC', 'ETH', 'ENG', 'LRC' ],
      [ 'BTC', 'ETH', 'LRC', 'ENG' ],
      [ 'BNB', 'ETH', 'BTC', 'WTC' ],
      [ 'BNB', 'ETH', 'WTC', 'BTC' ],
      [ 'BNB', 'BTC', 'ETH', 'WTC' ],
      [ 'BNB', 'BTC', 'WTC', 'ETH' ],
      [ 'BNB', 'WTC', 'ETH', 'BTC' ],
      [ 'BNB', 'WTC', 'BTC', 'ETH' ],
      [ 'ETH', 'BNB', 'BTC', 'WTC' ],
      [ 'ETH', 'BNB', 'WTC', 'BTC' ],
      [ 'ETH', 'BTC', 'BNB', 'WTC' ],
      [ 'ETH', 'BTC', 'WTC', 'BNB' ],
      [ 'ETH', 'WTC', 'BNB', 'BTC' ],
      [ 'ETH', 'WTC', 'BTC', 'BNB' ],
      [ 'BTC', 'BNB', 'ETH', 'WTC' ],
      [ 'BTC', 'BNB', 'WTC', 'ETH' ],
      [ 'BTC', 'ETH', 'BNB', 'WTC' ],
      [ 'BTC', 'ETH', 'WTC', 'BNB' ],
      [ 'BTC', 'WTC', 'BNB', 'ETH' ],
      [ 'BTC', 'WTC', 'ETH', 'BNB' ],
      [ 'WTC', 'BNB', 'ETH', 'BTC' ],
      [ 'WTC', 'BNB', 'BTC', 'ETH' ],
      [ 'WTC', 'ETH', 'BNB', 'BTC' ],
      [ 'WTC', 'ETH', 'BTC', 'BNB' ],
      [ 'WTC', 'BTC', 'BNB', 'ETH' ],
      [ 'WTC', 'BTC', 'ETH', 'BNB' ],
      [ 'BNB', 'LRC', 'ETH', 'BTC' ],
      [ 'BNB', 'LRC', 'BTC', 'ETH' ],
      [ 'LRC', 'BNB', 'ETH', 'BTC' ],
      [ 'LRC', 'BNB', 'BTC', 'ETH' ],
      [ 'ETH', 'BTC', 'BNB', 'LRC' ],
      [ 'ETH', 'BTC', 'LRC', 'BNB' ],
      [ 'BTC', 'ETH', 'BNB', 'LRC' ],
      [ 'BTC', 'ETH', 'LRC', 'BNB' ],
      [ 'BNB', 'ENG', 'ETH', 'BTC' ],
      [ 'BNB', 'ENG', 'BTC', 'ETH' ],
      [ 'ENG', 'BNB', 'ETH', 'BTC' ],
      [ 'ENG', 'BNB', 'BTC', 'ETH' ],
      [ 'ETH', 'BTC', 'BNB', 'ENG' ],
      [ 'ETH', 'BTC', 'ENG', 'BNB' ],
      [ 'BTC', 'ETH', 'BNB', 'ENG' ],
      [ 'BTC', 'ETH', 'ENG', 'BNB' ],
    ]
    
    // When provided with an exchange rate, currency pairs indicate how much of the 
    // quote currency is needed to buy one unit of the provided base currency. 
    // For example, reading EUR/USD = 1.55 means that _1 is equal to $1.55. 
    // This directly says that in order to purchase _1, a buyer must pay $1.55. 
    // The currency pair quotation is read in the same manner when selling the base currency. 
    // If a seller wants to sell _1, he will get $1.55 for it.

    for (let trade of volatile) {
      let tradePairs = Generate.validatedTradePairs(trade[0], trade[1], trade[2], trade[3], markets)
      let arb = new Arb(tradePairs)
      arb.getRates(ex).then(() => {
        let arbRate = arb.getArb(300)
        console.log(`Arb Rate: ${arbRate[0]}`, `Coins: ${trade}`)
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



