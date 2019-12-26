import React from "react";
import { Switch, Route } from "react-router-dom";

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
import Company from "./components/Users/UserCompany/index";
import CompanyDetail from "./components/Users/UserCompany/detail";
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
          <Route path="/Pengaturan" component={Pengaturan} />
          <Route path="/Profile" component={Profile} />
          <Route path="/user" component={User} />
          <Route path="/user-create" component={UserAdd} />
          <Route path="/cabang" component={Cabang} />
          <Route path="/company" component={Company} />
          <Route path="/company-detail/:company_id" component={CompanyDetail} />
          <Route path="/grup" component={Grup} />
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
