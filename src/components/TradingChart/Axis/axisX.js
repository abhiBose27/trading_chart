import React from 'react'
import PropTypes from "prop-types"
import { utcFormat } from "d3";


const isIntervalgreaterThanOneHour = (interval) => {
    const intervalCode = interval.charAt(interval.length - 1)
    return intervalCode === "m" || intervalCode === "s" || interval === "1h" 
}

export const AxisXticks = React.memo(({xScale, bgColor, height, getxScaleTicks}) => {
    const ticks = xScale
        .domain()
        .filter(getxScaleTicks)
        .map((tickValue, idx) => (
            <g
                key={tickValue}
                transform={`translate(${xScale(tickValue) + xScale.bandwidth() / 2}, 0)`}
            >
                <line
                    y2={height}
                    strokeOpacity={0.3}
                    stroke={bgColor === "Dark" ? "white" : "black"}   
                />
               
            </g>
        ))
    
    return ticks
})

export const AxisXticksText = React.memo(({xScale, bgColor, height, interval, getxScaleTicks}) => {
    const tickFormat = isIntervalgreaterThanOneHour(interval) ? "%H:%M:%S" : "%Y/%m/%d"
    const ticks = xScale
        .domain()
        .filter(getxScaleTicks)
        .map((tickValue, idx) => (
            <g
                key={tickValue}
                transform={`translate(${xScale(tickValue) + xScale.bandwidth() / 2}, ${height / 1.5})`}
            >
                <text
                    dy="1%"
                    fontSize="0.7vw"
                    style={{ textAnchor: "middle" }}
                    fill={bgColor === "Dark" ? "white" : "black"}
                >
                    {utcFormat(tickFormat)(tickValue)}
                </text>
            </g>
        ))
    return ticks
})

export const AxisXhoverText = React.memo(({x, bgColor, height, width, hoverData}) => {
    const xCoordRect = x - width / 2
    const xCoordText = x - width / 2.5
    const yCoordText = height / 1.5
    return (
        <>
            <rect
                y={0}
                rx={9}
                opacity={0.9}
                width={width}
                x={xCoordRect}
                height={height}
                fill={bgColor === "Dark" ? "white" : "black"}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.83vw"
                fill={bgColor === "Dark" ? "black" : "white"}
            >
                {utcFormat("%Y/%m/%d %H:%M:%S" )(hoverData?.date)}
            </text>
            
        </>
    )
})

AxisXticks.propTypes = {
    xScale: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    getxScaleTicks: PropTypes.func.isRequired,
}

AxisXticksText.propTypes = {
    xScale: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    interval: PropTypes.string.isRequired,
    getxScaleTicks: PropTypes.func.isRequired,
}

AxisXhoverText.propTypes = {
    x: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    hoverData: PropTypes.object
}
