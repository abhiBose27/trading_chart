import { useState, useEffect } from "react";


const addMovingAverage = (klineData, parameters, idx) => {
    const movingAverages = {}
    for (const parameter of parameters) {
        if (!parameter.checked)
            continue
        const movingAverageValue = parameter.movingAverageValue
        if (idx < movingAverageValue - 1) {
            movingAverages[movingAverageValue] = {value: null, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
            continue
        }
        let sum = 0
        for (let k = 0; k < movingAverageValue; k++)
            sum += klineData[idx - k].close
        movingAverages[movingAverageValue] = {value: sum / movingAverageValue, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
    }
    return movingAverages
}

const addExponentialMovingAverage = (klineData, updatedKlineData, parameters, idx) => {
    const movingAverages = {}
    for (const parameter of parameters) {
        if (!parameter.checked)
            continue
        const movingAverageValue = parameter.movingAverageValue
        const alpha = 2 / (movingAverageValue + 1)
        if (idx === 0) {
            movingAverages[movingAverageValue] = {value: klineData[0].close, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
            continue
        }
        const previousEma = updatedKlineData[idx - 1].indicators["EMA"][movingAverageValue].value
        const ema = klineData[idx].close * alpha + previousEma * (1 - alpha)
        movingAverages[movingAverageValue] = {value: ema, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
    }
    return movingAverages
}

const addWeightedMovingAverage = (klineData, parameters, idx) => {
    const movingAverages = {}
    for (const parameter of parameters) {
        if (!parameter.checked)
            continue
        const movingAverageValue = parameter.movingAverageValue
        const denominator = movingAverageValue * (movingAverageValue + 1) / 2
        if (idx < movingAverageValue - 1) {
            movingAverages[movingAverageValue] = {value: null, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
            continue
        }
        let weightedSum = 0
        for (let k = 0; k < movingAverageValue; k++)
            weightedSum += klineData[idx - k].close * (movingAverageValue - k)
        movingAverages[movingAverageValue] = {value: weightedSum / denominator, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
    }
    return movingAverages
}

const addIndicatorsToKlineData = (klineData, indicators) => {
    const updatedKlineData = []
    for (let i = 0; i < klineData.length; i++) {
        const processedIndicator = {}
        for (const indicatorType in indicators) {
            if (!indicators[indicatorType].checked)
                continue
            const parameters = indicators[indicatorType].parameters
            if (indicatorType === "MA")
                processedIndicator[indicatorType] = addMovingAverage(klineData, parameters, i)
            if (indicatorType === "EMA")
                processedIndicator[indicatorType] = addExponentialMovingAverage(klineData, updatedKlineData, parameters, i)
            if (indicatorType === "WMA")
                processedIndicator[indicatorType] = addWeightedMovingAverage(klineData, parameters, i)
        }
        updatedKlineData.push({...klineData[i], indicators: processedIndicator})
    }
    return updatedKlineData
}

const convertRawKlinesToKlines = (crudeData, indicators) => {
    let klineData = crudeData.map((klineData, idx) => {
        return {
            id: idx,
            date: new Date(klineData[0]),
            open: parseFloat(klineData[1]),
            high: parseFloat(klineData[2]),
            low: parseFloat(klineData[3]),
            close: parseFloat(klineData[4]),
            volume: parseFloat(klineData[5]),
            change: parseFloat(((klineData[4] / klineData[1] - 1) * 100))
        }
    })
    return addIndicatorsToKlineData(klineData, indicators)
}

export const useFetchKline = (symbol, interval, indicators) => {
    const [data, setData]             = useState(null)
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
            if (ws.readyState === ws.OPEN) {
                ws.close()
                setData(null)
            }
        }

    }, [symbol, interval])

    useEffect(() => {
        if (!socket)
            return
        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data) 
            if (newMessage.status === 200)
                setData({interval: interval, result: convertRawKlinesToKlines(newMessage.result, indicators)})
            setIsFetching(false)
        }
    }, [socket, indicators, interval])

    return [isFetching, data]
}