import React, { Component } from "react";
import {Alert, Modal, Form} from 'react-bootstrap';
import API, {USER_ME, USER, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class Profile extends Component {
  state = {
    user_data: {
      user_id: Storage.get("user").data.user_id,
      company_id: "",
      grup_id: "",
      identity: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      level: "",

      //unlimited: '',
      //validity: '',
      status: "",

      branch_id: "",
      group: [],

      avatar: "",
      tempAvatar: ""
    },
    kursusDiikuti: [],
    isModalAvatar: false,
    toggle_alert: false,

    isNotifikasi: false,
    isiNotifikasi: ""
  };

  fetchDataKursusDiikuti() {
    API.get(
      `${API_SERVER}v1/user-course/${Storage.get("user").data.user_id}`
    ).then(res => {
      if (res.status === 200) {
        this.setState({ kursusDiikuti: res.data.result.reverse() });
      }
    });
  }

  componentDidMount() {
    this.fetchProfile();
    this.fetchDataKursusDiikuti();
  }

  handleModalAvatarClose = e => {
    this.setState({
      isModalAvatar: false,
      user_data: { ...this.state.user_data, tempAvatar: "" }
    });
  };

  onClickModalAvatar = e => {
    e.preventDefault();
    this.setState({ isModalAvatar: true });
  };

  onClickSubmitModal = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("avatar", this.state.user_data.tempAvatar);
    console.log('simpen')
    API.put(
      `${API_SERVER}v1/user/avatar/${this.state.user_data.user_id}`,
      formData
    ).then(res => {
      if (res.status === 200) {
        this.setState({
          user_data: { ...this.state.user_data, avatar: res.data.result },
          isModalAvatar: false
        });
      }
    });
  };
  onClickSubmitModalDelete = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("avatar", null);
    console.log('simpen')
    API.put(
      `${API_SERVER}v1/user/avatar/${this.state.user_data.user_id}`,
      formData
    ).then(res => {
      if (res.status === 200) {
        this.setState({
          user_data: { ...this.state.user_data, avatar: "/assets/images/user/avatar-1.png" },
          isModalAvatar: false
        });
      }
    });
  };

  fetchProfile = () => {
    const user = Storage.get("user");
    API.get(`${USER_ME}${user.data.email}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          console.log('res: ', res.data)
          this.setState({
            user_data: {
              ...this.state.user_data,
              avatar: res.data.result.avatar ? res.data.result.avatar : "/assets/images/user/avatar-1.png",
              company_id: res.data.result.company_id,
              branch_id: res.data.result.branch_id,
              grup_id: res.data.result.grup_id,
              group: res.data.result.group,
              level: res.data.result.level,
              status: res.data.result.status,
              email: res.data.result.email,
              name: res.data.result.name,
              identity: res.data.result.identity,
              address: res.data.result.address,
              phone: res.data.result.phone,
              unlimited: res.data.result.unlimited,
              validity: res.data.result.validity ? res.data.result.validity.toString().substring(0,10) : '0000-00-00',
            }
          });
          // if (this.state.user_data.level==='client'){
            // this.setState({user_data:{
              // ...this.state.user_data,
              // level:'user'
            // }})
          // }
        }
      }
    });
  };

  updateProfile = e => {
    e.preventDefault();
    const { user_data } = this.state;
    API.put(`${USER}/${user_data.user_id}`, user_data)
    .then(res => {
      console.log(res,'sinpenennn')
        if (res.status === 200) {
          if (!res.data.error) {
            this.fetchProfile();
            this.setState({
              toggle_alert: true
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  closeNotifikasi = e => {
    this.setState({ isNotifikasi: false, isiNotifikasi: "" });
  };

  handleChange = e => {
    if (e.target.name === "avatar") {
      if (e.target.files[0].size <= 500000) {
        this.setState({
          user_data: { ...this.state.user_data, tempAvatar: e.target.files[0] }
        });
      } else {
        e.target.value = null;
        this.handleModalAvatarClose();
        this.setState({
          isNotifikasi: true,
          isiNotifikasi:
            "File tidak sesuai dengan format, silahkan cek kembali."
        });
      }
    } else {
      this.setState({
        user_data: {
          ...this.state.user_data,
          [e.target.name]: e.target.value
        }
      });
    }
  };

  render() {
    const { user_data, toggle_alert } = this.state;
    console.log('STATE: ', this.state);
    // const ListAktivitas = ({ lists }) => {
    //   if (lists.length !== 0) {
    //     return (
    //       <ol className="p-l-40 p-t-30 p-r-40 p-b-30 ">
    //         {lists.map((item, i) => (
    //           <div key={item.course_id}>
    //             <li className="f-16 f-w-800 text-c-black" style={{margin: '5px 0'}}>
    //               {item.course.title}
    //               <Link to={`/detail-kursus/${item.course_id}`} style={{float: 'right'}}>Lihat</Link>
    //             </li>
    //             <table style={{ width: "100%" }}>
    //               <ListChapters lists={item.chapters} />
    //             </table>
    //           </div>
    //         ))}
    //       </ol>
    //     );
    //   } else {
    //     return (
    //       <h3 className="f-w-900 f-20" style={{ margin: "30px" }}>
    //         Belum ada aktivitas.
    //       </h3>
    //     );
    //   }
    // };

    // const ListChapters = ({ lists }) => (
    //   <tbody>
    //     {lists.map((item, i) => (
    //       <tr key={item.chapter_id}>
    //         <th className>{item.chapter_title}</th>
    //       </tr>
    //     ))}
    //   </tbody>
    // );

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <h3 className="f-w-bold f-18 fc-blue">Profile</h3>
                  <div className="row">
                    <div className="col-sm-8">
                      <div className="card">
                        <div className="card-block">
                          <div className="mt-3 mb-3">
                            <img
                              alt=""
                              src={this.state.user_data.avatar}
                              className="rounded-circle img-profile mb-4"
                            />

                            <button
                              onClick={this.onClickModalAvatar}
                              className="btn btn-icademy-primary mb-2 ml-3"
                            >
                              Ganti
                            </button>
                          </div>
                          <Modal
                            show={this.state.isModalAvatar}
                            onHide={this.handleModalAvatarClose}
                          >
                            <Modal.Body>
                              <Modal.Title className="text-c-purple3 f-w-bold">
                                Ganti Foto
                              </Modal.Title>
                              <div
                                style={{ marginTop: "20px" }}
                                className="form-group"
                              >
                                <label>Upload Foto</label>
                                <input
                                  accept="image/*"
                                  className="form-control"
                                  name="avatar"
                                  type="file"
                                  onChange={this.handleChange}
                                  required
                                />
                                <Form.Text className="text-muted">
                                  Pastikan format file png, jpg, jpeg, atau gif
                                  dan ukuran file tidak lebih dari 500KB
                                </Form.Text>
                              </div>
                              <div className="float-right">
                                <button
                                  type="button"
                                  onClick={this.onClickSubmitModal}
                                  className="btn btn-icademy-primary ml-2"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={this.onClickSubmitModalDelete}
                                  className="btn btn-icademy-danger ml-2"
                                >
                                  Hapus Foto
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-icademy-block ml-2"
                                  onClick={this.handleModalAvatarClose}
                                >
                                  Batal
                                </button>
                              </div>
                            </Modal.Body>
                          </Modal>

                          <form style={{ margin: "0 0px" }}>
                            {toggle_alert && (
                              <Alert variant={"success"}>
                                Data profil kamu berhasil di simpan.
                              </Alert>
                            )}
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nama Lengkap
                              </label>
                              <input
                                name="name"
                                type="text"
                                className="form-control"
                                required
                                placeholder="Nama lengkap"
                                value={user_data.name}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nomor Induk
                              </label>
                              <input
                                name="identity"
                                type="numeric"
                                className="form-control"
                                required
                                placeholder="No. ktp"
                                inputMode="numeric"
                                value={
                                  user_data.identity == null
                                    ? ""
                                    : user_data.identity
                                }
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Alamat
                              </label>
                              <input
                                name="address"
                                type="text"
                                className="form-control"
                                required
                                placeholder="Alamat lengkap"
                                value={user_data.address}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nomor Handphone
                              </label>
                              <input
                                name="phone"
                                type="phone"
                                className="form-control"
                                required
                                placeholder="081247959214"
                                inputMode="tel"
                                value={user_data.phone}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Level
                              </label>
                              <label className="form-control" htmlFor>
                                {user_data.level === "client" ? "User" : user_data.level}
                              </label>
                            </div>
                            <button
                              className="btn btn btn-icademy-primary float-right mt-3"
                              onClick={event => this.updateProfile(event)}
                            >
                              Simpan
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* <Card>
                        <Card.Body>
                          <form style={{ margin: "0 42px" }}>
                            <h3 className="f-24 f-w-bold mb-3">
                              Informasi Kontak
                            </h3>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Email
                              </label>
                              <input
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="aaaa@bbb.com"
                                value={user_data.email}
                                onChange={this.handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Password
                              </label>
                              <input
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="password"
                                onChange={this.handleChange}
                              />
                            </div>
                            <Link
                              to="/pengaturan"
                              className="btn btn-ideku btn-block m-t-10 f-20 f-w-600"
                            >
                              Ubah di Pengaturan
                            </Link>
                          </form>
                        </Card.Body>
                      </Card> */}

                      {/* <Card>
                        <Card.Body>
                          <form style={{ margin: "0 42px" }}>
                            <h3 className="f-24 f-w-bold mb-3">
                              Informasi Kursus
                            </h3>

                            <ListAktivitas lists={kursusDiikuti} />
                          </form>
                        </Card.Body>
                      </Card> */}

                      <Modal
                        show={this.state.isNotifikasi}
                        onHide={this.closeNotifikasi}
                      >
                        <Modal.Body>
                          <Modal.Title className="text-c-purple3 f-w-bold">
                            Notifikasi
                          </Modal.Title>

                          <p style={{ color: "black", margin: "20px 0px" }}>
                            {this.state.isiNotifikasi}
                          </p>

                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={this.closeNotifikasi}
                          >
                            Mengerti
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
    );
  }
}

export default Profile;
