import "bootstrap/dist/css/bootstrap.min.css"
import PropTypes from "prop-types"
import { useReducer} from "react"
import { useFetchSymbols } from "./custom/hooks/useFetchSymbols"
import { NavigationBar } from "./components/navigation"
import { TradingChart } from "./components/TradingChart/tradingChart"
import { useWindowSize } from "./custom/hooks/useWindowSize"
import { Orderbook } from "./components/Orderbook/orderbook"
import { isDataReady, isBgColorDark } from "./custom/tools/constants"
import { rootReducer } from "./custom/tools/reducer"


const App = ({defaultAppSpecification}) => {
    const windowSize                      = useWindowSize()
    const [isFetching, symbolsData]       = useFetchSymbols()
    const [appSpecification, appDispatch] = useReducer(rootReducer, defaultAppSpecification)
    const backgroundColor                 = isBgColorDark(appSpecification.bgColor) ? "#282c34": "white"
    const tradingChartSpecification       = {...appSpecification, height: 0.85 * windowSize.height, width: 0.65 * windowSize.width}
    const orderbookSpecification          = {...appSpecification, height: 0.85 * windowSize.height, width: 0.25 * windowSize.width}
    
    const AppView = isDataReady(isFetching, symbolsData) &&  <>
            <div style={{marginTop: "1%", marginLeft: "3%"}}>
                <NavigationBar
                    appDispatch={appDispatch}
                    symbolsData={symbolsData}
                    appSpecification={appSpecification}
                />
            </div>
            <div>
                <div style={{marginTop: "1%", marginLeft:"3%", float: "left"}}>
                    <TradingChart tradingChartSpecification={tradingChartSpecification}/>
                </div>
                <div style={{marginRight:"3%", float:"right"}}>
                    <Orderbook orderbookSpecification={orderbookSpecification}/>
                </div>
            </div>
        </>

    return (
        <div style={{
            position: "absolute",
            width: windowSize.width,
            height: windowSize.height,
            backgroundColor: backgroundColor,
        }}>
           {AppView}
        </div>
    )
}

App.propTypes = {
    defaultAppSpecification: PropTypes.object.isRequired
}

export default App;
