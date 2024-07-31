import PropTypes from "prop-types"
import React, { useMemo, useCallback, useEffect, useReducer } from "react"
import { scaleBand, min, max, scaleLinear, line } from "d3"
import { AxisXhoverText, AxisXticks, AxisXticksText } from "../Axis/axisX"
import { AxisYticks, AxisYticksText, AxisYhoverText, AxisYCandleStickText } from "../Axis/axisY"
import { VolumeMarks } from "../Marks/volumeMarks"
import { CandleStickMarks } from "../Marks/candleStickMarks"
import { Crosshair } from "../crosshair"
import { Stats } from "../stats"
import { ACTIONS, isThemeDark, COLORS } from "../../../constants"
import { rootReducer } from "../../../reducer"
import { IndicatorMarks } from "../Marks/indicatorMarks"
import { config } from "../tradingChartConfig"


export const MainChart = ({specification, klineData}) => {
    const { symbol, width, height, theme, interval } = specification
    const chartComponentsDimensions                  = config.getChartComponentDimensions(height, width)
    const [tradingChartState, dispatch]              = useReducer(rootReducer, {
        brushExtent: [0, 0],
        mouseCoords: {x: 0, y: 0},
        displayCrosshair: false,
        hoverData: null
    })

    useEffect(() => {
        if (!tradingChartState.displayCrosshair) 
            dispatch({type: ACTIONS.HOVERDATA, payload: klineData[klineData.length - 1]})
    }, [klineData, tradingChartState.displayCrosshair])

    useEffect(() => {
        dispatch({type: ACTIONS.NEWBRUSHEXTENT, payload: [
            Math.max(0, klineData.length - chartComponentsDimensions.brushSize), 
            klineData.length - 1
        ]})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, symbol])
    
    useEffect(() => {
        dispatch({type: ACTIONS.UPDATEBRUSHSIZE, payload: chartComponentsDimensions.brushSize})
    }, [chartComponentsDimensions.brushSize])

    const changeBrushExtent = e => {
        if (e.deltaX !== 0 && tradingChartState.brushExtent[0] + e.deltaX > -1 && tradingChartState.brushExtent[1] + e.deltaX < klineData.length)
            dispatch({type: ACTIONS.NEWBRUSHEXTENT, payload: [
                tradingChartState.brushExtent[0] + e.deltaX,
                tradingChartState.brushExtent[1] + e.deltaX
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

    const getxScaleTicks = useCallback((d) => {
        const intervalToTicks = {
            "1s" : d.getUTCSeconds() % 30 === 0,
            "1m" : d.getUTCMinutes() % 15 === 0,
            "3m" : d.getUTCMinutes() === 0,
            "5m" : d.getUTCMinutes() === 0,
            "15m": d.getUTCHours() % 3 === 0 && d.getUTCMinutes() === 0,
            "30m": d.getUTCHours() % 6 === 0 && d.getUTCMinutes() === 0,
            "1h" : d.getUTCHours() % 12 === 0,
            "2h" : d.getUTCDate() % 2 === 0 && d.getUTCHours() === 0,
            "6h" : d.getUTCDate() % 4 === 0 && d.getUTCHours() === 0,
            "12h": d.getUTCDate() % 8 === 0 && d.getUTCHours() === 0,
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

    const lineConfigs = useMemo(() => {
        if (slicedData.length === 0)
            return []
        const movingAverageValues = Object.keys(slicedData[0].movingAverages)
        return movingAverageValues.map(movingAverageValue => {
            return {
                color: slicedData[0].movingAverages[movingAverageValue].color,
                lineScale: line().x(d => xScale(d.date)).y(d => yPriceScale(d.movingAverages[movingAverageValue].value)).defined(d => d.movingAverages[movingAverageValue].value)
            }
        })
    }, [slicedData, xScale, yPriceScale])

    return (
        slicedData.length !== 0 && <div style={{
            height: height,
            width: width,
            backgroundColor: isThemeDark(theme) ? COLORS.CHARTGREY : COLORS.WHITE,
            boxShadow: config.boxShadow
        }}>
            <svg
                cursor="crosshair"
                height={chartComponentsDimensions.chartHeight}
                width={chartComponentsDimensions.chartWidth}
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
                    dispatch={dispatch}
                    height={chartComponentsDimensions.chartHeight}
                />
                <AxisXticks
                    xScale={xScale}
                    theme={theme}
                    getxScaleTicks={getxScaleTicks}
                    height={chartComponentsDimensions.chartHeight}
                />
                <AxisYticks
                    theme={theme}
                    yScale={yPriceScale}
                    width={chartComponentsDimensions.chartWidth}
                />
                <IndicatorMarks lineConfigs={lineConfigs} slicedData={slicedData}/>
                {
                    tradingChartState.displayCrosshair && <Crosshair
                        theme={theme}
                        x={tradingChartState.mouseCoords.x}
                        y={tradingChartState.mouseCoords.y}
                        height={chartComponentsDimensions.chartHeight}
                        width={chartComponentsDimensions.chartWidth}
                    />
                }
            </svg>
            <svg
                height={chartComponentsDimensions.chartHeight}
                width={chartComponentsDimensions.yAxisTextBoxDimension.width}
            >
               <AxisYticksText
                    theme={theme}
                    yScale={yPriceScale}
                    width={chartComponentsDimensions.yAxisTextBoxDimension.width}
                />
                {
                    tradingChartState.displayCrosshair && <AxisYhoverText
                        yScale={yPriceScale}
                        y={tradingChartState.mouseCoords.y}
                        width={chartComponentsDimensions.yAxisTextBoxDimension.width}
                        height={chartComponentsDimensions.yAxisTextBoxDimension.height}
                    /> 
                }
                <AxisYCandleStickText
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
                    theme={theme}
                    interval={interval}
                    getxScaleTicks={getxScaleTicks}
                    height={chartComponentsDimensions.xAxisTextBoxDimension.height}
                />
                {
                    tradingChartState.displayCrosshair && <AxisXhoverText
                        theme={theme}
                        x={tradingChartState.mouseCoords.x}
                        hoverData={tradingChartState.hoverData}
                        height={chartComponentsDimensions.xAxisTextBoxDimension.height}
                        width={chartComponentsDimensions.xAxisTextBoxDimension.width}
                    />
                }
            </svg>
            
            <svg
                height={chartComponentsDimensions.statsSvgHeight}
                width={chartComponentsDimensions.chartWidth} 
            >
                <Stats
                    theme={theme}
                    hoverData={tradingChartState.hoverData}
                    height={chartComponentsDimensions.statsSvgHeight}
                />
            </svg>
        </div> 
    )
}

MainChart.propTypes = {
    specification: PropTypes.object.isRequired,
    klineData: PropTypes.array.isRequired
}