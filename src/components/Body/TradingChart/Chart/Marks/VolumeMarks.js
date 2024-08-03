import React from "react"
import PropTypes from "prop-types"


export const VolumeMarks = React.memo(({xScale, height, yVolumeScale, slicedData}) => {
    return slicedData.map(d => (
        <g
            key={d.date}
            transform={`translate(${xScale(d.date)}, 0)`}
        >
            <rect
                fillOpacity={0.3}
                y={yVolumeScale(d.volume)}
                width={xScale.bandwidth()}
                height={Math.max(height - yVolumeScale(d.volume), 0)}
            />
        </g>
    ))
})

VolumeMarks.propTypes = {
    xScale: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    yVolumeScale: PropTypes.func.isRequired,
    slicedData: PropTypes.array.isRequired,
}