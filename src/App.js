import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types"
import { useReducer} from 'react';
import { ACTIONS } from './custom/reducerActions';
import { useFetchSymbols } from './custom/hooks/useFetchSymbols';
import { NavigationBar } from './components/navigation';
import { TradingChart } from './components/TradingChart/tradingChart';
import { useWindowSize } from './custom/hooks/useWindowSize';
import { Orderbook } from './components/Orderbook/orderbook';


const appReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.NEWSYMBOL:
            return {...state, symbol: action.payload}
        case ACTIONS.NEWINTERVAL:
            return {...state, interval: action.payload}
        case ACTIONS.BGCOLOR:
            return {...state, bgColor: action.payload}
        default:
            throw new Error('Unexpected action in App Component')
    }
}

const App = ({defaultSpecs}) => {
    const windowSize                      = useWindowSize();
    const [specs, dispatch]               = useReducer(appReducer, defaultSpecs)
    const [symbolsData, symbolsIsLoading] = useFetchSymbols()
    const tradingChartSpecs               = {
        ...specs,
        height: 0.85 * windowSize.height,
        width: 0.65 * windowSize.width
    }
    const orderbookSpecs                  = {
        ...specs,
        height: 0.85 * windowSize.height,
        width: 0.25 * windowSize.width
    }
    

    const AppView = !symbolsIsLoading && symbolsData &&  
        <>
            <div style={{marginTop: "1%", marginLeft: "3%"}}>
                <NavigationBar navbardispatch={dispatch} specs={specs} symbolsData={symbolsData}/>
            </div>
            <div style={{display: "flex"}}>
                <div style={{marginTop: "1%", marginLeft:"3%"}}>
                    <TradingChart specs={tradingChartSpecs}/>
                </div>
            <div style={{marginLeft:"3%"}}>
                    <Orderbook specs={orderbookSpecs}/>
                </div>
            </div>
        </>

    return (
        <div style={{
            backgroundColor: specs.bgColor === "Dark" ? "#282c34": "white",
            position: "absolute",
            height: windowSize.height,
            width: windowSize.width,
        }}>
           {AppView}
        </div>
    )
}

App.propTypes = {
    defaultSpecs: PropTypes.object.isRequired
}

export default App;
