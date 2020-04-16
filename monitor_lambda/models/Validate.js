class Validate {
  static pairExists(markets, pair) {
    if (markets[pair]) {
      return true
    } 
    return false
  }

  static correctPair(markets, quote, base) {
    if (markets[`${quote}/${base}`]) {
      return markets[`${quote}/${base}`]
    } else if (markets[`${base}/${quote}`]) {
      return markets[`${base}/${quote}`]
    } else {
      return false
    }
  }

  static switchPairs(pair) {
    let splitPair = pair.split('/')
    return `${splitPair[1]}/${splitPair[0]}`
  }
}

module.exports = Validate