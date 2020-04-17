class Validate {
  static pairExists(markets, pair) {
    if (markets[pair]) {
      return true
    } 
    return false
  }

  static correctPair(markets, quote, base) {
    let forward = markets[`${quote.toUpperCase()}/${base.toUpperCase()}`]
    let backward = markets[`${base.toUpperCase()}/${quote.toUpperCase()}`]
    if (forward != undefined) {
      return forward
    } else if (backward != undefined) {
      return backward
    } else {
      // console.log("No Trade")
      return false
    }
  }

  static switchPairs(pair) {
    let splitPair = pair.split('/')
    return `${splitPair[1]}/${splitPair[0]}`
  }
}

module.exports = Validate