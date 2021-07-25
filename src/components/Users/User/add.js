import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';
import ToggleSwitch from "react-switch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import { toast } from "react-toastify";

class UserAdd extends Component {

  state = {
    company_id: "",
    branch_id: "",

    optionComapny: [],
    valueCompany: [],

    identity: "",
    name: "",
    email: "",
    alertemail: "",
    phone: "",
    address: "",
    password: "",
    level: "",
    unlimited: false,
    validity: new Date(),

    listCompany: [],
    listBranch: [],
    listGrup: [],

    responseMessage: '',
    responseEmail: '',
    responsePhone: '',
    optionsGroup: [],
    valueGroup: []
  };


  handleChangeValidity = date => {
    this.setState({
      validity: date
    });
  };

  toggleSwitch(checked) {
    this.setState({ unlimited: !this.state.unlimited });
  }

  onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === 'email') {
      API.get(`${API_SERVER}v1/user/cek/email/${value}`).then(res => {
        if (res.data.error) {
          target.value = ''
          this.setState({ alertemail: 'Email sudah terdaftar dan aktif. gunakan email lain' })
        } else {
          this.setState({ [name]: value, alertemail: '' })
        }
      })
    }
    else if (name === 'company_id') {
      API.get(`${API_SERVER}v1/branch/company/${value}`).then(res => {
        if (res.status === 200) {
          this.setState({ listBranch: res.data.result[0], company_id: value, listGrup: res.data.result[1] })
          res.data.result[0].map(item => {
            this.state.optionsGroup.push({ value: item.branch_id, label: item.branch_name });
          });
          this.showMultipleCompany(value)
        }
      })
    } else {
      this.setState({
        [name]: value
      });
    }
  }
  //
  submitForm = e => {
    e.preventDefault();
    let unlimited = this.state.unlimited == false ? '1' : '0'
    const formData = {
      company_id: this.state.company_id,
      multi_company: this.state.valueCompany,
      // branch_id: this.state.branch_id,
      branch_id: 0,
      grup_id: this.state.grup_id,
      group: this.state.valueGroup,
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

    if (
      formData.company_id === '' ||
      formData.group == '' ||
      formData.grup_id === '' ||
      formData.name === '' ||
      formData.identity === '' ||
      formData.email === '' ||
      formData.level === ''
    ){
      toast.warning('Please fill required field.')
    }
    else{
      API.post(`${API_SERVER}v1/user`, formData).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            this.setState({ responseMessage: res.data.result })
          } else {
            let userId = res.data.result.user_id;
            API.delete(`${API_SERVER}v1/user/assign/${res.data.result.user_id}`).then(res => {
              if (res.status === 200) {
                for (let i = 0; i < this.state.valueCompany.length; i++) {
                  let formData = {
                    user_id: userId,
                    company_id: this.state.valueCompany[i],
                  };
                  API.post(`${API_SERVER}v1/user/assign`, formData)
                }
              }
            })
            this.props.history.push(`/company-detail-super/${formData.company_id}`)
          }
        }
      })
    }
  };

  showMultipleCompany(except) {
    API.get(`${API_SERVER}v1/company`).then(res => {
      this.setState({ valueCompany: [] })
      this.setState({ optionComapny: [] })
      res.data.result.map(item => {
        this.state.optionComapny.push({ value: item.company_id, label: item.company_name });
      });
      this.setState({
        optionComapny: this.state.optionComapny.filter(item => item.value != except),
      })
    });
  }
  componentDidMount() {
    API.get(`${API_SERVER}v1/company`).then(res => {
      if (res.status === 200) {
        this.setState({ listCompany: res.data.result })
      }
    });
  }

  render() {
    const levelUser = [{ level: 'superadmin' }, { level: 'admin' }, { level: 'client' }];
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
                              <label className="label-input">Company</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <select required className="form-control" name="company_id" onChange={this.onChangeInput}>
                                <option value="">-- Select --</option>
                                {
                                  this.state.listCompany.map(item => (
                                    <option value={item.company_id}>{item.company_name}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Multiple Company</label>
                              <MultiSelect
                                id="multicompany"
                                options={this.state.optionComapny}
                                value={this.state.valueCompany}
                                onChange={valueCompany => this.setState({ valueCompany })}
                                mode="tags"
                                removableTags={true}
                                hasSelectAll={true}
                                selectAllLabel="Choose all"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select Company"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Group</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <MultiSelect
                                id="group"
                                options={this.state.optionsGroup}
                                value={this.state.valueGroup}
                                onChange={valueGroup => this.setState({ valueGroup })}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select Group"
                              />
                              {/* <select required className="form-control" name="branch_id" onChange={this.onChangeInput}>
                                <option value="">-- Select --</option>
                                {
                                  this.state.listBranch.map(item => (
                                    <option value={item.branch_id}>{item.branch_name}</option>
                                  ))
                                }
                              </select> */}
                            </div>
                            <div className="form-group">
                              <label className="label-input">Role</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <select required className="form-control" name="grup_id" onChange={this.onChangeInput}>
                                <option value="">-- Select --</option>
                                {
                                  this.state.listGrup.map(item => (
                                    <option value={item.grup_id}>{item.grup_name}</option>
                                  ))
                                }
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="label-input"> Name </label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <input
                                required
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Name"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input"> Registration Number </label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <input
                                type="text"
                                required
                                name="identity"
                                className="form-control"
                                placeholder="001"
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <div className="form-group">
                              <label className="label-input">Email</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <input
                                type="email"
                                required
                                name="email"
                                className="form-control"
                                placeholder="example@domain.com"
                                onChange={this.onChangeInput}
                              />
                              <Form.Text className="text-danger">{this.state.alertemail}</Form.Text>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Phone</label>
                              <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="08119680220"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Address</label>
                              <textarea name="address" className="form-control" placeholder="Address" onChange={this.onChangeInput}></textarea>
                            </div>

                            <div className="form-group">
                              <label className="label-input">Level</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <select style={{ textTransform: 'capitalize' }} name="level" className="form-control" onChange={this.onChangeInput} required>
                                <option value="">-- Select --</option>
                                {
                                  levelUser.map(item => (
                                    <option value={item.level}>{item.level === 'client' ? 'User' : item.level}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Password</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <input
                                type="password"
                                name="password"
                                required
                                className="form-control"
                                placeholder="Password"
                                onChange={this.onChangeInput}
                              />
                            </div>

                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Time Limit
                              </label>
                              <div style={{ width: '100%' }}>
                                <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.unlimited} />
                              </div>

                            </div>
                            {
                              this.state.unlimited &&
                              <div className="form-group">
                                <label className="label-input" htmlFor>
                                  Valid Until
                                </label>
                                <div style={{ width: '100%' }}>
                                  <DatePicker
                                    selected={this.state.validity}
                                    onChange={this.handleChangeValidity}
                                    showTimeSelect
                                    dateFormat="yyyy-MM-dd"
                                  />
                                </div>

                              </div>
                            }
                            <div style={{ marginTop: '50px' }}>
                              {
                                this.state.responseMessage &&
                                <div class="alert alert-primary" role="alert">
                                  <b>ALERT</b> Please check you data before submit. {this.state.responseMessage}
                                </div>
                              }
                            </div>
                            <button type="submit" className="btn btn-primary btn-block m-t-100 f-20 f-w-600">
                              Save
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
