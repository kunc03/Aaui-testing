import React, { Component } from "react";

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
                Add Group
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
                  Nama Grup
                </label>
                <input
                  type="text"
                  className="form-control"
                  id
                  placeholder="Grup indonesia"
                />
              </div>
              <h3 className="f-24 f-w-bold mt-4 mb-4">Hak Akses</h3>
              <div className="row d-flex align-items-center">
                <div className="col-xl-3 col-md-6">
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          User
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Branch
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Category
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Activities
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Kursus
                        </small>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Quiz
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Ujian
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Forum
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Group Meeting
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="pretty p-default p-round p-thick m-b-35">
                    <input type="checkbox" />
                    <div className="state p-success-o">
                      <label className="f-18">
                        <small className="f-w-bold f-18 text-c-black">
                          Group Meeting
                        </small>
                      </label>
                    </div>
                  </div>
                </div>
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

export default ModalAdd;
