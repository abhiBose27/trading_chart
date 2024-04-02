import React from 'react'
import PropTypes from "prop-types"
import { useFetchOrderbook } from "../../custom/hooks/useFetchOrderbook"


export const Orderbook = ({specs}) => {
    const {symbol, bgColor, width, height} = specs
    const [isFetching, orderbook]          = useFetchOrderbook(symbol)
    const depthBidColor                    = "rgba(111, 22, 14, 0.4)"
    const bidColor                         = "rgba(111, 22, 14, 0.05)"
    const depthAskColor                    = "rgba(60, 179, 113, 0.4)"
    const askColor                         = "rgba(60, 179, 113, 0.05)"
    const fontColor                        = bgColor === "Dark" ? "white" : "black"
    return (
        !isFetching && orderbook && <table style={{height: height, width: width}}>
            <thead>
                <tr style={{color: fontColor, fontSize: "1vw"}}>
                    <th style={{textAlign: "initial"}}>Price</th>
                    <th style={{textAlign: "end"}}>Amount</th>
                    <th style={{textAlign: "end"}}>Total</th>
                </tr>
            </thead>
            <tbody>
                {
                    orderbook.bids.map((level) => (
                        <tr key={level} style={{backgroundImage: `linear-gradient(to left, ${depthBidColor} ${level[3]}%, ${bidColor} ${level[3]}% ${100-level[3]}%)`, fontSize: "75%"}}>
                            <td style={{textAlign: "initial", color: "red"}}>{level[0]}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{level[1]}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{level[2]}</td>
                        </tr>
                    ))
                }
                {
                    orderbook.asks.map((level) => (
                        <tr key={level} style={{backgroundImage: `linear-gradient(to left, ${depthAskColor} ${level[3]}%, ${askColor} ${level[3]}% ${100-level[3]}%)`, fontSize: "75%"}}>
                            <td style={{textAlign: "initial", color: "green"}}>{level[0]}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{level[1]}</td>
                            <td style={{textAlign: "end", color: fontColor, opacity: "0.8"}}>{level[2]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

Orderbook.propTypes = {
    specs: PropTypes.object.isRequired
}