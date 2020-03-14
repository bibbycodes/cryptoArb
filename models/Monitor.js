require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const Format = require('./Format')
// const coinbase = new ccxws.coinbasepro()
// const kraken = new ccxws.kraken()




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
    console.log(this.exchange)
    if (this.exchange == "kraken") {
      this.monitorKrTicker(symbols)
    }

    if (this.exchange == "coinbase") {
      this.monitorCbTicker(symbols)
    }

    if (this.exchange == "binance") {
      console.log("A")
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

    ws.on("message", message => {
      message = JSON.parse(message)
      if (message.event != "heartbeat") {
        console.log(message)
      }
    })
  }

  monitorBnTicker(symbols) {
    const binance = new ccxws.binance()
    console.log(symbols[0])
    const market = {
      id: symbols[0],
      base: symbols[0].slice(0, 3),
      quote: symbols[0].slice(3)
    }
    
    binance.subscribeTicker(market)
    
    binance.on("ticker", ticker => {
      console.log(ticker)
    })
  }
}

binance = new Monitor("Binance")
binance.monitor(['BTC/USD', 'BTC-EUR'])

kraken = new Monitor("Kraken")
kraken.monitor(['BTC/USD', 'BTC/EUR'])

cb = new Monitor("Coinbase")
cb.monitor(['BTC/USD', 'BTC/EUR'])