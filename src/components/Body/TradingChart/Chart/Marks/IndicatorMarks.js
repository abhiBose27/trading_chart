import React from "react"
import PropTypes from "prop-types"


export const IndicatorMarks = React.memo(({lineConfigs, slicedData}) => {
    
   return <g transform="translate(0, 0)">
        {
            lineConfigs.map(config => 
                <path
                    fill="none"
                    key={config.id}
                    className="line"
                    stroke={config.color}
                    d={config.lineScale(slicedData)}
                    strokeWidth={config.strokeWidth}
                />
            )
        }
        </g>
})

IndicatorMarks.propTypes = {
    lineConfigs: PropTypes.array.isRequired,
    slicedData: PropTypes.array.isRequired
}