const Generate = require('./Generate')
const Arb = require('./Arb')


const Binance = require('node-binance-api');
const binance = new Binance({
  APIKEY: '9MVXpunOLoJaePCGv3diL9iwreNQBQHDUs5e7gjCdTBj5loFpW6FjKqMU05uYjFx',
  APISECRET: 'qIRk2ZS331GyGPErPZo8TmhOxy9CjO16DMxb85NjTEoQeqwhSw5m1DCKRhdwCcc0'
});

class Trade {
  constructor (){
      console.log("Let the trading begin!!!");
      this.balances = {}
  }
  

  fullTrade(trade1, trade2, trade3, trade4, tradeAmount, baseRate){ 
    let eur_balance_start
    let btc_balance_start
    let ngn_balance_start
    let bnb_balance_start

    let eur_balance_end
    let btc_balance_end
    let ngn_balance_end
    let bnb_balance_end

    binance.balance((error, balances) => {
      if ( error ) return console.error(error);
      eur_balance_start = balances.EUR.available
      btc_balance_start = balances.BTC.available
      ngn_balance_start = balances.NGN.available
      bnb_balance_start = balances.BNB.available
    
      let baseSize 
      binance.marketBuy(trade1, tradeAmount).then( response => { // buy euro/bnb
          if (response.status == "FILLED") {
            binance.balance((error, balances) => {
              if ( error ) return console.error(error);
              eur_balance_end = balances.EUR.available
              btc_balance_end = balances.BTC.available
              ngn_balance_end = balances.NGN.available
              bnb_balance_end = balances.BNB.available

              return binance.marketSell(trade2, tradeAmount).then( result => { // sell bnb/naira
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
                        return binance.marketBuy(trade3, baseSize).then( result => {   //buy ngnbtc
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
                          return binance.marketSell(trade4, baseSize).then( result => { //sell btc for euro

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
            //tradeAmount = Number((parseFloat(response.executedQty) - (parseFloat(response.executedQty) * 0.01)).toFixed(3))
            
          }
         
      }).catch(err => console.log("err", err.body, err.message))
    });
  }

  getBalances()
}