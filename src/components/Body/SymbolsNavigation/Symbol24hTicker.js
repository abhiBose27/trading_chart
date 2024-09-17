import React from "react"
import PropTypes from "prop-types"
import { format } from "d3"
import { Menu, MenuItem } from "semantic-ui-react"
import { useFetch24hrTicker } from "../../../Hooks/useFetch24hrTicker"
import { isDataReady, klineColor } from "../../../Tools"


export const Symbol24hTicker = ({symbol}) => {
    const [isFetching, tickerData] = useFetch24hrTicker(symbol)
    const isReadyToDisplay         = isDataReady(isFetching, tickerData) &&  tickerData.symbol === symbol

    return (
        isReadyToDisplay &&
        <>
            <MenuItem>
                {`${format(".5f")(tickerData.result.lastPrice)}`}
            </MenuItem>
            <Menu vertical inverted>
                <MenuItem>
                    <header style={{opacity: 0.6}}>24h Change</header>
                    <br/>
                    <span style={{color: klineColor(tickerData.result)}}>
                        {format(".4f")(tickerData.result.price)} &nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span style={{color: klineColor(tickerData.result)}}>
                        {format(".4f")(tickerData.result.pricePercent) + "%"}
                    </span>
                </MenuItem>
            </Menu>
            <Menu vertical inverted>
                <MenuItem>
                    <header style={{opacity: 0.6}}>24h High</header>
                    <br/>
                    <span>
                        {format(".4f")(tickerData.result.high)}
                    </span>
                </MenuItem>
            </Menu>
            <Menu vertical inverted>
                <MenuItem>
                    <header style={{opacity: 0.6}}>24h Low</header>
                    <br/>
                    <span>
                        {format(".4f")(tickerData.result.low)}
                    </span>
                </MenuItem>
            </Menu>
            <Menu vertical inverted>
                <MenuItem>
                    <header style={{opacity: 0.6}}>24h Volume</header>
                    <br/>
                    <span>
                        {format(".4f")(tickerData.result.volumeBase)}
                    </span>
                </MenuItem>
            </Menu>
            <Menu vertical inverted>
                <MenuItem>
                    <header style={{opacity: 0.6}}>24h Volume Quote</header>
                    <br/>
                    <span>
                        {format(".4f")(tickerData.result.volumeQuote)}
                    </span>
                </MenuItem>
            </Menu>
        </>
    )
}

Symbol24hTicker.propTypes = {
    symbol: PropTypes.string.isRequired
}