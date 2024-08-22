import { useEffect, useState } from "react"


export const useFetch24hrTicker = (symbol) => {
    const [tickerData, setTicker] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://stream.binance.com:9443/stream"
        const ws = new WebSocket(url)

        ws.onopen = () => {
            if (ws.readyState === ws.OPEN)
                ws.send(JSON.stringify({
                    id     : "314",
                    method : "SUBSCRIBE",
                    params : [
                        `${symbol.toLowerCase()}@ticker@1000ms`
                    ]
                }))
        }

        ws.onerror = (event) => {
            if (event?.ticker) {
                const errMsg = JSON.parse(event.ticker)
                console.log(errMsg)
            }
        }

        ws.onmessage = (event) => {
            const crudeMessaage = JSON.parse(event?.data)
            if (crudeMessaage.data) {
                const ticker = crudeMessaage.data
                const message = {
                    symbol: symbol,
                    result: {
                        high: parseFloat(ticker.h),
                        low: parseFloat(ticker.l),
                        price: parseFloat(ticker.p),
                        pricePercent: parseFloat(ticker.P),
                        lastPrice: parseFloat(ticker.c),
                        volumeBase: parseFloat(ticker.v),
                        volumeQuote: parseFloat(ticker.q)
                    }
                }
                setTicker(message)
            }
            setIsFetching(false)
        }

        return () => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({
                    id     : "315",
                    method : "UNSUBSCRIBE",
                    params : [
                        `${symbol.toLowerCase()}@ticker@1000ms`
                    ]
                }))
                ws.close()
            }
        }
    }, [symbol])

    return [isFetching, tickerData]
}