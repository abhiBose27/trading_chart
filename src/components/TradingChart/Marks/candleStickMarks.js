import React from "react"
import PropTypes from "prop-types"

import { formatDateToolTipFormat, formatValue, klineColor } from "../../../custom/tools/constants"
import { ACTIONS } from "../../../custom/tools/reducer"


export const CandleStickMarks = React.memo(({xScale, yScale, slicedData, tradingChartDispatch, height}) => {
    return slicedData.map((d, idx) => (
        <g
            key={d.date}
            onMouseEnter={() => tradingChartDispatch({type: ACTIONS.HOVERDATA, payload: d})}
            transform={`translate(${xScale(d.date) + xScale.bandwidth() / 2}, 0)`}
        >
            <line
                y1={0}
                y2={height}
                strokeOpacity={0}
                stroke={klineColor(d)}
                width={xScale.bandwidth()}
            /> 
            
            <line
                y1={yScale(d.low)}
                y2={yScale(d.high)}
                stroke={klineColor(d)}
            />
            
             <line
                y1={yScale(d.open)}
                y2={yScale(d.close) === yScale(d.open) ? yScale(d.close) + 1 : yScale(d.close)}
                stroke={klineColor(d)}
                strokeWidth={xScale.bandwidth()}
                data-tip={
                    `<b>${formatDateToolTipFormat(d.date)}</b><br />` +
                    `Open: ${formatValue("~f")(d.open)}<br />` +
                    `Close: ${formatValue("~f")(d.close)}<br />` +
                    `Low: ${formatValue("~f")(d.low)}<br />` +
                    `High: ${formatValue("~f")(d.high)}<br />` +
                    `Volume: ${formatValue("~s")(d.volume)}`
                }
                data-for='mark-tooltip'
            />
        </g>
    ))
})

CandleStickMarks.propTypes = {
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    slicedData: PropTypes.array.isRequired,
    tradingChartDispatch: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
}