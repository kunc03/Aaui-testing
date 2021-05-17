import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';


import { dataToDo } from '../../modul/data';
import EventNew from './event';
import ProjekNew from './projek';
import CalenderNew from '../kalender/kalender';
// import ListToDoNew from './listToDo';
import RecentDocs from './recentDocs';
import JadwalHariIni from './jadwalHariIni';
import PengumumanTerbaru from './pengumumanTerbaru';
import TugasYangDikerjakan from './tugasYangDikerjakan';
import UjianYangAkanDatang from './ujianYangAkanDatang';
import NewsList from '../news/list';

import 'react-toastify/dist/ReactToastify.css';

import { connect } from 'react-redux';
import { initUser } from '../../actions/user_action';

import DashGuru from './dashguru';
import DashMurid from './dashmurid';
import DashParent from './dashparent';
import DashPrincipal from './dashprincipal';
import DashManagement from './dashmanagement';

// import Training from '../training/company'
// import TrainingUser from '../training/user'
import TrainingCourse from '../training/course'
import TrainingDetailCompany from '../training/company/detailTrainingCompany'

class HomeNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    event: [],
    project: [],
    findCourseInput: "",
    kategoriKursus: [],
    kursusTerbaru: [],
    kursusDiikuti: [],
    recentDocs: []
  }

  onChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  componentDidMount() {
    this.props.initUser();
    this.fetchDataUser();
    this.fetchDataKursusDiikuti();
    this.fetchEvent();


  }

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {

        this.fetchDataKategoriKursus(
          localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id
        );
        this.fetchDataKursusTerbaru(
          localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id
        );

        Object.keys(res.data.result).map((key, index) => {
          if (key === 'registered') {
            return res.data.result[key] = res.data.result[key].toString().substring(0, 10);
          }
        });

        this.setState({ user: res.data.result });
      }
    })
  }

  fetchDataKategoriKursus(companyId) {
    API.get(`${API_SERVER}v1/category/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : companyId}`).then(res => {
      if (res.status === 200) {
        this.setState({ kategoriKursus: res.data.result.filter(item => { return item.count_course > 0 }) })
      }
    })
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(`${API_SERVER}v1/course/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : companyId}`).then(res => {
      if (res.status === 200) {
        this.setState({ kursusTerbaru: res.data.result.filter(item => { return item.count_chapter > 0 }).slice(0, 3) })
      }
    })
  }

  fetchDataKursusDiikuti() {
    API.get(`${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        this.setState({ kursusDiikuti: res.data.result.reverse().slice(0, 6) })
      }
    })
  }

  fetchEvent() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/event/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
          this.setState({ event: response.data.result });
        }).catch(function (error) {
          console.log(error);
        });
      }
    })

    // recent docs
    API.get(`${API_SERVER}v1/files-logs`).then(res => {
      if (!res.data.error) {
        this.setState({ recentDocs: res.data.result });
      };
    });
  }

  findCourse = (e) => {
    e.preventDefault();
    this.setState({ findCourseInput: e.target.value });
  }

  render() {
    const eventDashboard = this.state.event;
    const projekDashboard = this.state.project;
    // const toDoDashboard = dataToDo;

    // let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    console.log(levelUser);

    var { kategoriKursus, kursusTerbaru, kursusDiikuti, findCourseInput } = this.state;
    if (findCourseInput !== "") {
      [kategoriKursus, kursusTerbaru, kursusDiikuti] = [kategoriKursus, kursusTerbaru, kursusDiikuti]
        .map(y =>
          y.filter(x =>
            JSON.stringify(
              Object.values(x)
            ).replace(
              /[^\w ]/g, ''
            ).match(new RegExp(findCourseInput, "gmi"))
          )
        );
    }

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
              <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url(${media})` }}></div>
            </div>
          );
        } else {
          return (
            <div>
              <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url('https://media.istockphoto.com/videos/play-button-blue-video-id472605657?s=640x640')` }}></div>
            </div>

          );
        }
      }
      return null;
    };

    // const ListKursusBaru = ({lists}) => {
    //   if(lists.length !== 0) {
    //     return (
    //       <div className="row">
    //         {
    //           lists.map((item, i) => (
    //             <div className="col-sm-12" key={item.course_id}>
    //               <Link to={(['admin','superadmin'].includes(Storage.get('user').data.level)) ? `/chapter/${item.course_id}`:`/detail-kursus/${item.course_id}`}>
    //                 <div className="card">
    //                   <CheckMedia media={item.thumbnail ? item.thumbnail : item.image} />

    //                   <div className="card-carousel ">
    //                     <div className="title-head f-w-900 f-16">
    //                       {item.title}
    //                     </div>
    //                     <small className="mr-3">{item.count_chapter} Chapter</small>
    //                   </div>
    //                 </div>
    //               </Link>
    //             </div>
    //           ))
    //         }
    //       </div>
    //     );
    //   } else {
    //     return findCourseInput
    //     ? (
    //       <div className="col-sm-12">
    //         <Card>
    //           <Card.Body>
    //             <h3 className="f-w-900 f-20">Tidak ditemukan kursus &quot;{findCourseInput}&quot;</h3>
    //           </Card.Body>
    //         </Card>
    //       </div>
    //     )
    //     : (
    //       <div className="col-sm-12">
    //         <Card>
    //           <Card.Body>
    //             <h3 className="f-w-900 f-20">Memuat halaman...</h3>
    //           </Card.Body>
    //         </Card>
    //       </div>
    //     );
    //   }
    // };


    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  {/* DASHBOARD CLIENT ===  levelUser, sementara dimatiin di production */}
                  {levelUser === 'clientlearning' ?
                    <div className="row">
                      <div className='col-sm-12 col-xl-6' style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <div className="col-sm-12">
                          <Card>
                            <Card.Body className="responsive-card-400 ">
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Schedule today
                                  </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    <Link to={""}>
                                      <span className=" f-12 fc-skyblue">See all</span>
                                    </Link>
                                  </p>
                                </div>
                              </div>
                              <div style={{ marginTop: '10px' }}>
                                <JadwalHariIni />
                              </div>
                            </Card.Body>
                          </Card>
                        </div>

                        <div className="col-sm-12">
                          <Card>
                            <Card.Body className="responsive-card-400 ">
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Latest Announcements
                                    </h3>
                                </div>
                              </div>
                              <div style={{ marginTop: '10px' }}>
                                <PengumumanTerbaru />
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>

                      <div className='col-sm-12 col-xl-6' style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <div className="col-sm-12">
                          <Card>
                            <Card.Body className="responsive-card-400 ">
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Completed task
                                  </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    <Link to={""}>
                                      <span className=" f-12 fc-skyblue">See all</span>
                                    </Link>
                                  </p>
                                </div>
                              </div>
                              <div style={{ marginTop: '10px' }}>
                                <TugasYangDikerjakan />
                              </div>
                            </Card.Body>
                          </Card>
                        </div>

                        <div className="col-sm-12">
                          <Card>
                            <Card.Body className="responsive-card-400 ">
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Upcoming Exams
                                    </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    <Link to={""}>
                                      <span className=" f-12 fc-skyblue">See all</span>
                                    </Link>
                                  </p>
                                </div>
                              </div>
                              <div style={{ marginTop: '10px' }}>
                                <UjianYangAkanDatang />
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>

                      <div className="col-sm-12">
                        <CalenderNew lists={kursusTerbaru} />
                      </div>
                    </div>
                    :

                    // ======= DASHBOARD ADMIN ======
                    <div className="row">
                      <div className='col-sm-12 col-xl-6' style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Event
                                  </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <EventNew lists={eventDashboard} />
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                        <div className="col-sm-12">
                          <CalenderNew lists={kursusTerbaru} />
                        </div>
                        <div className="col-sm-12">
                          <NewsList widgetMode={true} />
                        </div>
                      </div>
                      <div className="col-sm-12 col-xl-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Project
                                  </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    <Link to={"project"}>
                                      <span className=" f-12 fc-skyblue">See all</span>
                                    </Link>
                                  </p>
                                </div>
                              </div>
                              <div style={{ marginTop: '10px', overflowX: 'hidden', height: '385px' }}>
                                <ProjekNew lists={projekDashboard} />
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Recently Accessed Documents
                                  </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                                  </p>
                                </div>
                              </div>
                              <div style={{ overflowX: 'auto', height: '385px' }}>

                                <RecentDocs lists={this.state.recentDocs} />

                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                        {/* <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <div className="row">
                                <div className="col-sm-6">
                                  <h3 className="f-w-900 f-18 fc-blue">
                                    Things To Do
                                  </h3>
                                </div>
                                <div className="col-sm-6 text-right">
                                  <p className="m-b-0">
                                    <span className="f-w-600 f-16">Lihat Semua</span>
                                  </p>
                                </div>
                              </div>
                              <div style={{ marginTop: '10px' }}>
                                <ListToDoNew lists={toDoDashboard} />
                              </div>
                            </Card.Body>
                          </Card>
                        </div> */}

                        {/* <div className="col-sm-12">
                          <Card style={{ backgroundColor: '#F3F3F3' }}>

                            <div className="col-sm-12">
                              <Card style={{ backgroundColor: '#F3F3F3' }}>

                                <div className="widget-center">
                                  <img src='newasset/Combined Shape.svg' style={{ position: 'absolute', top: '8pc' }}></img>

                                  <p style={{ marginTop: '55px' }}>Add Widget</p>
                                </div>

                              </Card>
                            </div>

                          </Card>
                        </div> */}

                      </div>
                    </div>

                  }


                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.user;
}

const mapDispatchToProps = dispatch => ({
  initUser: () => dispatch(initUser())
})

const HomeNewProps = connect(mapStateToProps, mapDispatchToProps)(HomeNew);

class HomeV2 extends Component {

  state = {
    level: Storage.get('user').data.level,
    grupId: Storage.get('user').data.grup_id,
    grupName: Storage.get('user').data.grup_name,
    training_company_id: ''
  }

  componentDidMount() {

    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
    if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training') {
      API.get(`${API_SERVER}v2/training/user/read/user/${Storage.get('user').data.user_id}`).then(res => {
        if (res.status === 200) {
          this.setState({ training_company_id: res.data.result.training_company_id });
        }
      })
    }
  }

  goTo(url) {
    if (url === 'back') {
      this.props.history.goBack();
    }
    else {
      this.props.history.push(url);
    }
  }

  render() {
    if (this.state.level === "client") {
      if (this.state.grupName.toLowerCase() === "guru") {
        return (
          <DashGuru />
        )
      } else if (this.state.grupName.toLowerCase() === "murid") {
        return (
          <DashMurid />
        )
      } else if (this.state.grupName.toLowerCase() === "parents") {
        return (
          <DashParent />
        )
      } else if (this.state.grupName.toLowerCase() === "principal") {
        return (
          <DashPrincipal />
        )
      } else if (this.state.grupName.toLowerCase() === "management") {
        return (
          <DashManagement />
        )
      } else if (this.state.grupName.toLowerCase() === "user training") {
        return (
          <TrainingCourse />
        )
      } else if (this.state.grupName.toLowerCase() === "admin training") {
        return (
          <TrainingDetailCompany goTo={this.goTo.bind(this)} id={this.state.training_company_id} />
        )
      } else {
        return (
          <HomeNewProps />
        )
      }
    } else {
      return (
        <HomeNewProps />
      )
    }
  }

}

export default HomeV2;
