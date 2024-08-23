import { useEffect, useState } from "react"
import { SIDE } from "../Tools"


const convertRawTradesToTrades = (rawTrades) => {
    return rawTrades.map((rawTrade, idx) => {
        return {
            id: idx,
            date: new Date(rawTrade.time),
            side: rawTrade.isBuyerMaker ? SIDE.SELL : SIDE.BUY,
            quote: parseFloat(rawTrade.quoteQty),
            qty: parseFloat(rawTrade.qty),
            price: parseFloat(rawTrade.price)
        }
    })
}

export const useFetchTrades = (symbol) => {
    const [tradebook, setTradebook] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://ws-api.binance.com:443/ws-api/v3"
        const ws  = new WebSocket(url)

        const sendData = () => {
            if (ws.readyState === ws.OPEN)
                ws.send(JSON.stringify({
                    id: "313",
                    method: "trades.recent",
                    params: {
                        symbol: symbol,
                        limit: 50
                    }
                }))
        }

        ws.onopen= () => {
            const msgInterval = setInterval(() => sendData(), 1000)
            ws.onclose = () => clearInterval(msgInterval)
        }

        ws.onerror = (event) => {
            const errMsg = JSON.parse(event.data)
            throw new Error(errMsg)
        }

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data)
            if (newMessage.status === 200) {
                const message = {
                    symbol,
                    result: convertRawTradesToTrades(newMessage.result)
                }
                setTradebook(message)
            }
            setIsFetching(false)
        }

        return () => {
            if (ws.readyState === ws.OPEN)
                ws.close()
        }
        
    }, [symbol])

    return [isFetching, tradebook]
}