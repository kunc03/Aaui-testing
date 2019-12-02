import React from "react";
import ReactDOM from "react-dom";
import "./Resources/assets/css/style.css";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";

ReactDOM.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
  document.getElementById("root")
);
