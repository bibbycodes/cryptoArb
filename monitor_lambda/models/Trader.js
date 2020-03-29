// Binance API Rate Limit
// At the current time Binance rate limits are: 
// 1200 requests per minute. 
// 10 orders per second. 
// 100,000 orders per 24hrs.


const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '9MVXpunOLoJaePCGv3diL9iwreNQBQHDUs5e7gjCdTBj5loFpW6FjKqMU05uYjFx',
  APISECRET: 'qIRk2ZS331GyGPErPZo8TmhOxy9CjO16DMxb85NjTEoQeqwhSw5m1DCKRhdwCcc0'
});


//pairs are BUSD/NGN, EUR/BUSD, BTCEUR, BTCNGN

class Trader{

    constructor (){
        console.log("I AM THE CONSTRUCTOR");
    }

    async fullTrade(sourceArbPair, arbTargetPair, targetBasePair, baseSourcePair, amount){
        //arb is the coin that is being traded
        //base is the intemediary between souce and target
        //source is our starting currency
        //target is the destination currency

        console.log("I AM BINANCE TRADE", this.binanceTrade)
        await this.binanceTrade(sourceArbPair, amount, 'sell').then(result => {
            if (result.status == "FILLED"){
                return this.binanceTrade(arbTargetPair, result.cummulativeQuoteQty, "buy")
                .then(result2 => {
                    if (result2.status == "FILLED"){
                        return this.binanceTrade(targetBasePair, result2.cummulativeQuoteQty, "sell")
                    }
                })
                    .then(result3 => {
                        if (result3.status == "FILLED"){
                        return this.binanceTrade(baseSourcePair, result.cummulativeQuoteQty, "buy")
                    }})
                        .then(result3 => {
                            if (result3.status == "FILLED"){
                                console.log ("we're done")
                                binance.balance((error, balances) => {
                                    if ( error ) return console.error(error);
                                    //console.log("balances()", balances);
                                    console.log("BUSD balance: ", balances.BUSD.available);
                                    console.log("EUR balance: ", balances.EUR.available);
                                    console.log("BTC balance: ", balances.BTC.available);
                                    console.log("NGN balance: ", balances.BTC.available);
                                    console.log("-----------------------------------------------");
                                }
                                )

                            }
                        })
                    
                
            } else {
                console.log("didn't work")
            }

            let orderId = result.orderId


        }).catch(err => console.log(err))

    }

    binanceTrade(pair, amount, orderType) {
        binance.balance((error, balances) => {
            if ( error ) return console.error(error);
            //console.log("balances()", balances);
            console.log("BUSD balance: ", balances.BUSD.available);
            console.log("EUR balance: ", balances.EUR.available);
            console.log("BTC balance: ", balances.BTC.available);
            console.log("NGN balance: ", balances.BTC.available);
            console.log("-----------------------------------------------");
    
            console.log("PAIR=", pair, "AMOUNT=", amount, "ORDERTYPE=", orderType)

            if(orderType == 'buy') {
                binance.marketBuy(pair, amount).then( response => {
                    console.log("market order buy res", response)
                    console.log('Order details! - ' + response.fills);
                    return('Order details! - ' + response.fills);
                }).catch(err => console.log(err))
            }
    
            if(orderType == 'sell') {
                binance.marketSell(pair, amount).then( response => {
                    console.log("market order buy res", response)
                    console.log('Order details! - ' + response.fills);
                    return('Order details! - ' + response.fills);
                }).catch(err => console.log(err))
            }
            
    
            return
            
        });
    }


}



let trader = new Trader();
trader.fullTrade('BTCEUR', 'BTCNGN', 'BNBNGN', 'BNBEUR', 35);