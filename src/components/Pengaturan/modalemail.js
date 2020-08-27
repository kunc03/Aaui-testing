import React, { Component } from "react";
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

class ModalEmail extends Component {

  state = {
    userId: Storage.get('user').data.user_id,
    email: Storage.get('user').data.email,

    isDisabled: true,

    emailLama: '',
    emailBaru: '',
    msgEmailBaru: '',
    isEmailBaru: true,
  }

  handleChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleKeyUpEmail = e => {
    if(this.state.email === e.target.value) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  }

  handleKeyUpEmailBaru = e => {
    API.get(`${API_SERVER}v1/user/cek/email/${e.target.value}`).then(res => {
      if(res.status === 200) {
        if(!res.data.error) {
          this.setState({ msgEmailBaru: res.data.result, isEmailBaru: true });
        } else {
          this.setState({ msgEmailBaru: res.data.result, isEmailBaru: false, });
        }
      }
    })
  }

  onSubmitPengaturanEmail = e => {
    e.preventDefault();
    if(!this.state.isEmailBaru) {
      this.setState({ isEmailBaru: false, msgEmaemailBaru: '', emailBaru: '' });
    } else {
      let formData = { email: this.state.emailBaru };
      API.put(`${API_SERVER}v1/user/email/${this.state.userId}`, formData).then(res => {
        if(res.status === 200) {
          localStorage.clear();
          window.location.href = window.location.origin;
        }
      })
    }
  }

  render() {
    return (
      <div
        id="modalEmail"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="emailModal"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content b-r-15"
            style={{ padding: "30px 30px" }}>
            <div
              className="modal-header p-b-0"
              style={{ borderBottom: "0 !important" }}>
              <h5
                className="modal-title p-t-0 f-21 f-w-bold text-c-black"
                id="exampleModalCenterTitle">
                Ganti Email
              </h5>
            </div>
            <div className="modal-body">
              <form onSubmit={this.onSubmitPengaturanEmail}>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Email Lama
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailLama"
                    onChange={this.handleChangeInput}
                    onKeyUp={this.handleKeyUpEmail}
                    placeholder="Masukan Email Lama Anda"
                  />
                </div>
                <div className="text-center">
                  <hr className="m-t-40" style={{ textAlign: "center" }} />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Email Baru
                  </label>
                  <input
                    disabled={(this.state.isDisabled) ? 'disabled':''}
                    type="email"
                    name="emailBaru"
                    onChange={this.handleChangeInput}
                    onKeyUp={this.handleKeyUpEmailBaru}
                    value={this.state.emailBaru}
                    className="form-control"
                    placeholder="Masukan Email Baru Anda"
                  />
                  { this.state.msgEmailBaru && <span className={`label label-${(this.state.isEmailBaru) ? 'success':'danger'}`}>{this.state.msgEmailBaru}</span> }
                </div>
                <div className="modal-footer mt-4 p-b-0" style={{ borderTop: "0 !important" }}>
                  <button type="submit" className="btn btn-icademy-primary ml-2">
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

export default ModalEmail;
