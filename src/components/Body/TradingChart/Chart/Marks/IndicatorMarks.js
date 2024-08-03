import React from "react"
import PropTypes from "prop-types"


export const IndicatorMarks = React.memo(({lineConfigs, slicedData}) => {
    
   return <g transform="translate(0, 0)">
        {
            lineConfigs.map(config => 
                <path 
                    key={config.id} 
                    d={config.lineScale(slicedData)} 
                    className="line" 
                    fill="none" 
                    stroke={config.color} 
                    strokeWidth={2}
                />
            )
        }
        </g>
})

IndicatorMarks.propTypes = {
    lineConfigs: PropTypes.array.isRequired,
    slicedData: PropTypes.array.isRequired
}