import "fomantic-ui-css/semantic.css"
import "./Css/styles.css"
import { useFetchSymbols } from "./Hooks/useFetchSymbols"
import { COLORS, isDataReady } from "./Tools"
import { Footer } from "./Components/Footer/Footer"
import { Body } from "./Components/Body/Body"
import { useWindowSize } from "./Hooks/useWindowSize"


const App = () => {
    const { width, height }         = useWindowSize()
    const [isFetching, symbolsData] = useFetchSymbols()
    return (
        isDataReady(isFetching, symbolsData) && 
        <div className="app-container" style={{width: width, height: height, backgroundColor: COLORS.DARKGREY}}>
            <Body symbolsData={symbolsData} width={width} height={height}/>
            <Footer symbolsData={symbolsData}/>
        </div>
       
    )
}

export default App;
