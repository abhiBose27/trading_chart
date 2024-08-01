import axios from "axios"

export const getExchangeInfo = async() => {
    let requiredData = []
    const url = "https://api.binance.com/api/v3/exchangeInfo?permissions=SPOT"
    const response = await axios.get(url)
    if (response.status !== 200)
        return requiredData
    const crudeData = response.data
    for (let symbol of crudeData.symbols) {
        if (symbol.status === "TRADING")
            requiredData.push(symbol.symbol)
    }
    requiredData.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)
    return requiredData
}

export const get24hTicker = async(symbols) => {
    const url = "https://api.binance.com/api/v3/ticker/24hr"
    const response = await axios.get(url)
    if (response.status !== 200)
        return []
    const crudeData = response.data.filter(symbol => symbols.includes(symbol.symbol))
    return crudeData.map(elm => {
        return {
            symbol: elm.symbol, 
            priceChange: parseFloat(elm.priceChange), 
            priceChangePercent: parseFloat(elm.priceChangePercent), 
            lastPrice: parseFloat(elm.lastPrice),
            prevClosePrice: parseFloat(elm.prevClosePrice)
        }
    })
}


