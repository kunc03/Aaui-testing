import React, { Component } from "react";
import {Alert} from 'react-bootstrap';
import API, {USER_ME, USER} from '../../repository/api';
import Storage from '../../repository/storage';

class Profile extends Component {
  state = {
    user_data: {
      name: '',
      identity: '',
      address: '',
      phone: '',
    },
    toggle_alert: false
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.fetchProfile();
  }

  fetchProfile = () => {
    const user = Storage.get('user');
    API.get(`${USER_ME}${user.data.email}`)
      .then(res => {
        console.log('res', res);
        if(res.status === 200){
          if(!res.data.error){
            this.setState({
              user_data: res.data.result
            });
          }
        }
      })
  }

  updateProfile = (e) => {
    e.preventDefault();
    const {user_data} = this.state;
    console.log('user_data', user_data)
    API.put(`${USER}/${user_data.user_id}`, user_data)
      .then(res=> {
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
    console.log(this.state)
    console.log(e.target.value)
    this.setState({
      user_data: {
        ...this.state.user_data,
        [e.target.name]: e.target.value
      }
    })
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
                              src="https://chibi-akihabara.com/14679-large_default/fatestay-night-figurine-saber-alter-nendoroid-super-movable-edition.jpg"
                              alt
                              className="rounded-circle img-profile mb-4"
                            />
                            <br />
                            <a
                              href="#"
                              className="btn btn-ideku f-16 f-w-bold"
                              style={{ width: 180, padding: "15px 0" }}
                            >
                              Ganti
                            </a>
                          </div>
                          <form>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nama
                              </label>
                              <input
                                name="name"
                                type="text"
                                className="form-control"
                                id
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
                                id
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
                                id
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
                                id
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
                            {
                              toggle_alert &&
                              <Alert variant={'success'}>
                                Update successfully!
                              </Alert>
                            }
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
