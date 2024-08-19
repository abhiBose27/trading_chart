import { useState, useEffect } from "react";
import { INDICATORTYPES } from "../Tools";
import { getBollingerBands, getExponentialMovingAverage, getMovingAverage, getVolumeWeightedAveragePrice, getWeightedMovingAverage } from "../Data/Processing/Indicators";


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
    const indicatorTypeToValues = {}
    for (const indicatorType in indicators) {
        const checked = indicators[indicatorType].checked
        const parameters = indicators[indicatorType].parameters
        if (!checked)
            continue
        if (indicatorType === INDICATORTYPES.MA)
            indicatorTypeToValues[indicatorType] = getMovingAverage(klineData, parameters)
        if (indicatorType === INDICATORTYPES.EMA)
            indicatorTypeToValues[indicatorType] = getExponentialMovingAverage(klineData, parameters)
        if (indicatorType === INDICATORTYPES.WMA)
            indicatorTypeToValues[indicatorType] = getWeightedMovingAverage(klineData, parameters)
        if (indicatorType === INDICATORTYPES.VWAP)
            indicatorTypeToValues[indicatorType] = getVolumeWeightedAveragePrice(klineData, parameters)
        if (indicatorType === INDICATORTYPES.BOLL)
            indicatorTypeToValues[`${indicatorType}(${parameters[0].length},${parameters[1].multiplier})`] = getBollingerBands(klineData, parameters)
    }
    if (Object.keys(indicatorTypeToValues).length === 0)
        return klineData

    return klineData.map(kline => {
        const newKline = {...kline, indicators: {}}
        for (const indicatorType in indicatorTypeToValues)
            newKline.indicators[indicatorType] = indicatorTypeToValues[indicatorType][kline.date]
        return newKline
    })
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
            if (ws.readyState === ws.OPEN)
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