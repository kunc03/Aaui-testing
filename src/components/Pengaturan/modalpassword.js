import React, { Component } from "react";

class ModalPassword extends Component {
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
              <form>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Password Lama
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id
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
                    type="text"
                    className="form-control"
                    id
                    placeholder="Masukan Password Baru Anda"
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Ulangi Password Baru
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id
                    placeholder="Ulangi Password Lama Anda"
                  />
                </div>
              </form>
            </div>
            <div
              className="modal-footer mt-4 p-b-0"
              style={{ borderTop: "0 !important" }}
            >
              <button
                type="button"
                className="btn btn-primary btn-block f-18 f-w-bold openalert"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalPassword;
