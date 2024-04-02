import * as d3 from "d3"
import PropTypes from "prop-types"
import React, { useMemo, useCallback, useState, useEffect } from "react"
import { AxisXhoverText, AxisXticks, AxisXticksText } from "./Axis/axisX"
import { AxisYticks, AxisYticksText, AxisYhoverText, AxisYCandleStickText } from "./Axis/axisY"
import { VolumeMarks } from "./Marks/volumeMarks"
import { CandleStickMarks } from "./Marks/candleStickMarks"
import { Crosshair } from "./crosshair"
import { Stats } from "./stats"


const isEmpty = (array) => Array.isArray(array) && array.length === 0

export const MainChart = ({specs, klineData}) => {
    const {symbol, width, height, bgColor, interval} = specs
    const [brushExtent, setBrushExtent]              = useState([0, 0])
    const [mouseCoords, setMouseCoords]              = useState({x: 0, y: 0})
    const [displayCrosshair, setDisplayCrosshair]    = useState(false)
    const [hoverData, setHoverData]                  = useState(null)
    const chartComponentsDimensions                  = {
        yAxisTextBoxDimension: {width: 0.1 * width, height: 0.05 * height},
        xAxisTextBoxDimension: {width: 0.15 * width, height: 0.05 * height},
        statsSvgHeight       : 0.05 * height,
        chartHeight          : 0.90 * height,
        chartWidth           : 0.90 * width,
        brushSize            : Math.floor(0.1 * width)
    }

    useEffect(() => {
        setBrushExtent([
            Math.max(0, klineData.length - chartComponentsDimensions.brushSize), 
            klineData.length - 1
        ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, symbol])
    
    useEffect(() => {
        setBrushExtent(b => [
            Math.max(0, b[1] + 1 - chartComponentsDimensions.brushSize), 
            b[1]
        ])
    }, [chartComponentsDimensions.brushSize])

    useEffect(() => {
        if (!displayCrosshair) setHoverData(klineData[klineData.length - 1])
    }, [klineData, displayCrosshair])

    const changeBrushExtent = e => {
        if (e.deltaX !== 0 && brushExtent[0] + e.deltaX > -1 && brushExtent[1] + e.deltaX < klineData.length)
            setBrushExtent([
                brushExtent[0] + e.deltaX,
                brushExtent[1] + e.deltaX
            ])
    }

    const onMouseMove = e => {
        setMouseCoords({
            x: e.nativeEvent.x - Math.round(e.currentTarget.getBoundingClientRect().left),
            y: e.nativeEvent.y - Math.round(e.currentTarget.getBoundingClientRect().top)
        })
    }

    const onMouseLeave = e => setDisplayCrosshair(false)

    const onMouseEnter = e => setDisplayCrosshair(true)

    const getxScaleTicks = useCallback((d) => {
        switch (interval) {
            case "1s":
                return d.getUTCSeconds() % 30 === 0
            case "1m":
                return d.getUTCMinutes() % 15 === 0
            case "3m":
            case "5m":
                return d.getUTCMinutes() === 0
            case "15m":
                return d.getUTCHours() % 2 === 0 && d.getUTCMinutes() === 0
            case "30m":
                return d.getUTCHours() % 4 === 0 && d.getUTCMinutes() === 0
            case "1h": 
                return d.getUTCHours() % 12 === 0
            case "2h":
                return d.getUTCHours() === 0
            case "6h":
                return d.getUTCDate() % 3 === 0 && d.getUTCHours() === 0
            case "12h":
                return d.getUTCDate() % 7 === 0 && d.getUTCHours() === 0
            case "1d":
                return d.getUTCDate() === 1
            case "1M":
                return d.getUTCMonth() === 0
            default:
               break
        }   
    }, [interval])

    const slicedData = useMemo(() => 
        brushExtent[0] !== brushExtent[1] ? klineData.slice(brushExtent[0], brushExtent[1] + 1) : [],
    [brushExtent, klineData])

    const xScale = useMemo(() => {
        return d3.scaleBand()
        .domain(slicedData.map(d => d.date))
        .range([0, chartComponentsDimensions.chartWidth])
        .padding(0.1)
    }, [slicedData, chartComponentsDimensions.chartWidth])
    
    const yPriceScale = useMemo(() => {
        return d3.scaleLinear()
        .domain([d3.min(slicedData, d => d.low), d3.max(slicedData, d => d.high)])
        .rangeRound([chartComponentsDimensions.chartHeight, 0])
        .nice()
    }, [slicedData, chartComponentsDimensions.chartHeight])

    const yVolumeScale = useMemo(() => {
        return d3.scaleLinear()
        .domain([0, d3.max(slicedData, d => d.volume)])
        .rangeRound([chartComponentsDimensions.chartHeight, 0])
        .nice()
    }, [slicedData, chartComponentsDimensions.chartHeight])

    const updateHoveringData = useCallback((d) => {
        setHoverData(d)
    }, [])

    return (
        !isEmpty(slicedData) && <div style={{
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
                    height={chartComponentsDimensions.chartHeight}
                    yScale={yVolumeScale}
                    slicedData={slicedData}
                />
               <CandleStickMarks
                    xScale={xScale}
                    yScale={yPriceScale}
                    height={chartComponentsDimensions.chartHeight}
                    slicedData={slicedData}
                    updateHoveringData={updateHoveringData}
                />
                <AxisXticks
                    xScale={xScale}
                    bgColor={bgColor}
                    height={chartComponentsDimensions.chartHeight}
                    getxScaleTicks={getxScaleTicks}
                />
                <AxisYticks
                    bgColor={bgColor}
                    yScale={yPriceScale}
                    width={chartComponentsDimensions.chartWidth}
                />
                {
                    displayCrosshair && <Crosshair
                        x={mouseCoords.x}
                        y={mouseCoords.y}
                        bgColor={bgColor}
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
                    displayCrosshair && <AxisYhoverText
                        y={mouseCoords.y}
                        bgColor={bgColor}
                        yScale={yPriceScale}
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
                    height={chartComponentsDimensions.xAxisTextBoxDimension.height}
                    interval={interval}
                    getxScaleTicks={getxScaleTicks}
                />
                {
                    displayCrosshair && <AxisXhoverText
                        x={mouseCoords.x}
                        bgColor={bgColor}
                        height={chartComponentsDimensions.xAxisTextBoxDimension.height}
                        width={chartComponentsDimensions.xAxisTextBoxDimension.width}
                        hoverData={hoverData}
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
                    hoverData={hoverData}
                />
            </svg>
        </div> 
    )
}

MainChart.propTypes = {
    specs: PropTypes.object.isRequired,
    klineData: PropTypes.array.isRequired
}