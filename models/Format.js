const columnify = require('columnify')
const center = require('center-align');
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

  static tickerObject(price, pair, exchange, base, quote, ) {
    return {
      price: price,
      pair: pair,
      exchange: exchange,
      base: base,
      quote: quote
    }
  }

  static coinbaseTickerDbString(ticker, exchange) {
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

    let queryString = `INSERT INTO ${exchange}_ticker (${columns}) VALUES (${values})`
    console.log(queryString)
    return queryString
  }

  static matrix(matrix) {
    console.log(columnify(matrix))

    // for (let el of matrix) {
    //   let row_string = ""
    //   // console.log(el)
    //   for (let rate of el) {
    //     // console.log(rate)
    //     rate = center(rate, 7)
    //     row_string = row_string + ` ${rate.toString()}`
    //     // console.log(row_string)
    //   }
    //   console.table(row_string)
    // }
    console.log("\n")
  }
}

module.exports = Format