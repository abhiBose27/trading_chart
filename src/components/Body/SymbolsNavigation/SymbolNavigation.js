import PropTypes from "prop-types"
import { Dropdown } from "semantic-ui-react"
import { ACTIONS } from "../../../Store/Actions"
import React, { useRef } from "react"

export const SymbolNavigation = React.memo(({dispatch, symbol, symbolsData}) => {
    const localSymbol    = useRef(symbol)
    const symbolsOptions = symbolsData.map(elm => {return {key: elm, text: elm, value: elm}})

    const setSymbol = (e, data) => {
        if (localSymbol.current !== symbol)
            dispatch({type: ACTIONS.SYMBOL, payload: localSymbol.current})
    }

    const onChange = (e, { value }) => localSymbol.current = value

    return (
        <Dropdown
            search
            button
            labeled
            floating
            selection
            value={symbol}
            className="icon"
            icon="dollar sign"
            onChange={onChange}
            onClose={setSymbol}
            options={symbolsOptions}
        />
    )
})


SymbolNavigation.propTypes = {
    dispatch: PropTypes.func.isRequired,
    symbol: PropTypes.string.isRequired,
    symbolsData: PropTypes.array.isRequired
}