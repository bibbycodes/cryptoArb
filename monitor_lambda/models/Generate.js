const Validate = require('./Validate')
const ccxt = require('ccxt')
const Arb = require('./Arb')
const Trade = require('./Trade')
const Parse = require('./Parse')
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

     let trade4 = {
        // sell busd for euro
        pair : `${converter}/${source}`,
        tradePair : `${converter}${source}`,
        from : converter,
        to   : source,
        side : sides[3]
      }

    return { trade1, trade2, trade3, trade4 }
  }

  static sequentialTrades(sequentialCoins, markets, tickers) {
    let tradesArray = []
    for (let i = 0; i < sequentialCoins.length; i++) {
      let from, to
      from = sequentialCoins[i]
      
      if (i == sequentialCoins.length - 1) {
        to = sequentialCoins[0]
      } else {
        to = sequentialCoins[i + 1]
      }

      let trade = Validate.correctPair(markets, from, to)
      
      if (trade) {
        trade = Parse.trade(trade, from, to)
        let tradeInstance = new Trade(trade, tickers)
        tradesArray.push(tradeInstance)
      }
    }
    return tradesArray
  }

  static sequentialSymbols(sequentialCoins, markets) {
    let tradesArray = []
    for (let i = 0; i < sequentialCoins.length; i++) {
      let to
      let from = sequentialCoins[i]

      if (i == sequentialCoins.length - 1) {
        to = sequentialCoins[0]
      } else {
        to = sequentialCoins[i + 1]
      }
      let trade = Validate.correctPair(markets, from, to)
      tradesArray.push(trade.symbol)
    }
    if (tradesArray.includes(undefined)) {
      return false
      // throw new Error("Trade not Viable")
    }
    return tradesArray
  }

  static validatedTradePairs(source, target, crypto, converter, markets) {
    let sides = ['buy', 'sell', 'buy', 'sell']
    console.log(source, target, crypto, converter)
    let market1 = Validate.correctPair(markets, source, crypto)
    let market2 = Validate.correctPair(markets, crypto, target)
    let market3 = Validate.correctPair(markets, target, converter)
    let market4 = Validate.correctPair(markets, converter, source)

    if ([market1, market2, market3, market4].includes(false)) {
      // console.log("Not Viable")
      throw new Error("Trade not Viable")
    }

    let trade1 = {
      // buy bitcoin with euro
      pair : market1.symbol,
      tradePair : market1.id,
      from : source,
      to   : crypto,
      side : sides[0],
      quote :  market1.quoteId,
      base : market1.base,
      precision : market1.precision
    }

    let trade2 = {
      // sell bitcoin for naira
      pair : market2.symbol,
      tradePair : market2.id,
      from : crypto,
      to   : target,
      side : sides[1],
      quote :  market2.quote,
      base : market2.base,
      precision : market2.precision
    }

    let trade3 = {
      // buy busd with naira
      pair : market3.symbol,
      tradePair : market3.id,
      from : target,
      to   : converter,
      side : sides[2],
      quote :  market3.quote,
      base : market3.base,
      precision : market3.precision
    }

    let trade4 = {
      // sell busd for euro
      pair : market4.symbol,
      tradePair : market4.id,
      from : converter,
      to   : source,
      side : sides[3],
      quote :  market4.quote,
      base : market4.base,
      precision : market4.precision
    }

    return { trade1, trade2, trade3, trade4}
  }

  //  for a set of letters
  //  find all possible subsets
  //  whose length is four
  //  and consists of unique elements
  static combination(set) {
    // set = set.slice(0,15)
    let foundSets = []
    for (let i = 0; i < set.length; i++) {
      for (let j = 0; j < set.length + 1; j++) {
        if (i == j) {
          break
        }
        for (let k = 0; k < set.length; k++) {
          if (k == i || k == j) {
            break
          }
          for (let l = 0; l < set.length; l++) {
            if (l == i || l == k || l == j) {
              break
            }
            let combo = [set[i], set[j], set[k], set[l]]
            if (!foundSets.includes(combo)) {
              console.log(combo)
              foundSets.push(combo)
            }
          }
        }
      }
    }

    return foundSets
  }
  
  static permutations(input) {
    let permArr = []
    let usedChars = []

    function permute(input) {
      var i, ch;
      for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
          permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
      }
      return permArr
    };

    return permute(input)
  }
}

module.exports = Generate