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
  // trader.fullTrade('BTCEUR', 'BTCNGN', 'BNBNGN', 'BNBEUR', 35);
  static tradePairs(source, target, crypto, converter) {
    let trade1 = {
      // buy bitcoin with euro
      pair : `${crypto}/${source}`,
      from : source,
      to   : crypto,
      side : 'buy'
    }

    let trade2 = {
      // sell bitcoin for naira
      pair : `${crypto}/${target}`,
      from : crypto,
      to   : target,
      side : 'sell'
    }

    let trade3 = {
      // buy busd with naira
      pair : `${converter}/${target}`,
      from : target,
      to   : converter,
      side : 'buy'
    }

    let trade4
    if (converter == "BNB") {
      trade4 = {
        // sell busd for euro
        pair : `${converter}/${source}`,
        from : converter,
        to   : source,
        side : 'sell'
      }
    } else if (converter == "BUSD") {
      trade4 = {
        // sell busd for euro
        pair : `${source}/${converter}`,
        from : converter,
        to   : source,
        side : 'sell'
      }
    }



    return {
      trade1,
      trade2,
      trade3,
      trade4
    }
  }
}

// console.log(Generate.tradePairs('EUR','NGN','BTC','BUSD'))

module.exports = Generate