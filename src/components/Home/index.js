import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import Flickity from 'react-flickity-component';

class Home extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    kategoriKursus: [],
    kursusTerbaru: [],
    kursusDiikuti: [],
  }

  componentDidMount() {
    this.fetchDataUser();
    this.fetchDataKursusDiikuti();
  }

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.fetchDataKategoriKursus(res.data.result.company_id);
        this.fetchDataKursusTerbaru(res.data.result.company_id);
        
        Object.keys(res.data.result).map((key, index) => {
          if(key === 'registered') {
            return res.data.result[key] = res.data.result[key].toString().substring(0,10);
          }
        });
        this.setState({ user: res.data.result});
      }
    })
  }

  fetchDataKategoriKursus(companyId) {
    API.get(`${API_SERVER}v1/category/company/${companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ kategoriKursus: res.data.result.filter(item => { return item.count_course > 0 }) })
      }
    })
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(`${API_SERVER}v1/course/company/${companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ kursusTerbaru: res.data.result.filter(item => { return item.count_chapter > 0 }).slice(0,3) })
      }
    }) 
  }

  fetchDataKursusDiikuti() {
    API.get(`${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`).then(res => {
      if(res.status === 200) {
        this.setState({ kursusDiikuti: res.data.result.reverse().slice(0,6) })
      }
    })
  }

  render() {
    const { user, kategoriKursus, kursusTerbaru, kursusDiikuti } = this.state;

    const CheckMedia = ({ media }) => {
      if (media) {
        let ekSplit = media.split(".");
        let ektension = ekSplit[ekSplit.length - 1];
        if (
          ektension === "jpg" ||
          ektension === "png" ||
          ektension === "jpeg"
        ) {
          return (
            <div>
              <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${media})`}}></div>
            </div>
          );
        } else {
          return (
            <div>
              <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url('https://media.istockphoto.com/videos/play-button-blue-video-id472605657?s=640x640')`}}></div>
            </div>
            
          );
        }
      }
      return null;
    };

    const ListKategori = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div className="row">
            {lists.map((item, i) => (
              <div className="col-sm-4" key={item.category_id}>
                <Link
                  to={
                    ["admin", "superadmin"].includes(
                      Storage.get("user").data.level
                    )
                      ? `/kursus-materi`
                      : `/kategori-kursus/${item.category_id}`
                  }
                >
                  <div className="card">
                  
                    <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${item.category_image})`}}></div>
                  
                    {/* <img
                      className="img-fluid img-kursus radius-top-l-r-5"
                      src={item.category_image}
                      alt="dashboard-user"
                    /> */}
                    <div className="card-carousel ">
                      <div className="title-head f-w-900 f-16">
                        {item.category_name}
                      </div>
                      <small className="mr-3">{item.count_course} Kursus</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <h3 className="f-w-900 f-20">Memuat halaman...</h3>
              </Card.Body>
            </Card>
          </div>
        );
      }
    };

    const ListKursusBaru = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div className="row">
            {
              lists.map((item, i) => (
                <div className="col-sm-12" key={item.course_id}>
                  <Link to={(['admin','superadmin'].includes(Storage.get('user').data.level)) ? `/chapter/${item.course_id}`:`/detail-kursus/${item.course_id}`}>
                    <div className="card">
                      <CheckMedia media={item.thumbnail ? item.thumbnail : item.image} />
                      
                      <div className="card-carousel ">
                        <div className="title-head f-w-900 f-16">
                          {item.title}
                        </div>
                        <small className="mr-3">{item.count_chapter} Chapter</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            }
          </div>
        );
      } else {
        return (
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <h3 className="f-w-900 f-20">Memuat halaman...</h3>
              </Card.Body>
            </Card>
          </div>
        );
      }
    };

    const ListKursusDiikuti = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div className="row">
            {
              lists.map((item, i) => (
                <div className="col-sm-4" key={item.id_user_course}>
                  <Link to={`/detail-kursus/${item.course_id}`}>
                    <div className="card">
                      <div className="box-image">
                        <img
                          className="img-kursus-diikuti"
                          src="assets/images/component/Pattern Geometric-01.png"
                          alt="dashboard-user"
                        />
                        <div className="card-text-title">{item.course.category_name}</div>
                      </div>
                      <div className="card-carousel">
                        <div className="title-head f-16">
                          {item.course.title}
                        </div>
                        <div className="row m-t-50">
                          <div className="col-6">
                            <small className="f-w-600 m-b-10">
                              Tipe
                            </small>
                            <h6>
                              <small className="f-w-600">
                                {item.course.type}
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
                  </Link>
                </div>
              ))
            }
          </div>
        );
      } else {
        return (
          <Card>
            <Card.Body>
              <h3 className="f-w-900 f-20">Anda tidak mengikuti kursus apapun.</h3>
            </Card.Body>
          </Card>
        );
      }
    };

    const ListAktivitas = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <ol className="p-l-40 p-t-30 p-r-40 p-b-30 ">
            {lists.map((item, i) => (
              <div key={item.course_id}>
                <li className="f-16 f-w-800 text-c-black">
                  <Link to={`/detail-kursus/${item.course_id}`}>
                    {item.course.title}
                  </Link>
                </li>
                <table style={{ width: "100%" }}>
                  <ListChapters lists={item.chapters} />
                </table>
              </div>
            ))}
          </ol>
        );
      } else {
        return (
          <h3 className="f-w-900 f-20" style={{margin: '30px'}}>Belum ada aktivitas.</h3>
        );
      }
    };

    const ListChapters = ({lists}) => (
      <tbody>
        {
          lists.map((item, i) => (
            <tr key={item.chapter_id}>
              <th className>{item.chapter_title}</th>
            </tr>
          ))
        }
      </tbody>
    );

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-sm-8">

                      <div className="row">
                        <div className="col-md-12 col-xl-12">
                          <img style={{marginRight: '20px', marginBottom: '20px', float: 'left' }} src='./assets/images/component/Ilustrasi.png' className="img-fluid" width="130px" height="128px" />
                          <div className="page-header-title mb-2">
                            <h3 className="f-w-900" style={{marginTop: '32px'}}>
                              Selamat datang, {user.name}
                            </h3>
                            <h6 className="top mt-5 f-w-900 text-cc-grey">
                              Yuk, kita belajar untuk hari ini...
                            </h6>
                          </div>
                        </div>

                        <div className="col-md-12 col-xl-12" style={{marginBottom: '10px'}}>
                          <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                <i className="fa fa-search"></i>
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              placeholder="Kursus & Materi"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />
                            <InputGroup.Append style={{cursor: 'pointer'}}>
                              <InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
                            </InputGroup.Append>
                          </InputGroup>
                        </div>

                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/`}>
                            <div className="kategori-aktif">
                              <img src="/assets/images/component/kursuson.png" className="img-fluid" />
                              &nbsp;
                              Kursus & Materi
                            </div>
                          </Link>
                        </div>

                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/forum`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/forumoff.png" className="img-fluid" />
                              &nbsp;
                              Forum
                            </div>
                          </Link>
                        </div>

                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/liveclass`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/liveoff.png" className="img-fluid" />
                              &nbsp;
                              Group Meeting
                            </div>
                          </Link>
                        </div>

                      </div>

                      <div className="row" style={{marginTop: '15px'}}>
                        <div className="col-md-12 col-xl-12 mb-3">
                          <div className="row d-flex align-items-center">
                            <div className="col-6">
                              <h3 className="f-w-900 f-20">Kategori Kursus</h3>
                            </div>
                            <div className="col-6 text-right">
                              <p className="m-b-0">
                                <span className="f-w-600 f-16">Lihat Semua</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ListKategori lists={kategoriKursus} />

                      <div className="row">
                        <div className="col-md-12 col-xl-12 mb-3">
                          <div className="row d-flex align-items-center">
                            <div className="col-6">
                              <h3 className="f-w-900 f-20">Kursus yang Diikuti</h3>
                            </div>
                            <div className="col-6 text-right">
                              <p className="m-b-0">
                                <span className="f-w-600 f-16">Lihat Semua</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ListKursusDiikuti lists={kursusDiikuti} />

                    </div>
                    
                    <div className="col-sm-4">
                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-sm-6">
                              <h3 className="f-w-900 f-18">
                                Kursus Terbaru
                              </h3>
                            </div>
                            <div className="col-sm-6 text-right">
                              <p className="m-b-0">
                                <span className="f-w-600 f-16">Lihat Semua</span>
                              </p>
                            </div>
                          </div>
                          <div style={{marginTop: '10px'}}>
                            <ListKursusBaru lists={kursusTerbaru} />
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>


                  {/* BANNER YUK IKUTI */}
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
                              alt="Gambar"
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

                  <div className="row" style={{marginTop: '15px'}}>
                    <div className="col-md-12 col-xl-12 mb-3">
                      <div className="row d-flex align-items-center">
                        {/* <div className="col-6">
                          <h3 className="f-w-900 f-20">Aktivitas Terakhir</h3>
                        </div> */}
                        {/* <div className="col-6 text-right">
                          <p className="m-b-0">
                            <span className="f-w-600 f-16">Lihat Semua</span>
                          </p>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* <div className="col-md-12 col-xl-5">
                      <div className="card">
                        <ListAktivitas lists={kursusDiikuti} />
                      </div>
                    </div> */}

                    <div className="col-md-12 col-xl-7">
                      <div className="card p-35">
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <select
                            className="form-control"
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
