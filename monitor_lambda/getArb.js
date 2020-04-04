const Arb = require('./models/Arb')
const Email = require('./models/Email')

exports.func = () => {
  let busd = new Arb('EUR', 'NGN', 'BTC', 'BUSD')
  let bnb = new Arb('EUR', 'NGN', 'BTC', 'BNB')
  let recipients = ['admin@afriex.co', 'scrapyscraperng@gmail.com']

  busd.getRates()
  .then(rates => {
    let tradePairs = busd.tradePairs
    let busdArbRate = busd.getArb()
    return { rates, tradePairs, busdArbRate }
  }).then(async res => {
    let message = `ArbRate: ${res.busdArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
    await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BUSD EUR NGN: ${res.busdArbRate}`, message)
  })

  // bnb.getRates()
  //   .then(rates => {
  //     let tradePairs = bnb.tradePairs
  //     let bnbArbRate = bnb.getArb()
  //     return { rates, tradePairs, bnbArbRate }
  //   }).then(async res => {
  //     let message = `ArbRate: ${res.bnbArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
  //     await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BNB EUR NGN: ${res.bnbArbRate}`, message)
  //   })
} 


