import React from "react"
import PropTypes from "prop-types"
import { schemeReds, schemeGreens } from "d3"
import { useFetchOrderbook } from "../../custom/hooks/useFetchOrderbook"
import { isDataReady, formatValue, isBgColorDark } from "../../custom/tools/constants"


export const Orderbook = ({orderbookSpecification}) => {
    const {symbol, bgColor, width, height} = orderbookSpecification
    const [isFetching, orderbook]          = useFetchOrderbook(symbol)
    const fontColor                        = isBgColorDark(bgColor) ? "white" : "black"
    const depthBidColor                    = "rgba(111, 22, 14, 0.4)"
    const bidColor                         = "rgba(111, 22, 14, 0.05)"
    const depthAskColor                    = "rgba(60, 179, 113, 0.4)"
    const askColor                         = "rgba(60, 179, 113, 0.05)"

    return (
        isDataReady(isFetching, orderbook) && <table style={{height: height, width: width}}>
            <thead>
                <tr style={{color: fontColor, fontSize: "1vw"}}>
                    <th style={{textAlign: "initial"}}>Price</th>
                    <th style={{textAlign: "end"}}>Amount</th>
                    <th style={{textAlign: "end"}}>Total</th>
                </tr>
            </thead>
            <tbody>
                {
                    orderbook.asks.map((level) => (
                        <tr key={level} style={{backgroundImage: `linear-gradient(to left, ${depthBidColor} ${level[3]}%, ${bidColor} ${level[3]}% ${100-level[3]}%)`, fontSize: "75%"}}>
                            <td style={{textAlign: "initial", color: schemeReds[6][4]}}>{level[0]}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{formatValue(".4f")(level[1])}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{formatValue(".5f")(level[2])}</td>
                        </tr>
                    ))
                }
                {
                    orderbook.bids.map((level) => (
                        <tr key={level} style={{backgroundImage: `linear-gradient(to left, ${depthAskColor} ${level[3]}%, ${askColor} ${level[3]}% ${100-level[3]}%)`, fontSize: "75%"}}>
                            <td style={{textAlign: "initial", color: schemeGreens[6][4]}}>{level[0]}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{formatValue(".4f")(level[1])}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{formatValue(".4f")(level[2])}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

Orderbook.propTypes = {
    orderbookSpecification: PropTypes.object.isRequired
}