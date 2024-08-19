import PropTypes from "prop-types"
import { Button, Dropdown, Icon, Menu } from "semantic-ui-react"
import { ACTIONS } from "../../../../Store/Actions"
import React, { useState } from "react"
import { Indicator } from "./Indicator"


export const ChartNavigation = React.memo(({dispatch, width, specification}) => {
    const [showIndicators, setShowIndicators] = useState(false)
    const { theme, interval, indicators}      = specification
    const intervalOptions                     = [
        {key: "1s", text: "1s", value: "1s"},
        {key: "1m", text: "1m", value: "1m"},
        {key: "3m", text: "3m", value: "3m"},
        {key: "5m", text: "5m", value: "5m"},
        {key: "15m", text: "15m", value: "15m"},
        {key: "30m", text: "30m", value: "30m"},
        {key: "1h", text: "1h", value: "1h"},
        {key: "2h", text: "2h", value: "2h"},
        {key: "6h", text: "6h", value: "6h"},
        {key: "12h", text: "12h", value: "12h"},
        {key: "1d", text: "1d", value: "1d"},
        {key: "1M", text: "1M", value: "1M"},
    ]
    const themeOptions                        = [
        {key: "Dark", text: "Dark", value: "Dark"},
        {key: "Light", text: "Light", value: "Light"},
    ]

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