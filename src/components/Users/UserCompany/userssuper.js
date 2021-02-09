import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Form } from "react-bootstrap";
import API, { API_SERVER } from "../../../repository/api";
import { InputGroup, FormControl } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem
} from '@trendmicro/react-dropdown';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myCompanyId: this.props.companyId,
      users: [],
      dataUser: [],
      isModalHapus: false,
      userIdHapus: "",
      userStatusHapus: '',
      isModalPassword: false,
      userIdPassword: "",
      userPassword: "",

      isModalVoucher: false,
      userIdVoucher: "",
      voucher: "",
      notif: "",

      filterUser: '',

      isModalImport: false,
      excel: '',
      nameFile: '',
      direction: 'descending',

      isLoading: false,
      limitCompany: []
    };
  }

  sortData = (name) => {
    let userdata = this.state.users;
    if (this.state.direction === 'ascending') {
      this.setState({ direction: 'descending' })
    }
    else {
      this.setState({ direction: 'ascending' })
    }
    let direction = this.state.direction
    userdata.sort((a, b) => {
      if (a[name] < b[name]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if ([name] > b[name]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    this.setState({ users: userdata });
  }
  filterUser = (e) => {
    e.preventDefault();
    this.setState({ filterUser: e.target.value });
  }

  handleChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;
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
      if (res.status === 200) {
        this.fetchData();
        this.handleModalHapus();
      }
    })
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
    this.checkLimitCompany();
  }

  checkLimitCompany(){
    API.get(`${API_SERVER}v2/company-limit/${this.state.myCompanyId}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          this.setState({limitCompany: res.data.result});
        } else {
          console.log("Error, gagal check limit company")
        }
      }
    })
  }

  onClickModalVoucher = e => {
    e.preventDefault();
    this.setState({
      isModalVoucher: true,
      userIdVoucher: e.target.getAttribute("data-id"),
      voucher: e.target.getAttribute("data-voucher")
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
        this.sortData('name');
        let dUser = []
        this.state.users.map(item => {
          dUser.push({
            id: item.user_id,
            nama: item.name,
            nomorinduk: item.identity,
            email: item.email,
            phone: item.phone,
            group: item.branch_name,
            role: item.grup_name,
            level: item.level === 'client' ? 'User' : item.level === 'admin' ? 'Admin' : 'Superadmin',
            voucher: item.voucher,
            status: item.status,
            validity: item.unlimited === 1 ? 'Unlimited' : item.validity
          })
        });
        this.setState({ dataUser: dUser })
      })
      .catch(function (error) {
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

  render() {
    const columns = [
      {
        name: 'Nama',
        selector: 'nama',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Registration number',
        selector: 'nomorinduk',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Group',
        selector: 'group',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Role',
        selector: 'role',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Level',
        selector: 'level',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Voucher',
        selector: 'voucher',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Validity',
        selector: 'validity',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              if (eventKey === 1) {
                window.open('/user-edit/' + row.id, "_self")
              }
            }}
          >
            <Dropdown.Toggle
              btnStyle="flat"
              noCaret
              iconOnly
            >
              <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem data-id={row.id} data-voucher={row.voucher} onClick={this.onClickModalVoucher}><i className="fa fa-tag" /> Set Voucher</MenuItem>
              <MenuItem data-id={row.id} onClick={this.onClickModalPassword}><i className="fa fa-key" /> Set Password</MenuItem>
              <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
              <MenuItem data-id={row.id} data-status={row.status} onClick={this.onClickHapus}><i className="fa fa-trash" /> Delete</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
      },
    ];
    let { dataUser, filterUser } = this.state;
    if (filterUser != "") {
      dataUser = dataUser.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterUser, "gmi"))
      )
    }
    // let sorting = this.sortData;

    // const Item = ({ item, iter }) => {
    //   return (
    //     <tr>
    //       <td>{iter}</td>
    //       <td>{item.name}</td>
    //       <td>{item.identity}</td>
    //       <td>{item.branch_name}</td>
    //       <td>{item.grup_name}</td>
    //       <td style={{ textTransform: "capitalize" }}>
    //       {item.level === 'client' ? 'User' : item.level}
    //       </td>
    //       <td>{item.voucher}</td>
    //       <td>{item.email}</td>
    //       <td>{item.phone}</td>
    //       <td>{item.unlimited ? 'Tidak' : item.validity}</td>
    //       <td class="text-center">
    //         <Link
    //           to="#"
    //           className="buttonku"
    //           title="Setting Voucher"
    //         >
    //           <i
    //             data-id={item.user_id}
    //             onClick={this.onClickModalVoucher}
    //             className="fa fa-tag"
    //           ></i>
    //         </Link>
    //         <Link to="#" className="buttonku">
    //           <i
    //             data-id={item.user_id}
    //             onClick={this.onClickModalPassword}
    //             className="fa fa-key"
    //           ></i>
    //         </Link>
    //         <Link
    //           to={`/user-edit/${item.user_id}`}
    //           className="buttonku"
    //         >
    //           <i className="fa fa-edit"></i>
    //         </Link>
    //         <Link to="#" className="buttonku">
    //           <i
    //             data-id={item.user_id}
    //             data-status={item.status}
    //             onClick={this.onClickHapus}
    //             className="fa fa-trash"
    //           ></i>
    //         </Link>
    //       </td>
    //     </tr>
    //   );
    // };

    // const Lists = ({ lists }) => {
    //   if(lists.length == 0) {
    //     return (
    //       <tbody>
    //         <tr>
    //           <td colSpan='10'>sssr</td>
    //         </tr>
    //       </tbody>
    //     )
    //   } else {
    //     return (
    //       <tbody>
    //         {lists.map((list, i) => (
    //           <Item key={list.user_id} item={list} iter={i+1} />
    //         ))}
    //       </tbody>
    //     )
    //   }
    // }

    return (
      <div>
        <h3 className="f-24 f-w-800">User Management</h3>
        <div className="col-md-12 col-xl-12" style={{ marginBottom: '10px' }}>
          <InputGroup className="mb-3" style={{ background: '#FFF' }}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                <i className="fa fa-search"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              style={{ background: '#FFF' }}
              onChange={this.filterUser}
              placeholder="Filter"
              aria-describedby="basic-addon1"
            />
            <InputGroup.Append style={{ cursor: 'pointer' }}>
              <InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </div>
        {
          this.state.limitCompany.user &&
          <Link to="#" onClick={() => this.setState({ isModalImport: true })} className="btn btn-ideku">
            <i className="fa fa-plus"></i>
            Import User
          </Link>
        }
        {
          this.state.limitCompany.user &&
          <a href={`${API_SERVER}user/format-users.xlsx`} className="btn btn-ideku ml-2" alt="Link">
            <i className="fa fa-download"></i>
            Download Format
          </a>
        }
        {
          this.state.limitCompany.user &&
          <Link
            to='/user-create'
            className="btn btn-ideku float-right"
            style={{ padding: "7px 8px !important" }}
          >
            <img
              src="assets/images/component/person_add.png"
              className="button-img"
              alt=""
            />
                                    Create New
                                  </Link>
        }

        {/* <div style={{ overflow: "auto", maxHeight:'71vh' }}>
          <table className="table-curved" style={{ width: "100%",whiteSpace: "nowrap" }}>
            <thead>
              <tr style={{cursor:'pointer'}}>
                <th className="text-center">No</th>
                <th onClick={()=>sorting("name")}><i className="fa fa-sort"></i> Nama</th>
                <th onClick={()=>sorting("identity")}><i className="fa fa-sort"></i> Registration number</th>
                <th onClick={()=>sorting("branch_name")}><i className="fa fa-sort"></i> Group</th>
                <th onClick={()=>sorting("grup_name")}><i className="fa fa-sort"></i> Role</th>
                <th onClick={()=>sorting("level")}><i className="fa fa-sort"></i> Level</th>
                <th onClick={()=>sorting("voucher")}><i className="fa fa-sort"></i> Voucher</th>
                <th onClick={()=>sorting("email")}><i className="fa fa-sort"></i> Email</th>
                <th onClick={()=>sorting("phone")}><i className="fa fa-sort"></i> Phone</th>
                <th onClick={()=>sorting("validity")}><i className="fa fa-sort"></i> Validity</th>
                <th className="text-center">
                </th>
              </tr>
            </thead>
            <Lists lists={users} />
          </table> */}
                      {
                        !this.state.limitCompany.user &&
                        <div>
                          You cannot create a new user because you have reached the limit.
                        </div>
                      }

        <div style={{ backgroundColor: '#FFF' }}>
          <DataTable
            style={{ marginTop: 20 }}
            title="Data User"
            columns={columns}
            data={dataUser}
            highlightOnHover
            defaultSortField="title"
            pagination
            fixedHeader
          />
        </div>
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
              Change Password
              </Modal.Title>
            <form
              style={{ marginTop: "10px" }}
              onSubmit={this.onClickSubmitPassword}
            >
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="New password"
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
                Change Password
                </button>
              <button
                type="button"
                className="btn btn-block f-w-bold"
                onClick={this.handleModalPassword}
              >
                No
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
                  placeholder="voucher baru"
                  className="form-control"
                  name="voucher"
                  value={this.state.voucher}
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

        <Modal show={this.state.isModalImport} onHide={this.handleModalImport}>
          <Modal.Body>
            <Modal.Title className="text-c-purple3 f-w-bold">Import User</Modal.Title>
            <form style={{ marginTop: '10px' }} onSubmit={this.onSubmitImportUser}>
              <div className="form-group">
                <label>File Excel</label><br />
                <input type="file" required name="excel" onChange={this.handleChangeFile} />
                <label id="attachment"> &nbsp;{this.state.nameFile ? this.state.nameFile : 'Pilih File'}</label>
                <Form.Text>
                  Pastikan format file xls, atau xlsx.
                  </Form.Text>
              </div>

              <button style={{ marginTop: '50px' }} type="submit"
                className="btn btn-block btn-ideku f-w-bold">
                {this.state.isLoading ? 'Proses Import...' : 'Submit'}
              </button>
              <button type="button"
                className="btn btn-block f-w-bold"
                onClick={this.handleModalImport}>
                Tidak
                </button>
            </form>
          </Modal.Body>
        </Modal>

        {/* </div> */}
      </div>
    );
  }
}
