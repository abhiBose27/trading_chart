import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { get24hTicker } from "../../Data/Http/HttpBinance"
import { schemeGreens, schemeReds, format } from "d3"
import { COLORS } from "../../Tools"


export const Footer = ({symbolsData}) => {
    const [startAnimation, setStartAnimation] = useState(false)
    const [footerData, setFooterData]         = useState([])
    const relevantSymbols                     = symbolsData.filter(symbol => symbol.endsWith("USDT"))
    const getFontColorOnPercent = (priceChangePercent) => Math.sign(priceChangePercent) === -1 ? schemeReds[6][4] : schemeGreens[6][4]

    useEffect(() => {
        const fetchData = async() => {
            const data = await get24hTicker(relevantSymbols)
            setFooterData(data)
            const setTimeoutId = setTimeout(() => setStartAnimation(true), 1000)
            return () => clearTimeout(setTimeoutId)  
        }
        const setIntervalId = setInterval(fetchData, 3000)
        return () => clearInterval(setIntervalId)
    }, [relevantSymbols])

    return (
        <footer className="footer">
            <div className={`ticker ${startAnimation ? "animate" : ""}`}>
                {footerData.slice(0, 100).map(data => (
                    <React.Fragment key={data.id}>
                        <span style={{color: COLORS.WHITE}}>
                            {`${data.symbol}:`} &nbsp;
                        </span>
                        <span style={{color: getFontColorOnPercent(data.priceChangePercent)}} >
                            {`${format(".4f")(data.priceChangePercent)}%`} &nbsp;
                        </span>
                        <span style={{color: COLORS.BLACK}}>
                            {`${format(".3f")(data.lastPrice)}`} &nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </footer>
    )
}

Footer.propTypes = {
    symbolsData: PropTypes.array.isRequired
}