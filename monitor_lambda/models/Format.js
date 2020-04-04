const columnify = require('columnify')
const center = require('center-align');
const Parse = require('./Parse')

class Format {
  static symbols(symbols, exchange) {
    let output = []
    for (let symbol of symbols) {
      symbol = symbol.split(/[\/ -]/)

      if (exchange == "kraken") {
        symbol = symbol.join("/")
        output.push(symbol)
      }

      if (exchange == "coinbase") {
        symbol = symbol.join("-")
        output.push(symbol)
      }

      if (exchange == "binance") {
        if (symbol[1] == "USD") {
          symbol[1] = "USDT"
        }

        symbol = symbol.join("")
        output.push(symbol)
      }
    }
    return output
  }

  static symbol(crypto, curr, exchange) {
    
    if (exchange == 'binance') {
      if (crytpo == 'BUSD' && curr == 'EUR') {
        return `${curr.toUpperCase()}/${crypto.toUpperCase()}`
      }
      return `${crytpo.toUpperCase()}/${curr.toUpperCase()}`
    }

    if (exchange == 'trader') {
      if (crytpo == 'BUSD' && curr == 'EUR') {
        return `${curr.toUpperCase()}${crypto.toUpperCase()}`
      }
      return `${crytpo.toUpperCase()}${curr.toUpperCase()}`
    }
  }

  static tickerObject(price, pair, exchange, base, quote, converter) {
    return {
      price: price,
      pair: pair,
      exchange: exchange,
      base: base,
      quote: quote,
      converter: converter
    }
  }

  static coinbaseTickerDbString(ticker) {
    let columns = ""
    let values = ""

    for (let key in ticker) {
      if (["type", "sequence"].includes(key)) {
        continue
      }

      let value = ticker[key]

      if (key == "time") {
        key = "timestamp"
        value = Date.parse(value)
      }

      if (['side', 'product_id'].includes(key)) {
        value = `'${value}'`
      }
      
      columns += `${key}, `
      values += `${value}, `
    }

    columns = columns.substring(0, columns.length - 2)
    values = values.substring(0, values.length - 2)

    let queryString = `INSERT INTO coinbase_ticker (${columns}) VALUES (${values})`
    return queryString
  }

  static krakenTickerDbString(ticker) {
    let object = Parse.krakenTicker(ticker)
    let columns = ""
    let values = ""

    for (let key in object) {
      let value = object[key]

      if (key == "pair") {
        value = `'${value}'`
      }

      columns += `${key}, `
      values += `${value}, `
    }

    columns = columns.substring(0, columns.length - 2)
    values = values.substring(0, values.length - 2)

    let queryString = `INSERT INTO kraken_ticker (${columns}) VALUES (${values})`
    return queryString

  }

  static binanceTickerDbString(ticker) {
    let columns = ""
    let values = ""
    ticker = Parse.binanceTicker(ticker)

    ticker["pair"] = `'${ticker["base"]}${ticker["quote"]}'`

    for (let key in ticker) {
      let value = ticker[key]

      if (['base', 'quote'].includes(key)) {
        value = `'${value}'`
      }

      columns += `${key}, `
      values += `${value}, `
    }

    columns = columns.substring(0, columns.length - 2)
    values = values.substring(0, values.length - 2)

    let queryString = `INSERT INTO binance_ticker (${columns}) VALUES (${values})`
    return queryString
  }

  static matrix(matrix) {
    return columnify(matrix)
  }

  static orderBookDbString(orderBook) {
    let timestamp = orderBook.timestamp
    let exchange = orderBook.exchange
    let pair = orderBook.pair
    let ask = orderBook.ask
    let askVolume = orderBook.askVolume
    let bid = orderBook.bid
    let bidVolume = orderBook.bidVolume

    return `
      INSERT INTO order_book_best 
      (timestamp, exchange, pair, ask_price, ask_volume, bid_price, bid_volume)
      VALUES (${timestamp}, '${exchange}', '${pair}', ${ask}, ${askVolume}, ${bid}, ${bidVolume})
      `
  }
}

module.exports = Format