import React, { Component } from "react";
// import FormField from '../utils/Form/formfield'

import { Connect } from "react-redux";

class Login extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formData: {
      email: {
        element: "input",
        value: "",
        config: {
          name: "email",
          type: "email",
          placeholder: "Enter your email"
        },
        validation: {
          requred: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      },
      password: {
        element: "input",
        value: "",
        config: {
          name: "password",
          type: "password",
          placeholder: "Enter your password"
        },
        validation: {
          requred: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      }
    }
  };

  submitForm = e => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ email: "email@email.com" }));
    window.location.href = window.location.origin;
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
          <h1 className="text-c-white f-40 f-w-600">Selamat Datang!</h1>
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
                  {/* <FormField
                    id={"email"}
                    formData={this.state.formData.email}
                    change={element => this.updateForm()}
                  /> */}

                  <div className="input-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                  <button className="btn btn-ideku col-12 shadow-2 mb-4 mt-4 b-r-3 f-20">
                    Masuk
                  </button>
                </form>
                <p className="mb-0 mt-2">
                  <a
                    href="auth-signin.html"
                    className="text-cc-purple f-21 f-w-600"
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
