import React, { Component } from "react";
import {Alert, Modal} from 'react-bootstrap';
import API, {USER_ME, USER, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class Profile extends Component {
  state = {
    user_data: {
      user_id: Storage.get('user').data.user_id,
      company_id: '',
      branch_id: '',
      level: '',
      status: '',
      email: '',
      
      name: '',
      identity: '',
      address: '',
      phone: '',
      avatar: '',
      tempAvatar: '',
    },
    isModalAvatar: false,
    toggle_alert: false
  }

  componentDidMount(){
    this.fetchProfile();
  }

  handleModalAvatarClose = e => {
    this.setState({ isModalAvatar: false, user_data: { ...this.state.user_data, tempAvatar: '' }});
  }

  onClickModalAvatar = e => {
    e.preventDefault();
    this.setState({ isModalAvatar: true });
  }

  onClickSubmitModal = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('avatar', this.state.user_data.tempAvatar);

    API.put(`${API_SERVER}v1/user/avatar/${this.state.user_data.user_id}`, formData).then(res => {
      if(res.status === 200) {
        this.setState({ 
          user_data: { ...this.state.user_data, avatar: res.data.result}, 
          isModalAvatar: false
        });
      }
    })
  }

  fetchProfile = () => {
    const user = Storage.get('user');
    API.get(`${USER_ME}${user.data.email}`).then(res => {
      console.log(res.data.result)
      if(res.status === 200){
        if(!res.data.error){
          this.setState({
            user_data: {
              ...this.state.user_data,
              avatar: res.data.result.avatar,
              company_id: res.data.result.company_id,
              branch_id: res.data.result.branch_id,
              level: res.data.result.level,
              status: res.data.result.status,
              email: res.data.result.email,
              name: res.data.result.name,
              identity: res.data.result.identity,
              address: res.data.result.address,
              phone: res.data.result.phone,
            }
          });
        }
      }
    })
  }

  updateProfile = (e) => {
    e.preventDefault();
    const {user_data} = this.state;
    API.put(`${USER}/${user_data.user_id}`, user_data).then(res=> {
      console.log(res.data)
        if(res.status === 200){
          if(!res.data.error){
            this.setState({
              toggle_alert: true
            })
          }
        }
      })
      .catch(err=> {
        console.log(err);
      })
  }

  handleChange = (e) => {
    if(e.target.name === 'avatar') {
      this.setState({ user_data: { ...this.state.user_data, tempAvatar: e.target.files[0] } });
    } else {
      this.setState({
        user_data: {
          ...this.state.user_data,
          [e.target.name]: e.target.value
        }
      })
    }
  }

  render() {
    const {user_data, toggle_alert} = this.state;

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-36 f-w-bold mb-3">Profile Anda !</h3>
                      <div className="card">
                        <div className="card-block">
                          <div className="text-center mt-5 mb-5">
                            <img
                              alt=""
                              src={this.state.user_data.avatar}
                              className="rounded-circle img-profile mb-4"
                            />
                            <br />
                            <button
                              onClick={this.onClickModalAvatar}
                              className="btn btn-ideku f-16 f-w-bold"
                              style={{ width: 180, padding: "15px 0" }}
                            >
                              Ganti
                            </button>
                          </div>
                          <Modal show={this.state.isModalAvatar} onHide={this.handleModalAvatarClose}>
                            <Modal.Body>
                              <Modal.Title className="text-c-purple3 f-w-bold">Ganti Foto</Modal.Title>
                              <div style={{ marginTop: '20px'}} className="form-group">
                                <label>Upload Foto</label>
                                <input className="form-control" name="avatar" type="file" onChange={this.handleChange} required />
                              </div>
                              <button style={{ marginTop: '50px'}} type="button"
                                onClick={this.onClickSubmitModal}
                                className="btn btn-block btn-ideku f-w-bold">
                                Simpan
                              </button>
                              <button type="button"
                                className="btn btn-block f-w-bold"
                                onClick={this.handleModalAvatarClose}>
                                Tidak
                              </button>
                            </Modal.Body>
                          </Modal>


                          {
                            toggle_alert &&
                            <Alert variant={'success'}>
                              Update successfully!
                            </Alert>
                          }
                          <form>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nama
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
                                Nomor Identitas
                              </label>
                              <input
                                name="identity"
                                type="numeric"
                                className="form-control"
                                required
                                placeholder="No. ktp"
                                inputMode="numeric"
                                value={user_data.identity == null ? "" : user_data.identity}
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
                            <button
                              className="btn btn-primary btn-block m-t-100 f-20 f-w-600"
                              onClick={event => this.updateProfile(event)}
                            >
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

export default Profile;
