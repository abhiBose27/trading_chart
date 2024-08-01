import "fomantic-ui-css/semantic.css"
import "./css/styles.css"
import { useFetchSymbols } from "./hooks/useFetchSymbols"
import { isDataReady } from "./tools"
import { Footer } from "./components/Footer/footer"
import { Body } from "./components/Body/body"


const App = () => {
    const [isFetching, symbolsData] = useFetchSymbols()
    return (
        isDataReady(isFetching, symbolsData) && 
        <>
            <Body symbolsData={symbolsData}/>
            <Footer symbolsData={symbolsData}/>
        </>
       
    )
}

export default App;
