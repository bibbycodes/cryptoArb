// Binance API Rate Limit
// At the current time Binance rate limits are: 
// 1200 requests per minute. 
// 10 orders per second. 
// 100,000 orders per 24hrs.




const Binance = require('node-binance-api');
const binance = new Binance({
  APIKEY: '9MVXpunOLoJaePCGv3diL9iwreNQBQHDUs5e7gjCdTBj5loFpW6FjKqMU05uYjFx',
  APISECRET: 'qIRk2ZS331GyGPErPZo8TmhOxy9CjO16DMxb85NjTEoQeqwhSw5m1DCKRhdwCcc0'
});




//pairs are BUSD/NGN, EUR/BUSD, BTCEUR, BTCNGN

class Trader{

    constructor (){
        console.log("I AM THE CONSTRUCTOR");
    }

    fullTrade(sourceArbPair, arbTargetPair, targetBasePair, baseSourcePair, amount, direction){

        
        let tradeAmount = amount

        
       
        



    }

        


        


}


let trader = function(){ 

    binance.balance((error, balances) => {
        if ( error ) return console.error(error);
        console.log("EUR balance: ", balances.EUR.available);
        console.log("BTC balance: ", balances.BTC.available);
        console.log("NGN balance: ", balances.NGN.available);
        console.log("BNB balance: ", balances.BNB.available);
    });
    
    let tradeAmount 
    binance.marketBuy('BTCEUR', 0.004).then( response => {
        console.log("1st trade", response) 
        if (response.status == "FILLED") {
            tradeAmount = Number((parseFloat(response.executedQty) - (parseFloat(response.executedQty) * 0.01)).toFixed(3))
            console.log("TRADE AMOUNT 2", tradeAmount)
            return binance.marketSell('BTCNGN', tradeAmount).then( result => {
                if (result.status == "FILLED"){
                    console.log("2nd trade", result)
                    // we cannot use trade amount for the next trade
                    return binance.marketBuy('BNBNGN', 1.5).then( result => {
                        console.log("3rd trade", result)
                        tradeAmount = Number((parseFloat(result.executedQty) - (parseFloat(result.executedQty) * 0.01)).toFixed(2))
                        console.log("Final trade amount", tradeAmount)
                        return binance.marketSell('BNBEUR', tradeAmount).then( result => {
                            console.log("4th trade", result)
                        })
                    })
                }
            })
        } 
    }).catch(err => console.log(err.body, err.message))

}()





// let trader = new Trader();
// trader.fullTrade('BTCEUR', 'BTCNGN', 'BNBNGN', 'BNBEUR', 0.005);