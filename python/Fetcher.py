import requests
import lxml.etree as etree

# class Fetcher:

def exchangeRate(base, quote):
  headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'}
  res = requests.get('https://www.google.com/search?q={}+{}'.format(base, quote), headers=headers)
  html = res.text
  dom = etree.HTML(html)
  div = dom.xpath("//div[contains(@id,'knowledge-currency__updatable-data-column')]//span[1]//@data-value")
  # "//div[contains(@id,'knowledge-currency__updatable-data-column')]//span[1]//@data-value"
  # '//span[@id="knowledge-currency__updatable-data-column"]'
  # "//div[contains(@class,'SwHCTb')]"
  # "//span[contains(@class,'SwHCTb')]"
  print(div)

exchangeRate('GBP', 'USD')