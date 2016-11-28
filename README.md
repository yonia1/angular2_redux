This project is part of the blog from www.talkinghightech.com

Angular 2 With Redux 



In my last post I went over the Redux principles, this was only the theory behind this design pattern. What I would like to do in this post is code a full example of an application based on Redux data flow. I will take some shortcuts using the angular CLI and some NPM libraries  but the main idea is the concept and not the implementation of the store.

We will start by using the CLI to create our redux application (before you start, make sure your angular CLI is updated):

ng new ANGULAR_REDUX
cd ANGULAR_REDUX
ng serve --host 0.0.0.0 --port 4201 --live-reload-port 49153
Go to your browser at http://localhost:4201/ and check if the application is running , it should display "app works!"

We would like to save some time by using an NPM library for the Redux pattern, Our next step will be to install it from NPM :

npm install redux --save
npm install ng2-redux --save
As always if  we would like to use some third party libraries, we will need to add them to our module. In this case I will add it to the main module in our app:

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgReduxModule, NgRedux } from 'ng2-redux';

import { AppComponent } from './app.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

We would like to create a simple Redux application for displaying  a stock information in our application, each time the stock updates the UI should be updated, The stock price will be update by a service that generates random numbers representing the changes in the stock price.

We will create a new directory called redux in our app and we will set up the redux pattern inside,create an index.ts file to export our modules.

We will start with a basic store that for now holds only the stock price, create a file called store.ts

export class AppState {
    
    stock_price: number;
}
This is just a simple number in out store, in most cases you will use objects to representing your store. For example if I wanted to hold more stocks I should have used a dictionary as the key represents the stock name and the value - the price. For simplicity I just added one stock price here.

Update the index.ts

export * from './store';
Next we will handle the actions section in our app. Create a new actions directory to hold our stock action and add a stock.actions.ts file , it will used as a service to handle all the logic of the actions

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
We placed static members to hold our basic actions types : the stock moves up, the stock moves down, each time there is an action we will dispatch the action to our store. For now we will just use random numbers for representing the change of the stock, in production app this will be implemented using another service that talks to the backend using http request or a socket for real time update.

It`s time to create our first reducer - stock.reducer.ts, as explained it will be a switch case function that always returns a new state:

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
In this reducer we specify our initial state as a const variable, it will be the default value of the reducer if no state is applied. According to the type of the action we will decide what to do, remember you must return a new state, in this case because our state is a primitive number it will be return by copy therefore a new object , but if your state is a non primitive object you must return a new object so take in mind a you will need a fast way to duplicate and update an existing object.

Go back to your module definition, its time to introduce the store to our app :

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
We created a store using the createStore function in our app, next in our appModule class we tell ngRedux that we are providing it with a store

constructor(ngRedux: NgRedux<AppState>) {
    ngRedux.provideStore(store);
}
And we are up! we can use the store in our app, lets updated our simple app to display our stock price,In our app component class we will add the service we created and we will introduce a new  decorator @select , it is use to get the store value as an observable



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
We will update our html template to show the current stock price :

<h1>
  {{title}}
</h1>

<h2>Our Stock price is : {{ count$ | async }} $</h2>


And we can see out stock priced being updated in real time on our UI.
You can view the project in my git repository/

References:
https://github.com/angular-redux/ng2-redux 









# ANGULARREDUX

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.19-3.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
=======
# angular2_redux
>>>>>>> c2859bb87c2b1c378ea2bbb28b9b2253f3c343f9
