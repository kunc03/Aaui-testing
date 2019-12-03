import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Loader from "./components/Header_sidebar/Loader";
import Home from "./components/Home/index";
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
          <Route path="/user" component={User} />
        </Switch>
      </div>
    );
  }
}

export class User extends React.Component {
  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <h3>C</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
