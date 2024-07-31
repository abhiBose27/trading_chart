import { schemeReds, schemeGreens } from "d3"

export const ACTIONS = {
    THEME: "theme",
    SYMBOL: "symbol",
    INTERVAL: "interval",
    UPDATEMOUSE: "updateMouseCoords",
    UPDATEBRUSHSIZE: "updateBrushSize",
    NEWBRUSHEXTENT: "newBrushExtent",
    DISPLAYCROSSHAIR: "displayCrosshair",
    HOVERDATA: "hoverData",
    UPDATEINDICATOR: "updateIndicator"
}

export const SIDEBOOK = {
    ASKS: "asks",
    BIDS: "bids"
}

export const SIDE = {
    BUY: "buy",
    SELL: "sell"
}

export const COLORS = {
    DARKGREY: "#282c34",
    GREY: "#363c47",
    BLACK: "black",
    WHITE: "#f0f2f6",
    CHARTGREY: "#222837"
}

export const defaultAppSpecification = {
    symbol: "ETHUSDT",
    interval: "1m",
    theme: "Dark"
}

export const klineColor = (d) => d.open > d.close ? schemeReds[6][4] : schemeGreens[6][4]

export const isDataReady = (isLoading, data) => !isLoading && data

export const isThemeDark = (theme) => theme === "Dark"

export const getTradingChartSpecification = (appSpecification, height, width) => {
    return {...appSpecification, height: height * 0.82, width: width * 0.65}
}

export const getOrderbookSpecification = (appSpecification, height, width) => {
    return {...appSpecification, height: height * 0.84, width: width * 0.12}
}

export const getTradebookSpecification = (appSpecificationn, height, width) => {
    return {...appSpecificationn, height: height * 0.84, width: width * 0.12}
}
