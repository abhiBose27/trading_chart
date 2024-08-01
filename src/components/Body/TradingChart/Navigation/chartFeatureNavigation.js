import { Button, Dropdown, Form, FormGroup, Icon, FormInput, Menu, Modal, ModalContent, FormCheckbox } from "semantic-ui-react"
import { ACTIONS } from "../../../../tools"
import { useState } from "react"
import { checkIndicator, updateMovingAverage } from "../../../../reducer"


export const ChartFeatureNavigation = ({dispatch, specification}) => {
    const { theme, interval, indicators, width } = specification
    const [showIndicators, setShowIndicators]    = useState(false)
    const [localIndicators, setLocalIndicators]  = useState(indicators)
    const intervalOptions                        = [
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
    const themeOptions                          = [
        {key: "Dark", text: "Dark", value: "Dark"},
        {key: "Light", text: "Light", value: "Light"},
    ]

    const SetInterval = (e, { value }) => dispatch({type: ACTIONS.INTERVAL, payload: value})

    const SetTheme = (e, { value }) => dispatch({type: ACTIONS.THEME, payload: value})

    const SetCheckMovingAverageValue = (value, key) => setLocalIndicators(checkIndicator(localIndicators, {key: key, value: value}))

    const SetMovingAverageValue = (value, key) => setLocalIndicators(updateMovingAverage(localIndicators, {key: key, value: value}))

    const ShowIndicators = () => setShowIndicators(prevState => !prevState)

    const onSubmit = () => {
        dispatch({type: ACTIONS.UPDATEINDICATOR, payload: localIndicators})
        setShowIndicators(false)
    }
    
    return (
        <div style={{width: width}}>
            <Menu inverted pointing fluid>
                <Dropdown
                    onChange={SetInterval}
                    className="link item"
                    defaultValue={interval}
                    options={intervalOptions}
                />
                <Dropdown
                    onChange={SetTheme}
                    className="link item"
                    defaultValue={theme}
                    options={themeOptions}
                />
                <Button icon inverted basic onClick={ShowIndicators}>
                    <Icon name="world"/>
                </Button>
            </Menu>
            <Modal size="mini" open={showIndicators} onClose={ShowIndicators}>
                <ModalContent>
                    <Form onSubmit={onSubmit}>
                        {
                            localIndicators.map(indicator => (
                                <FormGroup key={indicator.key} inline>
                                    <FormCheckbox
                                        slider
                                        checked={indicator.checked} 
                                        label={`MA${indicator.key}`} 
                                        onChange={(e, { checked }) => SetCheckMovingAverageValue(checked, indicator.key)}
                                    />
                                    <FormInput 
                                        disabled={!indicator.checked} 
                                        type="number" 
                                        defaultValue={indicator.movingAverageValue} 
                                        size="mini" 
                                        onChange={(e, { value }) => SetMovingAverageValue(value, indicator.key)}
                                    />
                                    <Icon className="circle" color={indicator.color} size="large"/>
                                </FormGroup>
                            ))
                        }
                        <Button type="submit">Save</Button>
                    </Form>
                </ModalContent>
            </Modal>
        </div>
       
    )
}