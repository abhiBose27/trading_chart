import ReactTooltip from "react-tooltip"
import PropTypes from "prop-types"
import { useEffect, useReducer} from "react"
import { rootReducer } from "../../../Store/Reducer"
import { ChartNavigation } from "./ChartNavigation/ChartNavigation"
import { ChartWrapper } from "./Chart/ChartWrapper"
import { config } from "./TradingChartConfig"

/**
 * @param {object} tradingChartSpecification = {
        symbol: ...,
        height: ...,
        width: ...
 *  } 
 */
export const TradingChart = ({tradingChartSpecification}) => {
    const [specification, dispatch] = useReducer(rootReducer, config.getInitialTradingChartSpecification)
    const { width }                 = tradingChartSpecification

    useEffect(() => ReactTooltip.rebuild())

    return (
        <div>
            <ChartNavigation dispatch={dispatch} width={width} specification={specification}/>
            <ChartWrapper specification={{...tradingChartSpecification, ...specification}}/>
        </div>
    )
}

TradingChart.propTypes = {
    tradingChartSpecification: PropTypes.object.isRequired
}