const Generate = require('./models/Generate')
const ccxt = require('ccxt')
const Arb = require('./models/Arb')
const Format = require('./models/Format')
const flatten = require('array-flatten').flatten
const Combinatorics = require('js-combinatorics');

let binanceTrades = [
  ['ETH', 'SNT', 'BTC' ],
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
  [ 'NGN', 'BTC', 'EUR', 'BNB' ],
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
  ['ETH', 'BTC', 'SNT', 'XRP'],
  [ 'XRP', 'SNT', 'ETH', 'BTC' ],
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

// function calculateCompoundedAmount(startVal, arbRate, numIterations) {
//   endVal = startVal
//   for (i = 0; i < numIterations; i ++) {
//     endVal += ((arbRate / 100) * startVal)
//   }
//   return endVal
// }

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
      let arb = new Arb(tradeSequence, 1000)
      console.log(arb.arbString)
      let dbString = Format.dbArbString(arb, 'binance')
      console.log(dbString)
    }
  })
}

async function fetchCoinList(exchangeName) {
  let exchange = new ccxt[exchangeName]()
  let coins = []
  let markets = await exchange.loadMarkets().then((markets) => {
    for (symbol in markets) {
      let market = markets[symbol]
      coins.push(market.quote, market.base)
    }
  })
  return Array.from(new Set(coins))
}



// let exchange = new ccxt['bittrex']()

// fetchVolatileSet(exchange, 10).then(set => {
//   console.log(set)
//   let comb = Combinatorics.combination(set, 4);
//   let combinations = []
//   while(a = comb.next()) {
//     perm = Combinatorics.permutation(a)
//     while(b = perm.next()) {
//       combinations.push(b)
//     };
//   };
//   getArbs(exchange, combinations)
// })

// exchange.enableRateLimit = true
let midCryptos = ["MATIC", "ENJ", "ALGO", "BAT", "ARK", "XLM", "BAND", "KAVA", "ZRX", "IOTA", "RVN", "WAVES", "KNC", "ATOM", "BTG", "CHZ", "LSK", "QTUM", "LTO", "IOTX"]
let topCryptos = ["SNT", "BNB", "BTC", "IOTA", "ETH", "XRP", "BCH", "LTC", "EOS", "XZT", "LINK", "XMR", "XLM", "ADA", "TRX", "DASH"]


let arbCryptos = ['SNT', 'IOTX', 'IOTA', 'EOS', 'LINK', 'NEO', 'QTUM', 'LTC', 'KMD', 'ZEN', 'NKN']
let transferable = ['BTC', 'ETH', 'XRP', 'BNB', 'USDT']

let numCoins = 4 // The number of individual coins involved in each trade
// let largeSet = Array.from(new Set(topCurrencies.concat(transferable.concat(arbCryptos))))

function intrestingArbs(numOfTrades) {
  let exchange = new ccxt['binance']()
  let topByMarketCap = ['ETH', 'BTC', 'XRP', 'BCH', 'LTC', 'BNB', 'EOS', 'XZT', 'LINK', 'XMR', 'XLM', 'ADA', 'TRX', 'DASH', 'ETC', 'ALGO', 'NEO', 'ATOM', 'IOTA', 'XEM', 'ONT', 'FFT', 'DOGE', 'ZEC']
  let topCurrencies = ["NGN", "RUB", "BUSD", "EUR", "TRY", "USDT", "ZAR", "IDRT", "BKRW", "USDC", "PAX"]
  let setOfCoins = Array.from(new Set(topByMarketCap.concat(topCurrencies))).slice(0,10)
  let comb = Combinatorics.bigCombination(setOfCoins, numOfTrades);
  let combinations = []
  
  while(a = comb.next()) {
    perm = Combinatorics.permutation(a)
    while(b = perm.next()) {
      combinations.push(b)
    };
  };
  
  getArbs(exchange, combinations)
}


function filterForViable(exchange) {
  exchange.loadMarkets().then(async markets => {
    let coinSequence = []
    let arrayOfSequentialTradeSymbols = setOfCombinations.map((coinSet) => {
      let tradeSymbols = Generate.sequentialSymbols(coinSet, markets)
      if (tradeSymbols) {
        coinSequence.push(coinSet)
        return tradeSymbols
      }
    }).filter(item => item != null)
  
    let setOfSymbols = Array.from(new Set(flatten(arrayOfSequentialTradeSymbols)))
  })
  return setOfSymbols
}

function getAllCombosOf(arraySize, exchangeName) {
  fetchCoinList(exchangeName).then(coins => {
    let comb = Combinatorics.bigCombination(coins, arraySize);
    let combinations = []
    while(a = comb.next()) {
      perm = Combinatorics.permutation(a)
      while(b = perm.next()) {
        combinations.push(b)
      };
    };
    let exchange = new ccxt[exchangeName]()
  })
}

intrestingArbs(4)

// cmb = Combinatorics.permutation(['a','b','c','d'])
// console.log(cmb.toArray());

// getAllCombosOf(4, 'binance')