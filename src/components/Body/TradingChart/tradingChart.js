import ReactTooltip from "react-tooltip"
import PropTypes from "prop-types"
import { useEffect, useReducer} from "react"
import { rootReducer } from "../../../reducer"
import { ChartFeatureNavigation } from "./Navigation/chartFeatureNavigation"
import { Chart } from "./Chart/chart"


export const TradingChart = ({tradingChartSpecification}) => {
    const [specification, dispatch] = useReducer(rootReducer, {
        interval: "1m", 
        theme: "Dark",
        indicators: [
            {key: 1, checked: true, movingAverageValue: 7, color: "orange"},
            {key: 2, checked: true, movingAverageValue: 25, color: "pink"},
            {key: 3, checked: true, movingAverageValue: 99, color: "teal"},
            {key: 4, checked: false, movingAverageValue: 0, color: "purple"},
            {key: 5, checked: false, movingAverageValue: 0, color: "blue"},
            {key: 6, checked: false, movingAverageValue: 0, color: "red"},
            {key: 7, checked: false, movingAverageValue: 0, color: "olive"},
            {key: 8, checked: false, movingAverageValue: 0, color: "yellow"},
            {key: 9, checked: false, movingAverageValue: 0, color: "brown"}
        ]
    })

    useEffect(() => ReactTooltip.rebuild())

    return (
        <>
            <ChartFeatureNavigation dispatch={dispatch} specification={{...tradingChartSpecification, ...specification}}/>
            <Chart specification={{...tradingChartSpecification, ...specification}}/>
        </>
    )
}

TradingChart.propTypes = {
    tradingChartSpecification: PropTypes.object.isRequired
}