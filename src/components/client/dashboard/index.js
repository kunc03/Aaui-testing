import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from 'react-bootstrap';
import API, {USER_ME, API_SERVER} from '../../../repository/api';
import Storage from '../../../repository/storage';

import {dataEvent, dataToDo} from './data';
import EventNew from './event';
import ProjekNew from './projek';
import CalenderNew from './kalender';
import ListToDoNew from './listToDo';

class HomeNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    event: [],
    findCourseInput: "",
    kategoriKursus: [],
    kursusTerbaru: [],
    kursusDiikuti: [],

    dataProjek: [],
  }

  async componentDidMount() {
    this.fetchDataUser();
    this.fetchDataKursusDiikuti();
  }

  fetchDataProject(companyId) {
    let url = `${API_SERVER}v1/project/client/${Storage.get('user').data.user_id}/${companyId}`;
    API.get(url).then(res => {
      if(res.data.error) console.log('RES: ', res.data);

      console.log('STATE: ', res.data);
      this.setState({ dataProjek: res.data.result });
    })
  }

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.fetchDataKategoriKursus(
          localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id
        );
        this.fetchDataKursusTerbaru(
          localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id
        );
        
        Object.keys(res.data.result).map((key, index) => {
          if(key === 'registered') {
            return res.data.result[key] = res.data.result[key].toString().substring(0,10);
          }
        });
        this.setState({ user: res.data.result});

        this.fetchDataProject(res.data.result.company_id);
      }
    })
  }

  fetchDataKategoriKursus(companyId) {
    API.get(`${API_SERVER}v1/category/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ kategoriKursus: res.data.result.filter(item => { return item.count_course > 0 }) })
      }
    })
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(`${API_SERVER}v1/course/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ kursusTerbaru: res.data.result.filter(item => { return item.count_chapter > 0 }).slice(0,3) })
      }
    }) 
  }

  fetchDataKursusDiikuti() {
    API.get(`${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`).then(res => {
      if(res.status === 200) {
        console.log('resssssss',res)
        this.setState({ kursusDiikuti: res.data.result.reverse().slice(0,6) })
      }
    })
  }

  findCourse = (e) => {
    e.preventDefault();
    this.setState({findCourseInput : e.target.value});
  }

  render() {
    const eventDashboard = dataEvent;
    const projekDashboard = this.state.dataProjek;
    const toDoDashboard = dataToDo;

    var { kategoriKursus, kursusTerbaru, kursusDiikuti, findCourseInput } = this.state;
    if(findCourseInput != ""){      
      [kategoriKursus, kursusTerbaru, kursusDiikuti] = [kategoriKursus, kursusTerbaru, kursusDiikuti]
        .map(y=>
          y.filter(x=>
            JSON.stringify(
              Object.values(x)
            ).replace(
              /[^\w ]/g,''
            ).match(new RegExp(findCourseInput,"gmi"))
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
        return findCourseInput 
        ? (
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <h3 className="f-w-900 f-20">Tidak ditemukan kursus &quot;{findCourseInput}&quot;</h3>
              </Card.Body>
            </Card>
          </div>
        ) 
        : (
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

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">                     
                    <div className="col-sm-6">
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
                          <div style={{marginTop: '10px'}}>
                            <EventNew lists={eventDashboard} />
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-sm-6">
                              <h3 className="f-w-900 f-18 fc-blue">
                                Projek
                              </h3>
                            </div>
                            <div className="col-sm-6 text-right">
                              <p className="m-b-0">
                                <span className="f-w-600 f-16 fc-skyblue">
                                  <Link to={`/project`}>
                                    Lihat Semua
                                  </Link>
                                </span>
                              </p>
                            </div>
                          </div>
                          <div style={{marginTop: '10px'}}>
                            <div className="wrap" style={{maxHeight:'258px', overflowY:'scroll', overflowX:'hidden'}}>
                              <ProjekNew lists={projekDashboard} />
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>

                  <div className="row">                     
                    <div className="col-sm-6">
                      <CalenderNew lists={kursusTerbaru} />
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-sm-6">
                              <h3 className="f-w-900 f-18 fc-blue">
                                To Do
                              </h3>
                            </div>
                            <div className="col-sm-6 text-right">
                              <p className="m-b-0">
                                {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                              </p>
                            </div>
                          </div>
                          <div style={{marginTop: '10px'}}>
                            <ListToDoNew lists={toDoDashboard} />
                          </div>
                        </Card.Body>
                      </Card>
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

export default HomeNew;
