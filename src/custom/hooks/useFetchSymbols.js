import { useState, useEffect } from "react"
import { getExchangeInfo } from "../../data/binance"


export const useFetchSymbols = () => {
    const [result, setResult]         = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            const data = await getExchangeInfo()
            setResult(data)
            setIsFetching(false)
        }
        fetchData()
    }, [])

    return [isFetching, result]
}