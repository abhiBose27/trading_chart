import React from "react"
import PropTypes from "prop-types"
import { schemeReds, schemeGreens, format } from "d3"
import { useFetchOrderbook } from "../../../hooks/useFetchOrderbook"
import { COLORS, isDataReady } from "../../../tools"
import { config } from "./orderbookConfig"


export const Orderbook = ({orderbookSpecification}) => {
    const { symbol, width, height } = orderbookSpecification
    const [isFetching, orderbook]   = useFetchOrderbook(symbol)
    const fontColor                 = COLORS.WHITE
    const depthBidColor             = config.depthBidColor
    const bidColor                  = config.bidColor
    const depthAskColor             = config.depthAskColor
    const askColor                  = config.askColor
    
    // These are done based on quick calculation of height and width of the table
    const cellFontSize            = config.cellFontSize(height, width)
    const cellHeaderfontSize      = config.cellHeaderFontSize(height, width)

    // Gives the gradient look to the orderbook based on the level
    const getCellBackground = (depthColor, color, level) => {
        return `linear-gradient(to left, ${depthColor} ${level[3]}%, ${color} ${level[3]}% ${100-level[3]}%)`
    }

    const isSymbolCorrect = () => orderbook?.symbol === symbol

    return (
        <div className="orderbook" style={{width: width}}>
            {
                isDataReady(isFetching, orderbook) && 
                isSymbolCorrect() && 
                <table className="orderbook-table" cellSpacing="0">
                    <thead style={{color: fontColor, fontSize: cellHeaderfontSize}}>
                        <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody style={{height: height, fontSize: cellFontSize, color: fontColor}}>
                        {
                            orderbook.asks.map((level, idx) => (
                                <tr key={`orderbook-row-asks-${idx}`} style={{backgroundImage: getCellBackground(depthBidColor, bidColor, level)}}>
                                    <td style={{color: schemeReds[6][4]}}>{level[0]}</td>
                                    <td>{format(".4f")(level[1])}</td>
                                    <td>{format(".4f")(level[2])}</td>
                                </tr>
                            ))
                        }
                        {
                            orderbook.bids.map((level, idx) => (
                                <tr key={`orderbook-row-bids-${idx}`} style={{backgroundImage: getCellBackground(depthAskColor, askColor, level)}}>
                                    <td style={{color: schemeGreens[6][4]}}>{level[0]}</td>
                                    <td>{format(".4f")(level[1])}</td>
                                    <td>{format(".4f")(level[2])}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
        
    )
}

Orderbook.propTypes = {
    orderbookSpecification: PropTypes.object.isRequired
}