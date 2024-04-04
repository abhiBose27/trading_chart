import {format, utcFormat, schemeReds, schemeGreens} from "d3"

export const formatValue = (formatType) => format(formatType)
export const formatDateToolTipFormat  = utcFormat("%H:%M:%S %B %-d, %Y")
export const formatDateTimeFormat     = utcFormat("%H:%M:%S")
export const formatDateYearFormat     = utcFormat("%Y/%m/%d")
export const formatDateTimeYearFormat = utcFormat("%Y/%m/%d %H:%M:%S")

export const klineColor = (d) => d?.open > d?.close ? schemeReds[6][4] : schemeGreens[6][4]
export const isTimeIntervalGreaterThan1h = (interval) => {
    const intervalCode = interval.charAt(interval.length - 1)
    return intervalCode !== "m" && intervalCode !== "s" && interval !== "1h" 
}
export const isDataReady = (isLoading, data) => !isLoading && data
export const isArrayEmpty = (array) => Array.isArray(array) && array.length === 0