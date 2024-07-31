import { useEffect, useState } from "react"
import { SIDE } from "../constants"


const convertRawTradesToTrades = (rawTrades) => {
    return rawTrades.map(rawTrade => {
        return {
            date: new Date(rawTrade.time),
            side: rawTrade.isBuyerMaker ? SIDE.SELL : SIDE.BUY,
            quote: parseFloat(rawTrade.quoteQty),
            qty: parseFloat(rawTrade.qty),
            price: parseFloat(rawTrade.price)
        }
    })
}

export const useFetchTrades = (symbol) => {
    const [result, setResult]         = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://ws-api.binance.com:443/ws-api/v3"
        const ws  = new WebSocket(url)

        const sendData = () => {
            ws.send(JSON.stringify({
                id: "314",
                method: "trades.recent",
                params: {
                    symbol: symbol,
                    limit: 50
                }
            }))
        }

        ws.onopen= () => {
            const msgInterval = setInterval(() => sendData(), 500)
            ws.onclose = () => clearInterval(msgInterval)
        }

        ws.onerror = (event) => {
            if (event?.data) {
                const errMsg = JSON.parse(event.data)
                console.log(errMsg)
            }
        }

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data)
            if (newMessage.status === 200)
                setResult({symbol: symbol, result: convertRawTradesToTrades(newMessage.result)})
            setIsFetching(false)
        }

        return () => ws.close()
        
    }, [symbol])

    return [isFetching, result]
}