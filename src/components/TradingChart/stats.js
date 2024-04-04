import React from "react"
import PropTypes from "prop-types"

import { formatValue, formatDateTimeYearFormat, klineColor } from "../../custom/tools/constants"


export const Stats = React.memo(({bgColor, height, hoverData}) => {
    const metricColor = bgColor === "Dark" ? "white" : "black"
    const valueColor  = klineColor(hoverData)
    return (
        <g>
            <text transform={`translate(5, ${height / 1.5})`} fontSize="0.8vw">
                <tspan opacity={0.5} fill={metricColor}>
                    {formatDateTimeYearFormat(hoverData?.date)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Open: </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~f")(hoverData?.open)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">High: </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~f")(hoverData?.high)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Low: </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~f")(hoverData?.low)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Close: </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~f")(hoverData?.close)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Vol(Base): </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~s")(hoverData?.volume)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Vol(Quote): </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~s")(hoverData?.volume * hoverData?.close)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">CHANGE: </tspan>
                <tspan fill={valueColor}>
                    {formatValue("~f")(hoverData?.change) + "%"}
                </tspan>
            </text>
        </g>
    )
})

Stats.propTypes = { 
    bgColor: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    hoverData: PropTypes.object.isRequired
}