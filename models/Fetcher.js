const cheerio = require('cheerio')
const axios = require('axios')
const xpath = require('xpath')
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const dom = require('xmldom').DOMParser

class Fetcher {
  static async exchangeRate(base, quote) {
    let res = await axios.get(`https://www.google.com/search?q=${base}+${quote}`).catch(err => console.log(err))
    let document = parse5.parse(res.data.toString());
    let xhtml = xmlser.serializeToString(document)
    var doc = new dom().parseFromString(xhtml)
    const select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});
    var nodes = select("//div[@class='g obcontainer']", doc)
    console.log(nodes)
    // $('div[aria-label="Currency exchange rate converter"]').html()
    // console.log($('div[class="g obcontainer"]').html())
  }
}

Fetcher.exchangeRate('ngn', 'usd')

module.exports = Fetcher