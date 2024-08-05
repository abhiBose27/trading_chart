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
                transform={`translate(${xScale(tickValue) + xScale.bandwidth() / 2}, 0)`}
            >
                <line y2={height} stroke={fillColor} strokeOpacity={0.1}/>
            </g>
        ))    
})

export const AxisXticksText = React.memo(({xScale, theme, interval, getXScaleTicks, height}) => {
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
                transform={`translate(${xScale(tickValue) + xScale.bandwidth() / 2}, ${height / 1.5})`}
            >
                <text fill={fillColor} fontSize="0.7vw" textAnchor="middle">
                    {tickFormat(tickValue)}
                </text>
            </g>
        ))
})

export const AxisXhoverText = React.memo(({x, hoverData, height, width}) => {
    const yCoordRect = 0
    const xCoordRect = x - width / 2
    const xCoordText = xCoordRect + height / 2
    const yCoordText = yCoordRect + height / 2
    return (
        <>
            <rect
                rx={9}
                width={width}
                height={height}
                opacity={0.9}
                x={xCoordRect}
                y={yCoordRect}
                fill={COLORS.GREY}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.8vw"
                fill={COLORS.WHITE}
                dominantBaseline="middle"
            >
                {utcFormat("%Y/%m/%d %H:%M:%S")(hoverData?.date)}
            </text>
            
        </>
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
