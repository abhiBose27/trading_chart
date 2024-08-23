import PropTypes from "prop-types"
import { schemeGreens, schemeReds, utcFormat } from "d3"
import { COLORS, isDataReady, SIDE } from "../../../Tools"
import { useFetchTrades } from "../../../Hooks/useFetchTrades"


export const Tradebook = ({tradebookSpecification}) => {
    const { symbol, width, height } = tradebookSpecification
    const [isFetching, tradebook]   = useFetchTrades(symbol)
    const fontColor                 = COLORS.WHITE
    const cellHeaderFontSize        = 4 + (height + width) / 1.7 * 0.017
    const cellFontSize              = 1 + (height + width) / 1.7 * 0.017
    const isSymbolCorrect    = ()     => tradebook.symbol === symbol
    const getFontColorBySide = (side) => side === SIDE.SELL ? schemeReds[6][4] : schemeGreens[6][4]

    return (
        <div className="tradebook" style={{width: width}}>
            <table className="tradebook-table" cellSpacing="0">
                <thead style={{color: fontColor, fontSize: cellHeaderFontSize}}>
                    <tr>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Time</th>
                    </tr>
                </thead>
                {
                    isDataReady(isFetching, tradebook) &&
                    isSymbolCorrect() &&
                    <tbody style={{height: height, color: fontColor, fontSize: cellFontSize}}>
                    {
                        tradebook.result.map(trade => (
                            <tr key={trade.id}>
                                <td style={{color: getFontColorBySide(trade.side)}}>{trade.price}</td>
                                <td>{trade.qty}</td>
                                <td>{utcFormat("%H:%M:%S")(trade.date)}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                }
            </table>
        </div>
    )
}

Tradebook.propTypes = {
    tradebookSpecification: PropTypes.object.isRequired
}