import React, { Component } from "react";

class Profile extends Component {
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
                      <h3 className="f-36 f-w-bold mb-3">Profile Anda !</h3>
                      <div className="card">
                        <div className="card-block">
                          <div className="text-center mt-5 mb-5">
                            <img
                              src="https://chibi-akihabara.com/14679-large_default/fatestay-night-figurine-saber-alter-nendoroid-super-movable-edition.jpg"
                              alt
                              className="rounded-circle img-profile mb-4"
                            />
                            <br />
                            <a
                              href="#"
                              className="btn btn-ideku f-16 f-w-bold"
                              style={{ width: 180, padding: "15px 0" }}
                            >
                              Ganti
                            </a>
                          </div>
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
                                Nomor Identitas
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder={3329980118901291}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Alamat
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder="Sunburst CBD Lot II No. 3, BSD City (021) 22356800, Lengkong Gudang, Serpong Sub-District, South Tangerang City, Banten 15321"
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input" htmlFor>
                                Nomor Handphone
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id
                                placeholder={081247959214}
                              />
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary btn-block m-t-100 f-20 f-w-600"
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

export default Profile;
