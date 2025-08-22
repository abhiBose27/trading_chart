/**
 * @param {[{id: ..., date:..., low: ..., high: ..., open: ..., close: ..., volume: ..., change: ...}]} klineData 
 * @param {{<indicatorType>: {key: ..., checked: ..., parameters: []}, ...}} parameters 
 * @returns {
 *      <date>: {
 *          <period>: {value: ..., color: ..., strokeWidth: ...}
 *      }
 *  }
*/
export const getMovingAverage = (klineData, parameters) => {
    const dateToMovingAverages = {}
    for (const parameter of parameters) {
        const period    = parameter.period
        let windowStart = 0
        let sum         = 0
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            if (!parameter.checked)
                continue
            sum += klineData[windowEnd].close
            const currentDate = klineData[windowEnd].date
            if (!(currentDate in dateToMovingAverages))
                dateToMovingAverages[currentDate] = {}
            let movingAverage = {
                value: null, 
                color: parameter.color,
                strokeWidth: parameter.lineStrokeWidth
            }
            if (windowEnd >= period - 1) {
                movingAverage = {...movingAverage, value: sum / period}
                sum -= klineData[windowStart].close
                windowStart++
            }
            dateToMovingAverages[currentDate][period] = movingAverage
        }
    }
    return dateToMovingAverages
}

/**
 * @param {[{id: ..., date:..., low: ..., high: ..., open: ..., close: ..., volume: ..., change: ...}]} klineData 
 * @param {{<indicatorType>: {key: ..., checked: ..., parameters: []}, ...}} parameters 
 * @returns {
 *      <date>: {
 *          <period>: {value: ..., color: ..., strokeWidth: ...}
 *      }
 *  }
*/
export const getExponentialMovingAverage = (klineData, parameters) => {
    const dateToExponentialMovingAverages = {}
    for (const parameter of parameters) {
        const period = parameter.period
        const alpha  = 2 / (period + 1)
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            if (!parameter.checked)
                continue
            const currentDate = klineData[windowEnd].date
            if (!(currentDate in dateToExponentialMovingAverages))
                dateToExponentialMovingAverages[currentDate] = {}
            let exponentialMovingAverage = {
                value: klineData[0].close, 
                color: parameter.color,
                strokeWidth: parameter.lineStrokeWidth,
            }
            if (windowEnd !== 0) {
                const previousEma = dateToExponentialMovingAverages[klineData[windowEnd - 1].date][period].value
                const ema = klineData[windowEnd].close * alpha + previousEma * (1 - alpha)
                exponentialMovingAverage = {...exponentialMovingAverage, value: ema}
            }
            dateToExponentialMovingAverages[currentDate][period] = exponentialMovingAverage
        }
    }
    return dateToExponentialMovingAverages
}

/**
 * @param {[{id: ..., date:..., low: ..., high: ..., open: ..., close: ..., volume: ..., change: ...}]} klineData 
 * @param {{<indicatorType>: {key: ..., checked: ..., parameters: []}, ...}} parameters 
 * @returns {
 *      <date>: {
 *          <period>: {value: ..., color: ..., strokeWidth: ...}
 *      }
 *  }
*/
export const getWeightedMovingAverage = (klineData, parameters) => {
    const dateToWeightedMovingAverages = {}
    for (const parameter of parameters) {
        const period      = parameter.period
        const denominator = period * (period + 1) / 2
        let windowStart   = 0
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            if (!parameter.checked)
                continue
            const currentDate = klineData[windowEnd].date
            if (!(currentDate in dateToWeightedMovingAverages))
                dateToWeightedMovingAverages[currentDate] = {}
            let weightedMovingAverage = {
                value: null, 
                color: parameter.color,
                strokeWidth: parameter.lineStrokeWidth
            }
            if (windowEnd >= period - 1) {
                const weightedSum = Array.from({length: windowEnd - windowStart + 1})
                                    .map((_, k) => klineData[windowEnd - k].close * (period - k))
                                    .reduce((sum, value) => sum + value, 0)
                weightedMovingAverage = {...weightedMovingAverage, value: weightedSum / denominator}
                windowStart++
            }
            dateToWeightedMovingAverages[currentDate][period] = weightedMovingAverage
        }
    }
    return dateToWeightedMovingAverages
}

/**
 * @param {[{id: ..., date:..., low: ..., high: ..., open: ..., close: ..., volume: ..., change: ...}]} klineData 
 * @param {{<indicatorType>: {key: ..., checked: ..., parameters: []}, ...}} parameters 
 * @returns {
 *      <date>: {
 *          <length>: {value: ..., color: ..., strokeWidth: ...}
 *      }
 *  }
*/
export const getVolumeWeightedAveragePrice = (klineData, parameters) => {
    const dateToVWAP = {}
    for (const parameter of parameters) {
        let cumulativePrice  = 0
        let cumulativeVolume = 0
        let windowStart      = 0
        const length         = parameter.length
        for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
            cumulativePrice  += klineData[windowEnd].volume * (klineData[windowEnd].high + klineData[windowEnd].low + klineData[windowEnd].close) / 3
            cumulativeVolume += klineData[windowEnd].volume
            const currentDate = klineData[windowEnd].date
            if (!(currentDate in dateToVWAP))
                dateToVWAP[currentDate] = {}
            let volumeWeighedAveragePrice = {
                value: null, 
                color: parameter.color,
                strokeWidth: parameter.lineStrokeWidth,
            }
            if (windowEnd >= length - 1) {
                volumeWeighedAveragePrice = {...volumeWeighedAveragePrice, value: cumulativePrice / cumulativeVolume}
                cumulativePrice  -= klineData[windowStart].volume * (klineData[windowStart].high + klineData[windowStart].low + klineData[windowStart].close) / 3
                cumulativeVolume -= klineData[windowStart].volume
                windowStart++
            }
            dateToVWAP[currentDate][length] = volumeWeighedAveragePrice
        }
    }
    return dateToVWAP
}

/**
 * @param {[{id: ..., date:..., low: ..., high: ..., open: ..., close: ..., volume: ..., change: ...}]} klineData
 * @param {integer} length 
 * @returns {
        <date>: value    
 * }
*/
const _getDateToMovingAverage = (klineData, length) => {
    let sum = 0
    let windowStart = 0
    const dateToSMA = {}
    for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
        sum += klineData[windowEnd].close
        const currentDate = klineData[windowEnd].date
        let movingAverage = null
        if (windowEnd >= length - 1) {
            movingAverage = sum / length
            sum -= klineData[windowStart].close
            windowStart++
        }
        dateToSMA[currentDate] = movingAverage
    }
    return dateToSMA
}

const _getBollingerBandProperties = (parameters) => {
    return {
        length              : parameters[0].length,
        multiplier          : parameters[1].multiplier,
        isLowerBand         : parameters[4].checked,
        lowerBandLabel      : parameters[4].label,
        lowerBandColor      : parameters[4].color,
        lowerBandStrokeWidth: parameters[4].lineStrokeWidth,
        isMidBand           : parameters[3].checked,
        midBandLabel        : parameters[3].label,
        midBandColor        : parameters[3].color,
        midBandStrokeWidth  : parameters[3].lineStrokeWidth,
        isUpperBand         : parameters[2].checked,
        upperBandLabel      : parameters[2].label,
        upperBandColor      : parameters[2].color,
        upperBandStrokeWidth: parameters[2].lineStrokeWidth
    }
}

/**
 * @param {*} klineData 
 * @param {*} parameters 
 * @returns 
*/
export const getBollingerBands = (klineData, parameters) => {
    let varianceSum = 0
    let windowStart = 0
    const bollingerBands  = {}
    const bandsProperties = _getBollingerBandProperties(parameters)
    const dateToSMA       = _getDateToMovingAverage(klineData, bandsProperties.length)
    for (let windowEnd = 0; windowEnd < klineData.length; windowEnd++) {
        const currentDate = klineData[windowEnd].date
        varianceSum += dateToSMA[currentDate] ? Math.pow(klineData[windowEnd].close - dateToSMA[currentDate], 2) : 0
        if (!(currentDate in bollingerBands))
            bollingerBands[currentDate] = {}

        let upperBandValue = {
            value: null,
            color: bandsProperties.upperBandColor,
            checked: bandsProperties.isUpperBand,
            strokeWidth: bandsProperties.upperBandStrokeWidth
        }
        let midBandValue   = {
            value: dateToSMA[currentDate], 
            color: bandsProperties.midBandColor,
            checked: bandsProperties.isMidBand,
            strokeWidth: bandsProperties.midBandStrokeWidth
        }
        let lowerBandValue = {
            value: null, 
            color: bandsProperties.lowerBandColor,
            checked: bandsProperties.isLowerBand,
            strokeWidth: bandsProperties.lowerBandStrokeWidth
        }
        if (windowEnd >= bandsProperties.length - 1) {
            upperBandValue = {...upperBandValue, value: dateToSMA[currentDate] + (bandsProperties.multiplier * Math.sqrt(varianceSum / bandsProperties.length))}
            midBandValue   = {...midBandValue,   value: dateToSMA[currentDate]}
            lowerBandValue = {...lowerBandValue, value: dateToSMA[currentDate] - (bandsProperties.multiplier * Math.sqrt(varianceSum / bandsProperties.length))}
            varianceSum   -= dateToSMA[klineData[windowStart].date] ? Math.pow(klineData[windowStart].close - dateToSMA[klineData[windowStart].date], 2) : 0
            windowStart++
        }
        bollingerBands[currentDate][bandsProperties.upperBandLabel] = upperBandValue
        bollingerBands[currentDate][bandsProperties.midBandLabel]   = midBandValue
        bollingerBands[currentDate][bandsProperties.lowerBandLabel] = lowerBandValue
    }
    return bollingerBands
}