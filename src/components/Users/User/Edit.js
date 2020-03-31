import React, { Component } from "react";
import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

import axios from "axios";

class UserEdit extends Component {
  state = {
    user: null,
    user_id: this.props.match.params.user_id,

    company_id: "",
    branch_id: "",

    identity: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    level: "",
    password: "",

    listCompany: [],
    listBranch: [],
    listGrup: [],
    listLevel: [],

    responseMessage: ""
  };

  onSubmitEditUser = e => {
    e.preventDefault();
    let formData = {
      company_id: this.state.company_id,
      branch_id: this.state.branch_id,
      identity: this.state.identity,
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,
      level: this.state.level,
      status: "active"
    };

    API.put(`${API_SERVER}v1/user/${this.state.user_id}`, formData).then(
      res => {
        if (res.status === 200) {
          if (this.state.password !== "") {
            let formData = { password: this.state.password };
            API.put(
              `${API_SERVER}v1/user/password/${this.state.user_id}`,
              formData
            ).then(res => {
              console.log("pass: ", res.data);
            });
          }

          if (Storage.get("user").data.level === "superadmin") {
            this.props.history.push("/user");
          } else {
            this.props.history.push(`/user-company/${this.state.company_id}`);
          }
        }
      }
    );
  };

  onChangeInput = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "company_id") {
      API.get(`${API_SERVER}v1/branch/company/${value}`).then(res => {
        if (res.status === 200) {
          this.setState({ listBranch: res.data.result[0], company_id: value, listGrup: res.data.result[1] });
        }
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  componentDidMount() {
    API.get(`${API_SERVER}v1/user/${this.state.user_id}`).then(res => {
      if (res.status === 200) {
        this.setState({
          user: res.data.result,
          company_id: res.data.result.company_id,
          branch_id: res.data.result.branch_id,
          name: res.data.result.name,
          identity: res.data.result.identity,
          email: res.data.result.email,
          phone: res.data.result.phone,
          address: res.data.result.address,
          level: res.data.result.level
        });

        API.get(`${API_SERVER}v1/company`).then(res => {
          if (res.status === 200) {
            this.setState({ listCompany: res.data.result });
          }
        });

        API.get(
          `${API_SERVER}v1/branch/company/${this.state.user.company_id}`
        ).then(res => {
          if (res.status === 200) {
            this.setState({ listBranch: res.data.result[0], listGrup: res.data.result[1] });
          }
        });

        const levelUser = [
          { level: "superadmin" },
          { level: "admin" },
          { level: "client" }
        ];
        this.setState({ listLevel: levelUser });
      }
    });
  }

  render() {
    const levelUser = this.state.listLevel;

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800">Edit User Management</h3>
                      <div className="card">
                        <div className="card-block">
                          <form onSubmit={this.onSubmitEditUser}>
                            <div className="form-group">
                              <label className="label-input">Company</label>
                              <select
                                required
                                className="form-control"
                                name="company_id"
                                onChange={this.onChangeInput}
                              >
                                <option value="">-- pilih --</option>
                                {this.state.listCompany.map(item => (
                                  <option
                                    value={item.company_id}
                                    selected={
                                      item.company_id ===
                                      this.state.user.company_id
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    {item.company_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Cabang</label>
                              <select
                                required
                                className="form-control"
                                name="branch_id"
                                onChange={this.onChangeInput}
                              >
                                <option value="">-- pilih --</option>
                                {this.state.listBranch.map(item => (
                                  <option
                                    value={item.branch_id}
                                    selected={
                                      item.branch_id ===
                                      this.state.user.branch_id
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    {item.branch_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="label-input">Grup</label>
                              <select
                                required
                                className="form-control"
                                name="grup_id"
                                onChange={this.onChangeInput}
                              >
                                <option value="">-- pilih --</option>
                                {this.state.listGrup.map(item => (
                                  <option
                                    value={item.grup_id}
                                    selected={
                                      item.grup_id ===
                                      this.state.user.grup_id
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    {item.grup_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="label-input">Nama</label>
                              <input
                                required
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="nama"
                                value={this.state.name}
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Nomor Induk</label>
                              <input
                                type="text"
                                required
                                name="identity"
                                className="form-control"
                                placeholder="210-1971-74"
                                value={this.state.identity}
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Email</label>
                              <input
                                type="email"
                                required
                                name="email"
                                value={this.state.email}
                                className="form-control"
                                placeholder="rakaal@gmail.com"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Phone</label>
                              <input
                                type="text"
                                required
                                name="phone"
                                value={this.state.phone}
                                className="form-control"
                                placeholder="081-247-9592"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Alamat</label>
                              <textarea
                                value={this.state.address}
                                required
                                name="address"
                                className="form-control"
                                placeholder="alamat"
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <div className="form-group">
                              <label className="label-input">Level</label>
                              <select
                                style={{textTransform: 'capitalize'}}
                                name="level"
                                className="form-control"
                                onChange={this.onChangeInput}
                                required
                              >
                                <option value="">-- pilih --</option>
                                {levelUser.map(item => (
                                  <option
                                    value={item.level}
                                    selected={
                                      item.level === this.state.user.level
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    {item.level}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Password</label>
                              <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="password"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <button
                              type="submit"
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

export default UserEdit;
