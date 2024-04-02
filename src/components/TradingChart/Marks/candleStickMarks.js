import React from 'react'
import PropTypes from "prop-types"
import { schemeReds, format, utcFormat, schemeGreens } from 'd3';


const formatValue       = format('.2f');
const formatString      = format('.3s');
const formatDateCandles = utcFormat('%H:%M:%S %B %-d, %Y');

export const CandleStickMarks = React.memo(({xScale, yScale, slicedData, updateHoveringData, height}) => {

    return slicedData.map((d, idx) => (
        <g
            key={d.date}
            onMouseEnter={() => updateHoveringData(d)}
            transform={`translate(${xScale(d.date) + xScale.bandwidth() / 2}, 0)`}
        >
            <line
                y1={0}
                y2={height}
                strokeOpacity={0}
                stroke={schemeReds[6][4]}
                width={xScale.bandwidth()}
            /> 
            
            <line
                y1={yScale(d.low)}
                y2={yScale(d.high)}
                stroke={d.open > d.close ? schemeReds[6][4] : schemeGreens[6][4]}
            />
            
             <line
                y1={yScale(d.open)}
                y2={yScale(d.close) === yScale(d.open) ? yScale(d.close) + 1 : yScale(d.close)}
                strokeWidth={xScale.bandwidth()}
                stroke={d.open > d.close ? schemeReds[6][4] : schemeGreens[6][4]}
                data-tip={
                    `<b>${formatDateCandles(d.date)}</b><br />` +
                    `Open: ${formatValue(d.open)}<br />` +
                    `Close: ${formatValue(d.close)}<br />` +
                    `Low: ${formatValue(d.low)}<br />` +
                    `High: ${formatValue(d.high)}<br />` +
                    `Volume: ${formatString(d.volume)}`
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
    updateHoveringData: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
}