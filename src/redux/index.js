import { createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";

import Reducer from "./reducers";
//import Action from "./actions"


const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

const Store = createStoreWithMiddleware(
	Reducer,
	(window.__REDUX_DEVTOOLS_EXTENSION__ ||
		console.log.bind({},"no extension"))
	()
)

export default Store