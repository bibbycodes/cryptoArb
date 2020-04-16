const Arb = require('./models/Arb')
const dbConn = require('./models/dbConn')
const ccxt = require('ccxt')
const Email = require('./models/Email')
const Generate = require('./models/Generate')
const Format = require('./models/Format')

// exports.func = () => {
  async function test() {

    // let busd = new Arb('EUR', 'NGN', 'BTC', 'BUSD')`
    // let bnb = new Arb('EUR', 'NGN', 'BTC', 'BNB')
    let binance = new ccxt['binance']()
    let markets = await binance.loadMarkets()
    let recipients = ['admin@afriex.co', 'scrapyscraperng@gmail.com']
    // let original = ['EUR', 'NGN', 'BTC', 'BUSD']
    // let permOrig = Generate.permutations(original)
    let viableTrades = [
      // [ // 'BNB', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'BNB', 'ETH', 'BTC' ],
      // [ 'ETH', 'BNB', 'LTC', 'BTC' ],
      // [ 'BTC', 'BNB', 'LTC', 'ETH' ],
      // [ 'NEO', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'NEO', 'ETH', 'BTC' ],
      // [ 'NEO', 'BNB', 'ETH', 'BTC' ],
      // [ 'BNB', 'NEO', 'ETH', 'BTC' ],
      // [ 'ETH', 'NEO', 'BNB', 'BTC' ],
      // [ 'BTC', 'NEO', 'BNB', 'ETH' ],
      // [ 'LTC', 'NEO', 'BNB', 'BTC' ],
      // [ 'LTC', 'NEO', 'BNB', 'ETH' ],
      // [ 'QTUM', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'QTUM', 'ETH', 'BTC' ],
      // [ 'QTUM', 'BNB', 'ETH', 'BTC' ],
      // [ 'BNB', 'QTUM', 'ETH', 'BTC' ],
      // [ 'ETH', 'QTUM', 'BNB', 'BTC' ],
      // [ 'BTC', 'QTUM', 'BNB', 'ETH' ],
      // [ 'LTC', 'QTUM', 'BNB', 'BTC' ],
      // [ 'LTC', 'QTUM', 'BNB', 'ETH' ],
      // [ 'QTUM', 'NEO', 'ETH', 'BTC' ],
      // [ 'NEO', 'QTUM', 'ETH', 'BTC' ],
      // [ 'QTUM', 'NEO', 'BNB', 'BTC' ],
      // [ 'NEO', 'QTUM', 'BNB', 'BTC' ],
      // [ 'QTUM', 'NEO', 'BNB', 'ETH' ],
      // [ 'NEO', 'QTUM', 'BNB', 'ETH' ],
      // [ 'EOS', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'EOS', 'ETH', 'BTC' ],
      // [ 'EOS', 'BNB', 'ETH', 'BTC' ],
      // [ 'BNB', 'EOS', 'ETH', 'BTC' ],
      // [ 'ETH', 'EOS', 'BNB', 'BTC' ],
      // [ 'BTC', 'EOS', 'BNB', 'ETH' ],
      // [ 'LTC', 'EOS', 'BNB', 'BTC' ],
      // [ 'LTC', 'EOS', 'BNB', 'ETH' ],
      // [ 'EOS', 'NEO', 'ETH', 'BTC' ],
      // [ 'NEO', 'EOS', 'ETH', 'BTC' ],
      // [ 'EOS', 'NEO', 'BNB', 'BTC' ],
      // [ 'NEO', 'EOS', 'BNB', 'BTC' ],
      // [ 'EOS', 'NEO', 'BNB', 'ETH' ],
      // [ 'NEO', 'EOS', 'BNB', 'ETH' ],
      // [ 'EOS', 'QTUM', 'ETH', 'BTC' ],
      // [ 'QTUM', 'EOS', 'ETH', 'BTC' ],
      // [ 'EOS', 'QTUM', 'BNB', 'BTC' ],
      // [ 'QTUM', 'EOS', 'BNB', 'BTC' ],
      // [ 'EOS', 'QTUM', 'BNB', 'ETH' ],
      // [ 'QTUM', 'EOS', 'BNB', 'ETH' ],
      // [ 'SNT', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'SNT', 'ETH', 'BTC' ],
      // [ 'SNT', 'BNB', 'ETH', 'BTC' ],
      // [ 'BNB', 'SNT', 'ETH', 'BTC' ],
      // [ 'SNT', 'NEO', 'ETH', 'BTC' ],
      // [ 'NEO', 'SNT', 'ETH', 'BTC' ],
      // [ 'SNT', 'QTUM', 'ETH', 'BTC' ],
      // [ 'QTUM', 'SNT', 'ETH', 'BTC' ],
      // [ 'SNT', 'EOS', 'ETH', 'BTC' ],
      // [ 'EOS', 'SNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'BNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'BNB', 'ETH', 'BTC' ],
      // [ 'BNB', 'BNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'NEO', 'ETH', 'BTC' ],
      // [ 'NEO', 'BNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'QTUM', 'ETH', 'BTC' ],
      // [ 'QTUM', 'BNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'EOS', 'ETH', 'BTC' ],
      // [ 'EOS', 'BNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'SNT', 'ETH', 'BTC' ],
      // [ 'SNT', 'BNT', 'ETH', 'BTC' ],
      // [ 'BCC', 'LTC', 'ETH', 'BTC' ],
      // [ 'LTC', 'BCC', 'ETH', 'BTC' ],
      // [ 'BCC', 'BNB', 'ETH', 'BTC' ],
      // [ 'BNB', 'BCC', 'ETH', 'BTC' ],
      // [ 'ETH', 'BCC', 'BNB', 'BTC' ],
      // [ 'BTC', 'BCC', 'BNB', 'ETH' ],
      // [ 'LTC', 'BCC', 'BNB', 'BTC' ],
      // [ 'LTC', 'BCC', 'BNB', 'ETH' ],
      // [ 'BCC', 'NEO', 'ETH', 'BTC' ],
      // [ 'NEO', 'BCC', 'ETH', 'BTC' ],
      // [ 'BCC', 'NEO', 'BNB', 'BTC' ],
      // [ 'NEO', 'BCC', 'BNB', 'BTC' ],
      // [ 'BCC', 'NEO', 'BNB', 'ETH' ],
      // [ 'NEO', 'BCC', 'BNB', 'ETH' ],
      // [ 'BCC', 'QTUM', 'ETH', 'BTC' ],
      // [ 'QTUM', 'BCC', 'ETH', 'BTC' ],
      // [ 'BCC', 'QTUM', 'BNB', 'BTC' ],
      // [ 'QTUM', 'BCC', 'BNB', 'BTC' ],
      // [ 'BCC', 'QTUM', 'BNB', 'ETH' ],
      // [ 'QTUM', 'BCC', 'BNB', 'ETH' ],
      // [ 'BCC', 'EOS', 'ETH', 'BTC' ],
      // [ 'EOS', 'BCC', 'ETH', 'BTC' ],
      // [ 'BCC', 'EOS', 'BNB', 'BTC' ],
      // [ 'EOS', 'BCC', 'BNB', 'BTC' ],
      // [ 'BCC', 'EOS', 'BNB', 'ETH' ],
      // [ 'EOS', 'BCC', 'BNB', 'ETH' ],
      // [ 'BCC', 'SNT', 'ETH', 'BTC' ],
      // [ 'SNT', 'BCC', 'ETH', 'BTC' ],
      // [ 'BCC', 'BNT', 'ETH', 'BTC' ],
      // [ 'BNT', 'BCC', 'ETH', 'BTC' ],
      // [ 'USDT', 'LTC', 'ETH', 'BTC' ],
      //[ 'LTC', 'USDT', 'ETH', 'BTC' ]
      ['NGN', 'BTC', 'BNB', 'BUSD' ]
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

    



    binance.fetchTicker('BCC/BNB').then(ticker => {
      // console.log(outcome(5,ticker.ask))
      // console.log(ticker)
    })
    
    for (let trade of viableTrades) {
      let startTime = Date.now()
      let tradePairs = Generate.validatedTradePairs(trade[0], trade[1], trade[2], trade[3], markets)
        .then(async pairs => {
          let busd = new Arb(pairs)
          busd.getRates()
            .then(rates => {
              let tradePairs = busd.tradePairs
              let busdArbRate = busd.getArb()
              // console.log(`Arb Rate: ${JSON.stringify(busdArbRate)}`, `Coins: ${trade}`)
              return { rates, tradePairs, busdArbRate }
            })
        })
      .catch(err => console.log(err.message))
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



