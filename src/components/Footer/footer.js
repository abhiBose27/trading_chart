import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { get24hTicker } from "../../data/binance"
import { schemeGreens, schemeReds, format } from "d3"
import { COLORS } from "../../tools"


export const Footer = ({symbolsData}) => {
    const [startAnimation, setStartAnimation] = useState(false)
    const [footerData, setFooterData] = useState([])
    const relevantSymbols = symbolsData.filter(symbol => symbol.endsWith("USDT"))

    const getFontColorOnPercent = (priceChangePercent) => Math.sign(priceChangePercent) === -1 ? schemeReds[6][4] : schemeGreens[6][4]

    useEffect(() => {
        const fetchData = async() => {
            const data = await get24hTicker(relevantSymbols)
            setFooterData(data)
            setTimeout(() => setStartAnimation(true), 1000)
            
        }
        const msgInterval = setInterval(fetchData, 3000)
        return () => clearInterval(msgInterval)
    }, [relevantSymbols])

    return (
        <footer className="footer">
            <div className={`ticker ${startAnimation ? "animate" : ""}`}>
                {footerData.slice(0, 100).map((data, idx) => (
                    <React.Fragment key={`footer-${idx}`}>
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