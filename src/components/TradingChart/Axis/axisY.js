import React from "react";
import PropTypes from "prop-types"
import { format, schemeReds, schemeGreens } from "d3";


export const AxisYticks = React.memo(({bgColor, yScale, width}) => {
    const ticks = yScale
        .ticks()
        .slice(1, yScale.ticks().length - 1)
        .map((tickValue, idx) => (
            <g
                key={tickValue}
                transform={`translate(0, ${yScale(tickValue)})`}
            >
                <line 
                    x2={width}
                    strokeOpacity={0.1}
                    stroke={bgColor === "Dark" ? "white" : "black"} 
                />
            </g>
        ))
    return ticks
})

export const AxisYticksText = React.memo(({bgColor, yScale, width}) => {
    const ticks = yScale
        .ticks()
        .slice(1, yScale.ticks().length - 1)
        .map((tickValue, idx) => (
            <g
                key={tickValue}
                transform={`translate(${width / 5}, ${yScale(tickValue)})`}
            >
                <text
                    dy="1%"
                    fontSize="0.7vw"
                    fill={bgColor === "Dark" ? "white" : "black"}
                >
                    {format('~f')(tickValue)}
                </text>
            </g>
        ))
    return ticks
})

export const AxisYCandleStickText = React.memo(({bgColor, yScale, lastCandleStick, width, height}) => {
    const yCoordRect = yScale(lastCandleStick.close) - height / 2
    const yCoordText = yScale(lastCandleStick.close) + height / 6
    const xCoordText = width / 7
    return (
        <>
            <rect
                x={0}
                rx={9}
                opacity={0.9}
                width={width}
                y={yCoordRect}
                height={height}
                fill={lastCandleStick.open > lastCandleStick.close ? schemeReds[6][4] : schemeGreens[6][4]}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.9vw"
                fill={bgColor === "Dark" ? "black" : "white"}
            >
                {lastCandleStick.close} 
            </text>
        </>
    )
})

export const AxisYhoverText = React.memo(({y, bgColor, yScale, width, height}) => {
    const yCoordRect = y - height / 2
    const yCoordText = y + height / 6
    const xCoordText = width / 7
    return (
        <>
            <rect
                x={0}
                rx={9}
                opacity={0.9}
                width={width}
                y={yCoordRect}
                height={height}
                fill={bgColor === "Dark" ? "white" : "black"}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.9vw"
                fill={bgColor === "Dark" ? "black" : "white"}
            >
                {format('~f')(yScale.invert(y))}
            </text>
        </>
        
    )
})

AxisYticks.propTypes = {
    bgColor: PropTypes.string.isRequired,
    yScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
}

AxisYticksText.propTypes = {
    bgColor: PropTypes.string.isRequired,
    yScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
}

AxisYCandleStickText.propTypes = {
    bgColor: PropTypes.string.isRequired,
    yScale: PropTypes.func.isRequired,
    lastCandleStick: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

AxisYhoverText.propTypes = {
    y: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    yScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}