import PropTypes from "prop-types"
import { useState } from "react"
import { Modal, ModalContent, Grid, GridRow, Form, FormField, GridColumn, FormGroup, FormCheckbox, FormInput, Icon, Button } from "semantic-ui-react"


export const Indicator = ({
    showIndicators, 
    triggerIndicators, 
    formSubmit, 
    localIndicators,
    setLocalIndicators,
}) => {

    // Hard Coded initialised. Needs to be changed
    const [indicatorTypeClicked, setIndicatorTypeClicked] = useState("MA")

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
            case "CHECK":
                updateIndicators[indicatorTypeClicked].parameters[key - 1] = {...localIndicators[indicatorTypeClicked].parameters[key - 1], checked: value}
                break
            case "MOVINGAVERAGEVALUE":
                updateIndicators[indicatorTypeClicked].parameters[key - 1] = {...localIndicators[indicatorTypeClicked].parameters[key - 1], movingAverageValue: parseInt(value)}
                break
            default:
                break;
        }
        setLocalIndicators(updateIndicators)
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
                    <FormCheckbox
                        slider
                        checked={parameter.checked} 
                        label={`${indicatorTypeClicked}${parameter.key}`} 
                        onChange={(e, { checked }) => setValues(checked, parameter.key, "CHECK")}
                    />
                    <FormInput
                        size="mini"
                        type="number"
                        disabled={!parameter.checked}
                        value={parameter.movingAverageValue}
                        onChange={(e, { value }) => setValues(value, parameter.key, "MOVINGAVERAGEVALUE")}
                    />
                    <Icon className="circle" color={parameter.color} size="large"/>
                </FormGroup>
            ))
        )
    }

    return (
        <Modal size="tiny" open={showIndicators} onClose={triggerIndicators}>
            <ModalContent>
                <Grid columns={2} divided>
                    <GridRow stretched>
                        <GridColumn width={5}>
                            <Form> 
                                {getIndicatorTypeCheckboxesJSX()}
                            </Form>
                        </GridColumn>
                        <GridColumn>
                            <Form onSubmit={formSubmit}>
                                <FormField>
                                    <b>{indicatorTypeClicked}</b>
                                </FormField>
                                <FormField>
                                    {getIndicatorTypeParametersJSX()}
                                <Button type="submit">Save</Button>
                                </FormField>
                            </Form>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </ModalContent>
        </Modal>
    )
}

Indicator.propTypes = {
    showIndicators: PropTypes.bool.isRequired,
    triggerIndicators: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    localIndicators: PropTypes.object.isRequired,
    setLocalIndicators: PropTypes.func.isRequired
}