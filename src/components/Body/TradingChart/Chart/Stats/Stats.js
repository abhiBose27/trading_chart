import React from "react"
import PropTypes from "prop-types"
import { format, utcFormat } from "d3"
import { klineColor, isThemeDark, COLORS } from "../../../../../Tools"


export const Stats = React.memo(({theme, height, hoverData}) => {
    const metricColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const valueColor  = klineColor(hoverData)

    const getIndicatorsJSX = () => {
        const indicatorJSX = []
        const ids = {indicatorTypeId: 0, valueId: 0}
        for (const indicatorType in hoverData.indicators) {
            const children = []
            for (const value in hoverData.indicators[indicatorType]) {
                children.push(
                    <React.Fragment key={ids.valueId}>
                        <tspan opacity={0.5} fill={metricColor} dx={ids.valueId !== 0 ? "2%": null}>
                            {`${indicatorType}(${value}): `}
                        </tspan>
                        <tspan fill={hoverData.indicators[indicatorType][value].color}>
                            {format("~f")(hoverData.indicators[indicatorType][value].value)}
                        </tspan>
                    </React.Fragment>
                )
                ids.valueId++
            }
            indicatorJSX.push(
                <text key={ids.indicatorTypeId} transform={`translate(10, ${height / (3 - ids.indicatorTypeId - 0.2)})`} fontSize="0.7vw">
                    {children}
                </text>
            )
            ids.indicatorTypeId++
            ids.valueId = 0
        }
        return indicatorJSX
    }

    return (
        hoverData && <> 
            <text transform={`translate(10, ${height / 8})`} fontSize="0.7vw">
                <tspan opacity={0.5} fill={metricColor}>
                    {utcFormat("%Y/%m/%d %H:%M:%S")(hoverData.date)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Open: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.open)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">High: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.high)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Low: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.low)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Close: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.close)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Vol(Base): </tspan>
                <tspan fill={valueColor}>
                    {format("~s")(hoverData.volume)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Vol(Quote): </tspan>
                <tspan fill={valueColor}>
                    {format("~s")(hoverData.volume * hoverData.close)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">CHANGE: </tspan>
                <tspan fill={valueColor}>
                    {format("~f")(hoverData.change) + "%"}
                </tspan>
            </text>
            {getIndicatorsJSX()}
        </>
    )
})

Stats.propTypes = { 
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    hoverData: PropTypes.object
}