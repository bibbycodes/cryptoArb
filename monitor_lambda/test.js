const Generate = require('./models/Generate')
const Validate = require('./models/Validate')
const ccxt = require('ccxt')
const Trade = require('./models/Trade')
const Arb = require('./models/Arb')
const flatten = require('array-flatten').flatten
const Combinatorics = require('js-combinatorics');

let binanceTrades = [
  [ 'EUR', 'NGN', 'BTC', 'BNB' ],
  [ 'NGN', 'EUR', 'BTC', 'BNB' ],
  [ 'EUR', 'NGN', 'BTC', 'BUSD' ],
  [ 'NGN', 'EUR', 'BTC', 'BUSD' ],
  [ 'EUR', 'NGN', 'BUSD', 'BNB' ],
  [ 'NGN', 'EUR', 'BUSD', 'BNB' ],
  [ 'EUR', 'NGN', 'BNB', 'BTC' ],
  [ 'BUSD', 'BNB', 'NGN', 'EUR'],
  [ 'BNB', 'BTC', 'EUR', 'NGN', ],
  [ 'NGN', 'EUR', 'BNB', 'BTC' ],
  [ 'SNT', 'NEO', 'ETH', 'BTC' ],
  [ 'NEO', 'SNT', 'ETH', 'BTC' ],
  [ 'BNB', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'BNB', 'ETH', 'BTC' ],
  [ 'ETH', 'BNB', 'LTC', 'BTC' ],
  [ 'BTC', 'BNB', 'LTC', 'ETH' ],
  [ 'NEO', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'NEO', 'ETH', 'BTC' ],
  [ 'NEO', 'BNB', 'ETH', 'BTC' ],
  [ 'BNB', 'NEO', 'ETH', 'BTC' ],
  [ 'ETH', 'NEO', 'BNB', 'BTC' ],
  [ 'BTC', 'NEO', 'BNB', 'ETH' ],
  [ 'LTC', 'NEO', 'BNB', 'BTC' ],
  [ 'LTC', 'NEO', 'BNB', 'ETH' ],
  [ 'QTUM', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'QTUM', 'ETH', 'BTC' ],
  [ 'QTUM', 'BNB', 'ETH', 'BTC' ],
  [ 'BNB', 'QTUM', 'ETH', 'BTC' ],
  [ 'ETH', 'QTUM', 'BNB', 'BTC' ],
  [ 'BTC', 'QTUM', 'BNB', 'ETH' ],
  [ 'LTC', 'QTUM', 'BNB', 'BTC' ],
  [ 'LTC', 'QTUM', 'BNB', 'ETH' ],
  [ 'QTUM', 'NEO', 'ETH', 'BTC' ],
  [ 'NEO', 'QTUM', 'ETH', 'BTC' ],
  [ 'QTUM', 'NEO', 'BNB', 'BTC' ],
  [ 'NEO', 'QTUM', 'BNB', 'BTC' ],
  [ 'QTUM', 'NEO', 'BNB', 'ETH' ],
  [ 'NEO', 'QTUM', 'BNB', 'ETH' ],
  [ 'EOS', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'EOS', 'ETH', 'BTC' ],
  [ 'EOS', 'BNB', 'ETH', 'BTC' ],
  [ 'BNB', 'EOS', 'ETH', 'BTC' ],
  [ 'ETH', 'EOS', 'BNB', 'BTC' ],
  [ 'BTC', 'EOS', 'BNB', 'ETH' ],
  [ 'LTC', 'EOS', 'BNB', 'BTC' ],
  [ 'LTC', 'EOS', 'BNB', 'ETH' ],
  [ 'EOS', 'NEO', 'ETH', 'BTC' ],
  [ 'NEO', 'EOS', 'ETH', 'BTC' ],
  [ 'EOS', 'NEO', 'BNB', 'BTC' ],
  [ 'NEO', 'EOS', 'BNB', 'BTC' ],
  [ 'EOS', 'NEO', 'BNB', 'ETH' ],
  [ 'NEO', 'EOS', 'BNB', 'ETH' ],
  [ 'EOS', 'QTUM', 'ETH', 'BTC' ],
  [ 'QTUM', 'EOS', 'ETH', 'BTC' ],
  [ 'EOS', 'QTUM', 'BNB', 'BTC' ],
  [ 'QTUM', 'EOS', 'BNB', 'BTC' ],
  [ 'EOS', 'QTUM', 'BNB', 'ETH' ],
  [ 'QTUM', 'EOS', 'BNB', 'ETH' ],
  [ 'SNT', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'SNT', 'ETH', 'BTC' ],
  [ 'SNT', 'BNB', 'ETH', 'BTC' ],
  [ 'BNB', 'SNT', 'ETH', 'BTC' ],
  [ 'SNT', 'NEO', 'ETH', 'BTC' ],
  [ 'NEO', 'SNT', 'ETH', 'BTC' ],
  [ 'SNT', 'QTUM', 'ETH', 'BTC' ],
  [ 'QTUM', 'SNT', 'ETH', 'BTC' ],
  [ 'SNT', 'EOS', 'ETH', 'BTC' ],
  [ 'EOS', 'SNT', 'ETH', 'BTC' ],
  [ 'BNT', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'BNT', 'ETH', 'BTC' ],
  [ 'BNT', 'BNB', 'ETH', 'BTC' ],
  [ 'KMD', 'BNB', 'ETH', 'BTC' ],
  [ 'IOTX', 'BNB', 'ETH', 'BTC' ],
  [ 'KMD', 'BNB', 'ETH', 'BTC' ],
  [ 'ZEN', 'BNB', 'ETH', 'BTC' ],
  [ 'NKN', 'ETH', 'BTC', 'BNB' ],
  [ 'NKN', 'LTC', 'BTC', 'BNB' ],
  [ 'NKN', 'ETH', 'BTC', 'BNB' ],
  [ 'KMD', 'BNB', 'ETH', 'BTC' ],
  [ 'IOTX', 'LTC', 'BTC', 'ETH' ],
  [ 'SOL', 'LTC', 'BNB', 'BTC' ],
  [ 'NKN', 'LTC', 'BNB', 'BTC' ],
  [ 'ARK', 'BNB', 'BTC', 'ETH' ],
  [ 'NEO', 'BNT', 'ETH', 'BTC' ],
  [ 'BNT', 'QTUM', 'ETH', 'BTC' ],
  [ 'QTUM', 'BNT', 'ETH', 'BTC' ],
  [ 'BNT', 'EOS', 'ETH', 'BTC' ],
  [ 'EOS', 'BNT', 'ETH', 'BTC' ],
  [ 'BNT', 'SNT', 'ETH', 'BTC' ],
  [ 'SNT', 'BNT', 'ETH', 'BTC' ],
  [ 'USDT', 'LTC', 'ETH', 'BTC' ],
  [ 'LTC', 'USDT', 'ETH', 'BTC' ],
]

function getCombs(markets) {
  let bases = []
  // let markets = exchange.loadMarkets().then(async markets => {
  let keys = Object.keys(markets)

  for (let key of keys) {
    let market = markets[key]

    if (!bases.includes(market.quote)) {
      bases.push(market.quote)
    }

    if (!bases.includes(market.base)) {
      bases.push(market.base)
    }
  }

  let combinations = Generate.combination(bases)

  let viable = []
  for (let com of combinations) {
    // let permutated = Generate.permutations(com)
    // for (let perm of permutated) {
      let tradePairs = Generate.sequentialSymbols(com[0], com[1], com[2], com[3], markets)
      // if (permutated.indexOf(perm) % 6 == 0) {
        if (tradePairs != "Trade not Viable") {
          console.log(tradePairs)
          viable.push(tradePairs)
        // }
        // console.log(tradePairs)
      }
    // }
    
  }
  return viable
  // console.log(combinations)
// })
}

async function checkTradePairs(){

  let sets = [ 
    [ 'BTC', 'ETH', 'LTC', 'BNB' ],
    [ 'ETH', 'LTC', 'BNB', 'NEO' ],
    [ 'LTC', 'BNB', 'NEO', 'QTUM' ],
    [ 'BNB', 'NEO', 'QTUM', 'EOS' ],
    [ 'NEO', 'QTUM', 'EOS', 'SNT' ],
    [ 'QTUM', 'EOS', 'SNT', 'BNT' ],
    [ 'EOS', 'SNT', 'BNT', 'BCC' ],
    [ 'SNT', 'BNT', 'BCC', 'GAS' ],
    [ 'BNT', 'BCC', 'GAS', 'USDT' ],
    [ 'BCC', 'GAS', 'USDT', 'HSR' ],
  ]

  for (let set of sets) {
    await Generate.validatedTradePairs(set[0], set[1], set[2], set[3], 'binance')
  }
}

// getCombs(exchange)

let arbRate = 2
let iterNum = 100
let startVal = 100

// let numItersDay = 2 * 60 * 24
// let numItersWeek = numItersDay * 7

// console.log(numItersDay)

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

let exchange = new ccxt['binance']()
exchange.enableRateLimit = true
let midCryptos = ["MATIC", "ENJ", "ALGO", "BAT", "ARK", "XLM", "BAND", "KAVA", "ZRX", "IOTA", "RVN", "WAVES", "KNC", "ATOM", "BTG", "CHZ", "LSK", "QTUM", "LTO", "IOTX"]
let topCryptos = ["SNT", "BNB", "BTC", "IOTA", "ETH", "XRP", "BCH", "LTC", "EOS", "XZT", "LINK", "XMR", "XLM", "ADA", "TRX", "DASH"]
let topCurrencies = ["NGN", "RUB", "BUSD", "EUR", "TUSD", "TRY", "PAX", "USDC", 'GBP']

let set = ['BTC', 'BNB', 'EUR', 'NGN']
let largeSet = Array.from(new Set(topCryptos.concat(topCurrencies.concat(midCryptos))))

let comb = Combinatorics.combination(largeSet, 4);
let combinations = []
while(a = comb.next()) combinations.push(a);

let coins = [['XRP', 'ETH', 'SNT', 'BTC'], ['NGN', 'BTC', 'BNB'], ['IOTX', 'BTC', 'ETH']]

exchange.loadMarkets().then(async markets => {

  // Get Set of all symbols for which tickers are needed => [ [ 'XRP/ETH', 'SNT/ETH', 'SNT/BTC', 'XRP/BTC' ] ]
  //  Get Set of sequential coins from all possible combinations
  let coinSequence = []
  let arrayOfSequentialTradeSymbols = combinations.map((coinSet) => {
    let tradeSymbols = Generate.sequentialSymbols(coinSet, markets)
    if (tradeSymbols) {
      coinSequence.push(coinSet)
      return tradeSymbols
    }
  }).filter(item => item != null)

  console.log(arrayOfSequentialTradeSymbols)

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

  // console.log(arrayOfSequentialTradeSymbols)

  // Generate Trade Instances using tickers (Each trade instance has prices and market details)
  let tradeSequences = coinSequence.map((coinSet) => {
    // console.log(coinSet)
    return Generate.sequentialTrades(coinSet, markets, tickersObj)
  })


  for (let tradeSequence of tradeSequences) {
    let arb = new Arb(tradeSequence)
    let arbRate = arb.fromSequence(10000)
  }
})



// calculateCompoundedAmount(startVal, arbRate, iterNum)
// fetchVolatileSet(exchange, 10).then(async set => {
//   let viable = []
//   let markets = await exchange.loadMarkets()
//   let combinations = Generate.combination(set)
//   for (combo of combinations) {
//     let permutated = Generate.permutations(combo)
//     for (let perm of permutated) {
//       try {
//         let tradeSet = Generate.validatedTradePairs(perm[0], perm[1], perm[2], perm[3], markets)
//         viable.push([perm[0], perm[1], perm[2], perm[3]])
//       } catch (err) {
//         1 + 1
//       }
//     }
    
//   }
// })
