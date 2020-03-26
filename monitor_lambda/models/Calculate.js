class Calculate {
  static relativeDifference(priceA, priceB, mesaage) {
    let relativeDifference = ((priceA - priceB) / (Math.max(priceA, priceB)) * 100).toFixed(2)
    return [relativeDifference]
  }
}

module.exports = Calculate