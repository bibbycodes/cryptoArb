const ccxt = require('ccxt')
const Generate = require('./models/Generate')
let midCryptos = ["MATIC", "ENJ", "ALGO", "BAT", "ARK", "XLM", "BAND", "KAVA", "ZRX", "IOTA", "RVN", "WAVES", "KNC", "ATOM", "BTG", "CHZ", "LSK", "QTUM", "LTO", "IOTX"]
let topCryptos = ["SNT", "BNB", "BTC", "IOTA", "ETH", "XRP", "BCH", "LTC", "EOS", "XZT", "LINK", "XMR", "XLM", "ADA", "TRX", "DASH"]
let topCurrencies = ["NGN", "RUB", "BUSD", "EUR", "TUSD", "TRY", "PAX", "USDC", 'GBP']

let set = ['BTC', 'BNB', 'EUR', 'NGN', 'IOTA', 'BUSD', 'ETH', 'NEO']
let largeSet = topCryptos.concat(topCurrencies.concat(midCryptos))
let exchange = new ccxt['binance']()

exchange.loadMarkets().then(markets => {
  let trades = []
  let tradeSets = []
  let combinations = Generate.combination(set)
  
  for (let combo of combinations) {
    let permutations = Generate.permutations(combo)

    for (let perm of permutations) {
      try {
        let tradeSet = Generate.validatedTradePairs(perm[0], perm[1], perm[2], perm[3], markets)
        tradeSets.push([perm[0], perm[1], perm[2], perm[3]])
        trades.push(tradeSet)
      } catch (err) {
        console.log("Trade Not Viable")
      }
    }
  }
  return tradeSets
}).then(async (tradeSets) => {
  console.log(tradeSets)
  // for (tradePairs of trades) {
  //   for (trade of tradePairs) {
  //     console.log(trade)
  //     let arb = new Arb(trade)
  //     let rates = await arb.getRates()
  //     console.log(rates)
  //     let arbRate = arb.getArb(2000)
  //     console.log("Arb Rate", arbRate)
  //   }
  // }
  console.log(JSON.stringify(trades))
})