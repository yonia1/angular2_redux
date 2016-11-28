import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgReduxModule, NgRedux } from "ng2-redux";
import { AppComponent } from "./app.component";
import { StockActions } from "./redux/actions/stock.actions";
import { rootReducer } from "./redux";
import { Store, createStore } from "redux";
import { AppState } from "./redux/store";

export const store: Store<AppState> = createStore(rootReducer);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgReduxModule.forRoot()

    ],
    providers: [StockActions],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(ngRedux: NgRedux<AppState>) {
        ngRedux.provideStore(store);
    }
}
