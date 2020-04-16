const ccxt = require('ccxt')
const Validate = require('./Validate')
const Format = require('./Format')
const Calculate = require('./Calculate')
const Fetcher = require('./Fetcher')
const dbConn = require('./dbConn')
const axios = require('axios')

class MonitorRest {
  static async orderBook(ex, pair) {
    try {
      let exchange = new ccxt[ex]()
      let markets = await exchange.loadMarkets()
      
      if (!markets[pair]) { 
        pair = Validate.switchPairs(pair)
      }
        let orderBook = await exchange.fetchOrderBook(pair)
        let timestamp = Date.now()
        let crypto = pair.split('/')[0]
        let curr = pair.split('/')[1]
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
    console.log(tickerObj)
    return tickerObj
  }
}

module.exports = MonitorRest