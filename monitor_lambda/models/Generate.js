class Generate {
  static pairs(cryptos, currencies) {
    let pairs = []
    for (let curr of currencies) {
      for (let cryp of cryptos) {
        if (curr == "NGN" && cryp != 'BTC') {
          break
        }
        if (curr == cryp) {
          break
        }
        let pair = `${cryp}/${curr}`
        pairs.push(pair)
      }
    }
    return pairs
  }

  static tradePairs(source, target, crypto, converter, reverse) {
    let sides = ['buy', 'sell', 'buy', 'sell']

    let trade1 = {
      // buy bitcoin with euro
      pair : `${crypto}/${source}`,
      tradePair : `${crypto}${source}`,
      from : source,
      to   : crypto,
      side : sides[0]
    }

    let trade2 = {
      // sell bitcoin for naira
      pair : `${crypto}/${target}`,
      tradePair : `${crypto}${target}`,
      from : crypto,
      to   : target,
      side : sides[1]
    }

    let trade3 = {
      // buy busd with naira
      pair : `${converter}/${target}`,
      tradePair : `${converter}${target}`,
      from : target,
      to   : converter,
      side : sides[2]
    }

    let trade4

    if (converter == "BNB") {
      trade4 = {
        // sell busd for euro
        pair : `${converter}/${source}`,
        tradePair : `${converter}${source}`,
        from : converter,
        to   : source,
        side : sides[3]
      }
    } else if (converter == "BUSD") {
      trade4 = {
        // sell busd for euro
        pair : `${source}/${converter}`,
        tradePair : `${source}${converter}`,
        from : converter,
        to   : source,
        side : sides[3]
      }
    }

    return {
      trade1,
      trade2,
      trade3,
      trade4,
    }
  }
}

module.exports = Generate