import React from "react"
import PropTypes from "prop-types"


export const VolumeMarks = React.memo(({xScale, height, yScale, slicedData}) => {
    return slicedData.map((d, idx) => (
        <g
            key={d.date}
            transform={`translate(${xScale(d.date)}, 0)`}
        >
            <rect
                key={d.date}
                fillOpacity={0.3}
                y={yScale(d.volume)}
                width={xScale.bandwidth()}
                height={Math.max(height - yScale(d.volume), 0)}
            />
        </g>
    ))
})

VolumeMarks.propTypes = {
    xScale: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    yScale: PropTypes.func.isRequired,
    slicedData: PropTypes.array.isRequired,
}