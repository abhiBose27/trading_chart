import React from "react"
import PropTypes from "prop-types"
import { format } from "d3"
import { klineColor, isThemeDark, COLORS } from "../../../../tools"


export const AxisYticks = React.memo(({theme, yScale, width}) => {
    const strokeColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    return yScale
        .ticks()
        .slice(1, yScale.ticks().length - 1)
        .map(tickValue => (
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

export const AxisYticksText = React.memo(({theme, yScale, width}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    return yScale
        .ticks()
        .slice(1, yScale.ticks().length - 1)
        .map(tickValue => (
            <g
                key={tickValue}
                transform={`translate(${width / 5}, ${yScale(tickValue)})`}
            >
                <text
                    fill={fillColor}
                    fontSize="0.7vw"
                    dominantBaseline="middle"
                >
                    {format("~f")(tickValue)}
                </text>
            </g>
        ))
})

export const AxisYCandleStickText = React.memo(({yScale, lastCandleStick, width, height}) => {
    const xCoordRect = 0
    const yCoordRect = yScale(lastCandleStick.close) - height / 2
    const yCoordText = yCoordRect + height / 2
    const xCoordText = xCoordRect + height / 2
    const fillColor  = klineColor(lastCandleStick)
    return (
        <>
            <rect
                rx={9}
                opacity={0.9}
                x={xCoordRect}
                y={yCoordRect}
                fill={fillColor}
                width={width}
                height={height}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.8vw"
                fill={COLORS.WHITE}
                dominantBaseline="middle"
            >
                {format("~f")(lastCandleStick.close)} 
            </text>
        </>
    )
})

export const AxisYhoverText = React.memo(({y, yScale, width, height}) => {
    const xCoordRect    = 0
    const yCoordRect    = y - height / 2
    const yCoordText    = yCoordRect + height / 2
    const xCoordText    = xCoordRect + height / 2
    return (
        <>
            <rect
                rx={9}
                opacity={0.9}
                x={xCoordRect}
                y={yCoordRect}
                width={width}
                height={height}
                fill={COLORS.GREY}
            />
            <text
                x={xCoordText}
                y={yCoordText}
                fontSize="0.8vw"
                fill={COLORS.WHITE}
                dominantBaseline="middle"
            >
                {format("~f")(yScale.invert(y))}
            </text>
        </>
        
    )
})

AxisYticks.propTypes = {
    theme: PropTypes.string.isRequired,
    yScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
}

AxisYticksText.propTypes = {
    theme: PropTypes.string.isRequired,
    yScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
}

AxisYCandleStickText.propTypes = {
    yScale: PropTypes.func.isRequired,
    lastCandleStick: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

AxisYhoverText.propTypes = {
    y: PropTypes.number.isRequired,
    yScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}