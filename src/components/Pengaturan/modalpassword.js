import React, { Component } from "react";
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

class ModalPassword extends Component {
  state = {
    userId: Storage.get('user').data.user_id,
    passwordLama: '',
    passwordBaru: '',
    ulangiPassword: '',
    isDisabled: true,
    isValidate: false,
    msgValidate: ''
  }

  handleChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  }

  onKeyUpPasswordLama = e => {
    let formData = { user_id: this.state.userId, password: this.state.passwordLama };
    API.post(`${API_SERVER}v1/user/password`, formData).then(res => {
      if(res.status === 200) {
        if (res.data.result.length !== 0) {
          this.setState({ isDisabled: false });
        } else {
          this.setState({ isDisabled: true });
        }
      }
    })
  }

  onSubmitForm = e => {
    e.preventDefault();

    if(this.state.passwordBaru === '' && this.state.ulangiPassword === '') {
      this.setState({ isValidate: false });
    } else {
      this.setState({ isValidate: true });
    }
    
    if(this.state.isValidate) {
      if(this.state.passwordBaru === this.state.ulangiPassword) {
        this.setState({ msgValidate: 'Password sama'});
        let formData = { password: this.state.passwordBaru };
        API.put(`${API_SERVER}v1/user/password/${this.state.userId}`, formData).then(res => {
          if(res.status === 200) {
            localStorage.clear();
            window.location.href = window.location.origin;
          }
        })
      } else {
        this.setState({ passwordBaru: '', ulangiPassword: '', isValidate: false, msgValidate: 'Password tidak sama.' });
      }
    } else{
      this.setState({ msgValidate: 'Password lama tidak sesuai'});
    }
  }

  render() {
    return (
      <div
        id="modalPassword"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="passwordModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content b-r-15"
            style={{ padding: "30px 30px" }}
          >
            <div
              className="modal-header p-b-0"
              style={{ borderBottom: "0 !important" }}
            >
              <h5
                className="modal-title p-t-0 f-21 f-w-bold text-c-black"
                id="exampleModalCenterTitle"
              >
                Ganti Password
              </h5>
            </div>
            <div className="modal-body">
              <form onSubmit={this.onSubmitForm}>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Password Lama
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={this.handleChangeInput}
                    onKeyUp={this.onKeyUpPasswordLama}
                    name="passwordLama"
                    placeholder="Masukan Password Lama Anda"
                  />
                </div>
                <div className="text-center">
                  <hr className="m-t-40" style={{ textAlign: "center" }} />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="passwordBaru"
                    className="form-control"
                    disabled={(this.state.isDisabled) ? 'disabled' : ''}
                    onChange={this.handleChangeInput}
                    placeholder="Masukan Password Baru Anda"
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Ulangi Password Baru
                  </label>
                  <input
                    type="password"
                    name="ulangiPassword"
                    className="form-control"
                    disabled={(this.state.isDisabled) ? 'disabled' : ''}
                    onChange={this.handleChangeInput}
                    placeholder="Ulangi Password Lama Anda"
                  />
                </div>
                { this.state.msgValidate && 
                  <span className="label label-primary">{this.state.msgValidate}</span>
                }
                <div
                  className="modal-footer mt-4 p-b-0"
                  style={{ borderTop: "0 !important" }}
                >
                  <button
                    type="submit"
                    className="btn btn-icademy-primary mt-3"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalPassword;
