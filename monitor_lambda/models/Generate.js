class Generate {
  static pairs(cryptos, currencies) {
    let pairs = []
    for (let curr of currencies) {
      for (let cryp of cryptos) {
        if (curr == "NGN" && cryp != 'BTC') {
          continue
        }
        if (curr == cryp) {
          continue
        }
        let pair = `${cryp}/${curr}`
        pairs.push(pair)
      }
    }
    return pairs
  }
}

let cryptos = ['BTC', 'ETH', 'XRP', 'LTC', 'XMR', 'DASH']
let currencires = ['GBP', 'NGN', 'BTC', 'ETH', 'EUR']

console.log(Generate.pairs(cryptos, currencires))
module.exports = Generate