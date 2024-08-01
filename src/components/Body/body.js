import { useReducer } from "react"
import { useWindowSize } from "../../hooks/useWindowSize"
import { rootReducer } from "../../reducer"
import { COLORS, defaultAppSpecification, getOrderbookSpecification, getTradebookSpecification, getTradingChartSpecification } from "../../tools"
import { SymbolNavigation } from "./Navigation/symbolNavigation"
import { Orderbook } from "./Orderbook/orderbook"
import { TradingChart } from "./TradingChart/tradingChart"
import { Tradebook } from "./Tradebook/tradebook"


export const Body = ({symbolsData}) => {
    const windowSize                = useWindowSize()
    const [specification, dispatch] = useReducer(rootReducer, {symbol: defaultAppSpecification.symbol})
    const tradingChartSpecification = getTradingChartSpecification(specification, windowSize.height, windowSize.width)
    const orderbookSpecification    = getOrderbookSpecification(specification, windowSize.height, windowSize.width)
    const tradebookSpecification    = getTradebookSpecification(specification, windowSize.height, windowSize.width)

    return (
        <div style={{
            position: "absolute",
            width: windowSize.width,
            height: windowSize.height,
            backgroundColor: COLORS.DARKGREY,
        }}>
            <div className="symbol-nav-container">
                <SymbolNavigation
                    dispatch={dispatch}
                    symbolsData={symbolsData}
                    specification={specification}
                />
            </div>
            <div className="main-container">
                <div className="orderbook-container">
                    <Orderbook orderbookSpecification={orderbookSpecification}/>
                </div>
                <div className="tradingchart-container">
                    <TradingChart tradingChartSpecification={tradingChartSpecification}/>
                </div>
                <div className="tradebook-container">
                    <Tradebook tradebookSpecification={tradebookSpecification}/>
                </div>
            </div>
        </div>
    )
}