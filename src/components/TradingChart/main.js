import {scaleBand, min, max, scaleLinear} from "d3"
import PropTypes from "prop-types"
import React, { useMemo, useCallback, useEffect, useReducer } from "react"
import { AxisXhoverText, AxisXticks, AxisXticksText } from "./Axis/axisX"
import { AxisYticks, AxisYticksText, AxisYhoverText, AxisYCandleStickText } from "./Axis/axisY"
import { VolumeMarks } from "./Marks/volumeMarks"
import { CandleStickMarks } from "./Marks/candleStickMarks"
import { Crosshair } from "./crosshair"
import { Stats } from "./stats"
import { isArrayEmpty, getTradingChartInitialState, getChartComponentDimensions } from "../../custom/tools/constants"
import { ACTIONS, rootReducer } from "../../custom/tools/reducer"


export const MainChart = ({tradingChartSpecification, klineData}) => {
    const {symbol, width, height, bgColor, interval} = tradingChartSpecification
    const chartComponentsDimensions                  = getChartComponentDimensions(height, width) 
    const tradingChartInitialState                   = getTradingChartInitialState()
    const [tradingChartState, tradingChartDispatch]  = useReducer(rootReducer, tradingChartInitialState)

    useEffect(() => {
        if (!tradingChartState.displayCrosshair) 
            tradingChartDispatch({type: ACTIONS.HOVERDATA, payload: klineData[klineData.length - 1]})
    }, [klineData, tradingChartState.displayCrosshair])

    useEffect(() => {
        tradingChartDispatch({type: ACTIONS.NEWBRUSHEXTENT, payload: [
            Math.max(0, klineData.length - chartComponentsDimensions.brushSize), 
            klineData.length - 1
        ]})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, symbol])
    
    useEffect(() => {
        tradingChartDispatch({type: ACTIONS.UPDATEBRUSHEXTENT, payload: chartComponentsDimensions.brushSize})
    }, [chartComponentsDimensions.brushSize])

    const changeBrushExtent = e => {
        if (e.deltaX !== 0 && tradingChartState.brushExtent[0] + e.deltaX > -1 && tradingChartState.brushExtent[1] + e.deltaX < klineData.length)
            tradingChartDispatch({type: ACTIONS.NEWBRUSHEXTENT, payload: [
                tradingChartState.brushExtent[0] + e.deltaX,
                tradingChartState.brushExtent[1] + e.deltaX
            ]})
    }

    const onMouseMove = e => {
        tradingChartDispatch({type: ACTIONS.UPDATEMOUSE, payload: {
            x: e.nativeEvent.x - Math.round(e.currentTarget.getBoundingClientRect().left),
            y: e.nativeEvent.y - Math.round(e.currentTarget.getBoundingClientRect().top)
        }})
    }

    const onMouseLeave = e => tradingChartDispatch({type: ACTIONS.DISPLAYCROSSHAIR, payload: false})

    const onMouseEnter = e => tradingChartDispatch({type: ACTIONS.DISPLAYCROSSHAIR, payload: true})

    const getxScaleTicks = useCallback((d) => {
        const intervalToTicks = {
            "1s" : d.getUTCSeconds() % 30 === 0,
            "1m" : d.getUTCMinutes() % 15 === 0,
            "3m" : d.getUTCMinutes() === 0,
            "5m" : d.getUTCMinutes() === 0,
            "15m": d.getUTCHours() % 2 === 0 && d.getUTCMinutes() === 0,
            "30m": d.getUTCHours() % 4 === 0 && d.getUTCMinutes() === 0,
            "1h" : d.getUTCHours() % 12 === 0,
            "2h" : d.getUTCHours() === 0,
            "6h" : d.getUTCDate() % 3 === 0 && d.getUTCHours() === 0,
            "12h": d.getUTCDate() % 7 === 0 && d.getUTCHours() === 0,
            "1d" : d.getUTCDate() === 1,
            "1M" : d.getUTCMonth() === 0
        }
        return intervalToTicks[interval]
    }, [interval])

    const slicedData = useMemo(() => 
        tradingChartState.brushExtent[0] !== tradingChartState.brushExtent[1] ? 
            klineData.slice(tradingChartState.brushExtent[0], tradingChartState.brushExtent[1] + 1) : [],
    [tradingChartState.brushExtent, klineData])

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

    return (
        !isArrayEmpty(slicedData) && <div style={{
            width: width, 
            height: height, 
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px"
        }}>
            <svg
                cursor="crosshair"
                width={chartComponentsDimensions.chartWidth}
                height={chartComponentsDimensions.chartHeight}
                onMouseMove={onMouseMove}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onWheel={changeBrushExtent}
            >
                <VolumeMarks
                    xScale={xScale}
                    yScale={yVolumeScale}
                    slicedData={slicedData}
                    height={chartComponentsDimensions.chartHeight}
                />
               <CandleStickMarks
                    xScale={xScale}
                    yScale={yPriceScale}
                    slicedData={slicedData}
                    tradingChartDispatch={tradingChartDispatch}
                    height={chartComponentsDimensions.chartHeight}
                />
                <AxisXticks
                    xScale={xScale}
                    bgColor={bgColor}
                    getxScaleTicks={getxScaleTicks}
                    height={chartComponentsDimensions.chartHeight}
                />
                <AxisYticks
                    bgColor={bgColor}
                    yScale={yPriceScale}
                    width={chartComponentsDimensions.chartWidth}
                />
                {
                    tradingChartState.displayCrosshair && <Crosshair
                        bgColor={bgColor}
                        x={tradingChartState.mouseCoords.x}
                        y={tradingChartState.mouseCoords.y}
                        height={chartComponentsDimensions.chartHeight}
                        width={chartComponentsDimensions.chartWidth}
                    />
                }
            </svg>
            <svg 
                width={chartComponentsDimensions.yAxisTextBoxDimension.width}
                height={chartComponentsDimensions.chartHeight}
            >
               <AxisYticksText
                    bgColor={bgColor}
                    yScale={yPriceScale}
                    width={chartComponentsDimensions.yAxisTextBoxDimension.width}
                />
                {
                    tradingChartState.displayCrosshair && <AxisYhoverText
                        bgColor={bgColor}
                        yScale={yPriceScale}
                        y={tradingChartState.mouseCoords.y}
                        width={chartComponentsDimensions.yAxisTextBoxDimension.width}
                        height={chartComponentsDimensions.yAxisTextBoxDimension.height}
                    /> 
                }
                <AxisYCandleStickText
                    bgColor={bgColor}
                    yScale={yPriceScale}
                    lastCandleStick={slicedData[slicedData.length - 1]}
                    width={chartComponentsDimensions.yAxisTextBoxDimension.width}
                    height={chartComponentsDimensions.yAxisTextBoxDimension.height}
                />
            </svg>
            <svg 
                height={chartComponentsDimensions.xAxisTextBoxDimension.height} 
                width={chartComponentsDimensions.chartWidth}
            >
                <AxisXticksText
                    xScale={xScale}
                    bgColor={bgColor}
                    interval={interval}
                    getxScaleTicks={getxScaleTicks}
                    height={chartComponentsDimensions.xAxisTextBoxDimension.height}
                />
                {
                    tradingChartState.displayCrosshair && <AxisXhoverText
                        bgColor={bgColor}
                        x={tradingChartState.mouseCoords.x}
                        hoverData={tradingChartState.hoverData}
                        height={chartComponentsDimensions.xAxisTextBoxDimension.height}
                        width={chartComponentsDimensions.xAxisTextBoxDimension.width}
                    />
                }
            </svg>
            
            <svg 
                width={chartComponentsDimensions.chartWidth} 
                height={chartComponentsDimensions.statsSvgHeight}
            >
                <Stats
                    bgColor={bgColor}
                    height={chartComponentsDimensions.statsSvgHeight}
                    hoverData={tradingChartState.hoverData}
                />
            </svg>
        </div> 
    )
}

MainChart.propTypes = {
    tradingChartSpecification: PropTypes.object.isRequired,
    klineData: PropTypes.array.isRequired
}