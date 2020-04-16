const Validate = require('./Validate')
const ccxt = require('ccxt')
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

  static async validatedTradePairs(source, target, crypto, converter, markets) {
    let sides = ['buy', 'sell', 'buy', 'sell']
    let market1 = Validate.correctPair(markets, source, crypto)
    let market2 = Validate.correctPair(markets, crypto, target)
    let market3 = Validate.correctPair(markets, target, converter)
    let market4 = Validate.correctPair(markets, converter, source)

    if ([market1, market2, market3, market4].includes(false)) {
      return "Trade not Viable"
    }

    let trade1 = {
      // buy bitcoin with euro
      pair : market1.symbol,
      tradePair : market1.id,
      from : source,
      to   : crypto,
      side : sides[0],
      quote :  market1.quoteId,
      base : market1.base
    }

    let trade2 = {
      // sell bitcoin for naira
      pair : market2.symbol,
      tradePair : market2.id,
      from : crypto,
      to   : target,
      side : sides[1],
      quote :  market2.quote,
      base : market2.base
    }

    let trade3 = {
      // buy busd with naira
      pair : market3.symbol,
      tradePair : market3.id,
      from : target,
      to   : converter,
      side : sides[2],
      quote :  market3.quote,
      base : market3.base
    }

    let trade4 = {
      // sell busd for euro
      pair : market4.symbol,
      tradePair : market4.id,
      from : converter,
      to   : source,
      side : sides[3],
      quote :  market4.quote,
      base : market4.base
    }
    return { trade1, trade2, trade3, trade4 }
  }

  //  for a set of letters
  //  find all possible subsets
  //  whose length is four
  //  and consists of unique elements
  static combination(set) {
    set = set.slice(0,15)
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
            console.log(combo)
            if (!foundSets.includes(combo)) {
              foundSets.push([set[i], set[j], set[k], set[l]])
            }
          }
        }
        // if (currSet.length == 4) {
        //   console.log("J:", j)
        //   console.log(currSet)
        //   foundSets.push(currSet)
        //   // j = 1
        //   break
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

// console.log(Generate.combination(['ngn', 'usd', 'btc', 'eth', 'busd', 'bnb', 'rub', 'xrp']))
module.exports = Generate