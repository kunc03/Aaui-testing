import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { Provider } from "react-redux";
import Store from "./redux";

import "./App.css";

ReactDOM.render(
  <Suspense fallback={<img src='newasset/loading.gif' style={{position:'fixed', top:'50%', left: '50%', transform: 'translate(-50%, -50%)'}} />}>
    <Provider store={Store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Suspense>,
  
  document.getElementById("root")
);
