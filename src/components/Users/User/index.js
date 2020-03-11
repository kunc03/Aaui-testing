import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import API, { API_SERVER } from '../../../repository/api';

import Storage from './../../../repository/storage';

export default class User extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      isModalHapus: false,
      userIdHapus: '',
      isModalPassword: false,
      userIdPassword: '',
      userPassword: '',

      isModalVoucher: false,
      userIdVoucher: '',
      voucher: ''
    };
  }

  handleModalVoucher = e => {
    this.setState({ isModalVoucher: false, userIdVoucher: '' });
  }

  handleChangeInput = e => {
    this.setState({ userPassword: e.target.value });
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
    let formData = { password: this.state.userPassword };
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
    this.setState({isModalVoucher: true, userIdVoucher: e.target.getAttribute('data-id')});
  }

  fetchData() {
    API.get(`${API_SERVER}v1/user`).then(response => {
      response.data.result.map(item => {
        let temp = item;
        if(item.validity != null) {
          temp.validity = item.validity.toString().substring(0,10);
        }
        return temp;
      });
      this.setState({ users: response.data.result });
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  // _deleteUser(idUser){
    
  //   let token = JSON.parse(localStorage.getItem("token"));
  //   let link = "https://8023.development.carsworld.co.id/v1/user" + idUser;

  //   var r = alert("Delete User ?");
  //   if (r === true) {
  //     axios.delete(link, {
  //       headers: {
  //         Authorization: token.data,
  //         "Content-Type": "application/json"
  //       }
  //     })
  //     .then(res => {
  //       console.log(res)
  //       if(res.status === 200){
  //         window.location = '/users'
  //       }
        
  //     }).catch(err => {
  //       console.log(err)
        
  //     })
  //   }
  // }

  render() {
    let { users } = this.state;

    const Item = ({ item, iter }) => {
      return (
        <tr>
          <td>{iter}</td>
          <td>{item.name}</td>
          <td>{item.identity}</td>
          <td>{item.company_name}</td>
          <td>{item.branch_name}</td>
          <td>{item.grup_name}</td>
          <td style={{textTransform: 'capitalize'}}>{item.level}</td>
          <td>{item.voucher}</td>
          <td>{item.email}</td>
          <td>{item.phone}</td>
          <td class="text-center">
            <Link to="#" className="buttonku" title="Setting Voucher">
              <i data-id={item.user_id} onClick={this.onClickModalVoucher} className="fa fa-tag"></i>
            </Link>
            <Link to="#" className="buttonku">
              <i data-id={item.user_id} onClick={this.onClickModalPassword} className="fa fa-key"></i>
            </Link>
            <Link to={`/user-edit/${item.user_id}`} className="buttonku">
              <i className="fa fa-edit"></i>
            </Link>
            <Link to="#" className="buttonku">
              <i data-id={item.user_id} onClick={this.onClickHapus} className="fa fa-trash"></i>
            </Link>
          </td>
        </tr>
      );
    };

    const Lists = ({ lists }) => (
      <tbody>
        {lists.map((list, i) => (
          <Item key={list.user_id} item={list} iter={i+1} />
        ))}
      </tbody>
    );

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
                      
                      <div style={{ overflowX: "auto" }}>
                        <table
                          className="table-curved"
                          style={{ width: "100%" }}
                        >
                          <thead>
                            <tr>
                              <th className="text-center">No</th>
                              <th>Nama</th>
                              <th>Nomor Induk</th>
                              <th>Company</th>
                              <th>Cabang</th>
                              <th>Grup</th>
                              <th>Level</th>
                              <th>Voucher</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th className="text-center">
                                <Link
                                  to='/user-create'
                                  className="btn btn-ideku col-12 f-14"
                                  style={{ padding: "7px 8px !important" }}
                                >
                                  <img
                                    src="assets/images/component/person_add.png"
                                    className="button-img"
                                    alt=""
                                  />
                                  Add New
                                </Link>
                              </th>
                            </tr>
                          </thead>
                          <Lists lists={users} />
                        </table>

                        <Modal show={this.state.isModalHapus} onHide={this.handleModalHapus}>
                          <Modal.Body>
                            <Modal.Title className="text-c-purple3 f-w-bold">Hapus User</Modal.Title>
                            <p className="f-w-bold">Apakah Anda yakin untuk menghapus user ini ?</p>
                            <button style={{ marginTop: '50px'}} type="button"
                              data-grup={this.state.namacabang}
                              onClick={this.onClickSubmitHapus}
                              className="btn btn-block btn-ideku f-w-bold">
                              Hapus
                            </button>
                            <button type="button"
                              className="btn btn-block f-w-bold"
                              onClick={this.handleModalHapus}>
                              Tidak
                            </button>
                          </Modal.Body>
                        </Modal>

                        <Modal show={this.state.isModalPassword} onHide={this.handleModalPassword}>
                          <Modal.Body>
                            <Modal.Title className="text-c-purple3 f-w-bold">Ubah Password</Modal.Title>
                            <form style={{ marginTop: '10px'}} onSubmit={this.onClickSubmitPassword}>
                              <div className="form-group">
                                <label>Password Baru</label>
                                <input type="password" placeholder="password baru" className="form-control" name="password" onChange={this.handleChangeInput} />
                              </div>
                              <button style={{ marginTop: '50px'}} type="submit"
                                className="btn btn-block btn-ideku f-w-bold">
                                Ubah Password
                              </button>
                              <button type="button"
                                className="btn btn-block f-w-bold"
                                onClick={this.handleModalPassword}>
                                Tidak
                              </button>
                            </form>
                          </Modal.Body>
                        </Modal>

                        <Modal show={this.state.isModalVoucher} onHide={this.handleModalVoucher}>
                          <Modal.Body>
                            <Modal.Title className="text-c-purple3 f-w-bold">Set Voucher</Modal.Title>
                            <form style={{ marginTop: '10px'}} onSubmit={this.onClickSubmitVoucer}>
                              <div className="form-group">
                                <label>Voucher</label>
                                <input type="text" required placeholder="voucher baru" className="form-control" name="voucher" onChange={this.handleChangeInput} />
                              </div>

                              <button style={{ marginTop: '50px'}} type="submit"
                                className="btn btn-block btn-ideku f-w-bold">
                                Set Voucher
                              </button>
                              <button type="button"
                                className="btn btn-block f-w-bold"
                                onClick={this.handleModalVoucher}>
                                Tidak
                              </button>
                            </form>
                          </Modal.Body>
                        </Modal>

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
