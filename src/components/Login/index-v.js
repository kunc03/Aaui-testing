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
