const cheerio = require('cheerio')
const axios = require('axios')
const xpath = require('xpath')
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const dom = require('xmldom').DOMParser
require('dotenv').config()

class Fetcher {
  static async googleExchangeRate(base, quote) {
    let document = parse5.parse(res.data.toString());
    let xhtml = xmlser.serializeToString(document)
    let doc = new dom().parseFromString(xhtml)
    const select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
    let nodes = select("//div", doc)
    console.log($('div[class="g obcontainer"]').html())
    return res
  }

  static async fixerExchangeRate(base, quote) {
    const key = process.env.FIXER_KEY
    if (base == "USDT") {
      base = "USD"
    }

    if (quote == "USDT") {
      quote = "USD"
    }

    let res = await axios.get(`http://data.fixer.io/api/latest?access_key=${key}&symbols=${base},${quote}`)
    let resBase = parseFloat(res.data.rates[base])
    let resQuote = parseFloat(res.data.rates[quote])
    let converted = resBase / resQuote
    return converted
  }

  static async transferWiseRates(source, target) {
    if (["USDC", "USDT"].includes(target)) {
      target = "USD"
    }

    let res = await axios.get(
      `https://api.sandbox.transferwise.tech/v1/rates?source=${source}&target=${target}`,
      {headers: {Authorization:` Bearer ${process.env.TW_KEY}`}}
    ).catch(err => console.log(err))
    
    return res.data[0].rate
  }

  async coinbasePairs() {
    let base_url = "https://api.pro.coinbase.com"
    let response = await axios.get(base_url + '/products')
    let pairs = response.data.map(pair => pair.id)
    return pairs
  }
}

module.exports = Fetcher