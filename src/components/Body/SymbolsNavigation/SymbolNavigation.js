import PropTypes from "prop-types"
import { Dropdown } from "semantic-ui-react"
import { ACTIONS } from "../../../Store/Actions"
import React from "react"


export const SymbolNavigation =({dispatch, specification, symbolsData}) => {
    
    const symbolsOptions = symbolsData.map(elm => {return {key: elm, text: elm, value: elm}})

    const SetSymbol = (e, { value }) => dispatch({type: ACTIONS.SYMBOL, payload: value})

    return (
        <Dropdown
            className="icon"
            onChange={SetSymbol} 
            icon="dollar sign"
            defaultValue={specification.symbol}
            options={symbolsOptions}
            floating
            labeled 
            button
            selection
            search
        />
    )
}

SymbolNavigation.propTypes = {
    dispatch: PropTypes.func.isRequired,
    specification: PropTypes.object.isRequired,
    symbolsData: PropTypes.array.isRequired
}