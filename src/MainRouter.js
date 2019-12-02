import React from "react";
import { Route, Switch } from "react-router-dom";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Header from "./components/Header_sidebar/Header";
// import Home from "./home/Home";
// import User from "./user/User";
// import UserEdit from "./user/edit";

const MainRouter = () => (
  <div>
    <Sidebar />
    <Header />
    <Switch>
      {/* <Route path="/" exact component={Home} /> */}
      {/* <Route path="/user" exact component={User} /> */}
    </Switch>
  </div>
);

export default MainRouter;
