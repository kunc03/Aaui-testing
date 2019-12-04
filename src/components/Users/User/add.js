import React, { Component } from "react";

class UserAdd extends Component {
  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800">Tambah User Management</h3>
                      <div className="card">
                        <div className="card-block">
                          <form>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nama
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="Rajaka Kauthar Allam"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nomor Induk
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="210-1971-74"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Cabang
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="Cyprus"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Group
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="Limit"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Email
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="rakaal@gmail.com"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Phone
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="081-247-9592"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Validity
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="01/06/2019"
                              />
                            </div>
                            {/* <button
                      type="submit"
                      class="btn btn-primary btn-block m-t-100 f-20 f-w-600 openAlert"
                    >
                      Simpan
                    </button> */}
                            <button
                              type="button"
                              className="btn btn-primary btn-block m-t-100 f-20 f-w-600"
                              data-toggle="modal"
                              data-target="#modalAlert"
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

export default UserAdd;
