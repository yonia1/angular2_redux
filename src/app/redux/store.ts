import { stockReducer } from './stock.reducer'
import { combineReducers } from "redux";
const persistState = require('redux-localstorage');

export class AppState {

    stock: number;
}

export const rootReducer = combineReducers<AppState>({
    stock: stockReducer,

});
export const enhancers = [
    persistState('stock', { key: 'ng2-redux/stock' })
];
