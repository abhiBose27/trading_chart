import { useState, useEffect } from "react";
import { INDICATORTYPES } from "../Tools";


const sanityCheckIfIndicatorExists = (klineData, indicatorType, idx) => {
    if (!("indicators" in klineData[idx]))
        klineData[idx].indicators = {}
    if (!(indicatorType in klineData[idx].indicators))
        klineData[idx].indicators[indicatorType] = {}
}

const addMovingAverage = (klineData, parameters) => {
    for (const parameter of parameters) {
        if (!parameter.checked)
            continue
        let windowStart = 0
        let sum = 0
        const movingAverageValue = parameter.movingAverageValue            
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            sum += klineData[windowEnd].close
            sanityCheckIfIndicatorExists(klineData, INDICATORTYPES.MA, windowEnd)
            if (windowEnd < movingAverageValue - 1)
                klineData[windowEnd].indicators[INDICATORTYPES.MA][movingAverageValue] = {value: null, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
            else {
                klineData[windowEnd].indicators[INDICATORTYPES.MA][movingAverageValue] = {value: sum / movingAverageValue, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
                sum -= klineData[windowStart].close
                windowStart++
            }
        }
    }
}

const addExponentialMovingAverage = (klineData, parameters) => {
    for (const parameter of parameters) {
        if (!parameter.checked)
            continue
        const movingAverageValue = parameter.movingAverageValue
        const alpha = 2 / (movingAverageValue + 1)
        for (let i = 0; i < klineData.length; i++) {
            sanityCheckIfIndicatorExists(klineData, INDICATORTYPES.EMA, i)
            if (i === 0) {
                klineData[i].indicators[INDICATORTYPES.EMA][movingAverageValue] = {value: klineData[0].close, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
                continue
            }
            const previousEma = klineData[i - 1].indicators[INDICATORTYPES.EMA][movingAverageValue].value
            const ema =  klineData[i].close * alpha + previousEma * (1 - alpha)
            klineData[i].indicators[INDICATORTYPES.EMA][movingAverageValue] = {value: ema, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
        } 
    }
}

const addWeightedMovingAverage = (klineData, parameters) => {
    for (const parameter of parameters) {
        if (!parameter.checked)
            continue
        const movingAverageValue = parameter.movingAverageValue
        const denominator = movingAverageValue * (movingAverageValue + 1) / 2
        let windowStart = 0
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            sanityCheckIfIndicatorExists(klineData, INDICATORTYPES.WMA, windowEnd)
            if (windowEnd < movingAverageValue - 1) {
                klineData[windowEnd].indicators[INDICATORTYPES.WMA][movingAverageValue] = {value: null, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
                continue
            }
            let weightedSum = 0
            for (let k = 0; k <= windowEnd - windowStart; k++)
                weightedSum += klineData[windowEnd - k].close * (movingAverageValue - k)
            klineData[windowEnd].indicators[INDICATORTYPES.WMA][movingAverageValue] = {value: weightedSum / denominator, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
            windowStart++
            
        }
    }
}

const addVolumeWeightedAveragePrice = (klineData, parameters) => {
    for (const parameter of parameters) {
        const vwapLength = parameter.length
        let cumulativePrice = 0
        let cumulativeVolume = 0
        let windowStart = 0
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            cumulativePrice += klineData[windowEnd].volume * (klineData[windowEnd].high + klineData[windowEnd].low + klineData[windowEnd].close) / 3
            cumulativeVolume += klineData[windowEnd].volume
            sanityCheckIfIndicatorExists(klineData, INDICATORTYPES.VWAP, windowEnd)
            if (windowEnd < vwapLength - 1)
                klineData[windowEnd].indicators[INDICATORTYPES.VWAP][vwapLength] = {value: null, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
            else {
                klineData[windowEnd].indicators[INDICATORTYPES.VWAP][vwapLength] = {value: cumulativePrice / cumulativeVolume, color: parameter.color, strokeWidth: parameter.lineStrokeWidth}
                cumulativePrice -= klineData[windowStart].volume * (klineData[windowStart].high + klineData[windowStart].low + klineData[windowStart].close) / 3
                cumulativeVolume -= klineData[windowStart].volume
                windowStart++
            }
        }
    }
}

const processIndicatorType = (indicatorType, parameters, klineData) => {
    if (indicatorType === INDICATORTYPES.VWAP)
        addVolumeWeightedAveragePrice(klineData, parameters)
    if (indicatorType === INDICATORTYPES.MA)
        addMovingAverage(klineData, parameters)
    if (indicatorType === INDICATORTYPES.EMA)
        addExponentialMovingAverage(klineData, parameters)
    if (indicatorType === INDICATORTYPES.WMA)
        addWeightedMovingAverage(klineData, parameters)
}

/*
Return :- {
    ...,
    indicators: {
        "MA": {
            7: {value: null, color: null, strokeWidth: null}
        }
    }
}
*/
const addIndicatorsToKlineData = (klineData, indicators) => {
    for (const indicatorType in indicators) {
        if (!indicators[indicatorType].checked)
            continue
        const parameters = indicators[indicatorType].parameters
        processIndicatorType(indicatorType, parameters, klineData)
    }
    return klineData
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