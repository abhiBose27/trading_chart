import PropTypes from "prop-types"
import { Button, Dropdown, Icon, Menu } from "semantic-ui-react"
import { ACTIONS } from "../../../../Store/Actions"
import React, { useState } from "react"
import { Indicator } from "./Indicator"
import { config } from "../TradingChartConfig"


export const ChartNavigation = React.memo(({dispatch, width, specification}) => {
    const [showIndicators, setShowIndicators] = useState(false)
    const { theme, interval, indicators}      = specification
    const intervalOptions                     = config.getChartNavigationIntervalOptions
    const themeOptions                        = config.getChartNavigationThemeOptions

    const setInterval = (e, { value }) => dispatch({type: ACTIONS.INTERVAL, payload: value})

    const setTheme = (e, { value })    => dispatch({type: ACTIONS.THEME, payload: value})

    const triggerIndicators = ()       => setShowIndicators(prevState => !prevState)
    
    return (
        <div style={{width: width}}>
            <Menu inverted pointing fluid>
                <Dropdown
                    className="link item"
                    value={interval}
                    onChange={setInterval}
                    options={intervalOptions}
                />
                <Dropdown
                    className="link item"
                    value={theme}
                    onChange={setTheme}
                    options={themeOptions}
                />
                <Button icon inverted basic onClick={triggerIndicators}>
                    <Icon className="chartline"/>
                </Button>
            </Menu>
            <Indicator
                dispatch={dispatch}
                indicators={indicators}
                showIndicators={showIndicators} 
                triggerIndicators={triggerIndicators}
            />
        </div>
    )
})

ChartNavigation.propTypes = {
    dispatch: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    specification: PropTypes.object.isRequired
}