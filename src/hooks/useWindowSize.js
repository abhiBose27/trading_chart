import { useEffect, useState } from "react"


export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    useEffect(() => {
        window.onresize = () => setWindowSize({width: window.innerWidth, height: window.innerHeight})
    }, [])

    return windowSize;
}