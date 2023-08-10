import { combineReducers,applyMiddleware} from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {composeWithDeTools} from "redux-devtools-extension";

const reducer = combineReducers({

});
 let  store  = undefined;
let initailState = {};

const middleware = [thunk];

   store = configureStore (
    reducer, 
    initailState,
    composeWithDeTools(applyMiddleware(...middleware))
    );

    export default store;


