import ReactTooltip from "react-tooltip"
import PropTypes from "prop-types"
import { useEffect} from "react";
import { MainChart } from "./main";
import { useFetchKline } from "../../custom/hooks/useFetchKline";


export const TradingChart = ({specs}) => {           
    const {symbol, interval}        = specs
    const [isFetching, klineData]   = useFetchKline(symbol, interval)
    useEffect(() => ReactTooltip.rebuild())
    return (
        !isFetching && klineData && 
        <>
            <MainChart specs={specs} klineData={klineData}/>
            <ReactTooltip id='mark-tooltip' place='right' effect='solid' html={true}/>
        </>
    )
}

TradingChart.propTypes = {
    specs: PropTypes.object.isRequired
}