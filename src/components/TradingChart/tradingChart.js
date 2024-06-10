import ReactTooltip from "react-tooltip"
import PropTypes from "prop-types"
import { useEffect} from "react"
import { MainChart } from "./main"
import { useFetchKline } from "../../custom/hooks/useFetchKline"
import { isDataReady } from "../../custom/tools/constants"


export const TradingChart = ({tradingChartSpecification}) => {           
    const {symbol, interval}       = tradingChartSpecification
    const [isFetching, klineData]  = useFetchKline(symbol, interval)
    
    useEffect(() => ReactTooltip.rebuild())
    
    return (
        isDataReady(isFetching, klineData) && <>
            <MainChart 
                tradingChartSpecification={tradingChartSpecification} 
                klineData={klineData}
            />
            <ReactTooltip id='mark-tooltip' place='right' effect='solid' html={true}/>
        </>
    )
}

TradingChart.propTypes = {
    tradingChartSpecification: PropTypes.object.isRequired
}