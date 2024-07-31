import React from "react"
import PropTypes from "prop-types"
import { format, utcFormat } from "d3"
import { klineColor, isThemeDark, COLORS } from "../../constants"


export const Stats = React.memo(({theme, height, hoverData}) => {
    const metricColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const valueColor  = klineColor(hoverData)

    return (
        hoverData && <> 
            <text transform={`translate(5, ${height / 10})`} fontSize="0.7vw">
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
            <text transform={`translate(5, ${height / 3})`} fontSize="0.7vw">
                {
                    Object.keys(hoverData.movingAverages)
                    .map((maValue, idx) => (
                        <>
                            <tspan
                                opacity={0.5} 
                                fill={metricColor} 
                                dx={idx !== 0 ? "2%" : null}
                            >
                                {`MA(${maValue}): `}
                            </tspan>
                            <tspan fill={hoverData.movingAverages[maValue].color}>
                                {format("~f")(hoverData.movingAverages[maValue].value)}
                            </tspan>
                        </>
                    )
                )}
            </text>
        </>
    )
})

Stats.propTypes = { 
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    hoverData: PropTypes.object.isRequired
}