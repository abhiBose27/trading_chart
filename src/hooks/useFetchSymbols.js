import { useState, useEffect } from "react"
import { getExchangeInfo } from "../Data/Http/HttpBinance"


export const useFetchSymbols = () => {
    const [symbols, setSymbols]       = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            const result = await getExchangeInfo()
            setSymbols(result)
            setIsFetching(false)
        }
        fetchData()
    }, [])

    return [isFetching, symbols]
}