require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const Format = require('./Format')
const axios = require("axios")

class Monitor {
  constructor(exchange){
    if (exchange) {
      this.exchange = exchange.toLowerCase()
    }

    this.pairs = []
    this.symbols = {}
    this.cbPrice = 0
    this.bnPrice = 0
    this.krPrice = 0
    this.arbDiff = 0
    this.arbRate = 0
  }

  monitor(symbols) {
    symbols = Format.symbols(symbols, this.exchange)
    if (this.exchange == "kraken") {
      this.krakenTicker(symbols)
    }

    if (this.exchange == "coinbase") {
      this.coinbaseTicker(symbols)
    }

    if (this.exchange == "binance") {
      this.binanceTicker(symbols)
    }
  }

  coinbaseTicker(symbols) {
    symbols = Format.symbols(symbols, "coinbase")
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
        let price = parseFloat(ticker.price)
        let quote = ticker.product_id.split("-")[1]
        let base = ticker.product_id.split("-")[0]
        this.symbols[`${ticker.product_id} coinbase`] = {
          price: price,
          pair: ticker.product_id,
          exchange: "coinbase",
          base: base,
          quote: quote
        }
        this.comparePairs(this.symbols)
      }
    })
  }

  async fetchPairsCoinbase() {
    let base_url = "https://api.pro.coinbase.com"
    let response = await axios.get(base_url + '/products')
    let pairs = response.data.map(pair => pair.id)
    return pairs
  }

  krakenTicker(symbols) {
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
        let price = parseFloat(ticker[1].b[0])
        let pair = ticker[3]
        let base = pair.split("/")[0]
        let quote = pair.split("/")[1]
        this.symbols[`${pair} kraken`] = {
          price: price,
          pair: pair,
          exchange: "kraken",
          base: base,
          quote: quote
        }
        this.comparePairs(this.symbols)
      }
    })
  }

  binanceTicker(symbols) {
    for (let symbol of symbols) {
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
        this.relativeDifference(this.bnPrice, this.cbPrice, "NGN/BTC on BINANCE to USD/BTC on COINBASE")
        this.relativeDifference(this.bnPrice, this.krPrice, "NGN/BTC on BINANCE to USD/BTC on KRAKEN")
      })
    }
  }

  comparePairs(pairs) {
    let arrayOfPairs = []
    // convert object to array
    for (const pair_name in pairs) {
      arrayOfPairs.push(pairs[pair_name])
    }
    for (let i = 0; i < arrayOfPairs.length; i++) {
      let priceA = arrayOfPairs[i].price
      let nameA = `${arrayOfPairs[i].pair} ${arrayOfPairs[i].exchange}`

      for (let j = 0; j < arrayOfPairs.length; j ++) {
        let priceB = arrayOfPairs[j].price
        let nameB = `${arrayOfPairs[j].pair} ${arrayOfPairs[j].exchange}`
        this.relativeDifference(priceA, priceB, `${nameA} to ${nameB}`)
      }
    }
  }

  relativeDifference(priceA, priceB, message) {
    let relativeDifference = ((priceA - priceB) / (Math.max(priceA, priceB)) * 100).toFixed(2)
    console.log(`Arb Rate for ${message} is ${relativeDifference}%`)
    return [relativeDifference]
  }
}


async function fetchCoinbasePairs() {
  let monitor = new Monitor()
  let pairs = await monitor.fetchPairsCoinbase()
  monitor.krakenTicker(['BTC/USD', 'BTC/EUR', 'ETH/USD'])
  monitor.coinbaseTicker(pairs)
}

fetchCoinbasePairs()
// monitor.coinbaseTicker(['BTC-USD'])
// monitor.binanceTicker(['BTCNGN'])

// monitor.binanceTicker(['BTCNGN'])
// monitor.coinbaseTicker(['BTC-USD', 'ETH-USD'])
// monitor.krakenTicker(['BTC/USD'])

// console.log(monitor.pairs)