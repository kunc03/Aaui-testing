import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Loader from "./components/Header_sidebar/Loader";
import Home from "./components/Home/index";
import Pengaturan from "./components/Pengaturan/index";
import Profile from "./components/Profile/index";
import User from "./components/Users/User/index";
import UserAdd from "./components/Users/User/add";
import Cabang from "./components/Users/UserCabang/index";
import Grup from "./components/Users/UserGroup/index";
import Login from "./components/Login/index";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLogin: false
    };
  }

  componentDidMount() {
    let userInfo = localStorage.getItem("user");
    if (userInfo == null) {
      this.setState({ userLogin: false });
    } else {
      this.setState({ userLogin: true });
    }
  }

  render() {
    let workSpace = null;
    if (this.state.userLogin) {
      workSpace = <Main />;
    } else {
      workSpace = <Login />;
    }

    return <div>{workSpace}</div>;
  }
}

export class Main extends React.Component {
  render() {
    return (
      <div>
        <Loader />
        <Sidebar />
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Pengaturan" exact component={Pengaturan} />
          <Route path="/Profile" exact component={Profile} />
          <Route path="/user" exact component={User} />
          <Route path="/user-create" exact component={UserAdd} />
          <Route path="/cabang" exact component={Cabang} />
          <Route path="/grup" exact component={Grup} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </div>
    );
  }
}

export class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.onClickLogout = this.onClickLogout.bind(this);
  }

  onClickLogout(e) {
    e.preventDefault();
  }

  componentDidMount() {
    localStorage.clear();
    window.location.href = window.location.origin;
  }

  render() {
    return <div></div>;
  }
}
