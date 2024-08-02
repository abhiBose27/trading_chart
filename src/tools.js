import { schemeReds, schemeGreens } from "d3"

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
    CHARTGREY: "#222837",
    DEPTHBIDCOLOR: "rgba(111, 22, 14, 0.4)",
    BIDCOLOR: "rgba(111, 22, 14, 0.05)",
    DEPTHASKCOLOR: "rgba(60, 179, 113, 0.4)",
    ASKCOLOR: "rgba(60, 179, 113, 0.05)"
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
