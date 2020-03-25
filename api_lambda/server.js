require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express')
const PORT = process.env.PORT || 5000;
const app = express()
const dbConn = require('./dbConn')
const bodyParser = require('body-parser')
// const cors = require('cors');

// app.use(cors())
app.use(bodyParser.json())

app.get('/rates', (req, res) => {

  res.send("Hello")
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
})

module.exports.handler = serverless(app);