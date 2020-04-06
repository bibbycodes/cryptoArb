require('dotenv').config()
const WebSocket = require('ws')
const MonitorRest = require('./MonitorRest')
const ccxws = require('ccxws');
const Format = require('./Format')
const Calculate = require('./Calculate')
const Generate = require('./Generate')
const Fetcher = require('./Fetcher')
const DB = require('./dbConn')
const ccxt = require('ccxt')

class MonitorWs {
  constructor(exchange){
    this.exchange = exchange
    this.pairs = []
    this.symbols = {}
  }

  monitor(symbols) {
    symbols = Format.symbols(symbols, this.exchange)
    if (this.exchange == 'kraken') {
      this.krakenTicker(symbols)
    }

    if (this.exchange == 'coinbase') {
      this.coinbaseTicker(symbols)
    }

    if (this.exchange == 'binance') {
      this.binanceTicker(symbols)
    }
  }

  coinbaseTicker(symbols) {
    symbols = Format.symbols(symbols, 'coinbase')
    const wsUrl = 'wss://ws-feed-public.sandbox.pro.coinbase.com'
    const ws = new WebSocket(wsUrl)
    
    const subscribePayload = {
      'type': 'subscribe',
      'product_ids': symbols,
      'channels': [
        'ticker',
      ]
    }

    ws.on('open', () => {
      ws.send(JSON.stringify(subscribePayload))
    })
   
    ws.on('message', async (ticker) => {
      ticker = JSON.parse(ticker)
      if (ticker.type == 'ticker') {
        let queryString = Format.coinbaseTickerDbString(ticker, 'coinbase')
        let db = new DB()
        db.query(queryString)
        let price = parseFloat(ticker.price)
        let quote = ticker.product_id.split('-')[1]
        let base = ticker.product_id.split('-')[0]
        // key has been deleted
        let exchangeRate = await Fetcher.transferWiseRates('USD', quote)
        price = price/parseFloat(exchangeRate)
        let tickerObject = Format.tickerObject(price, ticker.product_id, 'coinbase', base, quote)
        this.symbols[`${ticker.product_id} coinbase`] = tickerObject
        this.comparePairs(this.symbols)
      }
    })
  }

  krakenTicker(symbols) {
    symbols = Format.symbols(symbols, 'kraken')
    for (let symbol of symbols) {
      this.pairs.push([symbol, 'Kraken'])
    }

    const wsUrl = 'wss://ws.kraken.com'
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      'event': 'subscribe',
      'pair': symbols,
      'subscription': {
        'name': 'ticker'
      }
    }

    ws.on('open', () => {
      ws.send(JSON.stringify(subscribePayload))
    })

    ws.on('message', async (ticker) => {
      ticker = JSON.parse(ticker)
      if (!ticker.event) {
        let queryString = Format.krakenTickerDbString(ticker)
        let db = new DB()
        db.query(queryString)
        let price = parseFloat(ticker[1].b[0])
        let pair = ticker[3]
        let base = ticker[3].split('/')[0]
        let quote = ticker[3].split('/')[1]
        let exchangeRate = await Fetcher.transferWiseRates('USD', quote)
        price = price/parseFloat(exchangeRate)
        let tickerObject = Format.tickerObject(price, pair, 'kraken', base, quote)
        this.symbols[`${pair} kraken`] = tickerObject
        this.comparePairs(this.symbols)
      }
    })
  }

  binancePairs(fiat_currencies, crypto, converter) {
    for (let i of fiat_currencies) {
      for (let j of fiat_currencies) {
        console.log(i, j)
        if (i == j) {
          break
        }
        console.log(Generate.tradePairs(i, j, crypto, converter))
      }
      // let base = symbol[0]
      // let quote = symbol[1]
      console.log(crypto, i)
      this.tickerBinance(crypto, i, converter)
    }
  }

  async tickerBinance(crypto, fiat, converter) {
    let binance = new ccxws.binance()
    let binanceRest = new ccxt['binance']()
    let markets = binanceRest.loadMarkets()

    const market = {
      id: `${crypto}${fiat}`,
      base: crypto,
      quote: fiat
    }

    binance.subscribeTicker(market)
    binance.on('ticker', async (ticker) => {
      let pair = `${ticker.quote}-${ticker.base}`
      let queryString = Format.binanceTickerDbString(ticker)
      let db = new DB()
      db.query(queryString)
      let price = parseFloat((ticker.last))

      let converterPair = `${converter}/${ticker.quote}`
      let validPairs = ["BUSD/USDT", "BUSD/NGN", "BNB/USDT", "BNB/EUR", "BNB/NGN", "BUSB/EUR"]

      if ((validPairs.includes(converterPair))) {
        let converterRate = await MonitorRest.ticker('binance', converterPair)
        let exchangeRate = converterRate.last
        price = price/parseFloat(exchangeRate)
      } else {
        converterPair = `${ticker.quote}/${converter}`
        let converterRate = await MonitorRest.ticker('binance', converterPair)
        let exchangeRate =  converterRate.last
        price = price * parseFloat(exchangeRate)
      }
      
      let tickerObject = Format.tickerObject(price, pair, 'binance', ticker.base, ticker.quote, converter)
      this.symbols[`${pair} binance`] = tickerObject
      this.comparePairs(this.symbols)
    })
  }

  comparePairs(pairs) {
    // console.log(pairs)
    let arrayOfPairs = []
    let matrix = []

    // convert object to array
    for (const pair_name in pairs) {
      arrayOfPairs.push(pairs[pair_name])
    }

    // compare all pairs
    for (let i = 0; i < arrayOfPairs.length; i++) {
      let source = arrayOfPairs[i].price
      let sub_arr = []
      for (let j = 0; j < arrayOfPairs.length; j ++) {
        let target = arrayOfPairs[j].price
        sub_arr.push(Calculate.relativeDifference(source, target))
        if (i == j) {
          continue
        } else {
          Calculate.relativeDifference(source, target)
        }
      }
      
      matrix.push(sub_arr)
      console.log(Format.matrix(matrix))
      Format.matrix(matrix)
    }
  }
}

let monitorWs = new MonitorWs()