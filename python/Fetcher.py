import requests
import random
import lxml.etree as etree

# class Fetcher:

proxies = [
  "104.238.173.126:8080",
  "145.239.7.84:3128",
  "45.77.91.174:8080",
  "45.76.142.104:8080",
  "51.68.213.95:3128",
  "51.38.69.83:8080",
  "51.38.69.39:8080",
  "88.150.180.219:3128",
  "88.150.180.248:3128",
  "88.150.180.249:3128",
  "88.150.180.250:3128",
  "88.150.180.251:3128",
  "95.179.196.203:8080",
  "104.238.173.126:8080",
  "145.239.7.84:3128",
  "142.93.36.41:3128",
  "45.77.91.174:8080",
  "45.76.142.104:8080",
  "51.68.213.95:3128",
  "51.38.69.83:8080",
  "51.38.69.39:8080",
  "88.150.180.219:3128",
  "88.150.180.249:3128",
  "88.150.180.250:3128",
  "88.150.180.248:3128",
  "88.150.180.251:3128",
  "95.179.196.203:8080",
  "104.238.173.126:8080",
  "142.93.36.41:3128",
  "145.239.7.84:3128",
  "45.77.91.174:8080",
  "45.76.142.104:8080",
  "51.68.213.95:3128",
  "88.150.180.219:3128",
  "88.150.180.248:3128",
  "88.150.180.249:3128",
  "88.150.180.250:3128",
  "88.150.180.251:3128",
  "95.179.196.203:8080",
  "104.238.173.126:8080",
  "45.77.91.174:8080",
  "45.76.142.104:8080",
  "51.68.213.95:3128",
  "51.38.69.83:8080",
  "88.150.180.219:3128",
  "88.150.180.249:3128",
  "88.150.180.250:3128",
  "88.150.180.248:3128",
  "88.150.180.251:3128",
  "95.168.185.183:8080",
]

def fetch_with_random_proxy(endpoint):
  session = requests.Session()
  session.headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'}
  proxy = random.choice(proxies)
  session.proxies = {'http' : 'http://{}'.format(proxy)}
  response = session.get(endpoint, stream = True)
  return response

def exchange_rate(base, quote):
  headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'}
  res = fetch_with_random_proxy('https://www.google.com/search?q={}+{}'.format(base, quote))
  html = res.text
  dom = etree.HTML(html)
  div = dom.xpath("//div[contains(@id,'knowledge-currency__updatable-data-column')]//span[1]//@data-value")
  return div

exchange_rate('GBP', 'USD')
