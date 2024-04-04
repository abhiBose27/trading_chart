export const ACTIONS = {
    BGCOLOR: "bgColor",
    SYMBOL: "symbol",
    INTERVAL: "interval",
    UPDATEMOUSE: "updateMouseCoords",
    UPDATEBRUSHEXTENT: "updateBrushExtent",
    NEWBRUSHEXTENT: "newBrushExtent",
    DISPLAYCROSSHAIR: "displayCrosshair",
    HOVERDATA: "hoverData"
}

export const rootReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SYMBOL:
            return {...state, symbol: action.payload}
        case ACTIONS.INTERVAL:
            return {...state, interval: action.payload}
        case ACTIONS.BGCOLOR:
            return {...state, bgColor: action.payload}
        case ACTIONS.NEWBRUSHEXTENT:
            return {...state, brushExtent: action.payload}
        case ACTIONS.UPDATEBRUSHEXTENT:
            return {
                ...state, 
                brushExtent: [
                    Math.max(0, state.brushExtent[1] + 1 - action.payload),
                    state.brushExtent[1]
                ]
            }
        case ACTIONS.UPDATEMOUSE:
            return {...state, mouseCoords: action.payload}
        case ACTIONS.DISPLAYCROSSHAIR:
            return {...state, displayCrosshair: action.payload}
        case ACTIONS.HOVERDATA:
            return {...state, hoverData: action.payload}
        default:
            throw new Error('Unexpected action in App Component')
    }
}