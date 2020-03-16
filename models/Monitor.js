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
        this.symbols[`${ticker.product_id} Coinbase`] = ticker.price
        this.comparePairs(this.symbols)
      }

    // console.log(this.symbols)
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
        this.krPrice = parseFloat(ticker[1].b[0])
        console.log({"Kraken BTC/USD": this.krPrice})
        this.relativeDifference(this.krPrice, this.cbPrice, "USD/BTC on KRAKEN to USD/BTC on COINBASE")
        this.relativeDifference(this.bnPrice, this.krPrice, "USD/BTC on KRAKEN to NGN/BTC on BINANCE")
      }
    })
  }

  binanceTicker(symbols) {
    for (let symbol of symbols) {
      // this.pairs.push([symbol, "Binance"])
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
    console.log(this.symbols)
    for (const pair_name in pairs) {
      arrayOfPairs.push([pair_name, pairs[pair_name]])
    }
    for (let i = 0; i < arrayOfPairs.length; i++) {
      let priceA = arrayOfPairs[i][1]
      let nameA = arrayOfPairs[i][0]
      for (let j = 0; j < arrayOfPairs.length; j ++) {
        let priceB = arrayOfPairs[j][1]
        let nameB = arrayOfPairs[j][0]
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
  monitor.coinbaseTicker(pairs)
}

fetchCoinbasePairs()
// monitor.coinbaseTicker(['BTC-USD'])
// monitor.krakenTicker(['BTC/USD', 'BTC/EUR', 'ETH/USD'])
// monitor.binanceTicker(['BTCNGN'])

// monitor.binanceTicker(['BTCNGN'])
// monitor.coinbaseTicker(['BTC-USD', 'ETH-USD'])
// monitor.krakenTicker(['BTC/USD'])

// console.log(monitor.pairs)