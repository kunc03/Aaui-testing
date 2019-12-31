import React, { Component } from "react";

import axios from "axios";

class UserEdit extends Component {
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
    group: "",
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
    this.setState({ group: e.target.value });
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

  componentWillMount(){
    let idUser = window.location.search.split('?');
    let token = JSON.parse(localStorage.getItem("token"));
    let link = "https://8023.development.carsworld.co.id/v1/user/" + idUser[1];

    axios.get(link, {
      headers: {
        Authorization: token.data,
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      console.log(res)
      if(res.status === 200){
        this.setState({
            name: res.data.result.name,
            branch_name: "",
            nik: res.data.result.user_id,
            group: "",
            email: res.data.result.email,
            phone: res.data.result.phone,
            validity: ""
        })
      }
      // this.props.history.push(`/users`);	
    }).catch(err => {
      console.log(err)
      //alert(err.response.data.msg)
    })
  }

  _updateUser(){
    let token = JSON.parse(localStorage.getItem("token"));
    let idUser = window.location.search.split('?');
    let link = "https://8023.development.carsworld.co.id/v1/user/" + idUser[1];
    let data = {
      company_id : 1,
      branch_id : 1,
      name: this.state.name,
      identity: this.state.nik,
      // group: this.state.group,
      email: this.state.email,
      phone: this.state.phone,
      address : 'jakarta',
      password : 'admin123',
      level :'admin',
      status : 'active'
      //validity: this.state.validity
    };
    //console.log(data);

    axios.put(link, data , {
      headers: {
        Authorization: token.data,
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      console.log(res)
      if(res.status === 200){
        window.location = '/users'
      }
      // this.props.history.push(`/users`);	
    }).catch(err => {
      console.log(err)
      //alert(err.response.data.msg)
    })
  }
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
                                value={this.state.name}
                                className="form-control"
                                placeholder="Rajaka Kauthar Allam"
                                onChange={this.onChangeName}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Nomor Induk</label>
                              <input
                                type="text"
                                value={this.state.nik}
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
                                value={this.state.email}
                                className="form-control"
                                placeholder="rakaal@gmail.com"
                                onChange={this.onChangeEmail}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Phone</label>
                              <input
                                type="text"
                                value={this.state.phone}
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
                              onClick={this._updateUser.bind(this)}
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
