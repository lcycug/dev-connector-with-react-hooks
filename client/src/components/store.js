import thunk from "redux-thunk";
import { createStore, compose, applyMiddleware } from "redux";

import rootReducer from "../reducers";

const initialState = {};
const middlewares = [thunk];
const store = createStore(
  rootReducer,
  initialState,
  compose(
    // compose is used for chrome devtools
    applyMiddleware(...middlewares),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
