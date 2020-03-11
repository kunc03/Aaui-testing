import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import {Alert} from 'react-bootstrap';
import axios from 'axios';
import API, {USER_LOGIN} from '../../repository/api';
import Storage from '../../repository/storage';

import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    email: '',
    password: '',
    toggle_alert: false,
    isVoucher: false,
    voucher: ''
  };

  onChangeEmail = e => {
    this.setState({ email: e.target.value, toggle_alert: false });
  };

  onChangePassword = e => {
    this.setState({ password: e.target.value, toggle_alert: false, });
  };

  onChangeVoucher = e => {
    this.setState({ voucher: e.target.value, toggle_alert: false });
  };

  onClickVoucher = e => {
    e.preventDefault();
    this.setState({ isVoucher: true, voucher: '', email: '', password: '', toggle_alert: false });
  };

  onClickEmail = e => {
    e.preventDefault();
    this.setState({ isVoucher: false, voucher: '', email: '', password: '', toggle_alert: false });
  };

  submitFormVoucher = e => {
    e.preventDefault();
    const { voucher } = this.state;
    let body = { voucher };

    axios.post(`${USER_LOGIN}/voucher`, body).then(res => {
      //console.log(res.data.result)
      if(res.status === 200) {
        if(!res.data.error) {
          Storage.set('user', {data: { 
            user_id: res.data.result.user_id, 
            email: res.data.result.email, 
            level: res.data.result.level,
          }});
          Storage.set('token', {data: res.data.result.token});
          window.location.href = window.location.origin;
        } else {
          this.setState({ toggle_alert: true });
        }
      } else {
        this.setState({ toggle_alert: true });
      }
    }).catch(err => {
      console.log('failed fetch', err);
    });
  }

  submitForm = e => {
    e.preventDefault();
    const { email, password } = this.state;
    let body = { email, password }

    axios.post(USER_LOGIN, body).then(res => {
      if(res.status === 200){
        if(!res.data.error){
          Storage.set('user', {data: { 
            user_id: res.data.result.user_id, 
            email: res.data.result.email,
            level: res.data.result.level,
          }});
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
    }).catch(err => {
      console.log('failed fetch', err);
    })
  };

  render() {
    const { toggle_alert, isVoucher } = this.state;
    let formKu = null;
    if(isVoucher) {
      formKu = (
        <form onSubmit={this.submitFormVoucher}>
          <div className="input-group mb-4">
            <input
              type="text"
              value={this.state.voucher}
              className="form-control"
              placeholder="Voucher"
              onChange={this.onChangeVoucher}
              required
            />
          </div>
          <button type="submit" className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16">
            Masuk
          </button>
          {
            toggle_alert &&
            <Alert variant={'danger'}>
              Login failed. Please verify the data correct!
            </Alert>
          }
        </form>
      );
    } else {
      formKu = (
        <form onSubmit={this.submitForm}>
          <div className="input-group mb-4">
            <input
              type="text"
              value={this.state.email}
              className="form-control"
              placeholder="Email"
              onChange={this.onChangeEmail}
              required
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              value={this.state.password}
              className="form-control"
              placeholder="Password"
              onChange={this.onChangePassword}
              required
            />
          </div>
          <button type="submit" className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16">
            Masuk
          </button>
          {
            toggle_alert &&
            <Alert variant={'danger'}>
              Login failed. Please verify the data correct!
            </Alert>
          }
        </form>
      );
    }

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
                {formKu}
                <p className="mb-0 mt-1">
                  <a
                    href="#"
                    className="text-cc-purple f-16 f-w-600"
                    onClick={ (!isVoucher) ? this.onClickVoucher : this.onClickEmail }
                  >
                    Masuk dengan {(!isVoucher) ? 'Voucher' : 'Email'}
                  </a>
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
