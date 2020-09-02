import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
  DropdownButton
} from '@trendmicro/react-dropdown';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import Storage from './../../../repository/storage';
import {headerTabble, bodyTabble} from './../data';

export default class User extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      isModalHapus: false,
      userIdHapus: '',
      isModalPassword: false,
      userIdPassword: '',
      userPassword: '',
      myCompanyId: this.props.match.params.company_id,

      isModalVoucher: false,
      userIdVoucher: '',
      voucher: '',

      filterUser: '',
      
      isModalImport: false,
      excel: '',
      nameFile: '',
      direction: 'descending'
    };
  }

  handleModalVoucher = e => {
    this.setState({ isModalVoucher: false, userIdVoucher: '' });
  }

  handleChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
    if (name === "voucher") {
      API.get(`${API_SERVER}v1/user/cek/voucher/${value}`).then(res => {
        if (res.data.error) {
          this.setState({ notif: "Voucher sudah digunakan." });
        } else {
          this.setState({ [name]: value });
          this.setState({ notif: "" });
        }
      });
    } else {
      this.setState({ [name]: value });
    }
  }

  onClickHapus = e => {
    e.preventDefault();
    this.setState({ isModalHapus: true, userIdHapus: e.target.getAttribute('data-id') });
  }

  onClickSubmitHapus = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/user/${this.state.userIdHapus}`).then(res => {
      if(res.status === 200) {
        this.fetchData();
        this.setState({isModalHapus: false, userIdHapus: ''})
      }
    })
  }

  handleModalHapus = e => {
    this.setState({ isModalHapus: false, userIdHapus: '' });
  }

  onClickModalPassword = e => {
    e.preventDefault();
    this.setState({ isModalPassword: true, userIdPassword: e.target.getAttribute('data-id')});
  }

  onClickSubmitPassword = e => {
    e.preventDefault();
    let formData = { password: this.state.password };
    API.put(`${API_SERVER}v1/user/password/${this.state.userIdPassword}`, formData).then(res => {
      if(res.status === 200) {
        this.setState({ isModalPassword: false, userIdPassword: '' });
      }
    })
  }

  handleModalPassword = e => {
    this.setState({ isModalPassword: false, userIdPassword: '' });
  }

  componentDidMount() {
    this.fetchData();
  }

  onClickModalVoucher = e => {
    e.preventDefault();
    this.setState({isModalVoucher: true, userIdVoucher: e.target.getAttribute('data-id'), voucher: e.target.getAttribute('data-voucher')});
    this.sortData('name');
  }
  onClickSubmitVoucer = e => {
    e.preventDefault();
    let form = { voucher: this.state.voucher };
    API.put(`${API_SERVER}v1/user/voucher/${this.state.userIdVoucher}`, form).then(res => {
      if(res.status === 200) {
        this.setState({ isModalVoucher: false, userIdVoucher: '' });
        this.fetchData();
      }
    }) 
  }
  handleModalImport = () => {
    this.setState({ isModalImport: false, excel: '', nameFile: '' });
  }

  handleChangeFile = e => {
    console.log(e.target.files[0])
    this.setState({
      excel: e.target.files[0],
      nameFile: e.target.files[0].name
    });
  }

  onSubmitImportUser = e => {
    e.preventDefault();
    let form = new FormData();
    form.append('company_id', this.state.myCompanyId);
    form.append('excel', this.state.excel);
    this.setState({ isLoading: true });

    API.post(`${API_SERVER}v1/user/import`, form).then((res) => {
      if (res.status === 200) {
        if (!res.data.error) {
          this.handleModalImport();
          this.fetchData();
          this.setState({ isLoading: false });
        }
      }
    })
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ myCompanyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        console.log('STORAGENYA',Storage.get('user').data);

        API.get(`${API_SERVER}v1/user/company/${this.state.myCompanyId}`).then(response => {
          console.log('resss',response)
          response.data.result.map(item => {
            let temp = item;
            if(item.validity !== null) {
              temp.validity = item.validity.toString().substring(0,10);
            }
            return temp;
          });
          this.setState({ users: response.data.result.reverse() });
          this.sortData('name');
          let dUser=[]
          this.state.users.map(item => {
            dUser.push({
              id: item.user_id,
              nama: item.name,
              nomorinduk: item.identity,
              email: item.email,
              phone: item.phone,
              group: item.branch_name,
              role: item.grup_name,
              level: item.level,
              voucher: item.voucher,
              validity: item.validity
            })
          });
          this.setState({dataUser : dUser})
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    });
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
                      <div className="card p-20">
                        <span>
                          <strong className="f-w-bold f-18 fc-blue mb-3">Meeting</strong>
                          <button
                            to='/user-create'
                            className="btn btn-icademy-primary float-right"
                            style={{ padding: "7px 8px !important" }}
                          >
                            <i className="fa fa-plus"></i>
                            {/* <img
                              src="assets/images/component/person_add.png"
                              className="button-img"
                              alt=""
                            /> */}
                            Add New
                          </button>
                        </span>
                        <div className="table-responsive">
                          <table className="table table-hover table-bordered">
                            <thead>
                              <tr>
                                {
                                  headerTabble.map((item, i) => {
                                      return (
                                        <td align="center" width={item.width}>{item.title}</td>
                                      )
                                  })
                                }
                                <td colSpan="2" align="center">Aksi</td>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                  bodyTabble.map((item, i) => {
                                      return (
                                        <tr>
                                          <td>{item.title}</td>
                                          <td align="center">{item.pembicara}</td>
                                          <td align="center">{item.status}</td>
                                          <td align="center">{item.status}</td>
                                          <td align="center">{item.status}</td>
                                          <td align="center">{item.status}</td>
                                          <td align="center">{item.status}</td>
                                          <td align="center">{item.status}</td>
                                          <td align="center">{item.status}</td>
                                        </tr>
                                      )
                                  })
                                }
                              
                            </tbody>
                          </table>
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
