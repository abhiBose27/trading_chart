import React from "react"
import PropTypes from "prop-types"
import { schemeReds, schemeGreens, format } from "d3"
import { useFetchOrderbook } from "../../hooks/useFetchOrderbook"
import { COLORS, isDataReady } from "../../constants"
import { config } from "./orderbookConfig"


export const Orderbook = ({orderbookSpecification}) => {
    const { symbol, width, height } = orderbookSpecification
    const [isFetching, orderbook] = useFetchOrderbook(symbol)
    const fontColor               = COLORS.WHITE
    const depthBidColor           = config.depthBidColor
    const bidColor                = config.bidColor
    const depthAskColor           = config.depthAskColor
    const askColor                = config.askColor
    const boxShadow               = config.boxShadow
    
    // These are done based on quick calculation of height and width of the table
    const cellFontSize                   = config.cellFontSize(height, width)
    const cellHeaderfontSize             = config.cellHeaderFontSize(height, width)
    //const orderBookDepthToDisplay        = config.orderBookDepthToDisplay(height, 38)

    // Gives the gradient look to the orderbook based on the level
    const getCellBackground = (depthColor, color, level) => {
        return `linear-gradient(to left, ${depthColor} ${level[3]}%, ${color} ${level[3]}% ${100-level[3]}%)`
    }

   /*  const getUpdatedSidebook = (sidebook, sidebookType) => {
        if (orderBookDepthToDisplay >= sidebook.length)
            return sidebook
        if (sidebookType === SIDEBOOK.ASKS)
            return sidebook.slice(sidebook.length - orderBookDepthToDisplay)
        return sidebook.slice(0, -(sidebook.length - orderBookDepthToDisplay))
    } */

    const isSymbolCorrect = () => orderbook?.symbol === symbol

    return (
        <div style={{width: width, boxShadow: boxShadow}}>
            {
                isDataReady(isFetching, orderbook) && 
                isSymbolCorrect() && 
                <table style={{width: "100%"}} cellSpacing="0">
                    <thead style={{display: "block"}}>
                        <tr style={{color: fontColor, fontSize: cellHeaderfontSize}}>
                            <th style={{textAlign: "initial", width: "50%"}}>Price</th>
                            <th style={{textAlign: "center", width: "10%"}}>Amount</th>
                            <th style={{textAlign: "end", width: "40%"}}>Total</th>
                        </tr>
                    </thead>
                    <tbody style={{height: height, overflowY: "auto", display: "block"}}>
                        {
                            orderbook.asks.map((level) => (
                                <tr key={level} style={{backgroundImage: getCellBackground(depthBidColor, bidColor, level), fontSize: cellFontSize}}>
                                    <td style={{textAlign: "initial", color: schemeReds[6][4], width: "50%"}}>{level[0]}</td>
                                    <td style={{textAlign: "center", color: fontColor, opacity: "0.8", width: "10%"}}>{format(".4f")(level[1])}</td>
                                    <td style={{textAlign: "end", color: fontColor, opacity: "0.8", width: "40%"}}>{format(".4f")(level[2])}</td>
                                </tr>
                            ))
                        }
                        {
                            orderbook.bids.map((level) => (
                                <tr key={level} style={{backgroundImage: getCellBackground(depthAskColor, askColor, level), fontSize: cellFontSize}}>
                                    <td style={{textAlign: "initial", color: schemeGreens[6][4], width: "50%"}}>{level[0]}</td>
                                    <td style={{textAlign: "center", color: fontColor, opacity: "0.8", width: "10%"}}>{format(".4f")(level[1])}</td>
                                    <td style={{textAlign: "end", color: fontColor, opacity: "0.8", width: "40%"}}>{format(".4f")(level[2])}</td>
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