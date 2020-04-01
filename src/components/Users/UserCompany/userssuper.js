import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import API, { API_SERVER } from "../../../repository/api";

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myCompanyId: this.props.companyId,
      users: [],
      isModalHapus: false,
      userIdHapus: "",
      userStatusHapus: '',
      isModalPassword: false,
      userIdPassword: "",
      userPassword: "",

      isModalVoucher: false,
      userIdVoucher: "",
      voucher: "",
      notif: ""
    };
  }

  handleChangeInput = e => {
    const target = e.target;
    const name = e.target.name;
    const value = e.target.value;
    if(name === 'voucher') {
      API.get(`${API_SERVER}v1/user/cek/voucher/${value}`).then(res => {
        if (res.data.error) {
          target.value = "";
          this.setState({ notif: "Voucher sudah digunakan." })
        } else {
          this.setState({ [name]: value });
        }
      });
    } else {
      this.setState({ [name]: value });
    }
  }

  handleModalVoucher = e => {
    this.setState({ isModalVoucher: false, userIdVoucher: "", notif: '' });
  };

  onClickHapus = e => {
    e.preventDefault();
    this.setState({
      isModalHapus: true,
      userIdHapus: e.target.getAttribute("data-id"),
      userStatusHapus: e.target.getAttribute("data-status")
    });
  };

  onClickSubmitHapus = e => {
    e.preventDefault();
    let form = {
      active: this.state.userStatusHapus == 'active' ? 'pasive' : 'active'
    }
    API.put(`${API_SERVER}v1/user/active/${this.state.userIdHapus}`, form).then(res => {
      if(res.status === 200) {
        this.fetchData();
        this.handleModalHapus();
      }
    })

    // API.delete(
    //   `${API_SERVER}v1/user/${this.state.userIdHapus}`
    // ).then(res => {
    //   if (res.status === 200) {
    //     this.fetchData();
    //     this.setState({ isModalHapus: false, userIdHapus: "" });
    //   }
    // });
  };

  handleModalHapus = e => {
    this.setState({ isModalHapus: false, userIdHapus: "", userStatusHapus: '' });
  };

  onClickModalPassword = e => {
    e.preventDefault();
    this.setState({
      isModalPassword: true,
      userIdPassword: e.target.getAttribute("data-id")
    });
  };

  onClickSubmitPassword = e => {
    e.preventDefault();
    let formData = { password: this.state.userPassword };
    API.put(
      `${API_SERVER}v1/user/password/${this.state.userIdPassword}`,
      formData
    ).then(res => {
      if (res.status === 200) {
        this.setState({
          isModalPassword: false,
          userIdPassword: ""
        });
      }
    });
  };

  handleModalPassword = e => {
    this.setState({
      isModalPassword: false,
      userIdPassword: ""
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  onClickModalVoucher = e => {
    e.preventDefault();
    this.setState({
      isModalVoucher: true,
      userIdVoucher: e.target.getAttribute("data-id")
    });
  };

  fetchData() {
    API.get(
      `${API_SERVER}v1/user/company/${this.state.myCompanyId}`
    )
      .then(response => {
        response.data.result.map(item => {
          let temp = item;
          if (item.validity !== null) {
            temp.validity = item.validity
              .toString()
              .substring(0, 10);
          }
          return temp;
        });
        this.setState({ users: response.data.result.reverse() });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onClickSubmitVoucer = e => {
    e.preventDefault();
    let form = { voucher: this.state.voucher };
    API.put(
      `${API_SERVER}v1/user/voucher/${this.state.userIdVoucher}`,
      form
    ).then(res => {
      if (res.status === 200) {
        this.setState({
          isModalVoucher: false,
          userIdVoucher: ""
        });
        this.fetchData();
      }
    });
  };

  render() {
    let { users } = this.state;

    const Item = ({ item, iter }) => {
      return (
        <tr>
          <td>{iter}</td>
          <td>{item.name}</td>
          <td>{item.identity}</td>
          <td>{item.branch_name}</td>
          <td>{item.grup_name}</td>
          <td style={{ textTransform: "capitalize" }}>
          {item.level === 'client' ? 'User' : item.level}
          </td>
          <td>{item.voucher}</td>
          <td>{item.email}</td>
          <td>{item.phone}</td>
          <td>{item.validity}</td>
          <td class="text-center">
            <Link
              to="#"
              className="buttonku"
              title="Setting Voucher"
            >
              <i
                data-id={item.user_id}
                onClick={this.onClickModalVoucher}
                className="fa fa-tag"
              ></i>
            </Link>
            <Link to="#" className="buttonku">
              <i
                data-id={item.user_id}
                onClick={this.onClickModalPassword}
                className="fa fa-key"
              ></i>
            </Link>
            <Link
              to={`/user-edit/${item.user_id}`}
              className="buttonku"
            >
              <i className="fa fa-edit"></i>
            </Link>
            <Link to="#" className="buttonku">
              <i
                data-id={item.user_id}
                data-status={item.status}
                onClick={this.onClickHapus}
                className="fa fa-trash"
              ></i>
            </Link>
          </td>
        </tr>
      );
    };

    const Lists = ({ lists }) => {
      if(lists.length == 0) {
        return (
          <tbody>
            <tr>
              <td colSpan='10'>Tidak ada user</td>
            </tr>
          </tbody>
        )
      } else {
        return (
          <tbody>
            {lists.map((list, i) => (
              <Item key={list.user_id} item={list} iter={i+1} />
            ))}
          </tbody>
        )
      }
    }

    return (
      <div>
        <h3 className="f-24 f-w-800">User Management</h3>

        <div style={{ overflow: "auto", maxHeight:'71vh' }}>
          <table className="table-curved" style={{ width: "100%",whiteSpace: "nowrap" }}>
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Nama</th>
                <th>Nomor Induk</th>
                <th>Group</th>
                <th>Role</th>
                <th>Level</th>
                <th>Voucher</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Validity</th>
                <th className="text-center">
                  <Link
                    to={"/user-create"}
                    className="btn btn-ideku col-12 f-14"
                    style={{ padding: "7px 8px !important" }}
                  >
                    <img
                      src="assets/images/component/person_add.png"
                      className="button-img"
                      alt=""
                    />
                    Tambah Baru
                  </Link>
                </th>
              </tr>
            </thead>
            <Lists lists={users} />
          </table>

          <Modal show={this.state.isModalHapus} onHide={this.handleModalHapus}>
            <Modal.Body>
              <Modal.Title className="text-c-purple3 f-w-bold">
                Hapus User
              </Modal.Title>
              <p className="f-w-bold">
                Apakah Anda yakin untuk menghapus user ini ?
              </p>
              <button
                style={{ marginTop: "50px" }}
                type="button"
                data-grup={this.state.namacabang}
                onClick={this.onClickSubmitHapus}
                className="btn btn-block btn-ideku f-w-bold"
              >
                Hapus
              </button>
              <button
                type="button"
                className="btn btn-block f-w-bold"
                onClick={this.handleModalHapus}
              >
                Tidak
              </button>
            </Modal.Body>
          </Modal>

          <Modal
            show={this.state.isModalPassword}
            onHide={this.handleModalPassword}
          >
            <Modal.Body>
              <Modal.Title className="text-c-purple3 f-w-bold">
                Ubah Password
              </Modal.Title>
              <form
                style={{ marginTop: "10px" }}
                onSubmit={this.onClickSubmitPassword}
              >
                <div className="form-group">
                  <label>Password Baru</label>
                  <input
                    type="password"
                    placeholder="password baru"
                    className="form-control"
                    name="userPassword"
                    onChange={this.handleChangeInput}
                  />
                </div>
                <button
                  style={{ marginTop: "50px" }}
                  type="submit"
                  className="btn btn-block btn-ideku f-w-bold"
                >
                  Ubah Password
                </button>
                <button
                  type="button"
                  className="btn btn-block f-w-bold"
                  onClick={this.handleModalPassword}
                >
                  Tidak
                </button>
              </form>
            </Modal.Body>
          </Modal>

          <Modal
            show={this.state.isModalVoucher}
            onHide={this.handleModalVoucher}
          >
            <Modal.Body>
              <Modal.Title className="text-c-purple3 f-w-bold">
                Set Voucher
              </Modal.Title>
              <form
                style={{ marginTop: "10px" }}
                onSubmit={this.onClickSubmitVoucer}
              >
                <div className="form-group">
                  <label>Voucher</label>
                  <input
                    type="text"
                    required
                    placeholder="voucher baru"
                    className="form-control"
                    name="voucher"
                    onChange={this.handleChangeInput}
                  />
                  {this.state.notif && (
                    <Form.Text className="text-danger">{this.state.notif}</Form.Text>
                  )}
                </div>

                <button
                  style={{ marginTop: "50px" }}
                  type="submit"
                  className="btn btn-block btn-ideku f-w-bold"
                >
                  Set Voucher
                </button>
                <button
                  type="button"
                  className="btn btn-block f-w-bold"
                  onClick={this.handleModalVoucher}
                >
                  Tidak
                </button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}
