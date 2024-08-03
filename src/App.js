import "fomantic-ui-css/semantic.css"
import "./Css/styles.css"
import { useFetchSymbols } from "./Hooks/useFetchSymbols"
import { isDataReady } from "./Tools"
import { Footer } from "./Components/Footer/Footer"
import { Body } from "./Components/Body/Body"


const App = () => {
    const [isFetching, symbolsData] = useFetchSymbols()
    return (
        isDataReady(isFetching, symbolsData) && 
        <div className="app-container">
            <Body symbolsData={symbolsData}/>
            <Footer symbolsData={symbolsData}/>
        </div>
       
    )
}

export default App;
