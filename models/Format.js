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
    }
    return output
  }
}

module.exports = Format