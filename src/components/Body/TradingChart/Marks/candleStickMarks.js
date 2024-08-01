import React from "react"
import PropTypes from "prop-types"
import { utcFormat, format } from "d3"
import { ACTIONS, klineColor } from "../../../../tools"


export const CandleStickMarks = React.memo(({xScale, yScale, slicedData, dispatch, height}) => {
    return slicedData.map((d, idx) => (
        <g
            key={d.date}
            onMouseEnter={() => dispatch({type: ACTIONS.HOVERDATA, payload: d})}
            transform={`translate(${xScale(d.date) + xScale.bandwidth() / 2}, 0)`}
        >
            <line
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
                    `<b>${utcFormat("%H:%M:%S %B %-d, %Y")(d.date)}</b><br />` +
                    `Open: ${format("~f")(d.open)}<br />` +
                    `Close: ${format("~f")(d.close)}<br />` +
                    `Low: ${format("~f")(d.low)}<br />` +
                    `High: ${format("~f")(d.high)}<br />` +
                    `Volume: ${format("~s")(d.volume)}`
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
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
}