const ccxt = require('ccxt')
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

      if (markets[pair]) {
        let orderBook = await exchange.fetchOrderBook(pair)
        let timestamp = Date.now()

        let best =  {
          timestamp: timestamp,
          exchange: ex,
          pair : pair,
          ask : orderBook.asks[0][0],
          askVolume : orderBook.asks[0][1],
          bid : orderBook.bids[0][0],
          bidVolume : orderBook.bids[0][1]
        }

        let db = new dbConn()
        let queryString = Format.orderBookDbString(best)
        await db.query(queryString)

        return best
      } else {
        throw new Error('Pair not Present')
      }
    } catch (err){
      console.log(err)
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