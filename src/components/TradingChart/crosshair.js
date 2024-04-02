import React from "react";
import PropTypes from "prop-types"


export const Crosshair = React.memo(({x, y, bgColor, height, width}) => {
    return (
        <>
            <line
                x1={x}
                x2={x}
                y1={0}
                y2={height}
                strokeOpacity={0.7}
                strokeDasharray={3}
                stroke={bgColor === "Dark" ? "white" : "black"}
            />
            <line
                y1={y}
                y2={y}
                x1={0}
                x2={width}
                strokeDasharray={3}
                strokeOpacity={0.7}
                stroke={bgColor === "Dark" ? "white" : "black"}
            />
        </>
    )
})


Crosshair.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
}
