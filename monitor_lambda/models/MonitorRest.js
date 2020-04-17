const ccxt = require('ccxt')
const Validate = require('./Validate')
const Format = require('./Format')
const Calculate = require('./Calculate')
const Fetcher = require('./Fetcher')
const dbConn = require('./dbConn')
const axios = require('axios')

class MonitorRest {
  // issue here

  static async orderBook(ex, pair) {
    try {
      let exchange = new ccxt[ex]()
      let markets = await exchange.loadMarkets()
      let splitPair = pair.split('/')
      let pairDetails = Validate.correctPair(markets, splitPair[1], splitPair[0])
      let symbol = pairDetails.symbol

      if(pair != false) {
        let orderBook = await exchange.fetchOrderBook(symbol)
        let timestamp = Date.now()

        let best =  {
          timestamp: timestamp,
          exchange: ex,
          pair : pair,
          ask : orderBook.asks[0][0],
          askVolume : orderBook.asks[0][1],
          bid : orderBook.bids[0][0],
          bidVolume : orderBook.bids[0][1],
        }

        return best
      } else {
        throw new Error('Could not fetch order books')
      }
      
    } catch (err){
      throw new Error(`Pair not Present: Pair ${pair}`)
      // return err.message
    }
  }

  static async ticker(ex, pair) {
    let exchange = new ccxt[ex]()
    let ticker = await exchange.fetchTicker(pair).catch(err => console.log(err))
    let tickerObj = {
      exchange : ex,
      pair: pair,
      ask: ticker.ask,
      bid: ticker.bid,
      last: ticker.last,
      open: ticker.open,
      close: ticker.close,
      timestamp: ticker.timestamp,
    }
    return tickerObj
  }
}

module.exports = MonitorRest