import React, { Component } from "react";

class Modal extends Component {
  render() {
    return (
      <div
        id="modalAdd"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="addModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div
            className="modal-content b-r-15"
            style={{ padding: "30px 50px" }}
          >
            <div
              className="modal-header p-b-0"
              style={{ borderBottom: "0 !important" }}
            >
              <h5
                className="modal-title p-t-0 f-21 f-w-bold text-c-black"
                id="exampleModalCenterTitle"
              >
                Tambah Cabang
              </h5>
              <a href="#" title="Delete" className="openDelete">
                <img
                  src="assets/images/component/Delete-1.png"
                  className="img-icon-delete"
                  alt="Delete"
                />
              </a>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="label-input" htmlFor>
                  Nama
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={this.onChangeBranch}
                  placeholder="Branch Name"
                />
              </div>
            </div>
            <div
              className="modal-footer p-b-0"
              style={{ borderTop: "0 !important" }}
            >
              <button
                type="button"
                className="btn btn-primary btn-block f-18 f-w-bold openalertedit"
              >
                Simpan
              </button>
            </div>
            <div
              className="modal-footer p-t-1"
              style={{ borderTop: "0 !important" }}
            >
              <button
                type="button"
                className="btn btn-block bg-c-white text-c-grey3 f-18 f-w-bold"
                data-dismiss="modal"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
