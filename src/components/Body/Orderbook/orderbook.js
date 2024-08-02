import React from "react"
import PropTypes from "prop-types"
import { schemeReds, schemeGreens, format } from "d3"
import { useFetchOrderbook } from "../../../Hooks/useFetchOrderbook"
import { COLORS, isDataReady } from "../../../Tools"


export const Orderbook = ({orderbookSpecification}) => {
    const { symbol, width, height } = orderbookSpecification
    const [isFetching, orderbook]   = useFetchOrderbook(symbol)
    const fontColor                 = COLORS.WHITE
    const depthBidColor             = COLORS.DEPTHBIDCOLOR
    const bidColor                  = COLORS.BIDCOLOR
    const depthAskColor             = COLORS.DEPTHASKCOLOR
    const askColor                  = COLORS.ASKCOLOR
    const cellFontSize              = 1 + (height + width) / 1.7 * 0.017
    const cellHeaderFontSize        = 4 + (height + width) / 1.7 * 0.017

    // Gives the gradient look to the orderbook based on the level
    const getCellBackground = (depthColor, color, level) => `linear-gradient(to left, ${depthColor} ${level[3]}%, ${color} ${level[3]}% ${100-level[3]}%)`

    const isSymbolCorrect = () => orderbook?.symbol === symbol

    return (
        <div className="orderbook" style={{width: width}}>
            {
                isDataReady(isFetching, orderbook) && 
                isSymbolCorrect() && 
                <table className="orderbook-table" cellSpacing="0">
                    <thead style={{fontSize: cellHeaderFontSize, color: fontColor}}>
                        <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody style={{height: height, fontSize: cellFontSize, color: fontColor}}>
                        {
                            orderbook.result.asks.map(order => (
                                <tr key={order.id} style={{backgroundImage: getCellBackground(depthBidColor, bidColor, order.level)}}>
                                    <td style={{color: schemeReds[6][4]}}>{order.level[0]}</td>
                                    <td>{format(".4f")(order.level[1])}</td>
                                    <td>{format(".4f")(order.level[2])}</td>
                                </tr>
                            ))
                        }
                        {
                            orderbook.result.bids.map(order => (
                                <tr key={order.id} style={{backgroundImage: getCellBackground(depthAskColor, askColor, order.level)}}>
                                    <td style={{color: schemeGreens[6][4]}}>{order.level[0]}</td>
                                    <td>{format(".4f")(order.level[1])}</td>
                                    <td>{format(".4f")(order.level[2])}</td>
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