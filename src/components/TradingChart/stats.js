import React from "react"
import PropTypes from "prop-types"
import { utcFormat, format } from "d3"

export const Stats = React.memo(({bgColor, height, hoverData}) => {
    const metricColor = bgColor === "Dark" ? "white" : "black"
    const valueColor  = hoverData?.open > hoverData?.close ? "red" : "green"
    return (
        <g>
            <text transform={`translate(15, ${height / 1.5})`} fontSize="0.8vw">
                <tspan opacity={0.5} fill={metricColor}>{utcFormat("%Y/%m/%d %H:%M:%S" )(hoverData?.date)}</tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Open: </tspan>
                <tspan fill={valueColor}>
                    {hoverData?.open}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">High: </tspan>
                <tspan fill={valueColor}>
                    {hoverData?.high}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Low: </tspan>
                <tspan fill={valueColor}>
                    {hoverData?.low}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Close: </tspan>
                <tspan fill={valueColor}>
                    {hoverData?.close}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Vol(Base): </tspan>
                <tspan fill={valueColor}>
                    {format(".2f")(hoverData?.volume)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">Vol(Quote): </tspan>
                <tspan fill={valueColor}>
                    {format(".2f")(hoverData?.volume * hoverData?.close)}
                </tspan>
                <tspan opacity={0.5} fill={metricColor} dx="2%">CHANGE: </tspan>
                <tspan fill={valueColor}>
                    {format(".2f")(hoverData?.change) + "%"}
                </tspan>
            </text>
        </g>
    )
})

Stats.propTypes = { 
    bgColor: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    hoverData: PropTypes.object
}