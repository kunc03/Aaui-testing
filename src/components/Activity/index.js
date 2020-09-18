import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Card, InputGroup, FormControl, Row } from 'react-bootstrap';
import API, { USER_ME, API_SERVER, BBB_KEY, BBB_URL } from '../../repository/api';
import Storage from '../../repository/storage';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

import RiwayatKursus from './riwayatkursus';
import RiwayatForum from './riwayatforum';
import RiwayatLiveClass from './riwayatliveclass';
import { Doughnut, Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { dataBar, dataUser, dataRadar, dataPie } from './data';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import MomentTZ from 'moment-timezone';
const localizer = momentLocalizer(moment);
const bbb = require('bigbluebutton-js')
let event = [
  // {
  //   id: 0,
  //   title: 'Today',
  //   start: new Date(),
  //   end: new Date(),
  //   bgColor: 'red'
  // },
  // {
  //   id: 2,
  //   title: 'Ujian',
  //   start: moment(moment()).add(3, 'days'),
  //   end: moment(moment()).add(3, 'days'),
  //   bgColor: 'purple'
  // },
  // {
  //   id: 3,
  //   title: 'Group',
  //   start: moment(moment()).add(4, 'days'),
  //   end: moment(moment()).add(4, 'days'),
  //   bgColor: 'cyan'
  // }
];

class CustomToolbar extends Toolbar {
  render() {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => this.navigate('PREV')}>
            {'<'}
          </button>
          <button type="button" onClick={() => this.navigate('TODAY')}>
            today
          </button>
          <button type="button" onClick={() => this.navigate('NEXT')}>
            {'>'}
          </button>
        </span>
        <span className="rbc-toolbar-label">{this.props.label}</span>
      </div>
    );
  }

  navigate = (action) => {
    console.log(action);

    this.props.onNavigate(action);
  };
}

const tabs = [
  { title: 'Riwayat Kursus' },
  { title: 'Riwayat Forum' },
  { title: 'Group Meeting' },
];

class Aktivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,
      user: {
        name: 'AKTIVITAS',
        registered: '2019-12-09',
        companyId: '',
      },
      companyName: '',
      branchName: '',
      groupName: '',
      chartData: '',
      classRooms: [],
      kategoriKursus: [],
      kursusTerbaru: [],
      kursusDiikuti: [],
      recentCourse: [],
      recentClass: [],
      recentForum: [],
      recentLogin: [],
      today: '',
      calendarItems: [],
      loading: true,
      startDate: new Date(),
      endDate: new Date(),

      tanggalCoba: [
        { id: 1, date: '21 April 2020 - 22 April 2020' },
        { id: 2, date: '23 April 2020 - 24 April 2020' },
      ],

      event: [],
      active: '0',
      audience: '0',
      duration: '00:00:00',

      dataRecordings: [],
    };
    this.tabAktivitas = this.tabAktivitas.bind(this);
  }

  handleChangeDateStart = date => {
    this.setState({
      startDate: date
    }, () => {
      let start = MomentTZ.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD");
      let end = MomentTZ.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD");
      this.fetchDataChart(start, end);
    });
  };
  handleChangeDateEnd = date => {
    this.setState({
      endDate: date
    }, () => {
      let start = MomentTZ.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD");
      let end = MomentTZ.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD");
      this.fetchDataChart(start, end);
    });
  };
  componentDidMount() {
    this.fetchDataUser();
    this.fetchHistoryActivity(Storage.get('user').data.user_id);
    this.fetchDataKursusDiikuti();
    this.fetchUserCalendar();
    this.fetchDataRekaman();

    this.setState({startDate: moment(this.state.startDate).subtract(1, 'month')._d})
    let start = MomentTZ.tz(moment(this.state.startDate).subtract(1, 'month'), 'Asia/Jakarta').format("YYYY-MM-DD");
    let end = MomentTZ.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD");
    this.fetchDataChart(start, end);
    
    console.log('RECENTS DID', this.state.recentCourse);
    let date = new Date();
    console.log(String(date));
    this.setState({ today: String(date) });
  }

  fetchDataChart(start, stop) {
    API.get(
      `${API_SERVER}v1/api-activity/chart/${
        Storage.get('user').data.company_id
      }/${start}/${stop}`
    ).then((res) => {
      console.log('alvin res', res);
      if (res.status === 200) {
        console.log('ALVIN',res.data.result)
        dataBar.labels = res.data.result.chart1.grup;
        dataBar.datasets[0].data = res.data.result.chart1.count;
        dataUser.labels = res.data.result.chart2.name;
        dataUser.datasets[0].data = res.data.result.chart2.count;
        dataRadar.labels = res.data.result.chart4.tipe;
        dataRadar.datasets[0].data = res.data.result.chart4.count;
        dataPie.labels = res.data.result.chart4.tipe;
        dataPie.datasets[0].data = res.data.result.chart4.count;

        this.setState({
          active: res.data.result.active,
          audience: res.data.result.audience,
          duration: res.data.result.duration,
        });
      }
    });
  }

  fetchDataRekaman() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID')
            ? localStorage.getItem('companyID')
            : res.data.result.company_id,
        });
        API.get(
          `${API_SERVER}v1/liveclass/company/${
            localStorage.getItem('companyID')
              ? localStorage.getItem('companyID')
              : res.data.result.company_id
          }`
        ).then((res) => {
          if (res.status === 200) {
            let data = res.data.result.reverse();
            // BBB GET MEETING RECORD
            let api = bbb.api(BBB_URL, BBB_KEY)
            let http = bbb.http
            data.map((item) => {
              let getRecordingsUrl = api.recording.getRecordings({meetingID: item.class_id})
              http(getRecordingsUrl).then((result) => {
                if (result.returncode='SUCCESS' && result.messageKey!='noRecordings'){
                  this.state.dataRecordings.push(result.recordings)
                  this.forceUpdate()
                }
                else{
                  console.log('GAGAL', result)
                }
              })
            })
              // BBB END
            // this.setState({ classRooms: data.filter((data) => data.record) });
          }
        });
      }
    });
  }

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.fetchDataKategoriKursus(res.data.result.company_id);
        this.fetchDataKursusTerbaru(res.data.result.company_id);

        Object.keys(res.data.result).map((key, index) => {
          if (key === 'registered') {
            return (res.data.result[key] = res.data.result[key]
              .toString()
              .substring(0, 10));
          }
        });
        this.setState({ user: res.data.result });
        API.get(`${API_SERVER}v1/company/${res.data.result.company_id}`).then(
          (res) => {
            if (res.status === 200) {
              this.setState({ companyName: res.data.result.company_name });
            }
          }
        );
        API.get(`${API_SERVER}v1/branch/${res.data.result.branch_id}`).then(
          (res) => {
            if (res.status === 200) {
              this.setState({ branchName: res.data.result.branch_name });
            }
          }
        );
        API.get(`${API_SERVER}v1/grup/${res.data.result.grup_id}`).then(
          (res) => {
            if (res.status === 200) {
              this.setState({ groupName: res.data.result.grup_name });
              console.log('states', res.data.result);
            }
          }
        );
        API.get(
          `${API_SERVER}v1/user/activity/${res.data.result.grup_id}`
        ).then((res) => {
          if (res.status === 200) {
            this.setState({ chartData: res.data.result });

            console.log('resss', res);
          }
        });
      }
    });
  }

  fetchDataKategoriKursus(companyId) {
    API.get(`${API_SERVER}v1/category/company/${companyId}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          kategoriKursus: res.data.result.filter((item) => {
            return item.count_course > 0;
          }),
        });
      }
    });
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(`${API_SERVER}v1/course/company/${companyId}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          kursusTerbaru: res.data.result
            .filter((item) => {
              return item.count_chapter > 0;
            })
            .slice(0, 3),
        });
      }
    });
  }

  fetchDataKursusDiikuti() {
    API.get(
      `${API_SERVER}v1/user-course/${Storage.get('user').data.user_id}`
    ).then((res) => {
      if (res.status === 200) {
        this.setState({ kursusDiikuti: res.data.result.reverse().slice(0, 6) });
      }
    });
  }

  fetchUserCalendar() {
    API.get(`${API_SERVER}v1/agenda/${Storage.get('user').data.user_id}`).then(
      (res) => {
        if (res.status === 200) {
          let data = res.data.result.map((elem) => {
            let start = new Date(elem.string_start);
            let end = new Date(elem.string_end);
            return {
              id: elem.id,
              title:
                elem.type === 1
                  ? 'Ujian ' + elem.description
                  : elem.type === 2
                  ? 'Forum ' + elem.description
                  : 'Meeting ' + elem.description,
              start: new Date(
                start.getFullYear(),
                start.getMonth(),
                start.getDate(),
                start.getHours(),
                start.getMinutes(),
                start.getSeconds()
              ),
              end: new Date(
                end.getFullYear(),
                end.getMonth(),
                end.getDate(),
                end.getHours(),
                end.getMinutes(),
                end.getSeconds()
              ),
              bgColor:
                elem.type === 1 ? 'red' : elem.type === 2 ? 'purple' : 'cyan',
            };
          });
          this.setState({ event: data });
          // this.setState({ calendarItems: res.data.result });
        }
      }
    );
  }

  tabAktivitas(a, b) {
    this.setState({ tabIndex: b + 1 });
  }

  fetchHistoryActivity(user_id) {
    API.get(`${API_SERVER}v1/api-activity/history/${user_id}`).then((res) => {
      if (res.status === 200) {
        var { result } = res.data;
        var recentCourse = result.filter((x) => x.tipe == 'course');
        var recentForum = result.filter((x) => x.tipe == 'forum');
        var recentClass = result.filter((x) => x.tipe == 'liveclass');
        var recentLogin = result.filter((x) => x.tipe == 'login');

        this.setState({ recentClass, recentCourse, recentForum, recentLogin });

        console.log('RECENTS 1', recentCourse);
      }
    });
  }

  render() {
    let { classRooms } = this.state;
    const ClassRooms = ({ list }) => (
      <Row>
        {list.map((item) => (
          <div className="col-sm-12" key={item.class_id}>
              <div className="card">
                <div className="card-carousel ">
                  <div className="title-head f-w-900 f-16" style={{marginBottom:20}}>
                    {item.recording.length ? item.recording[0].name: item.recording.name}
                  </div>
                    <div className="f-14 row">
                      {
                        item.recording.length ?
                        item.recording.map(item =>
                          <a className="card col-md-4" target="_blank" href={item.playback.format.url} style={{alignItems:'center', justifyContent:'center'}}>
                            <img src={item.playback.format.preview.images.image[0]}/>
                            <p>{new Date(item.startTime).toISOString().slice(0, 16).replace('T', ' ')} - {new Date(item.endTime).toISOString().slice(0, 16).replace('T', ' ')}</p>
                          </a>
                        )
                        :
                          <a className="card col-md-4" target="_blank" href={item.recording.playback.format.url} style={{alignItems:'center', justifyContent:'center'}}>
                            <img src={item.recording.playback.format.preview.images.image[0]}/>
                            <p>{new Date(item.recording.startTime).toISOString().slice(0, 16).replace('T', ' ')} - {new Date(item.recording.endTime).toISOString().slice(0, 16).replace('T', ' ')}</p>
                          </a>
                      }
                    </div>
                </div>
              </div>
          </div>
        ))}
      </Row>
    );

    const data = {
      labels: ['Kursus', 'Forum', 'Meeting'],
      datasets: [
        {
          data: [
            this.state.chartData.total_enroll_course,
            this.state.chartData.total_reply_forum,
            this.state.chartData.total_meeting,
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    console.log('user: ', this.state.user);
    var { recentClass, recentCourse, recentForum, recentLogin } = this.state;
    console.log(
      { recentClass, recentCourse, recentForum, recentLogin },
      '2342'
    );

    return (
      <div
        className="pcoded-main-container"
        style={{ backgroundColor: '#F6F6FD' }}
      >
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  {/* <Card>
                    <div
                      className="row p-20"
                      style={{
                        backgroundImage:
                          'url(assets/images/component/Ilustrasi-b.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPositionX: 'right',
                        backgroundPositionY: 'center',
                        backgroundBlendMode: 'luminosity',
                      }}
                    >
                      <div className="col-xl-2 text-center">
                        <img
                          alt=""
                          src={
                            this.state.user.avatar
                              ? this.state.user.avatar
                              : '/assets/images/user/avatar-1.png'
                          }
                          className="rounded-circle img-profile"
                          style={{ padding: '20px' }}
                        />
                      </div>

                      <div className="col-xl-4 text-center">
                        <div className="media-body p-20">
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
                      <div
                        className="col-xl-2"
                        style={{ borderLeft: '#dedede solid 1px' }}
                      >
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                          <img
                            src="/assets/images/component/liveon.png"
                            className="img-fluid"
                            alt="cover"
                          />
                          <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                            Company
                          </small>
                          <a href="/aktivitas">{this.state.companyName}</a>
                        </div>
                      </div>
                      <div
                        className="col-xl-2"
                        style={{ borderLeft: '#dedede solid 1px' }}
                      >
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                          <img
                            src="/assets/images/component/liveon.png"
                            className="img-fluid"
                            alt="cover"
                          />
                          <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                            Group
                          </small>
                          <a href="/aktivitas">{this.state.branchName}</a>
                        </div>
                      </div>
                      <div
                        className="col-xl-2"
                        style={{ borderLeft: '#dedede solid 1px' }}
                      >
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-left">
                          <img
                            src="/assets/images/component/liveon.png"
                            className="img-fluid"
                            alt="cover"
                          />
                          <small className="d-block text-c-grey f-w-600 f-14 m-t-10">
                            Role
                          </small>
                          <a href="/aktivitas">{this.state.groupName}</a>
                        </div>
                      </div>
                    </div>
                  </Card> */}

                  <div className="row">
                    {/* <div className="col-md-12 col-xl-7">
                      <div className="card" style={{ padding: 10 }}>
                        <h4 className="p-10">
                          Jumlah kegiatan 10 hari terakhir
                        </h4>
                        <div
                          className="chart-container"
                          style={{ position: 'relative' }}
                        >
                          <Doughnut
                            data={data}
                            height={443}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* *
                     * Kalender View
                     */}
                    <div className="col-md-12">
                      <div className="card p-10">
                        <h4 className="p-10">Kalender</h4>
                        {/* <Calendar
                            onChange={(a)=>{console.log(a)}}
                            value={new Date()}
                            locale='id-ID'
                            tileContent={({ activeStartDate, date, view }) => { var d = new Date(); d.setHours(0,0,0,0); console.log(new Date(date), d, view); return view == 'month' && new Date(date) == d ? <p>asdf</p> : null }}
                            // activeStartDate={}
                            // defaultActiveStartDate={this.state.today}
                          /> */}
                        <Calendar
                          popup
                          events={this.state.event}
                          defaultDate={new Date()}
                          localizer={localizer}
                          style={{ height: 400 }}
                          // components={{ toolbar: CustomToolbar }}
                          eventPropGetter={(event, start, end, isSelected) => {
                            if (event.bgColor) {
                              return {
                                style: { backgroundColor: '#ffce56' },
                              };
                            }
                            return {};
                          }}
                          // views={['month']}
                          views={['month', 'day']}
                          // views={{
                          //   month: true,
                          //   week: true,
                          // }}
                        />
                        {/* <div className="p-l-20">
                          <span className="p-r-5" style={{ color: 'red' }}>
                            <i className="fa fa-square"></i>
                          </span>
                          Hari ini
                        </div>
                        <div className="p-l-20">
                          <span className="p-r-5" style={{ color: 'purple' }}>
                            <i className="fa fa-square"></i>
                          </span>
                          Ujian
                        </div> */}
                        <div className="p-l-20">
                          <span className="p-r-5" style={{ color: '#ffce56' }}>
                            <i className="fa fa-square"></i>
                          </span>
                          Group Meeting
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="card" style={{ padding: 10 }}>
                        <h4 className="p-10">Rekaman Meeting</h4>
                        <div
                          className="chart-container"
                          style={{ position: 'relative', margin: 20 }}
                        >
                          <div>
                            {this.state.dataRecordings.length ? (
                              <ClassRooms list={this.state.dataRecordings} />
                            ) : (
                              <div className="col-md-3 col-xl-3 mb-3">
                                Tidak ada rekaman meeting
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Filter Waktu
                          </Form.Label>
                          <div style={{width:'100%'}}>
                          <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChangeDateStart}
                            dateFormat="yyyy-MM-dd"
                          />
                          &nbsp;&mdash;&nbsp;
                          <DatePicker
                            selected={this.state.endDate}
                            onChange={this.handleChangeDateEnd}
                            dateFormat="yyyy-MM-dd"
                          />
                          </div>
                        </Form.Group>

                  <div className="row">
                    <div className="col-xl-2">
                      <div
                        className="card p-10"
                        style={{ backgroundColor: '#1087FF' }}
                      >
                        <center>
                          <h6 className="f-16 text-c-white">Active Private Meeting</h6>
                          <h3 className="d-block text-c-white f-w-600">
                            {this.state.active}
                          </h3>
                          <h6 className="f-16 text-c-white">Room</h6>
                        </center>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="card p-10">
                        <center>
                          <h6 className="f-16">Private Meeting Participants</h6>
                          <h3 className="d-block text-c-grey f-w-600">
                            {this.state.audience}
                          </h3>
                          <h6 className="f-16">User</h6>
                        </center>
                      </div>
                    </div>
                    <div className="col-xl-2">
                      <div className="card p-10">
                        <center>
                          <h6 className="f-16">Scheduled Meeting Duration</h6>
                          <h3 className="d-block text-c-grey f-w-600">
                            {this.state.duration}
                          </h3>
                          <h6 className="f-16">Hour</h6>
                        </center>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{ padding: 10 }}>
                        <h4 className="p-10">Role</h4>
                        <div
                          className="chart-container"
                          style={{ position: 'relative' }}
                        >
                          <Bar
                            data={dataBar}
                            width={100}
                            height={320}
                            options={{
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{ padding: 10 }}>
                        <h4 className="p-10">User</h4>
                        <div
                          className="chart-container"
                          style={{ position: 'relative' }}
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
                      <div className="card" style={{ padding: 10 }}>
                        <h4 className="p-10">Usage</h4>
                        <div
                          className="chart-container"
                          style={{ position: 'relative' }}
                        >
                          <Radar
                            data={dataRadar}
                            width={100}
                            height={320}
                            options={{
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-6">
                      <div className="card" style={{ padding: 10 }}>
                        <h4 className="p-10">Total Activity</h4>
                        <div
                          className="chart-container"
                          style={{ position: 'relative' }}
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
                    {tabs.map((tab, index) => {
                      return (
                        <div className="col-xl-4 mb-3">
                          <Link
                            onClick={this.tabAktivitas.bind(this, tab, index)}
                          >
                            <div
                              className={
                                this.state.tabIndex === index + 1
                                  ? 'kategori-aktif'
                                  : 'kategori title-disabled'
                              }
                            >
                              {tab.title}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                    {console.log(
                      'asjkdhkjsdhkjashdkjashdkjashdkajshdkjashdkjashdkjashd',
                      recentCourse
                    )}
                    {console.log(this.state.tabIndex)}
                    {this.state.tabIndex === 1 ? (
                      <RiwayatKursus recent={recentCourse} />
                    ) : this.state.tabIndex === 2 ? (
                      <RiwayatForum recent={recentForum} />
                    ) : (
                      <RiwayatLiveClass recent={recentClass} />
                    )}
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
