import React, { Component } from "react";
import { Form } from 'react-bootstrap'
import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import ToggleSwitch from "react-switch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from 'react-sm-select';
import { toast } from "react-toastify";

class UserEdit extends Component {

  state = {
    user: null,
    user_id: this.props.match.params.user_id,

    company_id: "",
    branch_id: "",
    grup_id: "",

    identity: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    level: "",
    password: "",
    unlimited: false,
    validity: new Date(),

    listCompany: [],
    listBranch: [],
    listGrup: [],
    listLevel: [],
    optionsGroup: [],
    valueGroup: [],

    responseMessage: '',
  }

  handleChangeValidity = date => {
    this.setState({
      validity: date
    });
  };

  toggleSwitch(checked) {
    this.setState({ unlimited: !this.state.unlimited });
  }
  onSubmitEditUser = e => {
    e.preventDefault();
    let unlimited = this.state.unlimited == false ? '1' : '0'
    let formData = {
      company_id: this.state.company_id,
      // branch_id: this.state.branch_id,
      group: this.state.valueGroup,
      grup_id: this.state.grup_id,
      identity: this.state.identity, name: this.state.name, email: this.state.email,
      phone: this.state.phone, address: this.state.address, level: this.state.level,
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
      API.put(`${API_SERVER}v1/user/${this.state.user_id}`, formData).then(res => {
        if (res.status === 200) {
  
          if (this.state.password !== '') {
            let formData = { password: this.state.password };
            API.put(`${API_SERVER}v1/user/password/${this.state.user_id}`, formData).then(res => {
              console.log('pass: ', res.data)
            })
          }
  
          if (Storage.get('user').data.level === 'superadmin') {
            this.props.history.push('/user')
          } else {
            this.props.history.push(`/my-company`)
          }
        }
      })
    }
  }

  onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === 'company_id') {
      API.get(`${API_SERVER}v1/branch/company/${value}`).then(res => {
        if (res.status === 200) {
          this.setState({ listBranch: res.data.result[0], company_id: value })
        }
      })
    } else if (name === 'email') {
      // API.get(`${API_SERVER}v1/user/cek/email/${value}`).then(res => {
      //   if (res.data.error) {
      //     target.value = ''
      //   } else {
      this.setState({ [name]: value })
      //   }
      // })
    } else if (name === 'address') {
      if (value.length <= 100) {
        this.setState({ [name]: value })
      } else {
        this.setState({ responseMessage: 'Cannot exceed the character limit.', [name]: value.slice(0, target.maxLength) })
      }
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  componentDidMount() {
    let valueGroup = [];
    API.get(`${API_SERVER}v1/user/${this.state.user_id}`).then(res => {
      if (res.status === 200) {
        let unlimited = res.data.result.unlimited == 0 ? true : false;
        this.setState({
          user: res.data.result,
          company_id: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
          branch_id: res.data.result.branch_id,
          grup_id: res.data.result.grup_id,
          name: res.data.result.name,
          identity: res.data.result.identity,
          email: res.data.result.email,
          phone: res.data.result.phone,
          address: res.data.result.address,
          level: res.data.result.level,
          unlimited: unlimited,
          validity: new Date(res.data.result.validity),
        });
        valueGroup = res.data.result.group_id ? res.data.result.group_id.split(',').map(Number) : [];

        API.get(`${API_SERVER}v1/branch/company/${this.state.user.company_id}`).then(res => {
          if (res.status === 200) {
            this.setState({ listBranch: res.data.result[0] })
            let tempGroup=[];
            res.data.result[0].map(item => {
              tempGroup.push({value: item.branch_id, label: item.branch_name});
            });
            this.setState({optionsGroup: tempGroup})
          }
        })

        API.get(`${API_SERVER}v1/grup/company/${this.state.user.company_id}`).then(res => {
          if (res.status === 200) {
            this.setState({ valueGroup: valueGroup })
            this.setState({ listGrup: res.data.result })
          }
        })

        const levelUser = [{ level: 'admin' }, { level: 'client' }];
        this.setState({ listLevel: levelUser });
      }
    })
  }

  render() {
    let validityUser = "";
    if (this.state.validity !== "") {
      validityUser = new Date(this.state.validity);
    }
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
                      <h3 className="f-24 f-w-800">User Management</h3>
                      <div className="card">
                        <div className="card-block">

                          <form onSubmit={this.onSubmitEditUser}>
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
                                    <option value={item.branch_id} selected={(item.branch_id === this.state.user.branch_id) ? 'selected': ''}>{item.branch_name}</option>
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
                                    <option value={item.grup_id} selected={(item.grup_id === this.state.user.grup_id) ? 'selected' : ''}>{item.grup_name}</option>
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
                                value={this.state.name}
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
                                placeholder="210-1971-74"
                                value={this.state.identity}
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
                                value={this.state.email}
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
                                value={this.state.phone}
                                className="form-control"
                                placeholder="081-247-9592"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Address</label>
                              <textarea value={this.state.address} name="address" className="form-control" placeholder="Address" onChange={this.onChangeInput} />
                            </div>

                            <div className="form-group">
                              <label className="label-input">Level</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <select style={{ textTransform: 'capitalize' }} name="level" className="form-control" onChange={this.onChangeInput} required>
                                <option value="">-- Select --</option>
                                {
                                  levelUser.map(item => (
                                    <option value={item.level} selected={(item.level === this.state.user.level) ? 'selected' : ''}>{item.level === 'client' ? 'User' : item.level}</option>
                                  ))
                                }
                              </select>
                            </div>
                            {/* <div className="form-group">
                              <label className="label-input">Password</label>
                              <Form.Text className="text-danger">Required</Form.Text>
                              <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="password"
                                onChange={this.onChangeInput}
                              />
                            </div> */}
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
                                    selected={validityUser}
                                    onChange={this.handleChangeValidity}
                                    dateFormat="yyyy-MM-dd"
                                  />
                                </div>

                              </div>
                            }
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

export default UserEdit;
