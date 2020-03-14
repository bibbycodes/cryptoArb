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

  monitorCB(symbols) {
    const wsUrl = "wss://ws-feed-public.sandbox.pro.coinbase.com"
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      "type": "subscribe",
      "product_ids": symbols,
      "channels": [
        "ticker",
        "level2",
      ]
    }

    ws.on('open', () => {
      ws.send(JSON.stringify(subscribePayload))
    })
   
    ws.on('message', message => {
      message = JSON.parse(message)
      if (message.type == "ticker") {
        console.log(message)
      }

      if (message.type == "snapshot") {
        console.log(message)
      }

      if (message.type == "l2update") {
        console.log(message)
      }
    })
  }

  monitorKR(symbols) {
    const wsUrl = "wss://ws.kraken.com"
    const ws = new WebSocket(wsUrl)
    const subscribePayload = {
      "event": "subscribe",
      "pair": symbols,
      "subscription": {
        "name": "ticker"
      }
    }

    ws.on("open", () => {
      ws.send(JSON.stringify(subscribePayload))
    })

    ws.on("message", message => {
      message = JSON.parse(message)
      if (message.event != "heartbeat") {
        console.log(message)
      }
    })
  }
}

cb = new Monitor()

cb.monitorKR(['BTC/USD', 'BTC/EUR'])