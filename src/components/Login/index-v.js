import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Alert} from 'react-bootstrap';
import API, {VOUCHER_LOGIN} from '../../repository/api';
import Storage from '../../repository/storage';

class Voucher extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    voucher: "",
    toggle_alert: false,
  };

  onChangevoucher = e => {
    this.setState({ voucher: e.target.value, toggle_alert: false });
  };

  submitForm = e => {
    e.preventDefault();

    const { voucher } = this.state;
    let body = { voucher }

    API.post(VOUCHER_LOGIN, body)
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
              "linear-gradient(rgba(61, 12, 49, 0.90), rgba(61, 12, 49, 0.90)),(assets/images/component/login.jpg)"
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
                  />
                </div>
                <h5 className="mb-4 f-20 f-w-800">Masuk dengan Voucher</h5>
                <form onSubmit={event => this.submitForm(event)}>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="No. Voucher"
                      onChange={this.onChangevoucher}
                    />
                  </div>
                  <button className="btn btn-ideku col-12 shadow-2 mb-4 mt-5 b-r-3 f-20">
                    Masuk
                  </button>
                  {
                    toggle_alert &&
                    <Alert variant={'danger'}>
                      Login failed. Please verify the data correct!
                    </Alert>
                  }
                </form>
                <p className="mb-0 mt-2">
                    <Link className="text-cc-purple f-16 f-w-600" to='/login'> Masuk dengan Email </Link>
                  {/* <a
                    href="auth-signin.html"
                    className="text-cc-purple f-21 f-w-600"
                  >
                    Masuk dengan Email
                  </a> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Voucher;




// import React, { Component } from "react";
// import axios from "axios";

// class Login extends Component {
//   constructor(props) {
//     super(props);

//     this.onChangeEmail = this.onChangeEmail.bind(this);
//     this.onChangePassword = this.onChangePassword.bind(this);
//     this.onClickVoucher = this.onClickVoucher.bind(this);
//     this.onClickEmail = this.onClickEmail.bind(this);
//   }

//   state = {
//     email: "",
//     password: "",
//     voucher: false
//   };

//   onClickVoucher = e => {
//     this.setState({ voucher: true });
//   };

//   onClickEmail = e => {
//     this.setState({ voucher: false });
//   };

//   onChangeEmail = e => {
//     this.setState({ email: e.target.value });
//   };
//   onChangePassword = e => {
//     this.setState({ password: e.target.value });
//   };

//   submitForm = e => {
//     e.preventDefault();

//     let link = "https://8023.development.carsworld.co.id/v1/auth";
//     let data = { email: this.state.email, password: this.state.password };
//     let header = {
//       headers: {
//         "Content-Type": "application/json"
//       }
//     };

//     axios
//       .post(link, data, header)
//       .then(function(response) {
//         if (response.data.error) {
//           this.setState({ email: e.target.value });
//           this.setState({ password: e.target.value });
//         } else {
//           localStorage.setItem("user", JSON.stringify(response.data));
//           window.location.href = window.location.origin;
//         }
//       })
//       .catch(function(error) {
//         console.log(error);
//       });
//   };

//   render() {
//     let formLogin = null;
//     if (this.state.voucher) {
//       formLogin = <VoucherLogin />;
//     } else {
//       formLogin = <EmailLogin />;
//     }

//     return (
//       <div>
//         <div
//           className="auth-wrapper"
//           style={{
//             background:
//               "linear-gradient(rgba(61, 12, 49, 0.90), rgba(61, 12, 49, 0.90) ),url(assets/images/component/login.jpg)"
//           }}
//         >
//           {formLogin}
//         </div>
//         <footer className="footer-ideku">
//           <div className="footer-copyright text-right">
//             Copyright © 2019 - Ideku Platform
//           </div>
//         </footer>
//       </div>
//     );
//   }
// }

// export default Login;

// export class VoucherLogin extends React.Component {
//   render() {
//     return (
//       <h1 className="text-c-white f-28 f-w-600">{title}</h1>
//         <div className="auth-content mb-4">
//           <div className="card b-r-15">
//             <div
//               className="card-body text-center"
//               style={{ padding: "50px !important" }}
//             >
//               <div className="mb-4">
//                 <img
//                   src="assets/images/component/LOGO IDEKU-01.png"
//                   style={{ width: 200 }}
//                   alt=""
//                 />
//               </div>
//               <form onSubmit={event => this.submitForm(event)}>
//                 <div className="input-group mb-4">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Email"
//                     onChange={this.onChangeEmail}
//                   />
//                 </div>
//                 <div className="input-group mb-3">
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Password"
//                     onChange={this.onChangePassword}
//                   />
//                 </div>
//                 <button className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16">
//                   Masuk
//                 </button>
//               </form>
//               <p className="mb-0 mt-1">
//                 <button
//                   className="text-cc-purple f-16 f-w-600"
//                   onClick={this.onClickVoucher}
//                 >
//                   Masuk dengan Voucher
//                 </button>
//               </p>
//               <p className="mb-0 mt-1">
//                 <button
//                   className="text-cc-purple f-16 f-w-600"
//                   onClick={this.onClickEmail}
//                 >
//                   Masuk dengan Email
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//         </div>
//     );
//   }
// }

// export class EmailLogin extends React.Component {
//   render() {
//     return (
//       <h1 className="text-c-white f-28 f-w-600">{title}</h1>
//         <div className="auth-content mb-4">
//           <div className="card b-r-15">
//             <div
//               className="card-body text-center"
//               style={{ padding: "50px !important" }}
//             >
//               <div className="mb-4">
//                 <img
//                   src="assets/images/component/LOGO IDEKU-01.png"
//                   style={{ width: 200 }}
//                   alt=""
//                 />
//               </div>
//               <form onSubmit={event => this.submitForm(event)}>
//                 <div className="input-group mb-4">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Email"
//                     onChange={this.onChangeEmail}
//                   />
//                 </div>
//                 <div className="input-group mb-3">
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Password"
//                     onChange={this.onChangePassword}
//                   />
//                 </div>
//                 <button className="btn btn-ideku col-12 shadow-2 mb-3 mt-4 b-r-3 f-16">
//                   Masuk
//                 </button>
//               </form>
//               <p className="mb-0 mt-1">
//                 <button
//                   className="text-cc-purple f-16 f-w-600"
//                   onClick={this.onClickVoucher}
//                 >
//                   Masuk dengan Voucher
//                 </button>
//               </p>
//               <p className="mb-0 mt-1">
//                 <button
//                   className="text-cc-purple f-16 f-w-600"
//                   onClick={this.onClickEmail}
//                 >
//                   Masuk dengan Email
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//     );
//   }
// }
