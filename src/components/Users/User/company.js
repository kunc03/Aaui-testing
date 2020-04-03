import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      isModalHapus: false,
      userIdHapus: '',
      myCompanyId: this.props.match.params.company_id,

      isModalPassword: '',
      userIdPassword: '',
      userPassword: '',

      isModalVoucher: false,
      userIdVoucher: '',
      voucher: ''
    };
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
        this.handleModalHapus();
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


  onClickModalVoucher = e => {
    e.preventDefault();
    this.setState({isModalVoucher: true, userIdVoucher: e.target.getAttribute('data-id')});
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

  handleModalVoucher = e => {
    this.setState({ isModalVoucher: false, userIdVoucher: '' });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ myCompanyId: res.data.result.company_id});
        console.log('STORAGENYA',Storage.get('user').data);

        API.get(`${API_SERVER}v1/user/company/${this.state.myCompanyId}`).then(response => {
          response.data.result.map(item => {
            let temp = item;
            if(item.validity !== null) {
              temp.validity = item.validity.toString().substring(0,10);
            }
            return temp;
          });
          this.setState({ users: response.data.result.reverse() });
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    });
  }

  render() {
    let { users } = this.state;

    const Item = ({ item, nomor }) => {
      return (
        <tr>
          <td>{nomor}</td>
          <td>{item.name}</td>
          <td>{item.identity}</td>
          <td>{item.branch_name}</td>
          <td>{item.grup_name}</td>
          <td style={{textTransform: 'capitalize'}}>{item.level === 'client' ? 'User' : item.level}</td>
          <td>{item.email}</td>
          <td>{item.voucher}</td>
          <td>{item.phone}</td>
          <td>{item.validity}</td>
          <td class="text-center">
            <Link to="#" className="buttonku" title="Setting Voucher">
              <i data-id={item.user_id} onClick={this.onClickModalVoucher} className="fa fa-tag"></i>
            </Link>
            <Link to="#" className="buttonku" title="Ubah Password">
              <i data-id={item.user_id} onClick={this.onClickModalPassword} className="fa fa-key"></i>
            </Link>
            <Link to={`/user-company-edit/${item.user_id}`} className="buttonku" title="Edit">
              <i className="fa fa-edit"></i>
            </Link>
            <Link to="#" className="buttonku" title="Hapus">
              <i data-id={item.user_id} onClick={this.onClickHapus} className="fa fa-trash"></i>
            </Link>
          </td>
        </tr>
      );
    };

    const Lists = ({ lists }) => (
      <tbody>
        {lists.map((list, i) => (
          <Item key={list.user_id} item={list} nomor={i+1} />
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
                      <div style={{ overflow: "auto", maxHeight:'71vh' }}>
                        <table
                          className="table-curved"
                          style={{ width: "100%", whiteSpace: "nowrap"}}
                        >
                          <thead>
                            <tr>
                              <th className="text-center">ID</th>
                              <th>Nama</th>
                              <th>Nomor Induk</th>
                              <th>Cabang</th>
                              <th>Grup</th>
                              <th>Level</th>
                              <th>Email</th>
                              <th>Voucher</th>
                              <th>Phone</th>
                              <th>Validity</th>
                              <th className="text-center">
                                <Link
                                  to={"/user-company-create"}
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
                                <input type="password" required placeholder="password baru" className="form-control" name="userPassword" onChange={this.handleChangeInput} />
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
                                {this.state.notif && (
                                  <Form.Text className="text-danger">{this.state.notif}</Form.Text>
                                )}
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
