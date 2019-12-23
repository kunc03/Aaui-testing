import React, { Component } from "react";
import {Alert} from 'react-bootstrap';
import API, {USER_LOGIN} from '../../repository/api';
import Storage from '../../repository/storage';

import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    password: "",
    toggle_alert: false,
  };

  onChangeEmail = e => {
    this.setState({ email: e.target.value, toggle_alert: false });
  };
  onChangePassword = e => {
    this.setState({ password: e.target.value, toggle_alert: false, });
  };

  submitForm = e => {
    e.preventDefault();

    const { email, password } = this.state;
    let body = { email, password }

    API.post(USER_LOGIN, body)
      .then(res => {
        console.log('succes fetch', res);
        if(res.status == 200){
          if(!res.data.error){
            Storage.set('user', {data:body});
            Storage.set('token', {data:res.data.result.token});
            window.location.href = window.location.origin;
          }else{
            this.setState({
              toggle_alert: true
            })
          }
        }else{
          this.setState({
            toggle_alert: true
          })
        }
      })
      .catch(err => {
        console.log('failed fetch', err);
      })
  };

  render() {
    const { toggle_alert } = this.state;
    return (
      <div>
        <div
          className="auth-wrapper"
          style={{
            background:
              "linear-gradient(rgba(61, 12, 49, 0.90), rgba(61, 12, 49, 0.90) ),url(assets/images/component/login.jpg)"
          }}
        >
          <h1 className="text-c-white f-28 f-w-600">Selamat Datang!</h1>
          <div className="auth-content mb-4">
            <div className="card b-r-15">
              <div
                className="card-body text-center"
                style={{ padding: "50px !important" }}
              >
                <div className="mb-4">
                  <img
                    src="assets/images/component/LOGO IDEKU-01.png"
                    style={{ width: 200 }}
                    alt=""
                  />
                </div>
                <form onSubmit={event => this.submitForm(event)}>
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      onChange={this.onChangeEmail}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={this.onChangePassword}
                      required
                    />
                  </div>
                  <button className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16">
                    Masuk
                  </button>
                  {
                    toggle_alert &&
                    <Alert variant={'danger'}>
                      Login failed. Please verify the data correct!
                    </Alert>
                  }
                </form>
                <p className="mb-0 mt-1">
                  <Link className="text-cc-purple f-16 f-w-600" to='/login-voucher'> Masuk dengan Voucher </Link>
                  {/* old */}
                  {/* <a
                    href="auth-signin.html"
                    className="text-cc-purple f-16 f-w-600"
                  >
                    Masuk dengan Voucher
                  </a> */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer-ideku">
          <div className="footer-copyright text-right">
            Copyright © 2019 - Ideku Platform
          </div>
        </footer>
      </div>
    );
  }
}

export default Login;
