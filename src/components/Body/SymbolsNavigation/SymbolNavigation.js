import PropTypes from "prop-types"
import React, { useRef } from "react"
import { Dropdown, Menu, Segment } from "semantic-ui-react"
import { ACTIONS } from "../../../Store/Actions"
import { Symbol24hTicker } from "./Symbol24hTicker"


export const SymbolNavigation = React.memo(({dispatch, symbol, symbolsData, width}) => {
    const localSymbol        = useRef(symbol)
    const symbolsOptions     = symbolsData.map(elm => {return {key: elm, text: elm, value: elm}})

    const setSymbol = (e, data) => {
        if (localSymbol.current !== symbol)
            dispatch({type: ACTIONS.SYMBOL, payload: localSymbol.current})
    }

    const onChange = (e, { value }) => localSymbol.current = value

    return (
        <div style={{width: width}}>
            <Menu inverted fluid>
                <Segment inverted>
                    <Dropdown
                        className="link item"
                        search
                        selection
                        value={symbol}
                        onChange={onChange}
                        onClose={setSymbol}
                        options={symbolsOptions}
                    />
                </Segment>
                <Symbol24hTicker symbol={symbol}/>
            </Menu>
        </div>
    )
})


SymbolNavigation.propTypes = {
    dispatch: PropTypes.func.isRequired,
    symbol: PropTypes.string.isRequired,
    symbolsData: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired
}