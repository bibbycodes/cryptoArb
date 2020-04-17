const axios = require('axios')
const xpath = require('xpath')
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const dom = require('xmldom').DOMParser
const ccxt = require('ccxt')
require('dotenv').config()

class Fetch {
  static async fetchVolatileSet(exchangeName, minPercentage) {
    let exchange = ccxt[exchangeName]()
    let cryptos = []
    let tickers = await exchange.fetchTickers()
  
    for (ticker in tickers) {
      let tickerObj = tickers[ticker]
      let percentage = tickerObj.percentage
      let symbol = tickerObj.symbol
      if (percentage >= minPercentage) {
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
  
}
module.exports = Fetch