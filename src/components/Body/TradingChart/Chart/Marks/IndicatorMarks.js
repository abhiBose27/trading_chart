import React from "react"
import PropTypes from "prop-types"


export const IndicatorMarks = React.memo(({lineConfigs, slicedData}) => {
    
   return <g transform="translate(0, 0)">
        {
            lineConfigs.map(config => {
                if (config.areaScale !== undefined)
                    return (
                        <path
                            opacity="0.2"
                            key={config.id}
                            className="area"
                            d={config.areaScale(slicedData)}
                        />
                    )
                return (
                    <path
                        fill="none"
                        key={config.id}
                        className="line"
                        stroke={config.color}
                        d={config.lineScale(slicedData)}
                        strokeWidth={config.strokeWidth}
                    />
                )  
            })
        }
        </g>
})

IndicatorMarks.propTypes = {
    lineConfigs: PropTypes.array.isRequired,
    slicedData: PropTypes.array.isRequired
}