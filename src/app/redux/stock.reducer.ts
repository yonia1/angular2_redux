import { StockActions } from "./actions/stock.actions";

const STOCK_INIT_PRICE: number = 5.5;

export function stockReducer(state: number = STOCK_INIT_PRICE, action: any) {

    switch (action.type) {

        case StockActions.STOCK_UP : {
            console.log('STOCK_UP');
            let newPrice = state + action.payload;
            console.log(newPrice);
            return (newPrice);
        }
        case StockActions.STOCK_DOWN : {
            console.log('STOCK_DOWN');
            let newPrice = state - action.payload;
            return newPrice;
        }
        default: // the old state is the new state

        {
            console.log('No change');
            return state;
        }

    }

}
