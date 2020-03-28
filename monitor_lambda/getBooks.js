exports.func = async () => {
  const MonitorRest = require('./models/MonitorRest')
  const Generate = require('./models/Generate')
  let cryptos = ['BTC', 'ETH', 'LTC',]
  let currencires = ['GBP', 'NGN', 'EUR', 'USD']
  let symbols = Generate.pairs(cryptos, currencires)
  let exchanges = ['binance', 'kraken', 'coinbasepro', 'bittrex', 'poloniex']

  for (let exchange of exchanges) {
    for (let symbol of symbols) {
      if (exchange == 'binance' || exchange == 'poloniex') {
        let symbol_split = symbol.split('/')
        if (symbol_split[1] == 'USD') {
          symbol = symbol_split[0] + '/USDT'
        }
      }
      await MonitorRest.orderBook(exchange, symbol)
    }
  }
} 