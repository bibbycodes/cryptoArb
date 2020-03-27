require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express')
const PORT = process.env.PORT || 5000;
const app = express()
const dbConn = require('./dbConn')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/rates/all', async (req, res) => {
  let db = new dbConn()
  let result = await db.query('SELECT * FROM tw_exchange_rates_history;').catch(err => console.log(err))
  let rates = result.rows
  res.json(rates)
})

app.get('/rates/last/:source/:target', async (req, res) => {
  let db = new dbConn()
  let source = req.params.source.toUpperCase()
  let target = req.params.target.toUpperCase()
  let result = await db.query(
    `SELECT * FROM tw_exchange_rates_history
    WHERE source='${source}' AND target='${target}';`
    ).catch(err => console.log(err))
  let rates = result.rows
  console.log(result.rows)
  res.json(rates)
})



app.get('/symbols/all', async(req, res) => {
  let db = new dbConn()
  let result = await db.query('SELECT * FROM order_book_best;')
  res.json(result.rows)
})

app.get('/symbols/:exchange/:symbol/', async(req, res) => {
  let db = new dbConn()
  let exchange = req.params.exchange
  let symbol = req.params.symbol
  let result = await db.query(
    `SELECT * FROM order_book_best
    WHERE exchange='${exchange}' AND pair='${symbol}';`
    )
  res.send(result.rows)
})

app.get('*', (req, res) => {
  res.send('CryptoArb')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
})

module.exports.handler = serverless(app);