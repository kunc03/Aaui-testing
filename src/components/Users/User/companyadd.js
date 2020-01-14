import React, { Component } from "react";
import API, { USER_ME, API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';

class UserAdd extends Component {

  state = {
    company_id: "",
    branch_id: "",
    
    identity: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    level: "",

    listCompany: [],
    listBranch: [],

    responseMessage: '',
    responseEmail: '',
    responsePhone: '' 
  };

  onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  submitForm = e => {
    e.preventDefault();
    const formData = {
      company_id: this.state.company_id,
      branch_id: this.state.branch_id,
      identity: this.state.identity,
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,
      password: this.state.password,
      level: this.state.level,
      status: 'active'
    };

    API.post(`${API_SERVER}v1/user`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          this.setState({ responseMessage: res.data.result })
        } else {
          this.props.history.push('/user-company')
        }
      }
    })
  };

  componentDidMount() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ company_id: res.data.result.company_id});

        API.get(`${API_SERVER}v1/branch/company/${this.state.company_id}`).then(res => {
          if(res.status === 200) {
            this.setState({ listBranch: res.data.result })
          }
        })
      }
    })
  }

  render() {
    console.log('state: ', this.state)
    const levelUser = [{level: 'superadmin'}, {level: 'admin'}, {level: 'client'}];
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
                              <label className="label-input">Cabang</label>
                              <select required className="form-control" name="branch_id" onChange={this.onChangeInput}>
                                <option value="">-- pilih --</option>
                                {
                                  this.state.listBranch.map(item => (
                                    <option value={item.branch_id}>{item.branch_name}</option>
                                  ))
                                }
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
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Email</label>
                              <input
                                type="email"
                                required
                                name="email"
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
                                className="form-control"
                                placeholder="081-247-9592"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Alamat</label>
                              <textarea required name="address" className="form-control" placeholder="alamat" onChange={this.onChangeInput}></textarea>
                            </div>

                            <div className="form-group">
                              <label className="label-input">Level</label>
                              <select name="level" className="form-control" onChange={this.onChangeInput} required>
                                <option value="">-- pilih --</option>
                                {
                                  levelUser.map(item => (
                                    <option value={item.level}>{item.level}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Password</label>
                              <input
                                type="password"
                                name="password"
                                required
                                className="form-control"
                                placeholder="password"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            {
                              this.state.responseMessage && <span className="label label-primary">{this.state.responseMessage}</span>
                            }
                            <button type="submit" className="btn btn-primary btn-block m-t-100 f-20 f-w-600">
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
