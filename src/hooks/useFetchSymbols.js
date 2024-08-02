import { useState, useEffect } from "react"
import { getExchangeInfo } from "../Data/HttpBinance"


export const useFetchSymbols = () => {
    const [data, setData]              = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            const result = await getExchangeInfo()
            setData(result)
            setIsFetching(false)
        }
        fetchData()
    }, [])

    return [isFetching, data]
}