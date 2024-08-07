import React from "react";
import PropTypes from "prop-types"
import { COLORS, isThemeDark } from "../../../../../Tools";


export const Crosshair = React.memo(({x, y, theme, height, width}) => {
    const strokeColor = isThemeDark(theme) ? COLORS.WHITE : COLORS.BLACK
    
    return (
        <g strokeOpacity="0.7" strokeDasharray="3" stroke={strokeColor}>
            <line x1={x} x2={x} y1={0} y2={height}/>
            <line y1={y} y2={y} x1={0} x2={width}/>
        </g>
    )
})


Crosshair.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    theme: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
}
