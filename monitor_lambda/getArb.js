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

<<<<<<< HEAD
  bnb.getRates().then(rates => {
    let tradePairs = bnb.tradePairs
    console.log(tradePairs)
    console.log(rates)
    let bnbArbRate = bnb.getArb()
    console.log(bnbArbRate)
    let message = `ArbRate: ${bnbArbRate[0]} \n TradePairs: ${JSON.stringify(tradePairs)} \n Rates: ${JSON.stringify(rates)}`
    Email.send('arb@afriex.co', 'ARBRATE', ['tope@afriex.co', 'scrapyscraperng@gmail.com'], `BNB EUR NGN: ${bnbArbRate}`, message)
  })
}, null, true, 'America/Chicago');
job.start();
// } 
=======
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


>>>>>>> 8e2bd313cf3ccb518f68d9bedc057ea381cbef37


