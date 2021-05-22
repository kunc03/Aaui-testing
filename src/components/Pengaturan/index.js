import React, { Component } from "react";
import { Modal } from 'react-bootstrap';
import ModalEmail from "./modalemail";
import {Link, NavLink} from "react-router-dom";
import ModalPassword from "./modalpassword";
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';


const menus = [
  { name: 'Setting'},
  { name: 'Security' },
  { name: 'Profile', link: `/profile` },
  { name: 'Global Setting', link:`/global-settings`},
  { name: 'Notification', link: `/notification-alert`}
]
class Pengaturan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      email: Storage.get('user').data.email,

      userId: Storage.get('user').data.user_id,
      confirm1: '',
      confirm2: '',
      confirm3: '',
      confirm4: '',
      confirm5: '',
      confirm6: '',
      confirm7: '',
      confirm8: '',
      confirm9: '',

      isModalResponse: false
    };
  }

  handleModalResponse = e => {
    this.setState({ isModalResponse: false });
  }

  handleOnChangeInput = e => {
    const name = e.target.name;
    const checked = e.target.checked;
    this.setState({ [name]: checked });
  }

  componentDidMount() {
    this.fetchData();
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  onClickSubmitSetting = e => {
    let formData = {
      confirm_1: this.state.confirm1 ? '1' : '0',
      confirm_2: this.state.confirm2 ? '1' : '0',
      confirm_3: this.state.confirm3 ? '1' : '0',
      confirm_4: this.state.confirm4 ? '1' : '0',
      confirm_5: this.state.confirm5 ? '1' : '0',
      confirm_6: this.state.confirm6 ? '1' : '0',
      confirm_7: this.state.confirm7 ? '1' : '0',
      confirm_8: this.state.confirm8 ? '1' : '0',
      confirm_9: this.state.confirm9 ? '1' : '0',
    }

    API.put(`${API_SERVER}v1/setting/user/${this.state.userId}`, formData).then(res => {
      if (res.status === 200) {
        this.setState({ isModalResponse: true });
      }
    })
  }

  fetchData() {
    let stringUrl = `${API_SERVER}v1/setting/user/${Storage.get('user').data.user_id}`;
    API.get(stringUrl).then(res => {
      if (res.status === 200) {
        console.log('response: ', res.data.result)
        this.setState({
          confirm1: (res.data.result.confirm_1 !== 1) ? false : true,
          confirm2: (res.data.result.confirm_2 !== 1) ? false : true,
          confirm3: (res.data.result.confirm_3 !== 1) ? false : true,
          confirm4: (res.data.result.confirm_4 !== 1) ? false : true,
          confirm5: (res.data.result.confirm_5 !== 1) ? false : true,
          confirm6: (res.data.result.confirm_6 !== 1) ? false : true,
          confirm7: (res.data.result.confirm_7 !== 1) ? false : true,
          confirm8: (res.data.result.confirm_8 !== 1) ? false : true,
          confirm9: (res.data.result.confirm_9 !== 1) ? false : true
        });
        if (res.data.result.is_new_password === 0) {
          document.getElementById("changePass").click()
        }
      }
    })
  }

  tabChoice(a) {
    console.log(a)
  }

  render() {
    console.log('response: ', this.state);

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">

              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-block">
                          <div className="row m-b-100">
                            {menus.map((item, i) => {
                              return (
                                <div className="col-xl-12 p-10 mb-3" style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                  onClick={this.tabChoice.bind(this, item.name)}>
                                  <Link to={item.link} > 
                                  <span className={item.name ? 'fc-skyblue' : ''}>{item.name}</span>
                                  </Link>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-8">
                      {/* <h3 className="f-36 f-w-bold mb-3">Pengaturan Anda !</h3> */}
                      <div className="card">
                        <div className="card-block">
                          <div className="row m-b-100">
                            <div className="col-xl-2">
                              <h3 className="f-w-bold f-18 fc-blue mb-4">Settings</h3>
                            </div>
                            <div className="col-xl-10">
                              <form>
                                <div className="form-group">
                                  <label className="label-input" htmlFor>
                                    Email
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="email"
                                      disabled
                                      value={this.state.email}
                                      className="form-control"
                                      placeholder="Enter your Old Email"
                                      aria-label="emailModel"
                                      aria-describedby="basic-addon2"
                                    />
                                    <div className="input-group-append">
                                      <button
                                        className="btn btn-icademy-primary ml-2"
                                        data-toggle="modal"
                                        data-target="#modalEmail"
                                        type="button"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="label-input" htmlFor>
                                    New Password
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="password"
                                      className="form-control"
                                      placeholder="**********"
                                      aria-label="**********"
                                      aria-describedby="basic-addon2"
                                    />
                                    <div className="input-group-append">
                                      {/* <span
                                        className="input-group-text"
                                        id="basic-addon2"
                                      >
                                        <i className="fa fa-eye text-c-grey" />
                                      </span> */}
                                      <button
                                        className="btn btn-icademy-primary ml-2"
                                        data-toggle="modal"
                                        data-target="#modalPassword"
                                        type="button"
                                        id="changePass"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>

                          {/* <div className="row">
                            <div className="col-xl-2 col-md-12">
                              <h3 className="pengaturan-title f-24 f-w-bold">
                                Notifikasi
                              </h3>
                            </div>
                            <div
                              className="col-xl-10 col-md-12 p-l-30"
                              style={{ borderLeft: "black solid 1px" }}
                            >
                              <form className="mt-2">
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm1)} onChange={this.handleOnChangeInput} name="confirm1" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi setelah mendaftar kursus
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm2)} onChange={this.handleOnChangeInput} name="confirm2" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan setelah selesai kursus
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm3)} onChange={this.handleOnChangeInput} name="confirm3" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan setelah mendaftar Kelas
                                        (Langsung)
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm4)} onChange={this.handleOnChangeInput} name="confirm4" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan setelah Kelas (Langsung
                                        berakhir)
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm5)} onChange={this.handleOnChangeInput} name="confirm5" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan saat pengguna lain
                                        mengirimkan aktivitas dalam diskusi
                                        forum
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm6)} onChange={this.handleOnChangeInput} name="confirm6" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan ketika materi baru
                                        ditambahkan
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm7)} onChange={this.handleOnChangeInput} name="confirm7" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Pengingat kelas (langsung) akan dimulai
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm8)} onChange={this.handleOnChangeInput} name="confirm8" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Pengingat akan kadaluarsa
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input checked={(this.state.confirm9)} onChange={this.handleOnChangeInput} name="confirm9" type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Pengingat forum akan ditutup
                                      </small>
                                    </label>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <button type="button" onClick={this.onClickSubmitSetting}
                            className="btn btn-primary btn-block m-t-100 f-20 f-w-600">
                            Simpan
                          </button> */}
                        </div>

                        <ModalEmail
                          show={this.state.isOpen}
                          onClose={this.toggleModal}
                          handleClose={this.toggleModal}
                        >
                          `Here's some content for the modal`
                        </ModalEmail>
                        <ModalPassword
                          show={this.state.isOpen}
                          onClose={this.toggleModal}
                        >
                          `Here's some content for the modal`
                        </ModalPassword>

                        <Modal show={this.state.isModalResponse} onHide={this.handleModalResponse}>
                          <Modal.Body>
                            <Modal.Title className="text-c-purple3 f-w-bold">Confirmation</Modal.Title>
                            <p className="f-w-bold">Change user settings have been saved.</p>
                            <button style={{ marginTop: '50px' }} type="button"
                              className="btn btn-block f-w-bold"
                              onClick={this.handleModalResponse}>
                              Close
                            </button>
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

export default Pengaturan;
