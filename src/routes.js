import React from "react";
import { Switch, Route } from "react-router-dom";

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Home from "./components/Home/index";

const Routes = () => (
  <div>
    <Sidebar />
    <Header />
    <Switch>
      <Route path="/" exact component={Home}></Route>
    </Switch>
  </div>
);

export default Routes;
