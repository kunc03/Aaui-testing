import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import axios from "axios";

class UserAdd extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeBranch = this.onChangeBranch.bind(this);
    this.onChangeNik = this.onChangeNik.bind(this);
    this.onChangeGrup = this.onChangeGrup.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeValidity = this.onChangeValidity.bind(this);
  }

  state = {
    name: "",
    branch_name: "",
    nik: "",
    grup_id: "",
    email: "",
    phone: "",
    validity: ""
  };

  onChangeName = e => {
    this.setState({ name: e.target.value });
  };
  onChangeBranch = e => {
    this.setState({ branch_name: e.target.value });
  };
  onChangeNik = e => {
    this.setState({ nik: e.target.value });
  };
  onChangeGrup = e => {
    this.setState({ grup_id: e.target.value });
  };
  onChangeEmail = e => {
    this.setState({ email: e.target.value });
  };
  onChangePhone = e => {
    this.setState({ phone: e.target.value });
  };
  onChangeValidity = e => {
    this.setState({ validity: e.target.value });
  };

  submitForm = e => {
    e.preventDefault();
    let token = JSON.parse(localStorage.getItem("user"));
    let link = "http://10.1.70.137:4000/v1/auth";
    let data = {
      name: this.state.name,
      branch_id: this.state.branch_id,
      nik: this.state.nik,
      grup_id: this.state.grup_id,
      email: this.state.email,
      phone: this.state.phone,
      validity: this.state.validity
    };
    let header = {
      headers: {
        Authorization: token.result.token,
        "Content-Type": "application/json"
      }
    };

    axios
      .post(link, data, header)
      .then(function(response) {
        if (response.data.error) {
          this.setState({ name: e.target.value });
          this.setState({ branch_id: e.target.value });
          this.setState({ nik: e.target.value });
          this.setState({ grup_id: e.target.value });
          this.setState({ email: e.target.value });
          this.setState({ phone: e.target.value });
          this.setState({ validity: e.target.value });
        } else {
          return <Redirect to="/user" />;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800">Tambah User Management</h3>
                      <div className="card">
                        <div className="card-block">
                          <form onSubmit={event => this.submitForm(event)}>
                            <div className="form-group">
                              <label className="label-input">Nama</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Rajaka Kauthar Allam"
                                onChange={this.onChangeName}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Nomor Induk</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="210-1971-74"
                                onChange={this.onChangeNik}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Cabang</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Cyprus"
                                onChange={this.onChangeBranch}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Grup</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Limit"
                                onChange={this.onChangeGrup}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                placeholder="rakaal@gmail.com"
                                onChange={this.onChangeEmail}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Phone</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="081-247-9592"
                                onChange={this.onChangePhone}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Validity</label>
                              <input
                                type="date"
                                className="form-control"
                                placeholder="01/06/2019"
                                onChange={this.onChangeValidity}
                              />
                            </div>
                            <button
                              type="button"
                              className="btn btn-primary btn-block m-t-100 f-20 f-w-600"
                            >
                              Simpan
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
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

export default UserAdd;
