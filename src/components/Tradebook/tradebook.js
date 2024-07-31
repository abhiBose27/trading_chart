import { schemeGreens, schemeReds, utcFormat } from "d3"
import { COLORS, isDataReady, SIDE } from "../../constants"
import { useFetchTrades } from "../../hooks/useFetchTrades"
import { config } from "./tradebookConfig"

export const Tradebook = ({tradebookSpecification}) => {
    const { symbol, width, height } = tradebookSpecification
    const [isFetching, tradebook]   = useFetchTrades(symbol)
    const fontColor                 = COLORS.WHITE
    const cellHeaderFontSize        = config.cellHeaderFontSize(height, width)
    const cellFontSize              = config.cellFontSize(height, width)

    const isSymbolCorrect = () => tradebook?.symbol === symbol

    return (
        <div style={{width: width, boxShadow: config.boxShadow}}>
            {
                isDataReady(isFetching, tradebook) &&
                isSymbolCorrect() &&
                <table style={{width: "100%"}} cellSpacing="0">
                    <thead style={{display: "block"}}>
                        <tr style={{color: fontColor, fontSize: cellHeaderFontSize}}>
                            <th style={{textAlign: "initial", width: "50%"}}>Price</th>
                            <th style={{textAlign: "center", width: "10%"}}>Amount</th>
                            <th style={{textAlign: "end", width: "40%"}}>Time</th>
                        </tr>
                    </thead>
                    <tbody style={{height: height, overflowY: "auto", display: "block"}}>
                        {
                            tradebook.result.map((trade, idx) => (
                                <tr key={idx} style={{fontSize: cellFontSize}}>
                                    <td style={{textAlign: "initial", color: trade.side === SIDE.SELL ? schemeReds[6][4] : schemeGreens[6][4], width: "50%"}}>{trade.price}</td>
                                    <td style={{textAlign: "center", color: fontColor, opacity: "0.8", width: "10%"}}>{trade.qty}</td>
                                    <td style={{textAlign: "end", color: fontColor, opacity: "0.8", width: "40%"}}>{utcFormat("%H:%M:%S")(trade.date)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
    )
}