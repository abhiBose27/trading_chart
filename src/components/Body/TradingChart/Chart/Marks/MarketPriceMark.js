import React from "react"
import PropTypes from "prop-types"
import { klineColor } from "../../../../../Tools"


export const MarketPriceMark = React.memo(({width, currentCandleStick, yPriceScale}) => {
    return (
        <g
            strokeWidth="2"
            strokeOpacity="0.9" 
            strokeDasharray="7"
            stroke={klineColor(currentCandleStick)}
            transform={`translate(0, ${yPriceScale(currentCandleStick.close)})`}
        >
            <line x2={width}/>
        </g>
    )
})

MarketPriceMark.propTypes = {
    width: PropTypes.number.isRequired,
    currentCandleStick: PropTypes.object.isRequired,
    yPriceScale: PropTypes.func.isRequired
}