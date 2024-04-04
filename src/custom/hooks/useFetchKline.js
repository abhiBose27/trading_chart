import { useState, useEffect } from "react";


const uiCrudeDataToData = (crudeData) => {
    return crudeData.map(klineData => {
        return {
            date: new Date(klineData[0]),
            open: parseFloat(klineData[1]),
            high: parseFloat(klineData[2]),
            low: parseFloat(klineData[3]),
            close: parseFloat(klineData[4]),
            volume: parseFloat(klineData[5]),
            change: parseFloat(((klineData[4] / klineData[1] - 1) * 100))
        }
    })
}

export const useFetchKline = (symbol, interval) => {
    const [result, setResult]         = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://ws-api.binance.com:443/ws-api/v3"
        const ws = new WebSocket(url)

        const sendData = () => {
            ws.send(JSON.stringify({
                id: "312",
                method: "uiKlines",
                params: {
                    symbol: symbol,
                    interval: interval,
                    limit: 1000
                }
            }))
        }

        const handleOnOpen = () => {
            const msgInterval = setInterval(() => sendData(), 1000)
            const terminateSchedules = () => {
                console.log("Clear the schedules")
                return clearInterval(msgInterval)
            }
            ws.addEventListener("close", terminateSchedules)
            return () => ws.removeEventListener("close", terminateSchedules)
            
        }

        const handleOnMessage = (event) => {
            const newMessage = JSON.parse(event.data)
            if (newMessage.status === 200) 
                setResult(uiCrudeDataToData(newMessage.result))
            setIsFetching(false)
        }

        const handleOnError = (event) => {
            if (event?.data) {
                const errMsg = JSON.parse(event.data)
                console.log(errMsg)
            }
        }

        ws.addEventListener("open", handleOnOpen)
        ws.addEventListener("message", handleOnMessage)
        ws.addEventListener("error", handleOnError)

        return () => {
            ws.removeEventListener("open", handleOnOpen)
            ws.removeEventListener("message", handleOnMessage)
            ws.removeEventListener("error", handleOnError)
            ws.close()
        }
    }, [symbol, interval])

    return [isFetching, result]
}