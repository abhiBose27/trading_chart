//import Nav from "react-bootstrap/Nav"
import PropTypes from "prop-types"
//import NavDropdown  from "react-bootstrap/NavDropdown"
//import Dropdown from "react-bootstrap/Dropdown"
import { Dropdown } from "semantic-ui-react"
import { ACTIONS } from "../../constants"
import { useMemo } from "react"


export const SymbolNavigation = ({dispatch, specification, symbolsData}) => {

    const SetSymbol = (e, { value }) => dispatch({type: ACTIONS.SYMBOL, payload: value})
    
    const symbolsOptions = useMemo(() => {
        return symbolsData.map(elm => {
            return {key: elm, text: elm, value: elm}
        })
    }, [symbolsData])

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