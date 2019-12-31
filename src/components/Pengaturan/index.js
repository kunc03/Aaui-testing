import React, { Component } from "react";
import ModalEmail from "./modalemail";
import ModalPassword from "./modalpassword";

class Pengaturan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

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
                      <h3 className="f-36 f-w-bold mb-3">Pengaturan Anda !</h3>
                      <div className="card">
                        <div className="card-block">
                          <div className="row m-b-100">
                            <div className="col-xl-2">
                              <h3 className="pengaturan-title f-24 f-w-bold">
                                Keamanan
                              </h3>
                            </div>
                            <div
                              className="col-xl-10 p-l-30"
                              style={{ borderLeft: "black solid 1px" }}
                            >
                              <form>
                                <div className="form-group">
                                  <label className="label-input" htmlFor>
                                    Email
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder="Masukan Email Lama Anda"
                                      aria-label="emailModel"
                                      aria-describedby="basic-addon2"
                                    />
                                    <div className="input-group-append">
                                      <button
                                        className="btn btn-ideku"
                                        data-toggle="modal"
                                        data-target="#modalEmail"
                                        type="button"
                                      >
                                        Ganti
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="label-input" htmlFor>
                                    Password Baru
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="password"
                                      className="form-control"
                                      placeholder="**********"
                                      aria-label="**********"
                                      aria-describedby="basic-addon2"
                                    />
                                    <div className="input-group-append">
                                      <span
                                        className="input-group-text"
                                        id="basic-addon2"
                                      >
                                        <i className="fa fa-eye text-c-grey" />
                                      </span>
                                      <button
                                        className="btn btn-ideku"
                                        data-toggle="modal"
                                        data-target="#modalPassword"
                                        type="button"
                                      >
                                        Ganti
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xl-2 col-md-12">
                              <h3 className="pengaturan-title f-24 f-w-bold">
                                Keamanan
                              </h3>
                            </div>
                            <div
                              className="col-xl-10 col-md-12 p-l-30"
                              style={{ borderLeft: "black solid 1px" }}
                            >
                              <form className="mt-2">
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi setelah mendaftar kursus
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan setelah selesai kursus
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan setelah mendaftar Kelas
                                        (Langsung)
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konformasi pesan setelah Kelas (Langsung
                                        berakhir)
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konfirmasi pesan saat pengguna lain
                                        mengirimkan aktivitas dalam diskusi
                                        forum
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Konformasi pesan ketika materi baru
                                        ditambahkan
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Pengingat kelas (langsung) akan dimulai
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Pengingat akan kadaluarsa
                                      </small>
                                    </label>
                                  </div>
                                </div>
                                <br />
                                <div className="pretty p-default p-round p-thick m-b-35">
                                  <input type="checkbox" />
                                  <div className="state p-success-o">
                                    <label
                                      className="f-18 "
                                      style={{
                                        whiteSpace: "normal !important"
                                      }}
                                    >
                                      <small className="f-w-bold f-18 text-c-black small-text">
                                        Pengingat forum akan ditutup
                                      </small>
                                    </label>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-block m-t-100 f-20 f-w-600"
                          >
                            Simpan
                          </button>
                        </div>
                        <ModalEmail
                          show={this.state.isOpen}
                          onClose={this.toggleModal}
                        >
                          `Here's some content for the modal`
                        </ModalEmail>
                        <ModalPassword
                          show={this.state.isOpen}
                          onClose={this.toggleModal}
                        >
                          `Here's some content for the modal`
                        </ModalPassword>
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

export default Pengaturan;
