import React from "react"
import PropTypes from "prop-types"
import { format, utcFormat } from "d3"
import { klineColor, isThemeDark, COLORS, INDICATORTYPES } from "../../../../../Tools"


export const Stats = React.memo(({theme, height, hoverData}) => {
    const metricColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const valueColor  = klineColor(hoverData)

    const getIndicatorTypeStatJSX = (id, indicatorType, metricColor, value) => {
        const isBollingerBands = indicatorType.includes(INDICATORTYPES.BOLL)
        const isSpaceRequired  = isBollingerBands || id !== 0
        return (
            <React.Fragment key={id}>
                <tspan fontSize="0.6dvw" opacity="0.5" fill={metricColor} dx={isSpaceRequired ? "2%" : null}>
                    {isBollingerBands ? `${value}: ` : `${indicatorType}(${value}): `}
                </tspan>
                <tspan fontSize="0.6dvw" fill={hoverData.indicators[indicatorType][value].color}>
                    {format("~f")(hoverData.indicators[indicatorType][value].value)}
                </tspan>
            </React.Fragment>
        )
    }

    const getIndicatorsStatsJSX = () => {
        const indicatorJSX = []
        const ids = {indicatorTypeId: 0, valueId: 0}
        const indicators = hoverData.indicators
        for (const indicatorType in indicators) {
            const children        = []
            const indicatorValues = indicators[indicatorType]
            if (indicatorType.includes(INDICATORTYPES.BOLL)) {
                children.push(
                    <tspan key={ids.valueId} fontSize="0.6dvw" opacity="0.5" fill={metricColor}>
                        {indicatorType}
                    </tspan>
                )
                ids.valueId++
            }
            for (const value in indicatorValues) {
                if (indicatorType.includes(INDICATORTYPES.BOLL) && !indicatorValues[value].checked)
                    continue
                children.push(getIndicatorTypeStatJSX(ids.valueId, indicatorType, metricColor, value))
                ids.valueId++
            }

            if (children.length !== 0) {
                indicatorJSX.push(
                    <text key={ids.indicatorTypeId} fontSize="0.7dvw" transform={`translate(10, ${(ids.indicatorTypeId + 2) * (height / 6)})`}>
                        {children}
                    </text>
                )
                ids.indicatorTypeId++
                ids.valueId = 0
            }
        }
        return indicatorJSX 
    }

    const getOHLCVStatsJSX = () => {
        return (
            <text
                fontSize="0.7dvw"
                transform={`translate(10, ${height / 8})`}
            >
                <tspan opacity="0.5" fill={metricColor}>
                    {utcFormat("%Y/%m/%d %H:%M:%S")(hoverData.date)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>Open: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.open)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>High: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.high)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>Low: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.low)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>Close: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.close)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>Vol(Base): </tspan>
                <tspan fill={valueColor}>
                    {format("~s")(hoverData.volume)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>Vol(Quote): </tspan>
                <tspan fill={valueColor}>
                    {format("~s")(hoverData.volumeQuote)}
                </tspan>
                <tspan opacity="0.5" dx="2%" fill={metricColor}>CHANGE: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.change) + "%"}
                </tspan>
            </text>
        )
    }

    return (
        hoverData && 
        <>
            {getOHLCVStatsJSX()}
            {getIndicatorsStatsJSX()}
        </>
    )
})

Stats.propTypes = { 
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    hoverData: PropTypes.object
}