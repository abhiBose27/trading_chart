import PropTypes from "prop-types"
import { Loader } from "semantic-ui-react"
import { isDataReady } from "../../../../Tools"
import { useFetchKline } from "../../../../Hooks/useFetchKline"
import { Chart } from "./Chart"
import { useEffect } from "react"
import ReactTooltip from "react-tooltip"


export const ChartWrapper = ({specification}) => {
    const { symbol, interval, indicators } = specification
    const [isFetching, klineData] = useFetchKline(symbol, interval, indicators)

    const isIntervalCorrect = () => klineData?.interval === interval
    
    useEffect(() => ReactTooltip.rebuild())

    if (!isDataReady(isFetching, klineData))
        return <Loader className="ui active slow green medium double loader"></Loader>
    
    return (
        isIntervalCorrect() &&
        <>
            <Chart specification={specification} klineData={klineData.result}/>
            <ReactTooltip id='mark-tooltip' place='right' effect='solid' html={true}/>
        </>
    )
}

ChartWrapper.propTypes = {
    specification: PropTypes.object.isRequired
}