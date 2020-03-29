// exports.func = async () => {
//   const MonitorRest = require('./models/MonitorRest')
//   const Generate = require('./models/Generate')
//   let cryptos = ['BTC', 'ETH', 'LTC', 'USDT', 'USDC', 'BGBP', 'XRP', 'NEO']
//   let currencires = ['GBP', 'NGN', 'EUR', 'USD', 'USDC', 'ETH', 'USDT', 'LTC', 'BGBP']
//   let symbols = Generate.pairs(cryptos, currencires)
//   let exchanges = ['bittrex', 'poloniex', 'gemini']

//   for (let exchange of exchanges) {
//     for (let symbol of symbols) {
//       if (exchange == 'binance' || exchange == 'poloniex') {
//         let symbol_split = symbol.split('/')
//         if (symbol_split[1] == 'USD') {
//           continue
//         }
//       }
//       await MonitorRest.orderBook(exchange, symbol)
//     }
//   }
// } 

async function mon() {
  const MonitorRest = require('./models/MonitorRest')
  const Generate = require('./models/Generate')
  let cryptos = ['BTC', 'ETH', 'LTC', 'USDT', 'USDC', 'BGBP', 'XRP', 'NEO']
  let currencires = ['GBP', 'NGN', 'EUR', 'USD', 'USDC', 'ETH', 'USDT', 'LTC', 'BGBP']
  let symbols = Generate.pairs(cryptos, currencires)
  let exchanges = ['bittrex', 'poloniex', 'gemini']

  for (let exchange of exchanges) {
    for (let symbol of symbols) {
      if (exchange == 'binance' || exchange == 'poloniex') {
        let symbol_split = symbol.split('/')
        if (symbol_split[1] == 'USD') {
          continue
        }
      }
      await MonitorRest.orderBook(exchange, symbol)
    }
  }
}

mon()
