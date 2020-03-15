require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const Format = require('./Format')

class Monitor {
  constructor(exchange){
    this.exchange = exchange.toLowerCase()
    this.cbPrice = 0
    this.bnPrice = 0
    this.krPrice = 0
    this.arbDiff = 0
    // this.pk = process.env.CB_PK
    // this.sk = process.env.CB_SK
    // this.passphrase = process.env.CB_PASS
    // this.apiUrl = "https://api-public.sandbox.pro.coinbase.com"
  }

  monitor(symbols) {
    symbols = Format.symbols(symbols, this.exchange)
    console.log(this.exchange)
    if (this.exchange == "kraken") {
      this.monitorKrTicker(symbols)
    }

    if (this.exchange == "coinbase") {
      this.monitorCbTicker(symbols)
    }

    if (this.exchange == "binance") {
      this.monitorBnTicker(symbols)
    }
  }

  monitorCbTicker(symbols) {
    const wsUrl = "wss://ws-feed-public.sandbox.pro.coinbase.com"
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      "type": "subscribe",
      "product_ids": symbols,
      "channels": [
        "ticker",
      ]
    }

    ws.on('open', () => {
      ws.send(JSON.stringify(subscribePayload))
    })
   
    ws.on('message', ticker => {
      ticker = JSON.parse(ticker)
      if (ticker.type == "ticker") {
        console.log("Coinbase", ticker)
      }

      // if (message.type == "snapshot") {
      //   console.log(message)
      // }

      // if (message.type == "l2update") {
      //   console.log(message)
      // }
    })
  }

  monitorKrTicker(symbols) {
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

    ws.on("message", ticker => {
      ticker = JSON.parse(ticker)
      if (ticker.event != "heartbeat") {
        // console.log(Object.keys(ticker))
        console.log("Kraken", ticker)
      }
    })
  }

  monitorBnTicker(symbols) {
    for (let symbol of symbols) {
      let binance = new ccxws.binance()
      const market = {
        id: symbol,
        base: symbol.slice(0, 3),
        quote: symbol.slice(3)
      }

      binance.subscribeTicker(market)
      binance.on("ticker", ticker => {
        // console.log(Object.keys(ticker))
        // console.log("Binance", ticker)
        this.bnPrice = ticker.last / 470
        console.log(this.bnPrice)
      })
    }
  }

  monitorArbRate() {
    this.arbDiff = (this.bnPrice - this.cbPrice)
    console.log(this.arbDiff)
  }
}

monitor = new Monitor("Binance")
// cb = new Monitor("Coinbase")
// kraken = new Monitor("Kraken")

binance.monitor(['BTC-NGN'])
// cb.monitor(['BTC/USD'])
// kraken.monitor(['BTC/USD'])