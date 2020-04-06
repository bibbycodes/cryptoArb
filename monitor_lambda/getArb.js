const Arb = require('./models/Arb')
const dbConn = require('./models/dbConn')
const Email = require('./models/Email')
const Format = require('./models/Format')

exports.func = () => {
  let busd = new Arb('EUR', 'NGN', 'BTC', 'BUSD')
  let bnb = new Arb('EUR', 'NGN', 'BTC', 'BNB')
  let recipients = ['admin@afriex.co', 'scrapyscraperng@gmail.com']

  busd.getRates()
  .then(rates => {
    let tradePairs = busd.tradePairs
    let busdArbRate = busd.getArb()
    return { rates, tradePairs, busdArbRate }
  })
  .then(async result => {
    let rates = result.rates
    let busdArbRate = result.busdArbRate
    let tradePairs = result.tradePairs
    let queryString = Format.arbDbString('EUR', 'NGN', 'BTC', 'BUSD', rates, busdArbRate)
    let db = new dbConn()
    await db.query(queryString)
    return { rates, busdArbRate, tradePairs }
  })
  .then(async res => {
    let message = `ArbRate: ${res.busdArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
    await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BUSD EUR NGN: ${res.busdArbRate}`, message)
  })

  bnb.getRates()
    .then(rates => {
      let tradePairs = bnb.tradePairs
      let bnbArbRate = bnb.getArb()
      return { rates, tradePairs, bnbArbRate }
    })
    .then(async result => {
      let rates = result.rates
      let bnbArbRate = result.bnbArbRate
      let tradePairs = result.tradePairs
      let queryString = Format.arbDbString('EUR', 'NGN', 'BTC', 'BNB', rates, bnbArbRate)
      let db = new dbConn()
      await db.query(queryString)
      return { rates, bnbArbRate, tradePairs }
    })
    .then(async res => {
      let message = `ArbRate: ${res.bnbArbRate[0]} \n TradePairs: ${JSON.stringify(res.tradePairs)} \n Rates: ${JSON.stringify(res.rates)}`
      await Email.send('arb@afriex.co', 'ARBRATE', recipients, `BNB EUR NGN: ${res.bnbArbRate}`, message)
    })
}




