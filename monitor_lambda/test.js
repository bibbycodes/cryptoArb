const Generate = require('./models/Generate')
const ccxt = require('ccxt')
const Arb = require('./models/Arb')
const flatten = require('array-flatten').flatten
const Combinatorics = require('js-combinatorics');


function calculateCompoundedAmount(startVal, arbRate, numIterations) {
  endVal = startVal
  for (i = 0; i < numIterations; i ++) {
    endVal += ((arbRate / 100) * startVal)
  }
}

async function fetchVolatileSet(exchange, minPercentage) {
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

async function getArbs(exchange, setOfCombinations) {
  exchange.loadMarkets().then(async markets => {
    // Get Set of all symbols for which tickers are needed => [ [ 'XRP/ETH', 'SNT/ETH', 'SNT/BTC', 'XRP/BTC' ] ]
    //  Get Set of sequential coins from all possible combinations
    let coinSequence = []
    let arrayOfSequentialTradeSymbols = setOfCombinations.map((coinSet) => {
      let tradeSymbols = Generate.sequentialSymbols(coinSet, markets)
      if (tradeSymbols) {
        coinSequence.push(coinSet)
        return tradeSymbols
      }
    }).filter(item => item != null)
  
    let setOfSymbols = Array.from(new Set(flatten(arrayOfSequentialTradeSymbols)))
    
    // Get set of async calls to fetch tickers
    let calls = setOfSymbols.map(async ticker => {
      return exchange.fetchTicker(ticker)
    })
    
    // Fetch all tickers in Parallel
    let tickers = await Promise.all(calls)
    
    // Convert Tickers to hash with symbols as keys
    let tickersObj = {}
    for (let ticker of tickers) {
      tickersObj[ticker.symbol] = ticker
    }
  
    // Generate Trade Instances using tickers (Each trade instance has prices and market details)
    let tradeSequences = coinSequence.map((coinSet) => {
      return Generate.sequentialTrades(coinSet, markets, tickersObj)
    })

    for (let tradeSequence of tradeSequences) {
      let arb = new Arb(tradeSequence)
      // console.log(arb.sequentialTrades)
    }
  })
}

// fetchVolatileSet(exchange, 10).then(set => {
//   let comb = Combinatorics.combination(set, 4);
//   let combinations = []
//   while(a = comb.next()) combinations.push(a);
//   getArbs(exchange, combinations)
// })

let exchange = new ccxt['binance']()
exchange.enableRateLimit = true
let midCryptos = ["MATIC", "ENJ", "ALGO", "BAT", "ARK", "XLM", "BAND", "KAVA", "ZRX", "IOTA", "RVN", "WAVES", "KNC", "ATOM", "BTG", "CHZ", "LSK", "QTUM", "LTO", "IOTX"]
let topCryptos = ["SNT", "BNB", "BTC", "IOTA", "ETH", "XRP", "BCH", "LTC", "EOS", "XZT", "LINK", "XMR", "XLM", "ADA", "TRX", "DASH"]
let topCurrencies = ["NGN", "RUB", "BUSD", "EUR", "TUSD", "TRY", "PAX", "USDC", 'GBP']

let largeSet = Array.from(new Set(topCryptos.concat(topCurrencies.concat(midCryptos))))

let comb = Combinatorics.combination(largeSet, 4);
let combinations = []
while(a = comb.next()) combinations.push(a);

getArbs(exchange, combinations)

