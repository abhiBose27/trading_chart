import axios from 'axios';

export const getExchangeInfo = async() => {
    let requiredData = []
    const url = "https://api.binance.com/api/v3/exchangeInfo"
    const response = await axios.get(url)
    if (response.status !== 200)
        return requiredData
    const crudeData = response.data
    for (let symbol of crudeData.symbols) {
        if (symbol.status === "TRADING")
            requiredData.push(symbol.symbol)
    }
    requiredData.sort()
    return requiredData
}




