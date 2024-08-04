import ReactTooltip from "react-tooltip"
import PropTypes from "prop-types"
import { useEffect, useReducer} from "react"
import { rootReducer } from "../../../Store/Reducer"
import { ChartNavigation } from "./ChartNavigation/ChartNavigation"
import { ChartWrapper } from "./Chart/ChartWrapper"
import { config } from "./TradingChartConfig"


export const TradingChart = ({tradingChartSpecification}) => {
    const [specification, dispatch] = useReducer(rootReducer, config.getInitialTradingChartSpecification)

    useEffect(() => ReactTooltip.rebuild())

    return (
        <>
            <ChartNavigation dispatch={dispatch} specification={{...tradingChartSpecification, ...specification}}/>
            <ChartWrapper specification={{...tradingChartSpecification, ...specification}}/>
        </>
    )
}

TradingChart.propTypes = {
    tradingChartSpecification: PropTypes.object.isRequired
}