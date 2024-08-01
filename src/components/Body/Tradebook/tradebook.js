import { schemeGreens, schemeReds, utcFormat } from "d3"
import { COLORS, isDataReady, SIDE } from "../../../tools"
import { useFetchTrades } from "../../../hooks/useFetchTrades"
import { config } from "./tradebookConfig"


export const Tradebook = ({tradebookSpecification}) => {
    const { symbol, width, height } = tradebookSpecification
    const [isFetching, tradebook]   = useFetchTrades(symbol)
    const fontColor                 = COLORS.WHITE
    const cellHeaderFontSize        = config.cellHeaderFontSize(height, width)
    const cellFontSize              = config.cellFontSize(height, width)

    const isSymbolCorrect = () => tradebook?.symbol === symbol

    const getFontColorOnSide = (side) => side === SIDE.SELL ? schemeReds[6][4] : schemeGreens[6][4]

    return (
        <div className="tradebook" style={{width: width}}>
            {
                isDataReady(isFetching, tradebook) &&
                isSymbolCorrect() &&
                <table className="tradebook-table" cellSpacing="0">
                    <thead style={{color: fontColor, fontSize: cellHeaderFontSize}}>
                        <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody style={{height: height, color: fontColor, fontSize: cellFontSize}}>
                        {
                            tradebook.result.map((trade, idx) => (
                                <tr key={`tradebook-row-${idx}`}>
                                    <td style={{color: getFontColorOnSide(trade.side)}}>{trade.price}</td>
                                    <td>{trade.qty}</td>
                                    <td>{utcFormat("%H:%M:%S")(trade.date)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            }
        </div>
    )
}