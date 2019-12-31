import React, { Component } from "react";
import API, { API_SERVER } from '../../repository/api';

class ModalEmail extends Component {
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
              <form>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Email Lama
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id
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
                    type="text"
                    className="form-control"
                    id
                    placeholder="Masukan Email Baru Anda"
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
                className="btn btn-primary btn-block f-18 f-w-bold openConfirm"
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

export default ModalEmail;
