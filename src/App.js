import "fomantic-ui-css/semantic.css"
import { useReducer} from "react"
import { useFetchSymbols } from "./hooks/useFetchSymbols"
import { SymbolNavigation } from "./components/Navigation/symbolNavigation"
import { TradingChart } from "./components/TradingChart/tradingChart"
import { useWindowSize } from ".//hooks/useWindowSize"
import { Orderbook } from "./components/Orderbook/orderbook"
import { isDataReady, getTradingChartSpecification, getOrderbookSpecification, COLORS, defaultAppSpecification, getTradebookSpecification } from "./constants"
import { rootReducer } from "./reducer"
import { Tradebook } from "./components/Tradebook/tradebook"


const App = () => {
    const windowSize                = useWindowSize()
    const [isFetching, symbolsData] = useFetchSymbols()
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
           {
                isDataReady(isFetching, symbolsData) &&
                <>
                    <div style={{marginTop: "1%", marginLeft: "3.5%"}}>
                        <SymbolNavigation
                            dispatch={dispatch}
                            symbolsData={symbolsData}
                            specification={specification}
                        />
                    </div>
                    <div style={{display: "flex", marginTop: "1%"}}>
                        <div style={{marginLeft:"3.5%"}}>
                            <Orderbook orderbookSpecification={orderbookSpecification}/>
                        </div>
                        <div style={{marginLeft:"2%"}}>
                            <TradingChart tradingChartSpecification={tradingChartSpecification}/>
                        </div>
                        <div style={{marginLeft: "2%", marginRight: "2%"}}>
                            <Tradebook tradebookSpecification={tradebookSpecification}/>
                        </div>
                    </div>
                </>
           }
        </div>
    )
}

export default App;
