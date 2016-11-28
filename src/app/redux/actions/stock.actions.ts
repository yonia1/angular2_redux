import { Injectable } from "@angular/core";
import { NgRedux } from "ng2-redux";
import { AppState } from "../index";


const MIN: number = 0.5;
const MAX: number = 2.5;

export function random(min: number = MIN, max: number = MAX): number {
    return (Math.random() * (max - min + 1) | 0) + min;
}

@Injectable()
export class StockActions {

    constructor(public ngRedux: NgRedux<AppState>) {
        let lastUp = false;
        setInterval(() => {


            !lastUp && this.up();
            lastUp && this.down();
            lastUp = !lastUp;

        }, 5000);
        ;
    }

    //private ngRedux: NgRedux<AppState>;

    static STOCK_UP: string = 'Increment stock';

    static STOCK_DOWN: string = 'Decrement stock';

    up(): void {

        this.ngRedux.dispatch({type: StockActions.STOCK_UP, payload: random()});
    }

    down(): void {
        this.ngRedux.dispatch({type: StockActions.STOCK_DOWN, payload:   random()});
    }
}
