// Binance API Rate Limit
// At the current time Binance rate limits are: 
// 1200 requests per minute. 
// 10 orders per second. 
// 100,000 orders per 24hrs.

const Generate = require('./Generate')
const Arb = require('./Arb')


const Binance = require('node-binance-api');
const binance = new Binance({
  APIKEY: '9MVXpunOLoJaePCGv3diL9iwreNQBQHDUs5e7gjCdTBj5loFpW6FjKqMU05uYjFx',
  APISECRET: 'qIRk2ZS331GyGPErPZo8TmhOxy9CjO16DMxb85NjTEoQeqwhSw5m1DCKRhdwCcc0'
});



class Trader{
  constructor (){
      console.log("Let the trading begin!!!");
  }
  

  fullTrade (srcArb, srcArbPrice, arbDest, arbDestPrice, destBase, destBasePrice, baseSrc, baseSrcPrice, arbSize, baseRate ){ 
    let eur_balance_start
    let btc_balance_start
    let ngn_balance_start
    let bnb_balance_start

    let eur_balance_end
    let btc_balance_end
    let ngn_balance_end
    let bnb_balance_end

    console.log("START...")
    binance.balance((error, balances) => {
      if ( error ) return console.error(error);
      eur_balance_start = balances.EUR.available
      btc_balance_start = balances.BTC.available
      ngn_balance_start = balances.NGN.available
      bnb_balance_start = balances.BNB.available

      console.log("EUR balance start: ", balances.EUR.available);
      console.log("BTC balance start: ", balances.BTC.available);
      console.log("NGN balance start: ", balances.NGN.available);
      console.log("BNB balance start: ", balances.BNB.available);
    
      let baseSize 
      console.log("buy ", srcArb, "at ", arbSize )
      binance.buy(srcArb, arbSize, srcArbPrice).then( response => { // buy euro/bnb
          if (response.status == "FILLED") {
            console.log("TRADE 1...")
            console.log("RESULT", response)
            binance.balance((error, balances) => {
              if ( error ) return console.error(error);
              console.log("EUR balance end: ", balances.EUR.available);
              console.log("BTC balance end: ", balances.BTC.available);
              console.log("NGN balance end: ", balances.NGN.available);
              console.log("BNB balance end: ", balances.BNB.available);

              eur_balance_end = balances.EUR.available
              btc_balance_end = balances.BTC.available
              ngn_balance_end = balances.NGN.available
              bnb_balance_end = balances.BNB.available

              console.log("EUR bal diff: ", eur_balance_end - eur_balance_start, "percentage diff:", (eur_balance_end - eur_balance_start)/ eur_balance_start ) ;
              console.log("BTC bal diff: ", btc_balance_end - btc_balance_start, "percentage diff:", (btc_balance_end - btc_balance_start)/ btc_balance_start );
              console.log("NGN bal diff: ", ngn_balance_end - ngn_balance_start, "percentage diff:", (ngn_balance_end - ngn_balance_start)/ ngn_balance_start );
              console.log("BNB bal diff: ", bnb_balance_end - bnb_balance_start, "percentage diff:", (bnb_balance_end - bnb_balance_start)/ bnb_balance_start );

              return binance.sell(arbDest, arbSize, arbDestPrice).then( result => { // sell bnb/naira
                if (result.status == "FILLED"){
                  console.log("TRADE 2...")
                  console.log("RESULT", result)
                      binance.balance((error, balances) => {
                        if ( error ) return console.error(error);
                        console.log("EUR balance end: ", balances.EUR.available);
                        console.log("BTC balance end: ", balances.BTC.available);
                        console.log("NGN balance end: ", balances.NGN.available);
                        console.log("BNB balance end: ", balances.BNB.available);
  
                        eur_balance_end = balances.EUR.available
                        btc_balance_end = balances.BTC.available
                        ngn_balance_end = balances.NGN.available
                        bnb_balance_end = balances.BNB.available
  
                        console.log("EUR bal diff: ", eur_balance_end - eur_balance_start, "percentage diff:", (eur_balance_end - eur_balance_start)/ eur_balance_start ) ;
                        console.log("BTC bal diff: ", btc_balance_end - btc_balance_start, "percentage diff:", (btc_balance_end - btc_balance_start)/ btc_balance_start );
                        console.log("NGN bal diff: ", ngn_balance_end - ngn_balance_start, "percentage diff:", (ngn_balance_end - ngn_balance_start)/ ngn_balance_start );
                        console.log("BNB bal diff: ", bnb_balance_end - bnb_balance_start, "percentage diff:", (bnb_balance_end - bnb_balance_start)/ bnb_balance_start );
                        
                        console.log("Naira gotten from bnb sale =", result.cummulativeQuoteQty)
                        console.log("Expected naira btc rate=", baseRate)

                        baseSize = Number((parseFloat(result.cummulativeQuoteQty) / baseRate ).toFixed(5))
                        console.log("baseSize: ", baseSize)
                        return binance.buy(destBase, baseSize, destBasePrice).then( result => {   //buy ngnbtc
                        //balance
                        if (result.status == "FILLED"){
                          console.log("TRADE 3...")

                          console.log("RESULT", result)

                          binance.balance((error, balances) => {
                            if ( error ) return console.error(error);
                            console.log("EUR balance end: ", balances.EUR.available);
                            console.log("BTC balance end: ", balances.BTC.available);
                            console.log("NGN balance end: ", balances.NGN.available);
                            console.log("BNB balance end: ", balances.BNB.available);
      
                            eur_balance_end = balances.EUR.available
                            btc_balance_end = balances.BTC.available
                            ngn_balance_end = balances.NGN.available
                            bnb_balance_end = balances.BNB.available
      
                            console.log("EUR bal diff: ", eur_balance_end - eur_balance_start, "percentage diff:", (eur_balance_end - eur_balance_start)/ eur_balance_start ) ;
                            console.log("BTC bal diff: ", btc_balance_end - btc_balance_start, "percentage diff:", (btc_balance_end - btc_balance_start)/ btc_balance_start );
                            console.log("NGN bal diff: ", ngn_balance_end - ngn_balance_start, "percentage diff:", (ngn_balance_end - ngn_balance_start)/ ngn_balance_start );
                            console.log("BNB bal diff: ", bnb_balance_end - bnb_balance_start, "percentage diff:", (bnb_balance_end - bnb_balance_start)/ bnb_balance_start );
                          
                            // baseSize = Number(baseSize.toFixed(2))
                          return binance.sell(baseSrc, baseSize, baseSrcPrice).then( result => { //sell btc for euro

                            if (result.status == "FILLED"){
                              console.log("TRADE 4...")
                               console.log("RESULT", result)
                              binance.balance((error, balances) => {
                                if ( error ) return console.error(error);
                                console.log("EUR balance end: ", balances.EUR.available);
                                console.log("BTC balance end: ", balances.BTC.available);
                                console.log("NGN balance end: ", balances.NGN.available);
                                console.log("BNB balance end: ", balances.BNB.available);
          
                                eur_balance_end = balances.EUR.available
                                btc_balance_end = balances.BTC.available
                                ngn_balance_end = balances.NGN.available
                                bnb_balance_end = balances.BNB.available
          
                                console.log("EUR bal diff: ", eur_balance_end - eur_balance_start, "percentage diff:", (eur_balance_end - eur_balance_start)/ eur_balance_start ) ;
                                console.log("BTC bal diff: ", btc_balance_end - btc_balance_start, "percentage diff:", (btc_balance_end - btc_balance_start)/ btc_balance_start );
                                console.log("NGN bal diff: ", ngn_balance_end - ngn_balance_start, "percentage diff:", (ngn_balance_end - ngn_balance_start)/ ngn_balance_start );
                                console.log("BNB bal diff: ", bnb_balance_end - bnb_balance_start, "percentage diff:", (bnb_balance_end - bnb_balance_start)/ bnb_balance_start );
                              })

                            }

                          })
                          
                          })
                          
                        }

                          
                        })

                      })
                    
                }
              })

            })
            
          }
         
      }).catch(err => console.log("err", err.body, err.message))
    });
  }
}

module.exports = Trader


let tradePairs = Generate.tradePairs('EUR','NGN','BTC', 'BNB') //why do we need to do this, we already do it in getArb()

// console.log(tradePairs)

let trader = new Trader();
let bnb = new Arb('EUR','NGN','BTC','BNB')
bnb.getRates().then(rates => {
  let tradePairs = bnb.tradePairs
  let bnbArb = bnb.getArb()
  let bnbArbRate = bnbArb["arbRate"] // we're calling this twice
  let baseRate = bnbArb["baseRate"] // we're calling this twice
  let message = `ArbRate: ${bnbArbRate} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
  console.log(`BNB EUR NGN: ${bnbArbRate}`,"minus fees =", Math.abs(bnbArbRate) - 0.3, "ngnBNBRate", baseRate, message)
  return {"rateForBase": baseRate, "rates": rates}
}).then(results => {
  //console.log("bnb-getRates result", results)
  // trader.fullTrade(
  //   tradePairs.trade1.tradePair, 
  //   results.rates.trade1.ask,
  //   tradePairs.trade2.tradePair, 
  //   results.rates.trade2.bid,
  //   tradePairs.trade3.tradePair, 
  //   results.rates.trade3.ask,
  //   tradePairs.trade4.tradePair, 
  //   results.rates.trade4.bid,
  //   0.0015,  //bnb
  //   results["rateForBase"]  //
  // );

  

})








