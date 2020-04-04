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
  

  fullTrade (srcArb, arbDest, destBase, baseSrc, arbSize, baseSize ){ 
    let eur_balance_start
    let btc_balance_start
    let ngn_balance_start
    let bnb_balance_start

    let eur_balance_end
    let btc_balance_end
    let ngn_balance_end
    let bnb_balance_end

    let eur_balance_diff
    let btc_balance_diff
    let ngn_balance_diff
    let bnb_balance_diff

    binance.balance((error, balances) => {
        if ( error ) return console.error(error);
        eur_balance_start = balances.EUR.available
        btc_balance_start = balances.BTC.available
        ngn_balance_start = balances.NGN.available
        bnb_balance_start = balances.BNB.available

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

                    eur_balance_end = balances.EUR.available
                    btc_balance_end = balances.BTC.available
                    ngn_balance_end = balances.BTC.available
                    bnb_balance_end = balances.BTC.available

                    console.log("EUR balance diff: ", eur_balance_start - eur_balance_end);
                    console.log("BTC balance diff: ", eur_balance_start - btc_balance_end);
                    console.log("NGN balance diff: ", eur_balance_start - ngn_balance_end);
                    console.log("BNB balance diff: ", eur_balance_start - bnb_balance_end);


                  })
                })
              })
            }
          })
        } 
    }).catch(err => console.log("err", err.body, err.message))
    });
  }
}

module.exports = Trader
// // let busd = new Arb('EUR', 'NGN', 'BTC', 'BUSD')
// let bnb = new Arb('EUR', 'NGN', 'BTC', 'BNB')

// // busd.getRates().then(rates => {
// //   let tradePairs = busd.tradePairs
// //   let busdArbRate = busd.getArb()
// //   let message = `ArbRate: ${busdArbRate[0]} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
// //   Email.send('arb@afriex.co', 'ARBRATE', ['tope@afriex.co', 'scrapyscraperng@gmail.com'], `BUSD EUR NGN: ${busdArbRate}`, message)
// // })

// bnb.getRates().then(rates => {
//   let tradePairs = bnb.tradePairs
//   let bnbArbRate = bnb.getArb()
//   console.log(bnbArbRate)
//   // let message = `ArbRate: ${bnbArbRate[0]} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
//   // Email.send('arb@afriex.co', 'ARBRATE', ['tope@afriex.co', 'scrapyscraperng@gmail.com'], `BNB EUR NGN: ${bnbArbRate}`, message)
// })

let tradePairs = Generate.tradePairs('EUR','NGN','BTC','BUSD')

console.log(tradePairs)
let trader = new Trader();
// trader.fullTrade('BTCEUR', 'BTCNGN', 'BNBNGN', 'BNBEUR', 0.0084, 4.38);
trader.fullTrade(
  tradePairs.trade1.tradePair, 
  tradePairs.trade2.tradePair, 
  tradePairs.trade3.tradePair, 
  tradePairs.trade4.tradePair, 
  0.006,
  45
);



