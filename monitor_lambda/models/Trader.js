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



class Trader{

    constructor (){
        console.log("Let the trading begin!!!");
    }

    fullTrade (srcArb, arbDest, destBase, baseSrc, arbSize, baseSize ){ 

        binance.balance((error, balances) => {
            if ( error ) return console.error(error);
            console.log("EUR balance: ", balances.EUR.available);
            console.log("BTC balance: ", balances.BTC.available);
            console.log("NGN balance: ", balances.NGN.available);
            console.log("BNB balance: ", balances.BNB.available);
        
        
        let tradeAmount 
        binance.marketBuy(srcArb, arbSize).then( response => {
            
            if (response.status == "FILLED") {
                tradeAmount = Number((parseFloat(response.executedQty) - (parseFloat(response.executedQty) * 0.01)).toFixed(3))
                
                return binance.marketSell(arbDest, arbSize).then( result => {
                    if (result.status == "FILLED"){
                        
                        return binance.marketBuy(destBase, baseSize).then( result => {
                            
                            tradeAmount = Number((parseFloat(result.executedQty) - (parseFloat(result.executedQty) * 0.01)).toFixed(2))
                            
                            return binance.marketSell(baseSrc, baseSize).then( result => {
                                
                                binance.balance((error, balances) => {
                                    if ( error ) return console.error(error);
                                    console.log("EUR balance: ", balances.EUR.available);
                                    console.log("BTC balance: ", balances.BTC.available);
                                    console.log("NGN balance: ", balances.NGN.available);
                                    console.log("BNB balance: ", balances.BNB.available);
                                    
                                })
                            })
                        })
                    }
                })
            } 
        }).catch(err => console.log(err.body, err.message))
    
        });
    
    }

        


        


}


let trader = new Trader();
// (srcArb, arbDest, destBase, baseSrc, arbSize, baseSize )
trader.fullTrade('BTCEUR', 'BTCNGN', 'BNBNGN', 'BNBEUR', 0.0084, 4.38);



