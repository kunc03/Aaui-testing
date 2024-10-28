import React, { Component } from "react";
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from "react-toastify";

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
      if (res.status === 200) {
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

    let isValidate = false;
    if (this.state.passwordBaru === '' && this.state.ulangiPassword === '') {
      this.setState({ isValidate: false });
      isValidate = false
      this.forceUpdate()
    } else {
      isValidate = true
      this.forceUpdate()
    }

    if (isValidate) {
      if (this.state.passwordBaru === this.state.ulangiPassword) {
        let formData = { password: this.state.passwordBaru };
        API.put(`${API_SERVER}v1/user/password/${this.state.userId}`, formData).then(res => {
          if (res.status === 200) {
            this.setState({ msgValidate: 'Password changed successfully', passwordLama: '', passwordBaru: '', ulangiPassword: '' });
            this.forceUpdate()
            toast.success('Password changed successfully')
            // localStorage.clear();
            // window.location.href = window.location.origin;
          }
        })
      } else {
        this.setState({ passwordBaru: '', ulangiPassword: '', isValidate: false, msgValidate: 'Passwords are not the same.' });
      }
    } else {
      this.setState({
        msgValidate: "The old password doesn't match"
      });
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
                Change Password
              </h5>
            </div>
            <div className="modal-body">
              <form onSubmit={this.onSubmitForm}>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={this.state.passwordLama}
                    onChange={this.handleChangeInput}
                    onKeyUp={this.onKeyUpPasswordLama}
                    name="passwordLama"
                    placeholder="Enter your old password"
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="passwordBaru"
                    value={this.state.passwordBaru}
                    className="form-control"
                    disabled={(this.state.isDisabled) ? 'disabled' : ''}
                    onChange={this.handleChangeInput}
                    placeholder="Enter your new password"
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Re-enter New Password
                  </label>
                  <input
                    type="password"
                    name="ulangiPassword"
                    value={this.state.ulangiPassword}
                    className="form-control"
                    disabled={(this.state.isDisabled) ? 'disabled' : ''}
                    onChange={this.handleChangeInput}
                    placeholder="Confirm your new password"
                  />
                </div>
                {this.state.msgValidate &&
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
                    Save
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
