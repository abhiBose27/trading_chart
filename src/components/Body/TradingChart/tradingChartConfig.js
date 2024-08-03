export const config = {
    getInitialChartState: (brushSize, klineDataLength) => {
        return {
            brushExtent:  [Math.max(0, klineDataLength - brushSize), klineDataLength - 1],
            mouseCoords: {x: 0, y: 0},
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
            brushSize            : Math.floor(0.2 * width)
        }
    }
}