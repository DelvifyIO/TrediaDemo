import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from 'react-router-redux';
import { createHashHistory } from 'history';

import rootReducer from "./reducers";


const initialState = {};
const reduxRouterMiddleware = routerMiddleware(createHashHistory());

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk, reduxRouterMiddleware];

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware)),
);
/* eslint-enable */
export default store;
