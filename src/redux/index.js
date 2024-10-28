import { createStore, applyMiddleware, compose } from "redux";
import ReduxThunk from "redux-thunk";

import Reducer from "./reducers";

// const createStoreWithMiddleware = applyMiddleware(
//   promiseMiddleware,
//   ReduxThunk
// )(createStore);
//
// const Store = createStoreWithMiddleware(
// 	Reducer,
// 	(window.__REDUX_DEVTOOLS_EXTENSION__ ||
// 		console.log.bind({},"no extension"))
// 	()
// )

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;
const Store = createStore(Reducer, composeEnhancers(applyMiddleware(ReduxThunk)));

export default Store
