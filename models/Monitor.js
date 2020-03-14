require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const Format = require('./Format')
const binance = new ccxws.binance()
const coinbase = new ccxws.coinbasepro()
const kraken = new ccxws.kraken()

const market = {
  id: "BTCUSDT",
  base: "BTC",
  quote: "USDT"
}

// binance.subscribeTicker(market)

// binance.on("ticker", snapshot => {
//   console.log(snapshot)
// })


class Monitor {
  constructor(exchange){
    this.exchange = exchange.toLowerCase()
    this.pk = process.env.CB_PK
    this.sk = process.env.CB_SK
    this.passphrase = process.env.CB_PASS
    this.apiUrl = "https://api-public.sandbox.pro.coinbase.com"
  }

  monitor(symbols) {
    symbols = Format.symbols(symbols, this.exchange)
    if (this.exchange == "kraken") {
      this.monitorKR(symbols)
    }

    if (this.exchange == "coinbase") {
      this.monitorCB(symbols)
    }

    // if (this.exchange == "Binance") {

    // }
  }

  monitorCB(symbols) {
    const wsUrl = "wss://ws-feed-public.sandbox.pro.coinbase.com"
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      "type": "subscribe",
      "product_ids": symbols,
      "channels": [
        "ticker",
        "level2",
      ]
    }

    ws.on('open', () => {
      ws.send(JSON.stringify(subscribePayload))
    })
   
    ws.on('message', message => {
      message = JSON.parse(message)
      if (message.type == "ticker") {
        console.log(message)
      }

      if (message.type == "snapshot") {
        console.log(message)
      }

      if (message.type == "l2update") {
        console.log(message)
      }
    })
  }

  monitorKR(symbols) {
    const wsUrl = "wss://ws.kraken.com"
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      "event": "subscribe",
      "pair": symbols,
      "subscription": {
        "name": "ticker"
      }
    }

    ws.on("open", () => {
      ws.send(JSON.stringify(subscribePayload))
    })

    ws.on("message", message => {
      message = JSON.parse(message)
      if (message.event != "heartbeat") {
        console.log(message)
      }
    })
  }
}

kr = new Monitor("Kraken")
console.log(kr)
kr.monitor(['BTC/USD', 'BTC-EUR'])

// kr.monitorKR(['BTC/USD', 'BTC/EUR'])
// cb.monitorCB(['BTC-USD', 'BTC-EUR'])