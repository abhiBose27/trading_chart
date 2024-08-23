import React from "react"
import PropTypes from "prop-types"
import { utcFormat, format } from "d3"
import { klineColor } from "../../../../../Tools"
import { ACTIONS } from "../../../../../Store/Actions"


export const CandleStickMarks = React.memo(({xScale, yPriceScale, slicedData, dispatch, height}) => {
    const onMouseEnter = (d) => {
        return (event) => dispatch({type: ACTIONS.HOVERDATA, payload: d})
    }
    
    return slicedData.map((d, idx) => (
        <g
            key={d.date}
            onMouseEnter={onMouseEnter(d)}
            transform={`translate(${xScale(d.date) + xScale.bandwidth() / 2}, 0)`}
        >
            <line
                y2={height}
                strokeOpacity={0}
                stroke={klineColor(d)}
                width={xScale.bandwidth()}
            /> 
            
            <line
                y1={yPriceScale(d.low)}
                y2={yPriceScale(d.high)}
                stroke={klineColor(d)}
            />
            
             <line
                y1={yPriceScale(d.open)}
                y2={yPriceScale(d.close) === yPriceScale(d.open) ? yPriceScale(d.close) + 1 : yPriceScale(d.close)}
                stroke={klineColor(d)}
                strokeWidth={xScale.bandwidth()}
                data-tip={
                    `<b>${utcFormat("%H:%M:%S %B %-d, %Y")(d.date)}</b><br />` +
                    `Open: ${format("~f")(d.open)}<br />` +
                    `Close: ${format("~f")(d.close)}<br />` +
                    `Low: ${format("~f")(d.low)}<br />` +
                    `High: ${format("~f")(d.high)}<br />` +
                    `Volume: ${format("~s")(d.volume)}<br />` +
                    `VolumeQuote: ${format("~s")(d.volumeQuote)}`
                }
                data-for='mark-tooltip'
            />
        </g>
    ))
})

CandleStickMarks.propTypes = {
    xScale: PropTypes.func.isRequired,
    yPriceScale: PropTypes.func.isRequired,
    slicedData: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
}