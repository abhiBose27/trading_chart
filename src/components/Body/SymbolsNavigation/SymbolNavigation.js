import PropTypes from "prop-types"
import { Dropdown } from "semantic-ui-react"
import { ACTIONS } from "../../../Store/Actions"
import React from "react"


export const SymbolNavigation =({dispatch, specification, symbolsData}) => {
    
    const symbolsOptions = symbolsData.map(elm => {return {key: elm, text: elm, value: elm}})

    const setSymbol = (e, { value }) => dispatch({type: ACTIONS.SYMBOL, payload: value})

    return (
        <Dropdown
            className="icon"
            icon="dollar sign"
            floating
            labeled 
            button
            selection
            search
            onChange={setSymbol}
            options={symbolsOptions}
            value={specification.symbol}
        />
    )
}

SymbolNavigation.propTypes = {
    dispatch: PropTypes.func.isRequired,
    specification: PropTypes.object.isRequired,
    symbolsData: PropTypes.array.isRequired
}