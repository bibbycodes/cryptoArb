const Arb = require('./models/Arb')
const dbConn = require('./models/dbConn')
const ccxt = require('ccxt')
const Email = require('./models/Email')
const Combinatorics = require('js-combinatorics');
const Generate = require('./models/Generate')
const Format = require('./models/Format')
const flatten = require('array-flatten').flatten

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.func = async () => {
  console.log("Starting")

  async function getArbs(exchange, setOfCombinations) {
    console.log("inside get Arbs")
    exchange.loadMarkets().then(async markets => {
      console.log("loading markets")
      let coinSequence = []
      let arrayOfSequentialTradeSymbols = setOfCombinations.map((coinSet) => {
        console.log("sequential trade symbol[0]", arrayOfSequentialTradeSymbols[0])
        let tradeSymbols = Generate.sequentialSymbols(coinSet, markets)     
        if (tradeSymbols) {
          coinSequence.push(coinSet)
          return tradeSymbols
        }
      }).filter(item => item != null)

      console.log("Coin Sequence: ", coinSequence)
      let setOfSymbols = Array.from(new Set(flatten(arrayOfSequentialTradeSymbols)))
      
      // Get set of async calls to fetch tickers
      let calls = setOfSymbols.map(async ticker => {
        return exchange.fetchTicker(ticker)
      })
      
      // Fetch all tickers in Parallel
      let tickers = await Promise.all(calls)
      console.log("tickers: ", tickers)
      
      // Convert Tickers to hash with symbols as keys
      let tickersObj = {}
      for (let ticker of tickers) {
        tickersObj[ticker.symbol] = ticker
      }

      console.log("tickersObj:", tickersObj)
    
      // Generate Trade Instances using tickers (Each trade instance has prices and market details)
      let tradeSequences = coinSequence.map((coinSet) => {
        return Generate.sequentialTrades(coinSet, markets, tickersObj)
      })
  
      for (let tradeSequence of tradeSequences) {
        let arb = new Arb(tradeSequence, 1000)
        let dbString = Format.dbArbString(arb, 'binance')
        let db = new dbConn()
        console.log("db Query:", dbString)
        await db.query(dbString)
      }
    })
  }
  
  async function intrestingArbs(numOfTrades) {
    console.log("inside interesting arbs")
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
    
    console.log("getting arbs")
    await getArbs(exchange, combinations)
  }

  await intrestingArbs(4)
  console.log("Ending")
}

// .then(async res => {
//   let message = `ArbRate: ${res.arbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
//   await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BUSD EUR NGN: ${res.arbRate}`, message)
// })