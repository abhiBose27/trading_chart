import { useState, useEffect } from "react";


const addMovingAverages = (klineData, indicators) => {
    const updatedKlineData = []
    for (let i = 0; i < klineData.length; i++) {
        const movingAverages = {}
        for (let j = 0; j < indicators.length; j++) {
            const indicator          = indicators[j]
            if (!indicator.checked)
                continue
            const movingAverageValue = indicator.movingAverageValue
            if (i < movingAverageValue - 1) {
                Object.assign(movingAverages, {[movingAverageValue]: {value: null, color: indicator.color}})
                continue
            }
            let sum = 0
            for (let k = 0; k < movingAverageValue; k++)
                sum += klineData[i - k].close
            Object.assign(movingAverages, {[movingAverageValue]: {value: sum / movingAverageValue, color: indicator.color}})
        }
        updatedKlineData.push({...klineData[i], movingAverages: movingAverages})
    }
    return updatedKlineData
}

const uiCrudeDataToData = (crudeData, indicators) => {
    let klineData = crudeData.map(klineData => {
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
    return addMovingAverages(klineData, indicators)
}

export const useFetchKline = (symbol, interval, indicators) => {
    const [result, setResult]         = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const [socket, setSocket]         = useState(null)

    useEffect(() => {
        setIsFetching(true)
        const url = "wss://ws-api.binance.com:443/ws-api/v3"
        const ws  = new WebSocket(url)
        setSocket(ws)
        
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
        
        ws.onopen = () => {
            const msgInterval = setInterval(() => sendData(), 1000)
            ws.onclose = () => clearInterval(msgInterval)
        }

        ws.onerror = (event) => {
            if (event?.data) {
                const errMsg = JSON.parse(event.data)
                console.log(errMsg)
            }
        }

        return () => {
            ws.close()
            setResult(null)
        }
    }, [symbol, interval])

    useEffect(() => {
        if (!socket)
            return
        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data) 
            if (newMessage.status === 200)
                setResult({interval: interval, result: uiCrudeDataToData(newMessage.result, indicators)})
            setIsFetching(prevState => {
                if (prevState) return false
            })
        }
    }, [socket, indicators, interval])

    return [isFetching, result]
}