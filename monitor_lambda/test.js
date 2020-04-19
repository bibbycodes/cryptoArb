const Generate = require('./models/Generate')
const Validate = require('./models/Validate')
const ccxt = require('ccxt')
const Trade = require('./models/Trade')
const Arb = require('./models/Arb')

function getCombs(exchange) {
  let bases = []
  let markets = exchange.loadMarkets().then(async markets => {
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
  // console.log(JSON.stringify(combinations))

  let viable = []
  for (let com of combinations) {
    let permutated = Generate.permutations(com)
    for (let perm of permutated) {
      let tradePairs = await Generate.validatedTradePairs(perm[0], perm[1], perm[2], perm[3], markets)
      if (tradePairs != "Trade not Viable") {
        if (permutated.indexOf(perm) % 6 == 0) {
          viable.push(perm)
        }
        // console.log(tradePairs)
      }
    }
    
  }
  return viable
  // console.log(combinations)
})
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
    console.log(endVal)
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

let exchange = new ccxt['bittrex']()

exchange.loadMarkets().then(async markets => {
  let coins = ['LTC', 'BTC', 'ETH']
  let tickers = await exchange.fetchTickers()
  let trades = Generate.sequentialTrades(coins, markets, tickers)
  let arb = new Arb(trades)
  arb.getArbFromSequence(100000)
  // console.log(trades)
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
