const Arb = require('./models/Arb')
const dbConn = require('./models/dbConn')
const ccxt = require('ccxt')
const Email = require('./models/Email')
const Fetch = require('./models/Fetch')
const Generate = require('./models/Generate')
const Format = require('./models/Format')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  let viableTrades = [ 
    [ 'XRP', 'SNT', 'ETH', 'BTC' ],
    [ 'XRP', 'SNT', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'XRP', 'SNT' ],
    [ 'ETH', 'BTC', 'SNT', 'XRP' ],
    [ 'BTC', 'ETH', 'XRP', 'SNT' ],
    [ 'BTC', 'ETH', 'SNT', 'XRP' ],
    [ 'SNT', 'XRP', 'ETH', 'BTC' ],
    [ 'SNT', 'XRP', 'BTC', 'ETH' ],
    [ 'LTC', 'SNT', 'ETH', 'BTC' ],
    [ 'LTC', 'SNT', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'LTC', 'SNT' ],
    [ 'ETH', 'BTC', 'SNT', 'LTC' ],
    [ 'BTC', 'ETH', 'LTC', 'SNT' ],
    [ 'BTC', 'ETH', 'SNT', 'LTC' ],
    [ 'SNT', 'LTC', 'ETH', 'BTC' ],
    [ 'SNT', 'LTC', 'BTC', 'ETH' ],
    [ 'LTC', 'XRP', 'ETH', 'BTC' ],
    [ 'LTC', 'XRP', 'BTC', 'ETH' ],
    [ 'XRP', 'LTC', 'ETH', 'BTC' ],
    [ 'XRP', 'LTC', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'LTC', 'XRP' ],
    [ 'ETH', 'BTC', 'XRP', 'LTC' ],
    [ 'BTC', 'ETH', 'LTC', 'XRP' ],
    [ 'BTC', 'ETH', 'XRP', 'LTC' ],
    [ 'EOS', 'SNT', 'ETH', 'BTC' ],
    [ 'EOS', 'SNT', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'EOS', 'SNT' ],
    [ 'ETH', 'BTC', 'SNT', 'EOS' ],
    [ 'BTC', 'ETH', 'EOS', 'SNT' ],
    [ 'BTC', 'ETH', 'SNT', 'EOS' ],
    [ 'SNT', 'EOS', 'ETH', 'BTC' ],
    [ 'SNT', 'EOS', 'BTC', 'ETH' ],
    [ 'EOS', 'XRP', 'ETH', 'BTC' ],
    [ 'EOS', 'XRP', 'BTC', 'ETH' ],
    [ 'XRP', 'EOS', 'ETH', 'BTC' ],
    [ 'XRP', 'EOS', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'EOS', 'XRP' ],
    [ 'ETH', 'BTC', 'XRP', 'EOS' ],
    [ 'BTC', 'ETH', 'EOS', 'XRP' ],
    [ 'BTC', 'ETH', 'XRP', 'EOS' ],
    [ 'EOS', 'LTC', 'ETH', 'BTC' ],
    [ 'EOS', 'LTC', 'BTC', 'ETH' ],
    [ 'LTC', 'EOS', 'ETH', 'BTC' ],
    [ 'LTC', 'EOS', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'EOS', 'LTC' ],
    [ 'ETH', 'BTC', 'LTC', 'EOS' ],
    [ 'BTC', 'ETH', 'EOS', 'LTC' ],
    [ 'BTC', 'ETH', 'LTC', 'EOS' ],
    [ 'LINK', 'SNT', 'ETH', 'BTC' ],
    [ 'LINK', 'SNT', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'LINK', 'SNT' ],
    [ 'ETH', 'BTC', 'SNT', 'LINK' ],
    [ 'BTC', 'ETH', 'LINK', 'SNT' ],
    [ 'BTC', 'ETH', 'SNT', 'LINK' ],
    [ 'SNT', 'LINK', 'ETH', 'BTC' ],
    [ 'SNT', 'LINK', 'BTC', 'ETH' ],
    [ 'LINK', 'XRP', 'ETH', 'BTC' ],
    [ 'LINK', 'XRP', 'BTC', 'ETH' ],
    [ 'XRP', 'LINK', 'ETH', 'BTC' ],
    [ 'XRP', 'LINK', 'BTC', 'ETH' ],
    [ 'ETH', 'BTC', 'LINK', 'XRP' ],
    [ 'ETH', 'BTC', 'XRP', 'LINK' ],
    [ 'BTC', 'ETH', 'LINK', 'XRP' ],
    [ 'BTC', 'ETH', 'XRP', 'LINK' ],
  ]

  let binanceTrades = [
    [ 'EUR', 'NGN', 'BTC', 'BNB' ],
    [ 'NGN', 'EUR', 'BTC', 'BNB' ],
    [ 'EUR', 'NGN', 'BTC', 'BUSD' ],
    [ 'NGN', 'EUR', 'BTC', 'BUSD' ],
    [ 'EUR', 'NGN', 'BUSD', 'BNB' ],
    [ 'NGN', 'EUR', 'BUSD', 'BNB' ],
    [ 'EUR', 'NGN', 'BNB', 'BTC' ],
    [ 'NGN', 'EUR', 'BNB', 'BTC' ],
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
    [ 'EOS', 'QTUM', 'BNB', 'ETH' ],
    [ 'QTUM', 'EOS', 'BNB', 'ETH' ],
    [ 'SNT', 'LTC', 'ETH', 'BTC' ],
    [ 'LTC', 'SNT', 'ETH', 'BTC' ],
    [ 'SNT', 'BNB', 'ETH', 'BTC' ],
    [ 'BNB', 'SNT', 'ETH', 'BTC' ],
    [ 'SNT', 'NEO', 'ETH', 'BTC' ],
    [ 'NEO', 'SNT', 'ETH', 'BTC' ],
    [ 'SNT', 'QTUM', 'ETH', 'BTC' ],
    [ 'QTUM', 'SNT', 'ETH', 'BTC' ],
    [ 'SNT', 'EOS', 'ETH', 'BTC' ],
    [ 'EOS', 'SNT', 'ETH', 'BTC' ],
    [ 'BNT', 'LTC', 'ETH', 'BTC' ],
    [ 'LTC', 'BNT', 'ETH', 'BTC' ],
    [ 'BNT', 'BNB', 'ETH', 'BTC' ],
    [ 'KMD', 'BNB', 'ETH', 'BTC' ],
    [ 'IOTX', 'BNB', 'ETH', 'BTC' ],
    [ 'KMD', 'BNB', 'ETH', 'BTC' ],
    [ 'ZEN', 'BNB', 'ETH', 'BTC' ],
    [ 'NKN', 'ETH', 'BTC', 'BNB' ],
    [ 'NKN', 'LTC', 'BTC', 'BNB' ],
    [ 'NKN', 'ETH', 'BTC', 'BNB' ],
    [ 'KMD', 'BNB', 'ETH', 'BTC' ],
    [ 'IOTX', 'LTC', 'BTC', 'ETH' ],
    [ 'SOL', 'LTC', 'BNB', 'BTC' ],
    [ 'NKN', 'LTC', 'BNB', 'BTC' ],
    [ 'ARK', 'BNB', 'BTC', 'ETH' ],
    [ 'NEO', 'BNT', 'ETH', 'BTC' ],
    [ 'BNT', 'QTUM', 'ETH', 'BTC' ],
    [ 'QTUM', 'BNT', 'ETH', 'BTC' ],
    [ 'BNT', 'EOS', 'ETH', 'BTC' ],
    [ 'EOS', 'BNT', 'ETH', 'BTC' ],
    [ 'BNT', 'SNT', 'ETH', 'BTC' ],
    [ 'SNT', 'BNT', 'ETH', 'BTC' ],
    [ 'USDT', 'LTC', 'ETH', 'BTC' ],
    [ 'LTC', 'USDT', 'ETH', 'BTC' ],
  ]

// let volatile = await Fetch.viableVolatileTrades(ex)

async function test(ex, data) {
  
  let exchange = new ccxt[ex]()
  let markets = await exchange.loadMarkets()
  let recipients = ['admin@afriex.co', 'scrapyscraperng@gmail.com']
  for (let trade of data) {
    await sleep(500);

    let tradePairs = Generate.validatedTradePairs(trade[0], trade[1], trade[2], trade[3], markets)
    let arb = new Arb(tradePairs)

    arb.getRates(ex)
      .then(rates => {
        let arbRate = arb.getArb(1000)
        // console.log(`Arb Rate: ${arbRate[0]}`, `Coins: ${trade}`)
        return {rates, arbRate, tradePairs}
      })
      .then(async result => {
        let rates = result.rates
        let arbRate = result.arbRate
        let tradePairs = result.tradePairs
        let queryString = Format.arbDbString(trade[0], trade[1], trade[2], trade[3], rates, arbRate)
        let db = new dbConn()
        await db.query(queryString)
        return { rates, arbRate, tradePairs }
      })
      .catch(err => console.log(err.message))
}
  
}

async function run(exchanges, trades) {
  for (let exchange of exchanges) {
    await test(exchange, trades).then(console.log("Done"))
  }
}

exports.func = () => {
  run(['bittrex'], viableTrades)
  run(['binance'], binanceTrades)
}





// .then(async result => {
  //   let rates = result.rates
  //   let arbRate = result.arbRate
  //   let tradePairs = result.tradePairs
  //   let queryString = Format.arbDbString(trade[0], trade[1], trade[2], trade[3], rates, arbRate)
  //   let db = new dbConn()
  //   await db.query(queryString)
//   let endTime = Date.now()
//   console.log(`Time elapsed for ${trade}: ${endTime - startTime}ms`)
//   return { rates, arbRate, tradePairs }
// })
// .then(async res => {
//   let message = `ArbRate: ${res.arbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
//   await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BUSD EUR NGN: ${res.arbRate}`, message)
// })