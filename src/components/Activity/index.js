import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import RiwayatKursus from './riwayatkursus';
import RiwayatForum from './riwayatforum';
import RiwayatLiveClass from './riwayatliveclass';
import { Doughnut,Bar, Line, Pie } from 'react-chartjs-2';
import {dataBar, dataUser, dataSpeaker, dataPie} from './data';

const tabs =[
  {title : 'Riwayat Kursus' },
  {title : 'Riwayat Forum' },
  {title : 'Group Meeting' },
]

class Aktivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex : 1,
      user: {
        name: 'AKTIVITAS',
        registered: '2019-12-09',
        companyId: '',
      },
      companyName:'',
      branchName:'',
      groupName:'',
      chartData:'',
      kategoriKursus: [],
      kursusTerbaru: [],
      kursusDiikuti: [],
      recentCourse: [],
      recentClass: [],
      recentForum: [],
      recentLogin: [],
      today : '',
      calendarItems:[],
      loading:true,

      tanggalCoba : [{id:1, date : '21 April 2020 - 22 April 2020'},{id:2, date : '23 April 2020 - 24 April 2020'}]
    }
    this.tabAktivitas = this.tabAktivitas.bind(this)
  }

  componentDidMount() {
    this.fetchDataUser();
    this.fetchHistoryActivity(Storage.get('user').data.user_id);
    this.fetchDataKursusDiikuti();
    this.fetchUserCalendar();
    console.log('RECENTS DID',this.state.recentCourse)
    let date = new Date();
    console.log(String(date));
    this.setState({today:String(date)})
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
        API.get(`${API_SERVER}v1/company/${res.data.result.company_id}`).then(res => {
          if(res.status === 200) {
            this.setState({ companyName: res.data.result.company_name });
          }
        });
        API.get(`${API_SERVER}v1/branch/${res.data.result.branch_id}`).then(res => {
          if(res.status === 200) {
            this.setState({ branchName: res.data.result.branch_name });
          }
        });
        API.get(`${API_SERVER}v1/grup/${res.data.result.grup_id}`).then(res => {
          if(res.status === 200) {
            this.setState({ groupName: res.data.result.grup_name });
            console.log('states',res.data.result)
          }
        });
        API.get(`${API_SERVER}v1/user/activity/${res.data.result.grup_id}`).then(res => {
          if(res.status === 200) {
            this.setState({ chartData: res.data.result });
          }
        });
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

  fetchUserCalendar(){
    API.get(`${API_SERVER}v1/agenda/${Storage.get('user').data.user_id}`).then(res => {
      if(res.status === 200) {
        this.setState({ calendarItems: res.data.result })
      }
    })    
  }

  tabAktivitas(a,b){
    this.setState({tabIndex: b+1});
  }


  fetchHistoryActivity(user_id){
    API.get(`${API_SERVER}v1/api-activity/history/${user_id}`).then(res => {
      if(res.status === 200) {
        var {result} = res.data
        var recentCourse = result.filter(x=>x.tipe == 'course');
        var recentForum = result.filter(x=>x.tipe == 'forum');
        var recentClass = result.filter(x=>x.tipe == 'liveclass');
        var recentLogin = result.filter(x=>x.tipe == 'login');

        this.setState({ recentClass, recentCourse, recentForum, recentLogin});
       
        console.log("RECENTS 1",recentCourse);
      }
    });
  }


  render() {

    const data = {
      labels: [
        'Kursus',
        'Forum',
        'Meeting'
      ],
      datasets: [{
        data: [this.state.chartData.total_enroll_course, this.state.chartData.total_reply_forum, this.state.chartData.total_meeting],
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
        ]
      }]
    };

    console.log('user: ', this.state.user);
    var { recentClass, recentCourse, recentForum, recentLogin} = this.state
    console.log({ recentClass, recentCourse, recentForum, recentLogin},'2342');

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                <Card>
                  <div className="row p-20" style={{
                    backgroundImage: 'url(assets/images/component/Ilustrasi-b.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPositionX: 'right',
                    backgroundPositionY: 'center',
                    backgroundBlendMode: 'luminosity',
                    // opacity: 0.1
                  }}>
                      <div className="col-xl-2 text-center">
                        <img
                            alt=""
                            src={this.state.user.avatar ? this.state.user.avatar : "/assets/images/user/avatar-1.png"}
                            className="rounded-circle img-profile"
                            style={{padding:'20px'}}
                          />
                      </div>

                      <div className="col-xl-4 text-center">
                          <div className="media-body p-20" >
                            <h6 className="title-head f-w-800 f-24 ">
                              <a href="/aktivitas">{this.state.user.name}</a>
                            </h6>
                              <small className="d-block text-c-grey f-w-600 f-16">
                                {this.state.user.email}
                                <p>{this.state.user.phone}</p>
                              </small>
                              <b>{this.state.user.address}</b>
                          </div>
                      </div>
                      <div className="col-xl-2" style={{ borderLeft: "#dedede solid 1px" }}>
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                            <img src="/assets/images/component/liveon.png" className="img-fluid" alt="cover" />
                            <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                              Company
                            </small>
                              <a href="/aktivitas">{this.state.companyName}</a>
                        </div>
                      </div>
                      <div className="col-xl-2" style={{ borderLeft: "#dedede solid 1px" }}>
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                            <img src="/assets/images/component/liveon.png" className="img-fluid" alt="cover" />
                            <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                              Group
                            </small>
                              <a href="/aktivitas">{this.state.branchName}</a>
                        </div>
                      </div>
                      <div className="col-xl-2" style={{ borderLeft: "#dedede solid 1px" }}>
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                            <img src="/assets/images/component/liveon.png" className="img-fluid" alt="cover" />
                            <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                              Role
                            </small>
                              <a href="/aktivitas">{this.state.groupName}</a>
                        </div>
                      </div>
                    </div>
                </Card>

                <div className="row">
                    <div className="col-md-12 col-xl-7">
                      <div className="card" style={{padding:10}}>
                        <h4 className="p-10">Jumlah kegiatan 10 hari terakhir</h4>
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <Doughnut
                            data={data}
                            height={320}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                          
                      </div>
                    </div>
                    {/* * 
                    * Kalender View
                    */}
                    <div className="col-md-12 col-xl-5">
                      <div className="card">
                        <h4 className="p-10">Kalender</h4>
                          <Calendar
                            onChange={(a)=>{console.log(a)}}
                            value={new Date()}
                            locale='id-ID'
                            // activeStartDate={}
                            // defaultActiveStartDate={this.state.today}
                          />
                          <div className="p-l-20"><span className="p-r-5" style={{color:'red'}}><i className="fa fa-square"></i></span>Hari ini</div>
                          <div className="p-l-20"><span className="p-r-5" style={{color:'purple'}}><i className="fa fa-square"></i></span>Ujian</div>
                          <div className="p-l-20"><span className="p-r-5" style={{color:'cyan'}}><i className="fa fa-square"></i></span>Group Meeting</div>

                      </div>
                    </div>
                  </div>

                  <div className="row">
                      <div className="col-xl-4 mb-3">
                        
                              <div className="form-group">
                                <label className="label-input"></label>
                                <select required className="form-control" name="company_id" >
                                  <option value="">-- pilih --</option>
                                  {
                                    this.state.tanggalCoba.map(item => (
                                      <option value={item.id}>{item.date}</option>
                                    ))
                                  }
                                </select>
                              </div>
                          
                      </div>
                  </div>

                  <div className="row">
                      <div className="col-xl-2">
                        <div className="card" style={{backgroundColor:'#1087FF'}}>
                          <center>
                            <h6 className="f-16 text-c-white">Active Meeting</h6>
                            <h3 className="d-block text-c-white f-w-600">
                              6
                            </h3>
                            <h6 className="f-16 text-c-white">Group</h6>
                          </center>
                        </div>
                      </div>
                      <div className="col-xl-2">
                         <div className="card">
                          <center>
                            <h6 className="f-16">Audience</h6>
                            <h3 className="d-block text-c-grey f-w-600">
                              6
                            </h3>
                            <h6 className="f-16">User</h6>
                          </center>
                        </div>
                      </div>
                      <div className="col-xl-2">
                        <div className="card">
                          <center>
                            <h6 className="f-16">Duration</h6>
                            <h3 className="d-block text-c-grey f-w-600">
                              01:10:10
                            </h3>
                            <h6 className="f-16">Hour</h6>
                          </center>
                        </div>
                      </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{padding:10}}>
                        <h4 className="p-10">Role</h4>
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <Bar
                            data={dataBar}
                            width={100}
                            height={320}
                            options={{
                              maintainAspectRatio: false
                            }}
                          />
                        </div>
                          
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{padding:10}}>
                        <h4 className="p-10">User</h4>
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <Line
                            data={dataUser}
                            height={320}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                          
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{padding:10}}>
                        <h4 className="p-10">Speaker Stats</h4>
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <Bar
                            data={dataSpeaker}
                            width={100}
                            height={320}
                            options={{
                              maintainAspectRatio: false
                            }}
                          />
                        </div>
                          
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{padding:10}}>
                        <h4 className="p-10">Average Time</h4>
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <Pie
                            data={dataPie}
                            height={320}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                          
                      </div>
                    </div>
                  </div>

                  <div className="row">
                      {tabs.map((tab, index)=>{
                          return (
                                  <div className="col-xl-4 mb-3">
                                      <Link onClick={this.tabAktivitas.bind(this, tab, index)}>
                                          <div className={this.state.tabIndex === index+1 ? "kategori-aktif" : "kategori title-disabled"}>
                                              {tab.title}
                                          </div>
                                      </Link>
                                  </div>
                              )
                      })}
                      {console.log('asjkdhkjsdhkjashdkjashdkjashdkajshdkjashdkjashdkjashd',recentCourse)}
                      {console.log(this.state.tabIndex)}
                      {this.state.tabIndex === 1 ?  <RiwayatKursus recent={recentCourse}/>
                      : this.state.tabIndex === 2 ? <RiwayatForum recent={recentForum}/>
                      :                             <RiwayatLiveClass recent={recentClass}/>}
                    
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

export default Aktivity;
