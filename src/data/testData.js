
export const getTestSymbols = () => {
    return [
        "ETHUSDT",
        "BTCUSDT"
    ]
}

export const getTestUIKlines = (symbol) => {
    const max = symbol === "BTCUSDT" ? 70000 : 3600
    const min = symbol === "BTCUSDT" ? 68000: 3500
    let klines = []
    let idx    = 0
    let dateTms = new Date(1707520080000)
    while (idx < 1000) {
        const open = Math.random() * (max - min) + min
        const high = Math.random() * (max - min) + min
        const low  = Math.random() * (max - min) + min
        const close = Math.random() * (max - min) + min
        const volume = Math.random() * (400000 - 0)
        const kline = {
            date: dateTms,
            open: open.toFixed(3),
            high: high.toFixed(3),
            low: low.toFixed(3),
            close: close.toFixed(3),
            volume: volume.toFixed(3)
        }
        dateTms = addOneMinuteToDate(dateTms)
        klines.push(kline)
        idx += 1
    }
    return klines
}

export const getTestOrderbook = (symbol) => {
    const max = symbol === "BTCUSDT" ? 70000 : 3600
    const min = symbol === "BTCUSDT" ? 68000: 3500
    const orderbook = {
        bids: [],
        asks: []
    }
    let idx = 0
    while (idx < 10) {
        const bidPrice = Math.random() * (max - min) + min
        const bidQty   = Math.random()
        const askPrice = Math.random() * (max - min) + min
        const askQty   = Math.random() 
        orderbook.bids.push([bidPrice.toFixed(2), bidQty.toFixed(2)])
        orderbook.asks.push([askPrice.toFixed(2), askQty.toFixed(2)])
        idx += 1
    }
    return orderbook
}


const addOneMinuteToDate = (date) => {
    let newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() + 1)
    return newDate
}