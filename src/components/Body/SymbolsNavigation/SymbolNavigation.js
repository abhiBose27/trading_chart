import PropTypes from "prop-types"
import React, { useRef } from "react"
import { Dropdown, Menu, Segment } from "semantic-ui-react"
import { ACTIONS } from "../../../Store/Actions"
import { Symbol24hTicker } from "./Symbol24hTicker"


export const SymbolNavigation = React.memo(({dispatch, symbol, symbolsData, width}) => {
    const symbolRef      = useRef(symbol)
    const symbolsOptions = symbolsData.map(elm => {return {key: elm, text: elm, value: elm}})
    const onChange  = (e, { value }) => symbolRef.current = value
    const setSymbol = (e, data)      => {
        if (symbolRef.current !== symbol)
            dispatch({type: ACTIONS.SYMBOL, payload: symbolRef.current})
    }

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