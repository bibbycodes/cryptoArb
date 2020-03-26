require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express')
const PORT = process.env.PORT || 5000;
const app = express()
const dbConn = require('./dbConn')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/rates', async (req, res) => {
  let db = new dbConn()
  let result = await db.query('SELECT * FROM tw_exchange_rates_history;').catch(err => console.log(err))
  let rates = result.rows
  res.json(rates)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
})

module.exports.handler = serverless(app);