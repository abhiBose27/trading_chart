
export const config = {
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
    getChartComponentDimensions: (height, width) => {
        const chartHeight = 0.8 * height
        const chartWidth  = 0.9 * width
        const yAxisTextBoxDimensionWidth = width - chartWidth
        const xAxisTextBoxDimensionHeight = (height - chartHeight) / 4
        const statsSvgHeight = height - (chartHeight + xAxisTextBoxDimensionHeight)
        return {
            yAxisTextBoxDimension: {width: yAxisTextBoxDimensionWidth, height: 0.04 * height},
            xAxisTextBoxDimension: {width: 0.15 * width, height: xAxisTextBoxDimensionHeight},
            statsSvgHeight       : statsSvgHeight,
            chartHeight          : chartHeight,
            chartWidth           : chartWidth,
            brushSize            : Math.floor(0.2 * width)
        }
    }
}