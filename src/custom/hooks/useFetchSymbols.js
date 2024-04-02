import { useState, useEffect } from 'react';
import { getExchangeInfo } from '../../data/binanceData';


export const useFetchSymbols = () => {
    const [result, setResult] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const data = await getExchangeInfo()
            setResult(data)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    return [
        result,
        isLoading
    ]
}