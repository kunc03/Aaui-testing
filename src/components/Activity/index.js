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

const tabs =[
  {title : 'Riwayat Kursus' },
  {title : 'Riwayat Forum' },
  {title : 'Live Class' },
]

class Aktivity extends Component {
  state = {
    user: {
      name: 'AKTIVITAS',
      registered: '2019-12-09',
      companyId: '',
    },
    kategoriKursus: [],
    kursusTerbaru: [],
    kursusDiikuti: [],
    today : '',
    tabIndex : 1
  }

  componentDidMount() {
    this.fetchDataUser();
    this.fetchDataKursusDiikuti();
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

  tabAktivitas(a,b){
    this.setState({tabIndex: b+1});
}

  render() {
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
                              src='https://iacts.org/sites/all/themes/themag/assets/images/default-user.png'
                              className="rounded-circle img-profile"
                              style={{padding:'20px'}}
                            />
                          
                      </div>
                      <div className="col-xl-4 text-center">
                          <div className="media-body p-20" >
                            <h6 className="title-head f-w-800 f-24 ">
                              <a href="/aktivitas">Natasa Midori</a>
                            </h6>
                              <small className="d-block text-c-grey f-w-600 f-16">
                                Group Marketing
                                <p>Cabang Jakarta Barat</p>
                              </small>
                              <b>Invovesta Utama</b>
                          </div>
                      </div>
                      <div className="col-xl-2" style={{ borderLeft: "#dedede solid 1px" }}>
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                            <img src="/assets/images/component/liveon.png" className="img-fluid" />
                            <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                              Cabang Jakarta Barat
                            </small>
                              <a href="/aktivitas">8</a>
                        </div>
                      </div>
                      <div className="col-xl-2" style={{ borderLeft: "#dedede solid 1px" }}>
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                            <img src="/assets/images/component/liveon.png" className="img-fluid" />
                            <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                              Cabang Jakarta Barat
                            </small>
                              <a href="/aktivitas">8</a>
                        </div>
                      </div>
                      <div className="col-xl-2" style={{ borderLeft: "#dedede solid 1px" }}>
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                            <img src="/assets/images/component/liveon.png" className="img-fluid" />
                            <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                              Cabang Jakarta Barat
                            </small>
                              <a href="/aktivitas">8</a>
                        </div>
                      </div>
                    </div>
                </Card>

                <div className="row">
                    <div className="col-md-12 col-xl-7">
                      <div className="card">
                        <h4 className="p-10">Waktu Di IDEKU</h4>
                        <div
                          className="chart-container"
                          style={{ position: "relative" }}
                        >
                          <canvas id="canvas" />
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
                            <div className="p-l-20"><span className="p-r-5" style={{color:'cyan'}}><i className="fa fa-square"></i></span>Live Class</div>
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
                      {this.state.tabIndex === 1 ?  <RiwayatKursus/>
                      : this.state.tabIndex === 2 ? <RiwayatForum/>
                      :                             <RiwayatLiveClass/>}
                    
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
