import PropTypes from "prop-types"
import { useState } from "react"
import { Modal, ModalContent, Grid, GridRow, Form, FormField, GridColumn, FormGroup, FormCheckbox, FormInput, Icon, Button, Dropdown, Message, MessageHeader } from "semantic-ui-react"
import { ACTIONS } from "../../../../Store/Actions"
import { INDICATORPROPERTYTYPES, INDICATORTYPES } from "../../../../Tools"


export const Indicator = ({
    dispatch,
    showIndicators, 
    triggerIndicators, 
    indicators,
}) => {

    // Hard Coded initialised. Needs to be changed
    const [indicatorTypeClicked, setIndicatorTypeClicked] = useState("MA")
    const [isError, setIsError]                           = useState(false)
    const [localIndicators, setLocalIndicators]           = useState(() => JSON.parse(JSON.stringify(indicators)))
    const optionsforStrokeWidth = [
        { key: 1, text: 1, value: 1 },
        { key: 2, text: 2, value: 2 },
        { key: 3, text: 3, value: 3 },
        { key: 4, text: 4, value: 4 }
    ]

    const getIndicatorTypes = () => {
        const indicatorTypes = []
        for (const indicatorType in localIndicators)
            indicatorTypes.push({
                key: localIndicators[indicatorType].key, 
                type: indicatorType, 
                checked: localIndicators[indicatorType].checked
            })
        return indicatorTypes
    }

    const onClickIndicatorType = (indicatorType) => {
        setIndicatorTypeClicked(indicatorType)
    }

    const onCheckIndicatorType = (indicatorType, checked) => {
        const newIndicators = {...localIndicators}
        newIndicators[indicatorType].checked = checked
        setLocalIndicators(newIndicators)
    }

    const setValues = (value, key, valueProperty) => {
        const updateIndicators = {...localIndicators}
        switch (valueProperty) {
            case INDICATORPROPERTYTYPES.CHECK:
                updateIndicators[indicatorTypeClicked].parameters[key - 1] = {...localIndicators[indicatorTypeClicked].parameters[key - 1], checked: value}
                break
            case INDICATORPROPERTYTYPES.MOVINGAVERAGEVALUE:
                updateIndicators[indicatorTypeClicked].parameters[key - 1] = {...localIndicators[indicatorTypeClicked].parameters[key - 1], movingAverageValue: parseInt(value)}
                break
            case INDICATORPROPERTYTYPES.STROKEWIDTH:
                updateIndicators[indicatorTypeClicked].parameters[key - 1] = {...localIndicators[indicatorTypeClicked].parameters[key - 1], lineStrokeWidth: parseInt(value)}
                break
            case INDICATORPROPERTYTYPES.VWAPLENGTH:
                updateIndicators[indicatorTypeClicked].parameters[key - 1] = {...localIndicators[indicatorTypeClicked].parameters[key - 1], length: parseInt(value)}
                break
            default:
                break;
        }
        setLocalIndicators(updateIndicators)
    }

    const sanityCheckIndicators = () => {
        for (const indicatorType in localIndicators) {
            if (!localIndicators[indicatorType].checked)
                continue
            const parameters = localIndicators[indicatorType].parameters
            for (const parameter of parameters) {
                for (const property in parameter) {
                    if (property === "color" || !isNaN(parameter[property]))
                        continue
                    return false
                }
            }
        }
        return true
    }

    const onSubmit = () => {
        if (!sanityCheckIndicators()) {
            setIsError(true)
            return
        }
        dispatch({type: ACTIONS.UPDATEINDICATOR, payload: JSON.parse(JSON.stringify(localIndicators))})
        triggerIndicators()
    }

    const getIndicatorTypeCheckboxesJSX = () => {
        const indicatorTypes = getIndicatorTypes()
        return indicatorTypes.map(indicatorType => (
            <FormField key={indicatorType.key}>
                <FormCheckbox
                    label={indicatorType.type}
                    checked={indicatorType.checked}
                    onClick={() => onClickIndicatorType(indicatorType.type)}
                    onChange={(e, { checked }) => onCheckIndicatorType(indicatorType.type, checked)}
                />
            </FormField>
        ))
    }

    const getIndicatorTypeParametersJSX = () => {
        return (    
            indicatorTypeClicked && localIndicators[indicatorTypeClicked].parameters.map(parameter => (
                <FormGroup key={parameter.key} inline>
                    {
                        indicatorTypeClicked === INDICATORTYPES.VWAP ? 
                        <FormInput
                            size="mini"
                            type="number"
                            value={String(parameter.length)}
                            error={isNaN(parameter.length)}
                            onChange={(e, { value }) => setValues(value, parameter.key, INDICATORPROPERTYTYPES.VWAPLENGTH)}
                        /> :
                        <>
                            <FormCheckbox
                                slider
                                checked={parameter.checked} 
                                label={`${indicatorTypeClicked}${parameter.key}`} 
                                onChange={(e, { checked }) => setValues(checked, parameter.key, INDICATORPROPERTYTYPES.CHECK)}
                            />
                            <FormInput
                                size="mini"
                                type="number"
                                disabled={!parameter.checked}
                                value={String(parameter.movingAverageValue)}
                                error={isNaN(parameter.movingAverageValue)}
                                onChange={(e, { value }) => setValues(value, parameter.key, INDICATORPROPERTYTYPES.MOVINGAVERAGEVALUE)}
                            />
                        </>
                    }
                    <Dropdown
                        selection
                        button
                        options={optionsforStrokeWidth}
                        value={parameter.lineStrokeWidth}
                        onChange={(e, { value }) => setValues(value, parameter.key, INDICATORPROPERTYTYPES.STROKEWIDTH)}
                    />
                    <Icon className="circle" color={parameter.color} size="large"/>
                </FormGroup>
            ))
        )
    }

    return (
        <Modal size="small" open={showIndicators} onClose={triggerIndicators}>
            <ModalContent>
                <Grid columns={2} divided>
                    <GridRow stretched>
                        <GridColumn width={4}>
                            <Form> 
                                {getIndicatorTypeCheckboxesJSX()}
                            </Form>
                        </GridColumn>
                        <GridColumn>
                            <Form onSubmit={onSubmit}>
                                <FormField>
                                    <b>{indicatorTypeClicked}</b>
                                </FormField>
                                <FormField>
                                    {getIndicatorTypeParametersJSX()}
                                <Button type="submit">Save</Button>
                                </FormField>
                                {isError && 
                                <FormField>
                                    <Message size="small" negative>
                                        <MessageHeader>Invalid values</MessageHeader>
                                    </Message>
                                </FormField>}
                            </Form>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </ModalContent>
        </Modal>
    )
}

Indicator.propTypes = {
    dispatch: PropTypes.func.isRequired,
    showIndicators: PropTypes.bool.isRequired,
    triggerIndicators: PropTypes.func.isRequired,
    indicators: PropTypes.object.isRequired,
}