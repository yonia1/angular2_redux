import { Component } from "@angular/core";
import { NgRedux, DevToolsExtension, select } from "ng2-redux";
import { AppState } from "./redux";
import { Observable } from "rxjs";
import { StockActions } from "./redux/actions/stock.actions";
const createLogger = require('redux-logger');
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @select('stock') count$: Observable<number>;

    constructor(private stockActions: StockActions,
                public ngRedux: NgRedux<AppState>,
                public devTool: DevToolsExtension) {




    }

    title = 'app works!';

}
