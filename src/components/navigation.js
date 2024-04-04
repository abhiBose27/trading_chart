import Nav from "react-bootstrap/Nav"
import PropTypes from "prop-types"
import NavDropdown  from "react-bootstrap/NavDropdown"
import Dropdown from "react-bootstrap/Dropdown"

import { ACTIONS } from "../custom/tools/reducer"


export const NavigationBar = ({appDispatch, appSpecification, symbolsData}) => {

    const SetSymbol = (selectedKey) => 
        appDispatch({type: ACTIONS.SYMBOL, payload: selectedKey})
    
    const SetInterval = (selectedKey) => 
        appDispatch({type: ACTIONS.INTERVAL, payload: selectedKey})

    const SetColor = (selectedKey) => 
        appDispatch({type: ACTIONS.BGCOLOR, payload: selectedKey})
    
    return (
        <div style={{display: "flex"}}>
           <Dropdown onSelect={SetSymbol}>
                <Dropdown.Toggle id="dropdown-basic">{appSpecification.symbol}</Dropdown.Toggle>
                <Dropdown.Menu style={{ 
                    height: "30vh", 
                    overflowY: "auto", 
                }}>
                    {symbolsData.map((elem, idx) => (
                        <Dropdown.Item eventKey={elem} key={elem}>{elem}</Dropdown.Item>
                    ))}
                </Dropdown.Menu> 
            </Dropdown>
            <Nav className="me-auto">
                <NavDropdown onSelect={SetInterval} title={appSpecification.interval} id="nav-dropdown">
                    <NavDropdown.Item eventKey="1s">1s</NavDropdown.Item>
                    <NavDropdown.Item eventKey="1m">1m</NavDropdown.Item>
                    <NavDropdown.Item eventKey="3m">3m</NavDropdown.Item>
                    <NavDropdown.Item eventKey="5m">5m</NavDropdown.Item>
                    <NavDropdown.Item eventKey="15m">15m</NavDropdown.Item>
                    <NavDropdown.Item eventKey="30m">30m</NavDropdown.Item>
                    <NavDropdown.Item eventKey="1h">1h</NavDropdown.Item>
                    <NavDropdown.Item eventKey="2h">2h</NavDropdown.Item>
                    <NavDropdown.Item eventKey="6h">6h</NavDropdown.Item>
                    <NavDropdown.Item eventKey="12h">12h</NavDropdown.Item>
                    <NavDropdown.Item eventKey="1d">1d</NavDropdown.Item>
                    <NavDropdown.Item eventKey="1M">1M</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown onSelect={SetColor} title={appSpecification.bgColor} id="nav-dropdown">
                    <NavDropdown.Item eventKey="Dark">Dark</NavDropdown.Item>
                    <NavDropdown.Item eventKey="Light">Light</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </div>
    )
}

NavigationBar.propTypes = {
    appDispatch: PropTypes.func.isRequired,
    appSpecification: PropTypes.object.isRequired,
    symbolsData: PropTypes.array.isRequired
}