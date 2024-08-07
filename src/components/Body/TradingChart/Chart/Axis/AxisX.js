import React from "react"
import PropTypes from "prop-types"
import { utcFormat } from "d3"
import { COLORS, isThemeDark } from "../../../../../Tools"


export const VerticalTicks = React.memo(({xScale, theme, height, getXScaleTicks}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const ticks     = xScale.domain().filter(getXScaleTicks)
    return ticks.slice(1, ticks.length).map(tickValue => (
            <g
                key={tickValue}
                stroke={fillColor}
                strokeOpacity="0.1"
                transform={`translate(${xScale(tickValue) + xScale.bandwidth() / 2}, 0)`}
            >
                <line y2={height}/>
            </g>
        ))    
})

export const AxisXticksText = React.memo(({xScale, theme, interval, height, getXScaleTicks}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const ticks     = xScale.domain().filter(getXScaleTicks)
    const tickFormat = (tickValue) => {
        if (interval === "1s")
            return utcFormat("%H:%M:%S")(tickValue)
        const intervalCode = interval.charAt(interval.length - 1)
        if (intervalCode === "m" || interval === "1h") 
            return utcFormat("%H:%M")(tickValue)
        return utcFormat("%Y/%m/%d")(tickValue) 
    }   
    return ticks.slice(1, ticks.length).map(tickValue => (
            <g
                key={tickValue}
                fill={fillColor}
                fontSize="0.7dvw"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`translate(${xScale(tickValue) + xScale.bandwidth() / 2}, ${height / 2})`}
            >
                <text>
                    {tickFormat(tickValue)}
                </text>
            </g>
        ))
})

export const AxisXhoverText = React.memo(({x, hoverData, height, width}) => {
    return (
        <g fontSize="0.8dvw" transform={`translate(${x - width / 2}, 0)`}>
            <rect
                rx="9"
                opacity="0.9"
                width={width}
                height={height}
                fill={COLORS.GREY}
            />
            <text
                x={height / 2}
                y={height / 2}
                fill={COLORS.WHITE}
                dominantBaseline="middle"
            >
                {utcFormat("%Y/%m/%d %H:%M:%S")(hoverData?.date)}
            </text>
            
        </g>
    )
})

VerticalTicks.propTypes = {
    xScale: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    getXScaleTicks: PropTypes.func.isRequired,
}

AxisXticksText.propTypes = {
    xScale: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    interval: PropTypes.string.isRequired,
    getXScaleTicks: PropTypes.func.isRequired,
}

AxisXhoverText.propTypes = {
    x: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    hoverData: PropTypes.object
}
