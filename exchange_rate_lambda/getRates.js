exports.func = async () => {
  require('dotenv').config()
  const axios = require('axios')
  const dbConn = require('./dbConn')

  let res = await axios.get(
    `https://api.sandbox.transferwise.tech/v1/rates`,
    {headers: {Authorization:` Bearer ${process.env.TW_KEY}`}}
  ).catch(err => console.log(err))
  let rates = res.data
  let currencies = ['NGN', 'GBP', 'USD', 'EUR', 'SFR', 'CAD', 'DKK']

  let timestamp = Date.now()

  for (let rate of rates) {
    if (currencies.includes(rate.source)) {
      if (currencies.includes(rate.target)) {
        let db = new dbConn()
        await db.query(
          `INSERT INTO tw_exchange_rates_history (source, target, rate, timestamp) 
          VALUES ('${rate.source}', '${rate.target}', ${rate.rate}, ${timestamp});`
        )
      }
    }
  }
}