import React, { Component } from "react";
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import API, { USER_LOGIN, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import LupaPassword from './lupaPassword'
import { Link } from "react-router-dom";
import { isMobile } from 'react-device-detect';

const tabs = [
  { title: 'Login' },
  { title: 'Vouchers' },
];


class Login extends Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    email: '',
    password: '',
    toggle_alert: false,
    isVoucher: false,
    voucher: '',
    alertMessage: '',
    tabIndex: 1,
    showPass: false
  };

  tabLogin(a, b) {
    this.setState({ tabIndex: b + 1 });
    if (b === 1) {
      this.setState({ isVoucher: true, voucher: '', email: '', password: '', toggle_alert: false });
    } else {
      this.setState({ isVoucher: false, voucher: '', email: '', password: '', toggle_alert: false });
    }
    // console.log(b, this.state.tabIndex)
  }

  backToLogin() {
    //console.log('balikk')
    this.setState({ isVoucher: false, voucher: '', email: '', password: '', toggle_alert: false, showPass: false, tabIndex: 1 });
  }

  lupaPassword() {
    this.setState({ isVoucher: true, voucher: '', email: '', password: '', toggle_alert: true, showPass: true, tabIndex: 4 });
  }

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
      if (res.status === 200) {
        if (!res.data.error) {

          let form = {
            user_id: res.data.result.user_id,
            description: res.data.result.email,
            title: 'voucher login'
          }

          Storage.set('user', {
            data: {
              user_id: res.data.result.user_id,
              email: res.data.result.email,
              level: res.data.result.level,
              grup_id: res.data.result.grup_id,
              grup_name: res.data.result.grup_name,
            }
          });

          Storage.set('access', {
            activity: res.data.result.activity,
            course: res.data.result.course,
            manage_course: res.data.result.manage_course,
            forum: res.data.result.forum,
            group_meeting: res.data.result.group_meeting,
            manage_group_meeting: res.data.result.manage_group_meeting
          });

          Storage.set('token', { data: res.data.result.token });

          if (this.props.redirectUrl) {
            window.location.href = window.location.origin + this.props.redirectUrl
          }
          else {
            if (res.data.result.is_new_password === 1) {
              window.location.href = window.location.origin;
            }
            else {
              window.location.href = `${window.location.origin}/pengaturan`;
            }
          }
          API.post(`${API_SERVER}v1/api-activity/new-login`, form).then(
            function () {
              console.log(arguments)
            }
          );

        } else {
          if (res.data.result.status == 'expired') {
            this.setState({ toggle_alert: true, alertMessage: res.data.result.message });
          }
          else {
            this.setState({ toggle_alert: true, alertMessage: 'Login failed. Please verify the data correct!' });
          }
        }
      } else {
        this.setState({ toggle_alert: true, alertMessage: 'Login failed. Please verify the data correct!' });
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
      if (res.status === 200) {
        if (!res.data.error) {

          let form = {
            user_id: res.data.result.user_id,
            description: res.data.result.email,
            title: 'regular login'
          }
          Storage.set('user', {
            data: {
              user_id: res.data.result.user_id,
              email: res.data.result.email,
              level: res.data.result.level,
              grup_id: res.data.result.grup_id,
              grup_name: res.data.result.grup_name,
            }
          });
          Storage.set('token', { data: res.data.result.token });
          if (this.props.redirectUrl) {
            window.location.href = window.location.origin + this.props.redirectUrl
          }
          else {
            if (res.data.result.is_new_password === 1) {
              window.location.href = window.location.origin;
            }
            else {
              window.location.href = `${window.location.origin}/pengaturan`;
            }
          }

          API.post(`${API_SERVER}v1/api-activity/new-login`, form).then(
            function () {
            }
          );
        } else {
          if (res.data.result.status == 'expired') {
            this.setState({ toggle_alert: true, alertMessage: res.data.result.message });
          }
          else {
            this.setState({ toggle_alert: true, alertMessage: 'Login failed. Please verify the data correct!' });
          }
        }
      } else {
        this.setState({ toggle_alert: true, alertMessage: 'Login failed. Please verify the data correct!' });
      }
    }).catch(err => {
      console.log('failed fetch', err);
    })
  };
  componentDidMount() {
    try {
      if (this.props.match.params.id && this.props.match.params.key) {
        this.lupaPassword()
      }
    } catch (error) {
      console.log('Continue', error)
    }
  }
  render() {
    const { toggle_alert, isVoucher } = this.state;
    let formKu = null;
    if (isVoucher) {
      formKu = (
        <form onSubmit={this.submitFormVoucher}>
          <b style={{ float: 'left', color: 'black' }}>Voucher Number</b>
          <div className="input-group mb-4 mt-5">
            <input
              type="text"
              value={this.state.voucher}
              className="form-control"
              style={{ marginTop: 8 }}
              placeholder="Enter your voucher number"
              onChange={this.onChangeVoucher}
              required
            />
          </div>
          <button type="submit" className="btn btn-ideku col-12 shadow-2 mt-10 b-r-3 f-16" style={{ height: 60 }}>
            Login
          </button>
          {
            toggle_alert &&
            <Alert variant={'danger'}>
              {this.state.alertMessage}
            </Alert>
          }
        </form>
      );
    } else {
      formKu = (
        <form onSubmit={this.submitForm}>
          <b style={{ float: 'left', color: 'black' }}>Email</b>
          <div className="input-group mb-4">
            <input
              type="text"
              value={this.state.email}
              className="form-control"
              style={{ marginTop: 8 }}
              placeholder="Enter your email"
              onChange={this.onChangeEmail}
              required
            />
          </div>
          <b style={{ float: 'left', color: 'black' }}>Password</b>
          <div className="input-group mb-3">
            <input
              type="password"
              value={this.state.password}
              className="form-control"
              style={{ marginTop: 8 }}
              placeholder="Enter your password"
              onChange={this.onChangePassword}
              required
            />
          </div>
          <p className="mt-5">
            <a style={{ cursor: 'pointer', color: '#00478C' }} onClick={this.lupaPassword.bind(this)}>Forgot Password ?</a>
          </p>
          <button type="submit" className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16" style={{ height: 60 }}>
            Login
          </button>
          {
            toggle_alert &&
            <Alert variant={'danger'}>
              {this.state.alertMessage}
            </Alert>
          }
        </form>
      );
    }

    return (
      <div style={{ background: "#fafbfc" }}>
        <header className="header-login">
          <center>
            <div className="mb-4">
              <img
                src="newasset/logo-horizontal.svg"
                style={{ paddingTop: 18 }}
                alt=""
              />
            </div>
          </center>
        </header>
        <div
          className="auth-wrapper"

        >
          <div className="auth-content mb-4" style={{ display: isMobile ? 'none' : 'block' }}>
            <div className=" b-r-15">
              <div
                className=" text-center"
                style={{ padding: "50px !important" }}
              >
                <div className="mb-4">
                  <img
                    src="newasset/user-computer.svg"
                    style={{ width: 350 }}
                    alt=""
                  />
                </div>
                <h4 className="mb-0 mt-1" style={{ textTransform: 'uppercase' }}>
                  <b>Connect with people anytime anywhere</b>
                </h4>
                <p className="mb-0 mt-1">
                  We are ready to connect you with others
                </p>

              </div>
            </div>
          </div>
          <div className="auth-content mb-4">
            <div className="card b-r-15">
              <div
                className="card-body text-center"
                style={{ padding: "50px !important" }}
              >
                <div className="row ">
                  <span className={!this.state.showPass ? 'hidden' : ''} style={{ color: '#00478C', paddingLeft: 15, cursor: 'pointer' }}
                    onClick={this.backToLogin.bind(this)}>
                    <i className="fa fa-arrow-left fa-2x"></i>
                  </span>
                  {tabs.map((tab, index) => {
                    return (
                      <div className={this.state.showPass ? 'hidden' : 'col-md-6 mb-4'}>
                        <Link
                          key={index}
                          onClick={this.tabLogin.bind(this, tab, index)}
                        >
                          <div
                            className={
                              this.state.tabIndex === index + 1
                                ? 'customtab-aktif'
                                : 'customtab title-disabled'
                            }
                          >
                            {tab.title}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                  {/* {console.log(this.state.tabIndex)} */}
                  {this.state.tabIndex === 1 && (!isVoucher) ? (
                    <div className="col-sm-12">{formKu}</div>
                  ) : this.state.tabIndex === 2 && (isVoucher) ? (
                    <div className="col-sm-12">{formKu}</div>
                  ) : (
                        <div><LupaPassword id={this.props.match.params.id} otp={this.props.match.params.key} /></div>
                      )}
                </div>
                {/* <p className="mb-0 mt-1">
                  <a
                    href="#"
                    className="text-cc-purple f-16 f-w-600"
                    onClick={ (!isVoucher) ? this.onClickVoucher : this.onClickEmail }
                  >
                    Masuk dengan {(!isVoucher) ? 'Voucher' : 'Email'}
                  </a>
                </p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="footer-info">
          <div className="row ">
            <div className="col-md-6"></div>
            <div className="col-md-3 mt-5">
              Gedung Total, Lantai 10.
              <p className="mb-0">Jl. Let. Jen. S. Parman Kav. 106 A</p>
              Jakarta 11440 - Indonesia
            </div>
            <div className="col-md-3 mt-5">
              <p className="mt-3 mb-0">Email	: support@infovesta.com</p>
              Phone	: 021 - 5697 2929
            </div>
          </div>
        </div>
        <footer className="footer-ideku">
          <div className="footer-copyright text-right">
            Copyright © 2020 - ICADEMY
          </div>
        </footer>
      </div>
    );
  }
}

export default Login;
