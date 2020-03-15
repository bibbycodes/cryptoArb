require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const Format = require('./Format')

class Monitor {
  constructor(exchange){
    if (exchange) {
      this.exchange = exchange.toLowerCase()
    }

    this.pairs = []
    this.cbPrice = 0
    this.bnPrice = 0
    this.krPrice = 0
    this.arbDiff = 0
    this.arbRate = 0
  }

  monitor(symbols) {
    symbols = Format.symbols(symbols, this.exchange)
    if (this.exchange == "kraken") {
      this.krTicker(symbols)
    }

    if (this.exchange == "coinbase") {
      this.cbTicker(symbols)
    }

    if (this.exchange == "binance") {
      this.bnTicker(symbols)
    }
  }

  cbTicker(symbols) {
    symbols = Format.symbols(symbols, "coinbase")
    for (let symbol of symbols) {
      this.pairs.push([symbol, "Coinbase"])
    }
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
        this.cbPrice = parseFloat(ticker.price)
        console.log({"Coinbase BTC/USD": this.cbPrice})
        this.compare(this.cbPrice, this.bnPrice, "USD/BTC on COINBASE to NGN/BTC on BINANCE")
        this.compare(this.cbPrice, this.krPrice, "USD/BTC on COINBASE to USD/BTC on KRAKEN")
      }
    })
  }

  krTicker(symbols) {
    symbols = Format.symbols(symbols, "kraken")
    for (let symbol of symbols) {
      this.pairs.push([symbol, "Kraken"])
    }

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
      if (!ticker.event) {
        this.krPrice = parseFloat(ticker[1].b[0])
        console.log({"Kraken BTC/USD": this.krPrice})
        this.compare(this.krPrice, this.cbPrice, "USD/BTC on KRAKEN to USD/BTC on COINBASE")
        this.compare(this.bnPrice, this.krPrice, "USD/BTC on KRAKEN to NGN/BTC on BINANCE")
      }
    })
  }

  bnTicker(symbols) {
    for (let symbol of symbols) {
      this.pairs.push([symbol, "Binance"])
      let binance = new ccxws.binance()
      const market = {
        id: symbol,
        base: symbol.slice(0, 3),
        quote: symbol.slice(3)
      }

      binance.subscribeTicker(market)
      binance.on("ticker", ticker => {
        this.bnPrice = parseFloat((ticker.last / 368.03).toFixed(2))
        console.log({"Binance NGN/BTC": this.bnPrice})
        this.compare(this.bnPrice, this.cbPrice, "NGN/BTC on BINANCE to USD/BTC on COINBASE")
        this.compare(this.bnPrice, this.krPrice, "NGN/BTC on BINANCE to USD/BTC on KRAKEN")
      })
    }
  }

  compare(priceA, priceB, name) {
    let relativeDifference = ((priceA - priceB) / (Math.max(priceA, priceB)) * 100).toFixed(2)
    let priceDiff = priceA - priceB
    let arbRate = ((priceDiff / priceB) * 100).toFixed(2)
    console.log(`Arb Rate for ${name} is ${arbRate}%`)
    console.log(`Relative Difference for ${name} is ${relativeDifference}%`)
    return [priceDiff, arbRate]
  }
}

monitor = new Monitor()
// monitor.cbTicker(['BTC-USD'])
// monitor.krTicker(['BTC/USD', 'BTC/EUR', 'ETH/USD'])
// monitor.bnTicker(['BTCNGN'])

monitor.bnTicker(['BTCNGN'])
monitor.cbTicker(['BTC-USD'])
monitor.krTicker(['BTC/USD'])

console.log(monitor.pairs)