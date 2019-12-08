import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  state = {
    email: "",
    password: ""
  };

  onChangeEmail = e => {
    this.setState({ email: e.target.value });
  };
  onChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  submitForm = e => {
    e.preventDefault();
    localStorage.setItem(
      "user",
      JSON.stringify({
        result: {
          email: "jek@jek.com",
          password: "123456"
        }
      })
    );
    window.location.href = window.location.origin;

    // let link = "http://10.1.70.137:4000/v1/auth";
    // let data = { email: this.state.email, password: this.state.password };
    // let header = {
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // };

    // axios
    //   .post(link, data, header)
    //   .then(function(response) {
    //     if (response.data.error) {
    //       this.setState({ email: e.target.value });
    //       this.setState({ password: e.target.value });
    //     } else {
    //       localStorage.setItem("user", JSON.stringify(response.data));
    //       window.location.href = window.location.origin;
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  };

  render() {
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
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={this.onChangePassword}
                    />
                  </div>
                  <button className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16">
                    Masuk
                  </button>
                </form>
                <p className="mb-0 mt-1">
                  <a
                    href="auth-signin.html"
                    className="text-cc-purple f-16 f-w-600"
                  >
                    Masuk dengan Voucher
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
