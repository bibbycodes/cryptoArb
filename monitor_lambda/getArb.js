const Arb = require('./models/Arb')
const Email = require('./models/Email')

exports.func = async () => {
  let busd = new Arb('EUR', 'NGN', 'BTC', 'BUSD')
  let bnb = new Arb('EUR', 'NGN', 'BTC', 'BNB')

  busd.getRates().then(rates => {
    let tradePairs = busd.tradePairs
    let busdArbRate = busd.getArb()
    let message = `ArbRate: ${busdArbRate[0]} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
    Email.send('arb@afriex.co', 'ARBRATE', ['tope@afriex.co', 'scrapyscraperng@gmail.com'], `BUSD EUR NGN: ${busdArbRate}`, message)
  })

  bnb.getRates().then(rates => {
    let tradePairs = bnb.tradePairs
    console.log(tradePairs)
    console.log(rates)
    let bnbArbRate = bnb.getArb()
    console.log(bnbArbRate)
    let message = `ArbRate: ${bnbArbRate[0]} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
    Email.send('arb@afriex.co', 'ARBRATE', ['tope@afriex.co', 'scrapyscraperng@gmail.com'], `BNB EUR NGN: ${bnbArbRate}`, message)
  })
} 


