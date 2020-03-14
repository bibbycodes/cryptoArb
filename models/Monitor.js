require('dotenv').config()
const WebSocket = require('ws')
const ccxws = require('ccxws');
const binance = new ccxws.binance()
const coinbase = new ccxws.coinbasepro()
const kraken = new ccxws.kraken()

const market = {
  id: "BTCUSDT",
  base: "BTC",
  quote: "USDT"
}

binance.subscribeTicker(market)
coinbase.subscribeTicker(market)
coinbase.subscribeTrades(market)
kraken.subscribeTicker(market)

// binance.on("ticker", snapshot => {
//   console.log(snapshot)
// })

coinbase.on("trade", trade => {
  console.log(trade)
})

coinbase.on("ticker", snapshot => {
  console.log(snapshot)
})

kraken.on("ticker", snapshot => {
  console.log(snapshot)
})


class Monitor {
  constructor(){
    this.pk = process.env.CB_PK
    this.sk = process.env.CB_SK
    this.passphrase = process.env.CB_PASS
    this.apiUrl = "https://api-public.sandbox.pro.coinbase.com"
  }

  // symbols is array of symbols ie "ETH-USD"
  monitorCB(symbols) {
    const wsUrl = "wss://ws-feed-public.sandbox.pro.coinbase.com"
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      "type": "subscribe",
      "product_ids": ["BTC-USD", "ETH-USD"],
      "channels": [
        "ticker",
        "heartbeat",
        {
          "name": "ticker",
          "product_ids": ["BTC-USD", "ETH-USD"]
        }
      ]
    }

    ws.on('open', () => {
      ws.send(JSON.stringify(subscribePayload))
    })
   
    ws.on('message', message => {
      message = JSON.parse(message)
      if (message.type == "ticker") {
        console.log(message.price)
      }
    })
  }
}

cb = new Monitor()

cb.monitorCB(['ETH-USD', "ETH-EUR"])