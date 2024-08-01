import React from "react";
import PropTypes from "prop-types"
import { COLORS, isThemeDark } from "../../../tools";


export const Crosshair = React.memo(({x, y, theme, height, width}) => {
    const strokeColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.WHITE
    
    return (
        <>
            <line
                x1={x}
                x2={x}
                y1={0}
                y2={height}
                strokeOpacity={0.7}
                strokeDasharray={3}
                stroke={strokeColor}
            />
            <line
                y1={y}
                y2={y}
                x1={0}
                x2={width}
                strokeDasharray={3}
                strokeOpacity={0.7}
                stroke={strokeColor}
            />
        </>
    )
})


Crosshair.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
}
