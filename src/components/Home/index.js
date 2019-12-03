import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);

    this.onClickLogout = this.onClickLogout.bind(this);
  }

  onClickLogout(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = window.location.origin;
  }

  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-md-12 col-xl-12">
                      <div className="page-header-title mb-2">
                        <h3 onClick={this.onClickLogout} className="f-w-900 ">
                          Selamat datang, Rakaal!
                        </h3>
                        <h6 className="top mt-5 f-w-900 text-cc-grey">
                          Yuk, kita belajar untuk hari ini...
                        </h6>
                      </div>
                    </div>
                    <div className="col-md-4 col-xl-4">
                      <div className="card">
                        <div className="card-block card-profile">
                          <div className="row align-items-center justify-content-center">
                            <div className="col-auto">
                              <i className="fa fa-calendar f-30 circle-icon-green" />
                            </div>
                            <div className="col">
                              <small className="f-w-900">
                                Tanggal Bergabung
                              </small>
                              <h5 className="f-w-900">23/08/2019</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-xl-4">
                      <div className="card">
                        <div className="card-block card-profile">
                          <div className="row align-items-center justify-content-center">
                            <div className="col-auto">
                              <i className="fa fa-image f-30 circle-icon-orange" />
                            </div>
                            <div className="col">
                              <small className="f-w-900">Tanggal Kursus</small>
                              <h5 className="f-w-900">200</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-xl-4">
                      <div className="card">
                        <div className="card-block card-profile">
                          <div className="row align-items-center justify-content-center">
                            <div className="col-auto">
                              <i className="fa fa-clock f-30 circle-icon-pink" />
                            </div>
                            <div className="col">
                              <small className="f-w-900">Jumlah Waktu</small>
                              <h5 className="f-w-900">24</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-xl-12 mb-3">
                      <div className="row d-flex align-items-center">
                        <div className="col-6">
                          <h3 className="f-w-900 f-24">Pilihan Kursus</h3>
                        </div>
                        <div className="col-5 text-right">
                          <p className="m-b-0">
                            <i className="fa fa-filter" />
                            <select className="mr-4" name id>
                              <option value>Filter</option>
                            </select>
                            <span className="f-w-600 f-16">See All</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-12 mb-3">
                      <div
                        className="carousel"
                        data-flickity='{ "freeScroll": true, "contain": true,"cellAlign": "left", "prevNextButtons": false, "pageDots": false }'
                      >
                        <div className="carousel-cell">
                          <div className="card">
                            <img
                              className="img-fluid img-kursus radius-top-l-r-5"
                              src="assets/images/component/p5.jpg"
                              alt="dashboard-user"
                            />
                            <div className="card-carousel ">
                              <div className="title-head f-w-900 f-16">
                                TEKNOLOGI
                              </div>
                              <small className="mr-3">12 Videos</small>
                              <small>24 Hours</small>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <img
                              className="img-fluid img-kursus radius-top-l-r-5"
                              src="assets/images/component/p5.jpg"
                              alt="dashboard-user"
                            />
                            <div className="card-carousel ">
                              <div className="title-head f-w-900 f-16">
                                TEKNOLOGI
                              </div>
                              <small className="mr-3">12 Videos</small>
                              <small>24 Hours</small>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <img
                              className="img-fluid img-kursus radius-top-l-r-5"
                              src="assets/images/component/p5.jpg"
                              alt="dashboard-user"
                            />
                            <div className="card-carousel ">
                              <div className="title-head f-w-900 f-16">
                                TEKNOLOGI
                              </div>
                              <small className="mr-3">12 Videos</small>
                              <small>24 Hours</small>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <img
                              className="img-fluid img-kursus radius-top-l-r-5"
                              src="assets/images/component/p5.jpg"
                              alt="dashboard-user"
                            />
                            <div className="card-carousel ">
                              <div className="title-head f-w-900 f-16">
                                TEKNOLOGI
                              </div>
                              <small className="mr-3">12 Videos</small>
                              <small>24 Hours</small>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <img
                              className="img-fluid img-kursus radius-top-l-r-5"
                              src="assets/images/component/p5.jpg"
                              alt="dashboard-user"
                            />
                            <div className="card-carousel ">
                              <div className="title-head">Teknologi</div>
                              <small className="mr-3">12 Videos</small>
                              <small>24 Hours</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-xl-12 mb-3">
                      <div className="row d-flex align-items-center">
                        <div className="col-6">
                          <h3 className="f-w-900 f-24">
                            Kursus yang harus diikuti
                          </h3>
                        </div>
                        <div className="col-5 text-right">
                          <p className="m-b-0">
                            <span className="f-w-600 f-16">See All</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-12 mb-3">
                      <div
                        className="carousel"
                        data-flickity='{ "freeScroll": true, "contain": true,"cellAlign": "left", "prevNextButtons": false, "pageDots": false }'
                      >
                        <div className="carousel-cell">
                          <div className="card">
                            <div className="box-image">
                              <img
                                className="img-kursus-diikuti"
                                src="assets/images/component/Pattern Geometric-01.png"
                                alt="dashboard-user"
                              />
                              <div className="card-text-title">DESAIN</div>
                            </div>
                            <div className="card-carousel">
                              <div className="title-head f-16">
                                Cara Membuat Design Dengan Menggunakan Adobe
                              </div>
                              <div className="row m-t-50">
                                <div className="col-6">
                                  <small className="f-w-600 m-b-10">
                                    Mentor
                                  </small>
                                  <h6>
                                    <small className="f-w-600">
                                      Muhammad Abail
                                    </small>
                                  </h6>
                                </div>
                                <div className="col-6">
                                  <div className="progress m-b-10">
                                    <div
                                      className="progress-bar progress-c-yellow"
                                      role="progressbar"
                                      style={{ width: "40%", height: 6 }}
                                      aria-valuenow={60}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    />
                                  </div>
                                  <small className="f-w-600">
                                    Proses (20%)
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <div className="box-image">
                              <img
                                className="img-kursus-diikuti"
                                src="assets/images/component/Pattern Geometric-02.png"
                                alt="dashboard-user"
                              />
                              <div className="card-text-title">MARKETING</div>
                            </div>
                            <div className="card-carousel">
                              <div className="title-head f-16">
                                Cara Membuat Design Dengan Menggunakan Adobe
                              </div>
                              <div className="row m-t-50">
                                <div className="col-6">
                                  <small className="f-w-600 m-b-10">
                                    Mentor
                                  </small>
                                  <h6>
                                    <small className="f-w-600">
                                      Muhammad Abail
                                    </small>
                                  </h6>
                                </div>
                                <div className="col-6">
                                  <div className="progress m-b-10">
                                    <div
                                      className="progress-bar progress-c-purple"
                                      role="progressbar"
                                      style={{ width: "40%", height: 6 }}
                                      aria-valuenow={60}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    />
                                  </div>
                                  <small className="f-w-600">
                                    Proses (20%)
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <div className="box-image">
                              <img
                                className="img-kursus-diikuti"
                                src="assets/images/component/Pattern Geometric-01.png"
                                alt="dashboard-user"
                              />
                              <div className="card-text-title">TEKNOLOGI</div>
                            </div>
                            <div className="card-carousel">
                              <div className="title-head f-16">
                                Cara Membuat Design Dengan Menggunakan Adobe
                              </div>
                              <div className="row m-t-50">
                                <div className="col-6">
                                  <small className="f-w-600 m-b-10">
                                    Mentor
                                  </small>
                                  <h6>
                                    <small className="f-w-600">
                                      Muhammad Abail
                                    </small>
                                  </h6>
                                </div>
                                <div className="col-6">
                                  <div className="progress m-b-10">
                                    <div
                                      className="progress-bar progress-c-yellow"
                                      role="progressbar"
                                      style={{ width: "40%", height: 6 }}
                                      aria-valuenow={60}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    />
                                  </div>
                                  <small className="f-w-600">
                                    Proses (20%)
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="carousel-cell">
                          <div className="card">
                            <div className="box-image">
                              <img
                                className="img-kursus-diikuti"
                                src="assets/images/component/Pattern Geometric-01.png"
                                alt="dashboard-user"
                              />
                              <div className="card-text-title">BISNIS</div>
                            </div>
                            <div className="card-carousel">
                              <div className="title-head f-16">
                                Cara Membuat Design Dengan Menggunakan Adobe
                              </div>
                              <div className="row m-t-50">
                                <div className="col-6">
                                  <small className="f-w-600 m-b-10">
                                    Mentor
                                  </small>
                                  <h6>
                                    <small className="f-w-600">
                                      Muhammad Abail
                                    </small>
                                  </h6>
                                </div>
                                <div className="col-6">
                                  <div className="progress m-b-10">
                                    <div
                                      className="progress-bar progress-c-yellow"
                                      role="progressbar"
                                      style={{ width: "40%", height: 6 }}
                                      aria-valuenow={60}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    />
                                  </div>
                                  <small className="f-w-600">
                                    Proses (20%)
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-xl-12">
                      <div
                        className="card"
                        style={{ position: "relative", overflow: "hidden" }}
                      >
                        <img
                          src="assets/images/component/Ilustrasi.png"
                          style={{
                            position: "absolute",
                            right: "5%",
                            bottom: "-115px",
                            width: 394,
                            height: 366,
                            opacity: "0.1"
                          }}
                          alt=""
                        />
                        <div className="row">
                          <div className="col-xl-2 text-center">
                            <img
                              className="img-radius p-1"
                              style={{ width: 136, height: 136 }}
                              src="assets/images/component/Ilustrasi.png"
                            />
                          </div>
                          <div className="col-xl-7">
                            <div className="media-body p-t-30 p-l-10 p-b-10 p-r-10">
                              <h5 className="chat-header f-w-800 f-24">
                                Yuk, Coba Test Kemampuan Kamu Sekarang !{" "}
                              </h5>
                              <div style={{ width: "50%" }}>
                                <small className="d-block text-c-grey f-w-600 f-16">
                                  Yuk, Coba Test Kemampuan Kamu Sudah Sesuai
                                  Atau Belum !
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 col-xl-3">
                            <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-center">
                              <button
                                type="button"
                                className="btn f-w-600 f-14 text-c-white bg-c-purple-ideku shadow-box"
                                title="btn btn-primary"
                                data-toggle="tooltip"
                              >
                                Mulai Sekarang
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-xl-12 mb-3">
                      <div className="row d-flex align-items-center">
                        <div className="col-6">
                          <h3 className="f-w-900 f-24">Aktivitas Terakhir</h3>
                        </div>
                        <div className="col-5 text-right">
                          <p className="m-b-0">
                            <span className="f-w-600 f-16">See All</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-xl-5">
                      <div className="card">
                        <ol className="p-l-40 p-t-30 p-r-40 p-b-30 ">
                          <li className="f-16 f-w-800 text-c-black">Design</li>
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr className>
                                <th className> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                            </tbody>
                          </table>
                          <li className="f-16 f-w-800 text-c-black m-t-5">
                            Teknologi
                          </li>
                          <table
                            style={{
                              padding: "50px !important",
                              width: "100%"
                            }}
                          >
                            <tbody>
                              <tr className>
                                <th className> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                              <tr>
                                <th> Chapter 1 - Judul Materi 1</th>
                                <th className="text-right"> 00:30:00</th>
                              </tr>
                            </tbody>
                          </table>
                        </ol>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-7">
                      <div className="card p-35">
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <select
                            name
                            id
                            style={{ position: "absolute", right: 0 }}
                          >
                            <option value="november">November 2019</option>
                            <option value="november">Desember 2019</option>
                            <option value="november">Januari 2020</option>
                            <option value="november">Febriari 2020</option>
                          </select>
                          <canvas id="canvas" />
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

export default Home;
