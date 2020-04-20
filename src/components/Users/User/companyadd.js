import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import ToggleSwitch from "react-switch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class UserAdd extends Component {

  state = {
    company_id: "",
    branch_id: "",
    grup_id: "",
    
    identity: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    level: "",
    unlimited:false,
    validity:new Date(),

    listCompany: [],
    listBranch: [],
    listGrup: [],

    responseMessage: '',
    responseEmail: '',
    responsePhone: '',
  };

  handleChangeValidity = date => {
    this.setState({
      validity: date
    });
  };

  toggleSwitch(checked) {
    this.setState({ unlimited:!this.state.unlimited });
  }
  onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name === 'email') {
      API.get(`${API_SERVER}v1/user/cek/email/${value}`).then(res => {
        if(res.data.error) {
          target.value = ''
        } else {
          this.setState({ [name]: value })
        }
      })
    } else if(name === 'address') {
      if (value.length <= 100) {
        this.setState({ [name]: value })
      } else {
        this.setState({ responseMessage: 'Tidak boleh melebihi batas karakter.', [name]: value.slice(0, target.maxLength) })
      }
    } else {
      this.setState({ [name]: value })
    }

  }

  submitForm = e => {
    e.preventDefault();
    let unlimited = this.state.unlimited == false ? '1' : '0'
    const formData = {
      company_id: this.state.company_id,
      branch_id: this.state.branch_id,
      grup_id: this.state.grup_id,
      identity: this.state.identity,
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,
      password: this.state.password,
      level: this.state.level,
      status: 'active',
      unlimited: unlimited,
      validity: this.state.validity.toISOString().split('T')[0]
    };

    API.post(`${API_SERVER}v1/user`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          this.setState({ responseMessage: res.data.result })
        } else {
          this.props.history.push('/my-company')
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
            this.setState({ listBranch: res.data.result[0] })
          }
        })

        API.get(`${API_SERVER}v1/grup/company/${this.state.company_id}`).then(res => {
          if(res.status === 200) {
            this.setState({ listGrup: res.data.result })
          }
        })
      }
    })
  }

  render() {
    const levelUser = [{level: 'admin'}, {level: 'client'}];

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
                              <label className="label-input">Group</label>
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
                              <label className="label-input">Role</label>
                              <select required className="form-control" name="grup_id" onChange={this.onChangeInput}>
                                <option value="">-- pilih --</option>
                                {
                                  this.state.listGrup.map(item => (
                                    <option value={item.grup_id}>{item.grup_name}</option>
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
                              <Form.Text className="text-muted">
                                Pastikan isi sesuai dengan format email ex. user@email.com
                              </Form.Text>
                            </div>

                            <div className="form-group">
                              <label className="label-input">Phone</label>
                              <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="081-247-9592"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Alamat</label>
                              <textarea maxLength="100" name="address" className="form-control" placeholder="alamat" onChange={this.onChangeInput}></textarea>
                              <Form.Text className="text-muted">
                                Maksimal 100 karakter untuk alamat
                              </Form.Text>
                            </div>

                            <div className="form-group">
                              <label className="label-input">Level</label>
                              <select name="level" className="form-control" onChange={this.onChangeInput} required style={{textTransform: 'capitalize'}}>
                                <option value="">-- pilih --</option>
                                {
                                  levelUser.map(item => (
                                    <option value={item.level}>{item.level === 'client' ? 'User' : item.level}</option>
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

                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Batasi Waktu
                              </label>
                              <div style={{width:'100%'}}>
                              <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.unlimited} />
                              </div>

                            </div>
                            {
                              this.state.unlimited &&
                              <div className="form-group">
                                <label className="label-input" htmlFor>
                                  Valid Until
                                </label>
                                <div style={{width:'100%'}}>
                                      <DatePicker
                                        selected={this.state.validity}
                                        onChange={this.handleChangeValidity}
                                        showTimeSelect
                                        dateFormat="yyyy-MM-dd"
                                      />
                                </div>
              
                              </div>
                            }
                            <div style={{marginTop: '50px'}}>
                            {
                              this.state.responseMessage && 
                              <div class="alert alert-primary" role="alert">
                                <b>ALERT</b> Please check you data before submit. {this.state.responseMessage}
                              </div>
                            }
                            </div>
                            <button type="submit" className="btn btn-primary btn-block m-t-10 f-20 f-w-600">
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
