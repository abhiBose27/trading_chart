import React from "react"
import PropTypes from "prop-types"
import { format } from "d3"
import { klineColor, isThemeDark, COLORS } from "../../../../../Tools"


export const HorizontalTicks = React.memo(({theme, width, yPriceScale}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const ticks     = yPriceScale.ticks()
    return ticks.slice(1, ticks.length - 1).map(tickValue => (
            <g
                key={tickValue}
                stroke={fillColor}
                strokeOpacity="0.1"
                transform={`translate(0, ${yPriceScale(tickValue)})`}
            >
                <line x2={width}/>
            </g>
        ))

})

export const AxisYticksText = React.memo(({theme, width, yPriceScale}) => {
    const fillColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    const ticks     = yPriceScale.ticks()
    return ticks.slice(1, ticks.length - 1).map(tickValue => (
            <g
                key={tickValue}
                fill={fillColor}
                fontSize="0.7dvw"
                dominantBaseline="middle"
                transform={`translate(${width / 8}, ${yPriceScale(tickValue)})`}
            >
                <text>
                    {format("~f")(tickValue)}
                </text>
            </g>
        ))
})

export const AxisYCandleStickText = React.memo(({width, height, currentCandleStick, yPriceScale}) => {
    return (
        <g 
            fontSize="0.8dvw" 
            transform={`translate(0, ${yPriceScale(currentCandleStick.close) - height / 2})`}
        >
            <rect
                rx="9"
                opacity="0.9"
                width={width}
                height={height}
                fill={klineColor(currentCandleStick)}
            />
            <text
                x={height / 2}
                y={height / 2}
                fill={COLORS.WHITE}
                dominantBaseline="middle"
            >
                {format("~f")(currentCandleStick.close)} 
            </text>
        </g>
    )
})

export const AxisYhoverText = React.memo(({y, width, height, yPriceScale}) => {
    return (
        <g fontSize="0.8dvw" transform={`translate(0, ${y - height / 2})`}>
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
                {format("~f")(yPriceScale.invert(y))}
            </text>
        </g>
        
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
    currentCandleStick: PropTypes.object,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

AxisYhoverText.propTypes = {
    y: PropTypes.number.isRequired,
    yPriceScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}