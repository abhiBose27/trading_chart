import { 
    getExponentialMovingAverage, 
    getMovingAverage, 
    getVolumeWeightedAveragePrice, 
    getWeightedMovingAverage 
} from "../Data/Processing/Indicators"


test("sma_test_valid", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: true, period: 2, "lineStrokeWidth": 2, color: "orange"},
        {key: 2, checked: true, period: 3, "lineStrokeWidth": 2, color: "orange"}
    ]
    const expectedDateToMovingAverages = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": {
            "2": { value: null, color: "orange", strokeWidth: 2 },
            "3": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": {
            "2": { value: 3, color: "orange", strokeWidth: 2 },
            "3": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": {
            "2": { value: 3.5, color: "orange", strokeWidth: 2 },
            "3": { value: 3, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "2": { value: 4, color: "orange", strokeWidth: 2 },
            "3": { value: 4, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "2": { value: 6.5, color: "orange", strokeWidth: 2 },
            "3": { value: 5.333333333333333, color: "orange", strokeWidth: 2 }
        }
    }
    const dateToMovingAverages = getMovingAverage(klineData, parameters)
    expect(expectedDateToMovingAverages).toEqual(dateToMovingAverages)
})

test("sma_test_period_greater", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: true, period: 7, "lineStrokeWidth": 2, color: "orange"},
    ]
    const expectedDateToMovingAverages = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": {
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": {
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": {
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "7": { value: null, color: "orange", strokeWidth: 2 },
        }
    }
    const dateToMovingAverages = getMovingAverage(klineData, parameters)
    expect(expectedDateToMovingAverages).toEqual(dateToMovingAverages)
})

test("sma_test_parameters_unchecked", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: false, period: 2, "lineStrokeWidth": 2, color: "orange"},
        {key: 2, checked: false, period: 3, "lineStrokeWidth": 2, color: "orange"},
        {key: 3, checked: false, period: 7, "lineStrokeWidth": 2, color: "orange"}
    ]
    const dateToMovingAverages = getMovingAverage(klineData, parameters)
    expect({}).toEqual(dateToMovingAverages)
})

test("sma_test_no_parameters", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = []
    const dateToMovingAverages = getMovingAverage(klineData, parameters)
    expect({}).toEqual(dateToMovingAverages)
})

test("ema_test_valid", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: true, period: 2, "lineStrokeWidth": 2, color: "orange"},
        {key: 2, checked: true, period: 3, "lineStrokeWidth": 2, color: "orange"},
    ]
    const expectedDateToExponentialMovingAverages = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": {
            "2": { value: 2, color: "orange", strokeWidth: 2 },
            "3": { value: 2, color: "orange", strokeWidth: 2 },
        },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": {
            "2": { value: 3.333333333333333, color: "orange", strokeWidth: 2 },
            "3": { value: 3, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": {
            "2": { value: 3.111111111111111, color: "orange", strokeWidth: 2 },
            "3": { value: 3, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "2": { value: 4.37037037037037, color: "orange", strokeWidth: 2 },
            "3": { value: 4, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "2": { value: 6.790123456790123, color: "orange", strokeWidth: 2 },
            "3": { value: 6, color: "orange", strokeWidth: 2 }
        }
    }
    const dateToExponentialMovingAverages = getExponentialMovingAverage(klineData, parameters)
    expect(expectedDateToExponentialMovingAverages).toEqual(dateToExponentialMovingAverages)
})

test("ema_test_period_greater", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: true, period: 7, "lineStrokeWidth": 2, color: "orange"},
    ]
    const expectedDateToExponentialMovingAverages = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": {
            "7": { value: 2, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": {
            "7": { value: 2.5, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": {
            "7": { value: 2.625, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "7": { value: 3.21875, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "7": { value: 4.4140625, color: "orange", strokeWidth: 2 },
        }
    }
    const dateToExponentialMovingAverages = getExponentialMovingAverage(klineData, parameters)
    expect(expectedDateToExponentialMovingAverages).toEqual(dateToExponentialMovingAverages)
})

test("ema_test_parameters_unchecked", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: false, period: 2, "lineStrokeWidth": 2, color: "orange"},
        {key: 2, checked: false, period: 3, "lineStrokeWidth": 2, color: "orange"},
        {key: 3, checked: false, period: 7, "lineStrokeWidth": 2, color: "orange"}
    ]
    const dateToExponentialMovingAverages = getExponentialMovingAverage(klineData, parameters)
    expect({}).toEqual(dateToExponentialMovingAverages)
})

test("ema_test_no_parameters", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = []
    const dateToExponentialMovingAverages = getExponentialMovingAverage(klineData, parameters)
    expect({}).toEqual(dateToExponentialMovingAverages)
})

test("wma_test_valid", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: true, period: 2, "lineStrokeWidth": 2, color: "orange"},
        {key: 2, checked: true, period: 3, "lineStrokeWidth": 2, color: "orange"},
    ]
    const expectedDateToWeightedMovingAverages = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": {
            "2": { value: null, color: "orange", strokeWidth: 2 },
            "3": { value: null, color: "orange", strokeWidth: 2 },
        },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": {
            "2": { value: 3.3333333333333335, color: "orange", strokeWidth: 2 },
            "3": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": {
            "2": { value: 3.3333333333333335, color: "orange", strokeWidth: 2 },
            "3": { value: 3.1666666666666665, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "2": { value: 4.333333333333333, color: "orange", strokeWidth: 2 },
            "3": { value: 4.166666666666667, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "2": { value: 7, color: "orange", strokeWidth: 2 },
            "3": { value: 6.166666666666667, color: "orange", strokeWidth: 2 }
        }
    }
    const dateToWeightedMovingAverages = getWeightedMovingAverage(klineData, parameters)
    expect(expectedDateToWeightedMovingAverages).toEqual(dateToWeightedMovingAverages)
})

test("wma_test_period_greater", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: true, period: 7, "lineStrokeWidth": 2, color: "orange"},
    ]
    const expectedDateToWeightedMovingAverages = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": {
            "7": { value: null, color: "orange", strokeWidth: 2 },
        },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": {
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": {
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "7": { value: null, color: "orange", strokeWidth: 2 }
        },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": {                                                                                                                                                                     
            "7": { value: null, color: "orange", strokeWidth: 2 }
        }
    }
    const dateToWeightedMovingAverages = getWeightedMovingAverage(klineData, parameters)
    expect(expectedDateToWeightedMovingAverages).toEqual(dateToWeightedMovingAverages)
})

test("wma_test_parameters_unchecked", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, checked: false, period: 2, "lineStrokeWidth": 2, color: "orange"},
        {key: 2, checked: false, period: 3, "lineStrokeWidth": 2, color: "orange"},
        {key: 3, checked: false, period: 7, "lineStrokeWidth": 2, color: "orange"}
    ]
    const dateToWeightedMovingAverages = getWeightedMovingAverage(klineData, parameters)
    expect({}).toEqual(dateToWeightedMovingAverages)
})

test("wma_test_no_parameters", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = []
    const dateToWeightedMovingAverages = getWeightedMovingAverage(klineData, parameters)
    expect({}).toEqual(dateToWeightedMovingAverages)
})

test("vwap_test_valid", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, length: 3, lineStrokeWidth: 2, color: "orange"}
    ]
    const expectedDateToVWAP = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": { "3": { value: null, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": { "3": { value: null, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": { "3": { value: 2.777777777777778, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": { "3": { value: 3.777777777777778, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": { "3": { value: 4.666666666666667, color: "orange", strokeWidth: 2 } }
    }
    const dateToVWAP = getVolumeWeightedAveragePrice(klineData, parameters)
    expect(expectedDateToVWAP).toEqual(dateToVWAP)
})

test("vwap_test_period_greater", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = [
        {key: 1, length: 7, lineStrokeWidth: 2, color: "orange"}
    ]
    const expectedDateToVWAP = {
        "Mon Aug 19 2024 12:30:00 GMT+0530 (India Standard Time)": { "7": { value: null, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:31:00 GMT+0530 (India Standard Time)": { "7": { value: null, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:32:00 GMT+0530 (India Standard Time)": { "7": { value: null, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:33:00 GMT+0530 (India Standard Time)": { "7": { value: null, color: "orange", strokeWidth: 2 } },
        "Mon Aug 19 2024 12:34:00 GMT+0530 (India Standard Time)": { "7": { value: null, color: "orange", strokeWidth: 2 } }
    }
    const dateToVWAP = getVolumeWeightedAveragePrice(klineData, parameters)
    expect(expectedDateToVWAP).toEqual(dateToVWAP)
})

test("vwap_test_no_parameters", () => {
    const klineData = [
        {id: 0, date: new Date(1724050800000), open: 1.0, high: 3.0, low: 2.0, close: 2.0, volume: 10.0, change: 100.0},
        {id: 1, date: new Date(1724050860000), open: 2.0, high: 5.0, low: 1.0, close: 4.0, volume: 10.0, change: 100.0},
        {id: 2, date: new Date(1724050920000), open: 2.0, high: 3.0, low: 2.0, close: 3.0, volume: 10.0, change: 50.0},
        {id: 3, date: new Date(1724050980000), open: 5.0, high: 10.0, low: 1.0, close: 5.0, volume: 10.0, change: 0.0},
        {id: 4, date: new Date(1724051040000), open: 5.0, high: 8.0, low: 2.0, close: 8.0, volume: 10.0, change: 60.0}
    ]
    const parameters = []
    const dateToVWAP = getVolumeWeightedAveragePrice(klineData, parameters)
    expect({}).toEqual(dateToVWAP)
})