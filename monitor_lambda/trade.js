const ccxt = require('ccxt')
const Validate = require('./models/Validate')
require('dotenv').config({ path: './.env'});
const Binance = require('node-binance-api');
const Parse = require('./models/Parse')
const Trade = require('./models/Trade')


const exchangeId = 'binance'
const exchangeClass = ccxt[exchangeId]
const exchange = new exchangeClass ({
    'apiKey': process.env.BN_KEY,
    'secret': process.env.BN_SECRET,
    'timeout': 30000,
    'enableRateLimit': true,
  })

// fetch balance => {
//   0.1 btc
//   STEEM/BTC
// }


  
exchange.loadMarkets().then(async markets => {
  let symbol = "STEEM/BTC"
  let marketDetails = Validate.correctPair(markets, "STEEM", "BTC")
  let parsedMarket = Parse.trade(marketDetails, "STEEM", "BTC")
  let ticker = await exchange.fetchTicker(marketDetails.symbol)
  ticker = { "STEEM/BTC" : ticker}
  let trade = new Trade(parsedMarket, ticker)
  let order = await trade.executeMarketOrder(exchange, 97)
  // console.log(order)
  // console.log(order.status)
})

// 0.1511
// ATOM/BNB
// amountOfBase / qoute price
// 1000 X 0.1511
// 1000 ATOM  => 151 BNB

let symbol = "STEEM/BTC"

// let amount = 0.001935
// console.log(amount)
// exchange.create_market_buy_order(symbol, 1).then(order => {
//   while (order.status != "closed") {
//     console.log(order.status)
//   }

// // // //   console.log(order)
// }).catch(err => console.log(err))
