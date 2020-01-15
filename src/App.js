import React from "react";
import { Switch, Route } from "react-router-dom";

import API, { API_SERVER } from './repository/api';
import Storage from './repository/storage';

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Loader from "./components/Header_sidebar/Loader";
import Home from "./components/Home/index";
import Pengaturan from "./components/Pengaturan/index";
import Profile from "./components/Profile/index";

import User from "./components/Users/User/index";
import UserAdd from "./components/Users/User/add";
import UserEdit from "./components/Users/User/Edit";

import UserCompany from "./components/Users/User/company";
import UserCompanyAdd from "./components/Users/User/companyadd";
import UserCompanyEdit from "./components/Users/User/companyedit";
import UserAccess from "./components/Users/Access/index";

import KursusMateri from "./components/admin/kursusmateri";
import KursusMateriAdd from "./components/admin/kursusmateriadd";
import KursusMateriEdit from "./components/admin/kursusmateriedit";

import Cabang from "./components/Users/UserCabang/index";
import Grup from "./components/Users/UserGroup/index";
import Company from "./components/Users/UserCompany/index";
import CompanyDetail from "./components/Users/UserCompany/detail";
import CompanyDetailSuper from "./components/Users/UserCompany/detailsuper";
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
  state = {
    level: Storage.get('user').data.level
  }

  render() {
    let workSpaceSwitch = null;
    if(this.state.level === 'superadmin') {
      workSpaceSwitch = <SuperAdminSwitch />;
    } else if(this.state.level === 'admin') {
      workSpaceSwitch = <AdminSwitch />;
    } else {
      workSpaceSwitch = <ClientSwitch />;
    }

    return (
      <div>
        <Loader />
        <Sidebar />
        <Header />
        {workSpaceSwitch}
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

export class SuperAdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/pengaturan" component={Pengaturan} />
        <Route path="/profile" component={Profile} />

        <Route path="/user" component={User} />
        <Route path="/user-create" component={UserAdd} />
        <Route path="/user-edit/:user_id" component={UserEdit} />
        
        <Route path="/user-access" component={UserAccess} />
        <Route path="/user-company/:company_id" component={UserCompany} />
        
        <Route path="/cabang" component={Cabang} />
        <Route path="/company" component={Company} />
        <Route path="/company-detail/:company_id" component={CompanyDetail} />
        <Route path="/company-detail-super/:company_id" component={CompanyDetailSuper} />
        <Route path="/grup" component={Grup} />

        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}

export class AdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/pengaturan" component={Pengaturan} />
        <Route path="/profile" component={Profile} />

        <Route path="/user" component={User} />
        <Route path="/user-create" component={UserAdd} />
        <Route path="/user-edit/:user_id" component={UserEdit} />

        <Route path="/user-company" component={UserCompany} />
        <Route path="/user-company-create" component={UserCompanyAdd} />
        <Route path="/user-company-edit/:user_id" component={UserCompanyEdit} />
        <Route path="/user-access" component={UserAccess} />
        <Route path="/my-company" component={CompanyDetail} />
        
        <Route path="/kursus-materi" component={KursusMateri} />
        <Route path="/kursus-materi-create" component={KursusMateriAdd} />
        <Route path="/kursus-materi-edit/:course_id" component={KursusMateriEdit} />
        
        <Route path="/cabang" component={Cabang} />
        <Route path="/company" component={Company} />
        <Route path="/grup" component={Grup} />

        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}

export class ClientSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />

        <Route path="/pengaturan" component={Pengaturan} />
        <Route path="/profile" component={Profile} />
        
        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}
