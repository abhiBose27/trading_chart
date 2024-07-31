import PropTypes from "prop-types"
import { Loader } from "semantic-ui-react"
import { isDataReady } from "../../../constants"
import { useFetchKline } from "../../../hooks/useFetchKline"
import { MainChart } from "./main"
import { useEffect } from "react"
import ReactTooltip from "react-tooltip"


export const Chart = ({specification}) => {
    const { symbol, interval, indicators } = specification
    const [isFetching, klineData]          = useFetchKline(symbol, interval, indicators)

    const isIntervalCorrect = () => klineData?.interval === interval
    useEffect(() => ReactTooltip.rebuild())

    if (!isDataReady(isFetching, klineData))
        return <Loader className="ui active slow green medium double loader"></Loader>
    
    return (
        isIntervalCorrect() &&
        <>
            <MainChart 
                specification={specification}
                klineData={klineData.result}
            />
            <ReactTooltip id='mark-tooltip' place='right' effect='solid' html={true}/>
        </>
    )
}

Chart.propTypes = {
    specification: PropTypes.object.isRequired
}