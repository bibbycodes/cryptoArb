const ccxt = require('ccxt')

// let exchanges = ccxt.exchanges

let requiredUtilities = [
  // 'CORS',
  // 'publicAPI',
  // 'privateAPI',
  // 'cancelOrder',
  // 'createDepositAddress',
  // 'createOrder',
  // 'deposit',
  // 'fetchBalance',
  // 'fetchClosedOrders',
  // // 'fetchCurrencies',
  // 'fetchDepositAddress',
  // 'fetchMarkets',
  // 'fetchMyTrades',
  // 'fetchOHLCV',
  // 'fetchOpenOrders', 
  // 'fetchOrder',
  // 'fetchOrderBook',
  // 'fetchOrders',
  // 'fetchStatus',
  'fetchTicker',
  // 'fetchTickers',
  // 'fetchBidsAsks',
  // 'fetchTrades',
  // 'withdraw',
]

let exchanges = ['binance', 'coinbasepro', 'kraken', 'coinbaseprime', 'bittrex']
let pairs = ['BTC/USD', 'BTC/EUR', 'BTC/GBP', 'ETH/USD', 'ETH/EUR', 'ETH/GBP']



async function ticker() { 
  let returned = {
    tickers : [],
    books: []
  }
  for (let ex of exchanges) {
    
    exchange = new ccxt[ex]()
    try {
      for (let pair of pairs) {
        let ticker = await exchange.fetchTicker(pair).catch(err => console.log(err))
        
        let tickerObj = {
          exchange : exchange.name,
          ask: ticker.ask,
          bid: ticker.bid,
          last: ticker.last,
          open: ticker.open,
          close: ticker.close,
          timestamp: ticker.timestamp,
        }

        let orderBook = await exchange.fetchOrderBook(pair)

        let best =  {
          exchange: ex,
          ticker: ticker.last,
          pair : pair,
          bestAsk : orderBook.asks[0],
          bestBid : orderBook.bids[0]
        }
      
        console.log(best, tickerObj.bestAsk, tickerObj.bestBid)
        returned.tickers.push(tickerObj)
        returned.books.push(best)
      }
     
      // if (ex == 'coinbasepro') {
      //   console.log(ticker)
      // }
      // let tickerObj = {
      //   exchange : exchange.name,
      //   ask: ticker.ask,
      //   bid: ticker.bid,
      //   last: ticker.last,
      //   open: ticker.open,
      //   close: ticker.close,
      //   timestamp: ticker.timestamp,
      // }
      // console.log(tickerObj)
    } catch (err) {
      continue
    }
  }
  console.log(returned.tickers.length, returned.books.length, returned)
}

ticker()