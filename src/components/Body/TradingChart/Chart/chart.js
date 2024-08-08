import PropTypes from "prop-types"
import React, { useMemo, useCallback, useEffect, useReducer } from "react"
import { scaleBand, min, max, scaleLinear, line } from "d3"
import { isThemeDark, COLORS } from "../../../../Tools"
import { rootReducer } from "../../../../Store/Reducer"
import { ACTIONS } from "../../../../Store/Actions"
import { config } from "../TradingChartConfig"
import { VolumeMarks } from "./Marks/VolumeMarks"
import { CandleStickMarks } from "./Marks/CandleStickMarks"
import { AxisXhoverText, AxisXticksText, VerticalTicks } from "./Axis/AxisX"
import { AxisYCandleStickText, AxisYhoverText, AxisYticksText, HorizontalTicks } from "./Axis/AxisY"
import { IndicatorMarks } from "./Marks/IndicatorMarks"
import { Crosshair } from "./Crosshair/Crosshair"
import { Stats } from "./Stats/Stats"
import { MarketPriceMark } from "./Marks/MarketPriceMark"


export const Chart = ({specification, klineData}) => {
    const { height, width, theme, interval } = specification
    const chartComponentsDimensions          = config.getChartComponentDimensions(height, width)
    const [chartState, dispatch]             = useReducer(rootReducer, config.getInitialChartState(chartComponentsDimensions.brushSize, klineData.length))
    const backgroundColor                    = isThemeDark(theme) ? COLORS.CHARTGREY : COLORS.WHITE
    const { 
        chartHeight, 
        chartWidth, 
        yAxisTextBoxDimensionWidth,
        yAxisTextBoxDimensionHeight,
        xAxisTextBoxDimensionHeight,
        xAxisTextBoxDimensionWidth,
        statsSvgHeight
    } = chartComponentsDimensions
    
    useEffect(() => {
        if (!chartState.displayCrosshair) 
            dispatch({type: ACTIONS.HOVERDATA, payload: klineData[klineData.length - 1]})
    }, [klineData, chartState.displayCrosshair])
    
    useEffect(() => {
        dispatch({type: ACTIONS.UPDATEBRUSHSIZE, payload: chartComponentsDimensions.brushSize})
    }, [chartComponentsDimensions.brushSize])

    const getXScaleTicks = useCallback((d) => {
        const intervalToTicks = {
            "1s" : d.getUTCSeconds() % 30 === 0,
            "1m" : d.getUTCMinutes() % 15 === 0,
            "3m" : d.getUTCMinutes() === 0,
            "5m" : d.getUTCMinutes() === 0,
            "15m": d.getUTCHours() % 3 === 0 && d.getUTCMinutes() === 0,
            "30m": d.getUTCHours() % 6 === 0 && d.getUTCMinutes() === 0,
            "1h" : d.getUTCHours() % 12 === 0,
            "2h" : d.getUTCDate() % 2 === 0 && d.getUTCHours() === 0,
            "6h" : d.getUTCDate() % 6 === 0 && d.getUTCHours() === 0,
            "12h": d.getUTCDate() % 12 === 0 && d.getUTCHours() === 0,
            "1d" : d.getUTCDate() === 1,
            "1M" : d.getUTCMonth() === 0
        }
        return intervalToTicks[interval]
    }, [interval])

    const slicedData = useMemo(() => 
        chartState.brushExtent[0] !== chartState.brushExtent[1] ? 
            klineData.slice(chartState.brushExtent[0], chartState.brushExtent[1] + 1) : [],
    [chartState.brushExtent, klineData])

    const xScale = useMemo(() => {
        return scaleBand()
        .domain(slicedData.map(d => d.date))
        .range([0, chartComponentsDimensions.chartWidth])
        .padding(0.1)
    }, [slicedData, chartComponentsDimensions.chartWidth])
    
    const yPriceScale = useMemo(() => {
        return scaleLinear()
        .domain([min(slicedData, d => d.low), max(slicedData, d => d.high)])
        .rangeRound([chartComponentsDimensions.chartHeight, 0])
        .nice()
    }, [slicedData, chartComponentsDimensions.chartHeight])

    const yVolumeScale = useMemo(() => {
        return scaleLinear()
        .domain([0, max(slicedData, d => d.volume)])
        .rangeRound([chartComponentsDimensions.chartHeight, 0])
        .nice()
    }, [slicedData, chartComponentsDimensions.chartHeight])

    const lineConfigs = useMemo(() => {
        const configs = []
        let id = 0
        for (const indicatorType in slicedData[0].indicators) {
            const indicatorValues = slicedData[0].indicators[indicatorType]
            for (const value in indicatorValues) {
                configs.push({
                    id: id,
                    strokeWidth: indicatorValues[value].strokeWidth,
                    color: indicatorValues[value].color,
                    lineScale: line().x(d => xScale(d.date)).y(d => yPriceScale(d.indicators[indicatorType][value].value))
                                .defined(d => d.indicators[indicatorType][value].value)
                })
                id++
            }
        }
        return configs

    }, [slicedData, xScale, yPriceScale])

    const changeBrushExtent = e => { 
        const windowSlide = e.deltaX !== 0 && chartState.brushExtent[0] + e.deltaX > -1 && chartState.brushExtent[1] + e.deltaX < klineData.length
        if (windowSlide)
            dispatch({type: ACTIONS.NEWBRUSHEXTENT, payload: [
                chartState.brushExtent[0] + e.deltaX,
                chartState.brushExtent[1] + e.deltaX
            ]})
    }

    const onMouseMove = e => {
        dispatch({type: ACTIONS.UPDATEMOUSE, payload: {
            x: e.nativeEvent.x - Math.round(e.currentTarget.getBoundingClientRect().left),
            y: e.nativeEvent.y - Math.round(e.currentTarget.getBoundingClientRect().top)
        }})
    }

    const onMouseLeave = e => dispatch({type: ACTIONS.DISPLAYCROSSHAIR, payload: false})

    const onMouseEnter = e => dispatch({type: ACTIONS.DISPLAYCROSSHAIR, payload: true})

    const getMainComponentJSX = () => {
        return (
            <svg
                cursor="crosshair"
                width={chartWidth}
                height={chartHeight} 
                onMouseMove={onMouseMove}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onWheel={changeBrushExtent}
            >
                <VolumeMarks xScale={xScale} height={chartHeight} slicedData={slicedData} yVolumeScale={yVolumeScale}/>
                <CandleStickMarks 
                    xScale={xScale}
                    dispatch={dispatch}
                    height={chartHeight} 
                    slicedData={slicedData}
                    yPriceScale={yPriceScale}
                />
                <VerticalTicks theme={theme} xScale={xScale} height={chartHeight} getXScaleTicks={getXScaleTicks}/>
                <HorizontalTicks theme={theme} width={chartWidth} yPriceScale={yPriceScale}/>
                <IndicatorMarks slicedData={slicedData} lineConfigs={lineConfigs}/>
                <MarketPriceMark width={chartWidth} yPriceScale={yPriceScale} lastCandleStick={slicedData[slicedData.length - 1]}/>
                {
                    chartState.displayCrosshair && 
                    <Crosshair 
                        theme={theme} 
                        x={chartState.mouseCoords.x} 
                        y={chartState.mouseCoords.y} 
                        width={chartWidth} 
                        height={chartHeight}
                    />
                }
            </svg>
        )
    }

    const getAxisYJSX = () => {
        return (
            <svg height={chartHeight} width={yAxisTextBoxDimensionWidth}>
                <AxisYticksText 
                    theme={theme} 
                    yPriceScale={yPriceScale} 
                    width={yAxisTextBoxDimensionWidth}
                />
                <AxisYCandleStickText 
                    yPriceScale={yPriceScale}  
                    width={yAxisTextBoxDimensionWidth} 
                    height={yAxisTextBoxDimensionHeight}
                    lastCandleStick={slicedData[slicedData.length - 1]}
                />
                {
                    chartState.displayCrosshair && 
                    <AxisYhoverText
                        yPriceScale={yPriceScale}
                        y={chartState.mouseCoords.y}
                        width={yAxisTextBoxDimensionWidth} 
                        height={yAxisTextBoxDimensionHeight}

                    />
                }
            </svg>
        )
    }

    const getAxisXJSX = () => {
        return (
            <svg height={xAxisTextBoxDimensionHeight} width={chartWidth}>
                <AxisXticksText 
                    theme={theme} 
                    xScale={xScale} 
                    interval={interval} 
                    getXScaleTicks={getXScaleTicks} 
                    height={xAxisTextBoxDimensionHeight}
                />
                {
                    chartState.displayCrosshair && 
                    <AxisXhoverText 
                        theme={theme} 
                        x={chartState.mouseCoords.x} 
                        hoverData={chartState.hoverData} 
                        width={xAxisTextBoxDimensionWidth} 
                        height={xAxisTextBoxDimensionHeight}
                    />
                }
            </svg>
        )
    }

    const getStatsJSX = () => {
        return (
            <svg height={statsSvgHeight} width={chartWidth}>
                <Stats theme={theme} hoverData={chartState.hoverData} height={statsSvgHeight}/>
            </svg>
        )
    }

    return (
        <div className="chart" style={{width: width, backgroundColor: backgroundColor}}>
            {getMainComponentJSX()}
            {getAxisYJSX()}
            {getAxisXJSX()}
            {getStatsJSX()}
        </div> 
    )
}

Chart.propTypes = {
    specification: PropTypes.object.isRequired,
    klineData: PropTypes.array.isRequired
}