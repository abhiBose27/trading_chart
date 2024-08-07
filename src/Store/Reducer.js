import { ACTIONS } from "./Actions"

export const rootReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SYMBOL:
            return {...state, symbol: action.payload}
        case ACTIONS.INTERVAL:
            return {...state, interval: action.payload}
        case ACTIONS.THEME:
            return {...state, theme: action.payload}
        case ACTIONS.NEWBRUSHEXTENT:
            return {...state, brushExtent: action.payload}
        case ACTIONS.UPDATEBRUSHSIZE:
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
        case ACTIONS.UPDATEINDICATOR:
            return {...state, indicators: action.payload}
        default:
            throw new Error('Unexpected action in App Component')
    }
}