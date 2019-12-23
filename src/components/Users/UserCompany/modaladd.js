import React, { Component } from "react";
import { Form } from 'react-bootstrap';

class ModalAdd extends Component {
  render() {
    return (
      <div
        id="modalAdd"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="editModal"
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
                Tambah Company
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
              <Form>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Nama Company
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id
                    placeholder="nama company"
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Status Company
                  </label>
                  <br/>
                  <Form.Check inline label="Active" type='radio' id={`inline-radio-1`} />
                  <Form.Check inline label="Nonactive" type='radio' id={`inline-radio-2`} />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Logo Company
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                  />
                </div>
              </Form>
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

export default ModalAdd;
