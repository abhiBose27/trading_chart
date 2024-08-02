import { useEffect, useState } from "react"


const addTotalSums = (orders) => {
    return orders.map((order) => {
        const totalSum     = order[0] * order[1]
        const updatedLevel = [...order, totalSum]
        return updatedLevel
    })
}

const addDepths = (orders, maxTotal) => {
    return orders.map(order => {
        const depth        = (order[2] / maxTotal) * 100
        const updatedLevel = [...order, depth]
        return updatedLevel
    })
}

const addPrecison = (orders) => {
    return orders.map((order, idx) => {
        const orderPrice    = order[0]
        const orderQty      = order[1]
        const orderTotalSum = order[2]
        return {
            id: idx, 
            level: [orderPrice, orderQty, orderTotalSum, order[3]]
        }
    })
}

const getMaxTotalSum = (orders) => {
    const totalSum = orders.map(order => order[2])
    return Math.max(...totalSum)
}

const sortOrders = (orders) => {
    let updatedOrders = orders.map((order) => [parseFloat(order[0]), parseFloat(order[1])])
    updatedOrders.sort((a, b) => b[0] - a[0])
    return updatedOrders
}

const convertRawOrdersToOrders = (rawOrders) => {
    const ordersSorted    = sortOrders(rawOrders)
    const ordersTotalSums = addTotalSums(ordersSorted)
    const ordersMaxSums   = getMaxTotalSum(ordersTotalSums)
    const orderDepths     = addDepths(ordersTotalSums, ordersMaxSums)
    const updatedOrders   = addPrecison(orderDepths)
    return updatedOrders
}

export const useFetchOrderbook = (symbol) => {
    const [data, setData]         = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://stream.binance.com:9443/stream"
        const ws = new WebSocket(url)

        ws.onopen = () => {
            ws.send(JSON.stringify({
                id     : "310",
                method : "SUBSCRIBE",
                params : [
                    `${symbol.toLowerCase()}@depth20@1000ms`
                ]
            }))
        }

        ws.onerror = (event) => {
            if (event?.data) {
                const errMsg = JSON.parse(event.data)
                console.log(errMsg)
            }
        }

        ws.onmessage = (event) => {
            const crudeMessaage = JSON.parse(event?.data)
            if (crudeMessaage.data) {
                const message = {
                    symbol: symbol,
                    result: {
                        bids: convertRawOrdersToOrders(crudeMessaage.data.bids),
                        asks: convertRawOrdersToOrders(crudeMessaage.data.asks)
                    }
                }
                setData(message)
            }
            setIsFetching(false)
        }

        return () => {
            ws.send(JSON.stringify({
                id     : "312",
                method : "UNSUBSCRIBE",
                params : [
                    `${symbol.toLowerCase()}@depth20@1000ms`
                ]
            }))
            ws.close()
        }
    }, [symbol])

    return [isFetching, data]
}