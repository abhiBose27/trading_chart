import PropTypes from "prop-types"
import { useReducer } from "react"
import { rootReducer } from "../../Store/Reducer"
import { SymbolNavigation } from "./SymbolsNavigation/SymbolNavigation"
import { Orderbook } from "./Orderbook/Orderbook"
import { TradingChart } from "./TradingChart/TradingChart"
import { Tradebook } from "./Tradebook/Tradebook"
import { defaultAppSpecification, getOrderbookSpecification, getTradebookSpecification, getTradingChartSpecification } from "../../Tools"
import { useWindowSize } from "../../Hooks/useWindowSize"


export const Body = ({symbolsData}) => {
    const { width, height }         = useWindowSize()
    const [specification, dispatch] = useReducer(rootReducer, {symbol: defaultAppSpecification.symbol})
    const tradingChartSpecification = getTradingChartSpecification(specification, height, width)
    const orderbookSpecification    = getOrderbookSpecification(specification, height, width)
    const tradebookSpecification    = getTradebookSpecification(specification, height, width)

    return (
        <>
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
        </>
    )
}

Body.propTypes = {
    symbolsData: PropTypes.array.isRequired,
}