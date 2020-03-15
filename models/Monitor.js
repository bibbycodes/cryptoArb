require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const Format = require('./Format')

class Monitor {
  constructor(exchange){
    // this.exchange = exchange.toLowerCase() || ""
    this.pairs = []
    this.symbols = {
      "coinbase": null,
      "kraken": null,
      "binance": null
    }
    this.cbPrice = 0
    this.bnPrice = 0
    this.krPrice = 0
    this.arbDiff = 0
    this.arbRate = 0
  }

  monitor(symbols) {
    symbols = Format.symbols(symbols, this.exchange)
    console.log(this.exchange)
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
        // console.log("Coinbase", ticker)
        this.cbPrice = ticker.price
        this.compare(this.cbPrice, this.bnPrice, "USD_COINBASE : NGN_BINANCE")
        this.compare(this.cbPrice, this.krPrice, "USD_COINBASE : USD_KRAKEN")
        // this.calcArbRate()
      }

      // if (message.type == "snapshot") {
      //   console.log(message)
      // }

      // if (message.type == "l2update") {
      //   console.log(message)
      // }
    })
  }

  krTicker(symbols) {
    symbols = Format.symbols(symbols, "kraken")
    for (let symbol of symbols) {
      this.pairs.push([symbol, "Kraken"])
    }

    console.log(this.pairs)

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
        // console.log(Object.keys(ticker))
        this.krPrice = ticker[1].b[0]
        console.log("Kraken", this.krPrice)
        // this.symbols["kraken"][ticker[3]] = ticker[1].b[0]
        this.compare(this.krPrice, this.cbPrice, "USD_KRAKEN : USD_COINBASE")
        this.compare(this.bnPrice, this.krPrice, "USD_KRAKEN : NGN_BINANCE")
      }
    })
  }

  bnTicker(symbols) {
    for (let symbol of symbols) {
      this.pairs.push([symbol, "Binance"])
      console.log(this.pairs)
      let binance = new ccxws.binance()
      const market = {
        id: symbol,
        base: symbol.slice(0, 3),
        quote: symbol.slice(3)
      }

      binance.subscribeTicker(market)
      binance.on("ticker", ticker => {
        console.log("Binance", symbol, ticker.last / 368)
        this.bnPrice = ticker.last / 368.03
        // // console.log("Binanace NGN as USD", this.bnPrice)
        this.compare(this.bnPrice, this.cbPrice, "NGN_BINANCE : USD_COINBASE")
        this.compare(this.bnPrice, this.krPrice, "NGN_BINANCE : USD_KRAKEN")
      })
    }
  }

  calcArbRate() {
    this.arbDiff = (this.bnPrice - this.cbPrice)
    this.arbRate = (this.arbDiff / this.cbPrice) * 100
    // console.log("Arb Diff", `$${this.arbDiff}`)
    console.log("Arb Rate", `${this.arbRate}%`)
    return [this.arbDiff, this.arbRate]
  }

  compare(priceA, priceB, name) {
    let priceDiff = priceA - priceB
    let arbRate = (priceDiff / priceB) * 100
    // console.log(`Price Difference for ${name}: $${priceDiff}`)
    console.log(`Arb Rate for ${name}: ${arbRate}%`)
    // console.log(`Pairs: ${this.pairs}`)
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

// cb = new Monitor("Coinbase")
// kraken = new Monitor("Kraken")

// cb.monitor(['BTC/USD'])
// kraken.monitor(['BTC/USD'])