const Generate = require('./models/Generate')
const Validate = require('./models/Validate')
const ccxt = require('ccxt')

let binance = new ccxt['binance']()

function getCombs() {
  let bases = []
  let markets = binance.loadMarkets().then(async markets => {
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
  console.log(viable)
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

// let markets = binance.loadMarkets().then(markets => {
//   Validate.correctPair
// })

// checkTradePairs()
getCombs()