import PropTypes from "prop-types"
import { useReducer } from "react"
import { rootReducer } from "../../Store/Reducer"
import { SymbolNavigation } from "./SymbolsNavigation/SymbolNavigation"
import { Orderbook } from "./Orderbook/Orderbook"
import { TradingChart } from "./TradingChart/TradingChart"
import { Tradebook } from "./Tradebook/Tradebook"
import { useWindowSize } from "../../Hooks/useWindowSize"
import { 
    defaultAppSpecification, 
    getOrderbookSpecification, 
    getTradebookSpecification, 
    getTradingChartSpecification 
} from "../../Tools"


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
                    width={width}
                    dispatch={dispatch} 
                    symbolsData={symbolsData} 
                    symbol={specification.symbol}
                />
            </div>
            <div className="main-container">
                <Orderbook orderbookSpecification={orderbookSpecification}/>
                <TradingChart tradingChartSpecification={tradingChartSpecification}/>
                <Tradebook tradebookSpecification={tradebookSpecification}/>
            </div>
        </>
    )
}

Body.propTypes = {
    symbolsData: PropTypes.array.isRequired,
}