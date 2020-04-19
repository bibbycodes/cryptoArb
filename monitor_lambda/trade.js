const ccxt = require('ccxt')
require('dotenv').config({ path: './.env'});
const Binance = require('node-binance-api');


const exchangeId = 'binance'
const exchangeClass = ccxt[exchangeId]
const exchange = new exchangeClass ({
    'apiKey': process.env.BN_KEY,
    'secret': process.env.BN_SECRET,
    'timeout': 30000,
    'enableRateLimit': true,
  })


let symbol = "STEEM/BTC"
// buy 1 BTC/USD for $2500, you pay $2500 and receive ฿1 when the order is closed
exchange.create_market_buy_order(symbol, 97).then(order => {
  while (order.status != "closed") {
    console.log(order.status)
  }

  console.log(order)
}).catch(err => console.log(err))
