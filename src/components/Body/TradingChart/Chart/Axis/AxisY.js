import React from "react"
import PropTypes from "prop-types"
import { format } from "d3"
import { klineColor, isThemeDark, COLORS } from "../../../../../Tools"


export const HorizontalTicks = React.memo(({theme, yPriceScale, width}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const ticks     = yPriceScale.ticks()
    return ticks.slice(1, ticks.length - 1).map(tickValue => (
            <g
                key={tickValue}
                transform={`translate(0, ${yPriceScale(tickValue)})`}
            >
                <line x2={width} stroke={fillColor} strokeOpacity={0.1}/>
            </g>
        ))

})

export const AxisYticksText = React.memo(({theme, yPriceScale, width}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const ticks     = yPriceScale.ticks()
    return ticks.slice(1, ticks.length - 1).map(tickValue => (
            <g
                key={tickValue}
                transform={`translate(${width / 5}, ${yPriceScale(tickValue)})`}
            >
                <text fill={fillColor} fontSize="0.7vw" dominantBaseline="middle">
                    {format("~f")(tickValue)}
                </text>
            </g>
        ))
})

export const AxisYCandleStickText = React.memo(({yPriceScale, lastCandleStick, width, height}) => {
    const xCoordRect = 0
    const yCoordRect = yPriceScale(lastCandleStick.close) - height / 2
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

export const AxisYhoverText = React.memo(({y, yPriceScale, width, height}) => {
    const xCoordRect = 0
    const yCoordRect = y - height / 2
    const yCoordText = yCoordRect + height / 2
    const xCoordText = xCoordRect + height / 2
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
                {format("~f")(yPriceScale.invert(y))}
            </text>
        </>
        
    )
})

HorizontalTicks.propTypes = {
    theme: PropTypes.string.isRequired,
    yPriceScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
}

AxisYticksText.propTypes = {
    theme: PropTypes.string.isRequired,
    yPriceScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
}

AxisYCandleStickText.propTypes = {
    yPriceScale: PropTypes.func.isRequired,
    lastCandleStick: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

AxisYhoverText.propTypes = {
    y: PropTypes.number.isRequired,
    yPriceScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}