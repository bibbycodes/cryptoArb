const axios = require('axios')
const xpath = require('xpath')
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const Generate = require('./Generate')
const ccxt = require('ccxt')
require('dotenv').config()

class Fetch {
  static async volatileSet(exchangeName, minPercentagePriceChange) {
    let exchange = new ccxt[exchangeName]()
    let cryptos = []
    let tickers = await exchange.fetchTickers()
  
    for (let ticker in tickers) {

      let tickerObj = tickers[ticker]
      let percentage = tickerObj.percentage
      let symbol = tickerObj.symbol
      if (Math.abs(percentage) >= minPercentagePriceChange) {
        console.log(Math.abs(percentage), symbol)
        let symbolSplit = symbol.split('/')
        let crypt1 = symbolSplit[0]
        let crypt2 = symbolSplit[1]

        if (!cryptos.includes(crypt1)) {
          cryptos.push(crypt1)
        }
  
        if (!cryptos.includes(crypt2)) {
          cryptos.push(crypt2)
        }
      }
    }
    
    return cryptos
  }

  static async viableVolatileTrades(exchangeName) {
    let set = await Fetch.volatileSet(exchangeName, 5)
    let exchange = new ccxt[exchangeName]()
    let viable = []
    let markets = await exchange.loadMarkets()
    let combinations = Generate.combination(set)
    for (let combo of combinations) {
      // let permutated = Generate.permutations(combo)
      // for (let perm of permutated) {
        try {
          let tradeSet = Generate.validatedTradePairs(combo[0], combo[1], combo[2], combo[3], markets)
          viable.push([combo[0], combo[1], combo[2], combo[3]])
        } catch (err) {
          1 + 1
        }
      // }
    }

    return viable
  }
}

// Fetch.viableVolatileTrades('binance').then(set => console.log(set))
module.exports = Fetch