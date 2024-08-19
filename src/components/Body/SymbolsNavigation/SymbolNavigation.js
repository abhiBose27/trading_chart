import PropTypes from "prop-types"
import { Dropdown } from "semantic-ui-react"
import { ACTIONS } from "../../../Store/Actions"
import React, { useState } from "react"


export const SymbolNavigation = React.memo(({dispatch, symbol, symbolsData}) => {

    const [localSymbol, setLocalSymbol] = useState(symbol)
    const symbolsOptions = symbolsData.map(elm => {return {key: elm, text: elm, value: elm}})

    const setSymbol = (e, data) => {
        if (localSymbol !== symbol)
            dispatch({type: ACTIONS.SYMBOL, payload: localSymbol})
    }

    const onChange = (e, { value }) => {
        setLocalSymbol(value)
    }

    return (
        <Dropdown
            className="icon"
            icon="dollar sign"
            floating
            labeled 
            button
            search
            selection
            onChange={onChange}
            onClose={setSymbol}
            options={symbolsOptions}
            value={symbol}
        />
    )
})


SymbolNavigation.propTypes = {
    dispatch: PropTypes.func.isRequired,
    symbol: PropTypes.string.isRequired,
    symbolsData: PropTypes.array.isRequired
}