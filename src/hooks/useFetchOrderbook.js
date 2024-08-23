import { useEffect, useState } from "react"
import { 
    addDepths, 
    addPrecison, 
    addTotalSums, 
    getMaxTotalSum, 
    sortOrders 
} from "../Data/Processing/Orders"


const convertRawOrdersToOrders = (rawOrders) => {
    const ordersSorted    = sortOrders(rawOrders)
    const ordersTotalSums = addTotalSums(ordersSorted)
    const ordersMaxSums   = getMaxTotalSum(ordersTotalSums)
    const orderDepths     = addDepths(ordersTotalSums, ordersMaxSums)
    const updatedOrders   = addPrecison(orderDepths)
    return updatedOrders
}

export const useFetchOrderbook = (symbol) => {
    const [orderbook, setOrderbook]   = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://stream.binance.com:9443/stream"
        const ws = new WebSocket(url)

        ws.onopen = () => {
            if (ws.readyState === ws.OPEN)
                ws.send(JSON.stringify({
                    id     : "310",
                    method : "SUBSCRIBE",
                    params : [
                        `${symbol.toLowerCase()}@depth20@1000ms`
                    ]
                }))
        }

        ws.onerror = (event) => {
            const errMsg = JSON.parse(event.data)
            throw new Error(errMsg)
        }

        ws.onmessage = (event) => {
            const crudeMessaage = JSON.parse(event.data)
            if (crudeMessaage.data) {
                const message = {
                    symbol,
                    result: {
                        bids: convertRawOrdersToOrders(crudeMessaage.data.bids),
                        asks: convertRawOrdersToOrders(crudeMessaage.data.asks)
                    }
                }
                setOrderbook(message)
            }
            setIsFetching(false)
        }

        return () => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({
                    id     : "311",
                    method : "UNSUBSCRIBE",
                    params : [
                        `${symbol.toLowerCase()}@depth20@1000ms`
                    ]
                }))
                ws.close()
            }
        }
    }, [symbol])

    return [isFetching, orderbook]
}