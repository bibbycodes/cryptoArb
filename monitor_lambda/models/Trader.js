// Binance API Rate Limit
// At the current time Binance rate limits are: 
// 1200 requests per minute. 
// 10 orders per second. 
// 100,000 orders per 24hrs.

const Generate = require('./Generate')
const Arb = require('./Arb')
const ccxt = require('ccxt')
const exchange = new ccxt['binance']()

const Binance = require('node-binance-api');
const binance = new Binance({
  APIKEY: '9MVXpunOLoJaePCGv3diL9iwreNQBQHDUs5e7gjCdTBj5loFpW6FjKqMU05uYjFx',
  APISECRET: 'qIRk2ZS331GyGPErPZo8TmhOxy9CjO16DMxb85NjTEoQeqwhSw5m1DCKRhdwCcc0'
});



class Trader{
  constructor (){
      console.log("Let the trading begin!!!");
  }
  

  fullTrade (srcArb, arbDest, destBase, baseSrc, startAmount, outcome1, outcome2, outcome3 ){ 
    let source_balance_start
    let crypto_balance_start
    let dest_balance_start
    let base_balance_start

    let source_balance_end
    let crypto_balance_end
    let dest_balance_end
    let base_balance_end

    console.log("START...")
    binance.balance((error, balances) => {
      if ( error ) return console.error(error);
      source_balance_start = balances.XRP.available
      crypto_balance_start = balances.BTC.available
      dest_balance_start = balances.SNT.available
      base_balance_start = balances.ETH.available

      console.log("source balance start: ", balances.XRP.available);
      console.log("CRYPTO balance start: ", balances.BTC.available);
      console.log("dest balance start: ", balances.SNT.available);
      console.log("BASE balance start: ", balances.ETH.available);
    
      let baseSize 
      console.log("buy ", srcArb, "at ", startAmount )
       
      binance.marketSell(srcArb, startAmount).then( response => { // SELL XRP FOR BTC
          if (response.status == "FILLED") {
            console.log("TRADE 1...SELL XRP FOR BTC")
            console.log("RESULT", response)
            binance.balance((error, balances) => {
              if ( error ) return console.error(error);
              console.log("source balance end: ", balances.XRP.available);
              console.log("crypto balance end: ", balances.BTC.available);
              console.log("dest balance end: ", balances.SNT.available);
              console.log("base balance end: ", balances.ETH.available);

              source_balance_end = balances.XRP.available
              crypto_balance_end = balances.BTC.available
              dest_balance_end = balances.SNT.available
              base_balance_end = balances.ETH.available

              console.log("source bal diff: ", source_balance_end - source_balance_start, "percentage diff:", (source_balance_end - source_balance_start)/ source_balance_start ) ;
              console.log("CRYPTO bal diff: ", crypto_balance_end - crypto_balance_start, "percentage diff:", (crypto_balance_end - crypto_balance_start)/ crypto_balance_start );
              console.log("dest bal diff: ", dest_balance_end - dest_balance_start, "percentage diff:", (dest_balance_end - dest_balance_start)/ dest_balance_start );
              console.log("BASE bal diff: ", base_balance_end - base_balance_start, "percentage diff:", (base_balance_end - base_balance_start)/ base_balance_start );

              return binance.marketBuy(arbDest, outcome2).then( result => { // BUY SNT WITH BTC
                if (result.status == "FILLED"){
                  console.log("TRADE 2...BUY SNT WITH BTC")
                  console.log("RESULT", result)
                      binance.balance((error, balances) => {
                        if ( error ) return console.error(error);
                        console.log("source balance end: ", balances.XRP.available);
                        console.log("CRYPTO balance end: ", balances.BTC.available);
                        console.log("dest balance end: ", balances.SNT.available);
                        console.log("BASE balance end: ", balances.ETH.available);
  
                        source_balance_end = balances.XRP.available
                        crypto_balance_end = balances.BTC.available
                        dest_balance_end = balances.SNT.available
                        base_balance_end = balances.ETH.available
  
                        console.log("source bal diff: ", source_balance_end - source_balance_start, "percentage diff:", (source_balance_end - source_balance_start)/ source_balance_start ) ;
                        console.log("CRYPTO bal diff: ", crypto_balance_end - crypto_balance_start, "percentage diff:", (crypto_balance_end - crypto_balance_start)/ crypto_balance_start );
                        console.log("dest bal diff: ", dest_balance_end - dest_balance_start, "percentage diff:", (dest_balance_end - dest_balance_start)/ dest_balance_start );
                        console.log("BASE bal diff: ", base_balance_end - base_balance_start, "percentage diff:", (base_balance_end - base_balance_start)/ base_balance_start );
                        
                        console.log("SNT gotten from BTC sale =", result.cummulativeQuoteQty)
                        

                        // baseSize = Number(result.fills[0].qty) 
                        // console.log("baseSize: ", baseSize)
                        return binance.marketSell(destBase, outcome2).then( result => {   //sell SNT for ETH
                        //balance
                        if (result.status == "FILLED"){
                          console.log("TRADE 3...SNT TO ETH")

                          console.log("RESULT", result)

                          binance.balance((error, balances) => { 
                            if ( error ) return console.error(error);
                            console.log("source balance end: ", balances.XRP.available);
                            console.log("CRYPTO balance end: ", balances.BTC.available);
                            console.log("dest balance end: ", balances.SNT.available);
                            console.log("BASE balance end: ", balances.ETH.available);
      
                            source_balance_end = balances.XRP.available
                            crypto_balance_end = balances.BTC.available
                            dest_balance_end = balances.SNT.available
                            base_balance_end = balances.ETH.available
      
                            console.log("source bal diff: ", source_balance_end - source_balance_start, "percentage diff:", (source_balance_end - source_balance_start)/ source_balance_start ) ;
                            console.log("CRYPTO bal diff: ", crypto_balance_end - crypto_balance_start, "percentage diff:", (crypto_balance_end - crypto_balance_start)/ crypto_balance_start );
                            console.log("dest bal diff: ", dest_balance_end - dest_balance_start, "percentage diff:", (dest_balance_end - dest_balance_start)/ dest_balance_start );
                            console.log("BASE bal diff: ", base_balance_end - base_balance_start, "percentage diff:", (base_balance_end - base_balance_start)/ base_balance_start );
                          
                            //baseSize = result.outcome3
                          return binance.marketBuy(baseSrc, outcome3).then( result => { //sell eth back to xrp

                            if (result.status == "FILLED"){
                              console.log("TRADE 4...ETH TO XRP")
                               console.log("RESULT", result)
                              binance.balance((error, balances) => { //ETH TO XRP
                                if ( error ) return console.error(error);
                                console.log("source balance end: ", balances.XRP.available);
                                console.log("CRYPTO balance end: ", balances.BTC.available);
                                console.log("dest balance end: ", balances.SNT.available);
                                console.log("BASE balance end: ", balances.ETH.available);
          
                                source_balance_end = balances.XRP.available
                                crypto_balance_end = balances.BTC.available
                                dest_balance_end = balances.SNT.available
                                base_balance_end = balances.ETH.available
          
                                console.log("source bal diff: ", source_balance_end - source_balance_start, "percentage diff:", (source_balance_end - source_balance_start)/ source_balance_start ) ;
                                console.log("CRYPTO bal diff: ", crypto_balance_end - crypto_balance_start, "percentage diff:", (crypto_balance_end - crypto_balance_start)/ crypto_balance_start );
                                console.log("dest bal diff: ", dest_balance_end - dest_balance_start, "percentage diff:", (dest_balance_end - dest_balance_start)/ dest_balance_start );
                                console.log("BASE bal diff: ", base_balance_end - base_balance_start, "percentage diff:", (base_balance_end - base_balance_start)/ base_balance_start );
                              })

                            }

                          }).catch(err => console.log("err", err.body, err.message))
                          
                          })
                          
                        }

                          
                      }).catch(err => {
                        console.log("err", err.body, err.msg)
                      })

                      })
                    
                }
              }).catch(err => console.log("err", err.body, err.message))

            })
            //tradeAmount = Number((parseFloat(response.executedQty) - (parseFloat(response.executedQty) * 0.01)).toFixed(3))
            
          }
         
      }).catch(err => console.log("err", err.body, err.message))
    })
  }
}

module.exports = Trader

let tradePairs
let markets = exchange.loadMarkets().then(markets => { 
  tradePairs = Generate.validatedTradePairs('XRP', 'SNT', 'BTC', 'ETH', markets)
  // console.log(tradePairs)

  let trader = new Trader();
let thisArb = new Arb(tradePairs)
thisArb.getRates('binance').then(rates => {
  let tradePairs = thisArb.tradePairs
  let thisArbRate = thisArb.getArb(50)
  // let baseRate = thisArb.getArb()
  let message = `ArbRate: ${thisArbRate} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
  //console.log(message)
   return ({"tradePairs": tradePairs, 
   "baseRate": thisArb.baseRate, 
   "outcome1": thisArb.outcome1,
   "outcome2": thisArb.outcome2,
   "outcome3": thisArb.outcome3,
   "outcome4": thisArb.outcome4
  })
}).then(async results => {
  //console.log("scoped tradePairs", results["tradePairs"])
  //
  let startAmount = 50
  let outcome1 = results.outcome1.toFixed(tradePairs.trade1.precision) - (results.outcome1.toFixed(tradePairs.trade1.precision) * 0.01)
  let outcome2 = results.outcome2.toFixed(tradePairs.trade2.precision) - (results.outcome2.toFixed(tradePairs.trade2.precision) * 0.01)
  let outcome3 = results.outcome3.toFixed(tradePairs.trade3.precision) - (results.outcome3.toFixed(tradePairs.trade3.precision) * 0.01)

  trader.fullTrade(
    tradePairs.trade1.tradePair, 
    tradePairs.trade2.tradePair, 
    tradePairs.trade3.tradePair, 
    tradePairs.trade4.tradePair, 
    50,  //snt
    outcome1,
    outcome2,
    outcome3  //
  );

  

})

})













