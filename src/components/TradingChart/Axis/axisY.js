import React from "react"
import PropTypes from "prop-types"
import { klineColor, formatValue, isBgColorDark } from "../../../custom/tools/constants"


export const AxisYticks = React.memo(({bgColor, yScale, width}) => {
    const strokeColor = isBgColorDark(bgColor) ? "white" : "black"

    return yScale
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
                    stroke={strokeColor} 
                />
            </g>
        ))

})

export const AxisYticksText = React.memo(({bgColor, yScale, width}) => {
    const fillColor = isBgColorDark(bgColor) ? "white" : "black"

    return yScale
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
                    fill={fillColor}
                >
                    {formatValue("~f")(tickValue)}
                </text>
            </g>
        ))
})

export const AxisYCandleStickText = React.memo(({bgColor, yScale, lastCandleStick, width, height}) => {
    const yCoordRect = yScale(lastCandleStick.close) - height / 2
    const yCoordText = yScale(lastCandleStick.close) + height / 6
    const fillColor  = isBgColorDark(bgColor) ? "black" : "white"
    const color      = klineColor(lastCandleStick)
    const xCoordText = width / 7

    return (
        <>
            <rect
                x={0}
                rx={9}
                fill={color}
                opacity={0.9}
                width={width}
                y={yCoordRect}
                height={height}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.8vw"
                fill={fillColor}
            >
                {formatValue("~f")(lastCandleStick.close)} 
            </text>
        </>
    )
})

export const AxisYhoverText = React.memo(({y, bgColor, yScale, width, height}) => {
    const rectFillColor = isBgColorDark(bgColor) ? "white" : "black"
    const textFillColor = isBgColorDark(bgColor) ? "black" : "white"
    const yCoordRect    = y - height / 2
    const yCoordText    = y + height / 6
    const xCoordText    = width / 7

    return (
        <>
            <rect
                x={0}
                rx={9}
                opacity={0.9}
                width={width}
                y={yCoordRect}
                height={height}
                fill={rectFillColor}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.8vw"
                fill={textFillColor}
            >
                {formatValue("~f")(yScale.invert(y))}
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