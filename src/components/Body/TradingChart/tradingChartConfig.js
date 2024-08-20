export const config = {
    getInitialChartState: (brushSize, klineDataLength) => {
        return {
            brushExtent:  [Math.max(0, klineDataLength - brushSize), klineDataLength - 1],
            mouseCoords: {x: null, y: null},
            displayCrosshair: false,
            hoverData: null 
        }
    },
    getChartComponentDimensions: (height, width) => {
        const chartHeight = 0.8 * height
        const chartWidth  = 0.9 * width
        const yAxisTextBoxDimensionWidth = width - chartWidth
        const xAxisTextBoxDimensionHeight = (height - chartHeight) / 4
        const statsSvgHeight = height - (chartHeight + xAxisTextBoxDimensionHeight)
        const xAxisTextBoxDimensionWidth = 0.15 * width
        const yAxisTextBoxDimensionHeight = 0.04 * height
        return {
            yAxisTextBoxDimensionWidth: yAxisTextBoxDimensionWidth,
            yAxisTextBoxDimensionHeight: yAxisTextBoxDimensionHeight,
            xAxisTextBoxDimensionHeight: xAxisTextBoxDimensionHeight,
            xAxisTextBoxDimensionWidth: xAxisTextBoxDimensionWidth,
            statsSvgHeight       : statsSvgHeight,
            chartHeight          : chartHeight,
            chartWidth           : chartWidth,
            brushSize            : Math.floor(0.15 * width)
        }
    },
    getInitialTradingChartSpecification: {
        interval: "1m", 
        theme: "Dark",
        indicators: {
            "MA": {
                key: 1,
                checked: false,
                parameters: [
                    {key: 1, checked: false, period: 0, "lineStrokeWidth": 2, color: "orange"},
                    {key: 2, checked: false, period: 0, "lineStrokeWidth": 2, color: "pink"},
                    {key: 3, checked: false, period: 0, "lineStrokeWidth": 2, color: "teal"},
                    {key: 4, checked: false, period: 0, "lineStrokeWidth": 2, color: "purple"},
                    {key: 5, checked: false, period: 0, "lineStrokeWidth": 2, color: "blue"},
                    {key: 6, checked: false, period: 0, "lineStrokeWidth": 2, color: "red"},
                    {key: 7, checked: false, period: 0, "lineStrokeWidth": 2, color: "olive"},
                    {key: 8, checked: false, period: 0, "lineStrokeWidth": 2, color: "yellow"},
                    {key: 9, checked: false, period: 0, "lineStrokeWidth": 2, color: "brown"}
                ]
            },
            "EMA": {
                key: 2,
                checked: false,
                parameters: [
                    {key: 1, checked: false, period: 0, lineStrokeWidth: 2, color: "orange"},
                    {key: 2, checked: false, period: 0, lineStrokeWidth: 2, color: "pink"},
                    {key: 3, checked: false, period: 0, lineStrokeWidth: 2, color: "teal"},
                    {key: 4, checked: false, period: 0, lineStrokeWidth: 2, color: "purple"},
                    {key: 5, checked: false, period: 0, lineStrokeWidth: 2, color: "blue"},
                    {key: 6, checked: false, period: 0, lineStrokeWidth: 2, color: "red"},
                    {key: 7, checked: false, period: 0, lineStrokeWidth: 2, color: "olive"},
                    {key: 8, checked: false, period: 0, lineStrokeWidth: 2, color: "yellow"},
                    {key: 9, checked: false, period: 0, lineStrokeWidth: 2, color: "brown"}
                ]
            },
            "WMA": {
                key: 3,
                checked: false,
                parameters: [
                    {key: 1, checked: false, period: 0, lineStrokeWidth: 2, color: "orange"},
                    {key: 2, checked: false, period: 0, lineStrokeWidth: 2, color: "pink"},
                    {key: 3, checked: false, period: 0, lineStrokeWidth: 2, color: "teal"},
                    {key: 4, checked: false, period: 0, lineStrokeWidth: 2, color: "purple"},
                    {key: 5, checked: false, period: 0, lineStrokeWidth: 2, color: "blue"},
                    {key: 6, checked: false, period: 0, lineStrokeWidth: 2, color: "red"},
                    {key: 7, checked: false, period: 0, lineStrokeWidth: 2, color: "olive"},
                    {key: 8, checked: false, period: 0, lineStrokeWidth: 2, color: "yellow"},
                    {key: 9, checked: false, period: 0, lineStrokeWidth: 2, color: "brown"}
                ]
            },
            "VWAP": {
                key: 4,
                checked: false,
                parameters: [
                    {key: 1, length: 14, lineStrokeWidth: 2, color: "olive"}
                ]
            },
            "BOLL": {
                key: 5,
                checked: false,
                parameters : [
                    {key: 1, length: 20},
                    {key: 2, multiplier: 2},
                    {key: 3, checked: false, label: "UP", lineStrokeWidth: 2, color: "teal"},
                    {key: 4, checked: false, label: "MB", lineStrokeWidth: 2, color: "pink"},
                    {key: 5, checked: false, label: "DN", lineStrokeWidth: 2, color: "teal"},
                ]
            }
        }
    }
}