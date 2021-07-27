import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  Row, InputGroup, FormControl, Modal
} from 'react-bootstrap';

import API, { API_SERVER, USER_ME, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { isMobile } from 'react-device-detect';


export default class LiveClass extends Component {
  state = {
    companyId: '',
    classRoomsActive: [],
    classRooms: [],
    isLive: false,
    liveURL: '',
    filterMeeting: '',
    infoClass: [],
    isModalConfirmation: this.props.match.params.roomid ? true : false,
    attendanceConfirmation: '',
  }

  filterMeeting = (e) => {
    e.preventDefault();
    this.setState({ filterMeeting: e.target.value });
  }
  handleCloseLive = e => {
    this.setState({ isLive: false, liveURL: '' })
  }

  componentDidMount() {
    this.fetchData();
    if (this.props.match.params.roomid) {
      this.fetchMeetingInfo(this.props.match.params.roomid)
      if (isMobile) {
        alert('ini mobile')
      }
    }
  }

  fetchData() {
    let invited = [];
    let not_invited = [];
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/liveclass/invite/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}/${Storage.get('user').data.user_id}`).then(res => {
          console.log('RESSS', res)
          if (res.status === 200) {
            not_invited = res.data.not_invited.reverse();
            invited = res.data.invited.reverse();
            let dataClass = invited.concat(not_invited)
            this.setState({
              classRooms: dataClass.filter((item) => item.active_participants <= 0).reverse(),
              classRoomsActive: dataClass.filter((item) => item.active_participants >= 1).reverse()
            })
          }
        })
      }
    })
  }

  fetchMeetingInfo(id) {
    API.get(`${API_SERVER}v1/liveclass/meeting-info/${id}`).then(res => {
      if (res.status === 200) {
        this.setState({
          infoClass: res.data.result[0],
          infoParticipant: res.data.result[1],
          countHadir: res.data.result[1].filter((item) => item.confirmation == 'Hadir').length,
          countTidakHadir: res.data.result[1].filter((item) => item.confirmation == 'Tidak Hadir').length,
          countTentative: res.data.result[1].filter((item) => item.confirmation == '').length,
          needConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation == '').length,
          attendanceConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)
        })
      }
    })
  }


  confirmAttendance(confirmation) {
    let form = {
      confirmation: confirmation,
    }

    API.put(`${API_SERVER}v1/liveclass/confirmation/${this.state.infoClass.class_id}/${Storage.get('user').data.user_id}`, form).then(async res => {
      if (res.status === 200) {
        this.fetchMeetingInfo(this.state.infoClass.class_id)
        let start = new Date(this.state.infoClass.schedule_start);
        let end = new Date(this.state.infoClass.schedule_end);
        let form = {
          confirmation: confirmation,
          user: Storage.get('user').data.user,
          email: [],
          room_name: this.state.infoClass.room_name,
          is_private: this.state.infoClass.is_private,
          is_scheduled: this.state.infoClass.is_scheduled,
          schedule_start: start.toISOString().slice(0, 16).replace('T', ' '),
          schedule_end: end.toISOString().slice(0, 16).replace('T', ' '),
          schedule_start: `${moment.tz(this.state.infoClass.schedule_start, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (${moment.tz.guess(true)} Time Zone)`,
          schedule_end: `${moment.tz(this.state.infoClass.schedule_end, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (${moment.tz.guess(true)} Time Zone)`,
          userInvite: [Storage.get('user').data.user_id],
          //url
          message: APPS_SERVER + 'redirect/meeting/information/' + this.state.infoClass.class_id,
          messageNonStaff: APPS_SERVER + 'meeting/' + this.state.infoClass.class_id
        }
        API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              console.log('sukses konfirmasi')
            } else {
              alert('Email error');
            }
          }
        })
      }
    })
  }

  closeModalConfirmation = e => {
    this.setState({ isModalConfirmation: false });
  }

  onClickInfo(class_id) {
    this.setState({ isModalConfirmation: true })
    this.fetchMeetingInfo(class_id)
  }

  render() {

    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let { classRooms, classRoomsActive, isLive } = this.state;
    let { filterMeeting } = this.state;
    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);
    if (filterMeeting != "") {
      classRooms = classRooms.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterMeeting, "gmi"))
      )
    }

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <Row>
                    {
                      levelUser == 'client' && access.course == 0 ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/kursus`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/kursusoff.png" className="img-fluid" />
                              &nbsp;
                              Kursus & Materi
                            </div>
                          </Link>
                        </div>
                    }

                    {
                      levelUser == 'client' && access.forum == 0 ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/forum`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/forumoff.png" className="img-fluid" />
                              &nbsp;
                              Forum
                            </div>
                          </Link>
                        </div>
                    }

                    {
                      levelUser == 'client' && (access.group_meeting == 0 && access.manage_group_meeting == 0) ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={access.manage_group_meeting ? `/meeting` : `/liveclass`}>
                            <div className="kategori-aktif">
                              <img src="/assets/images/component/liveon.png" className="img-fluid" />
                              &nbsp;
                              Group Meeting
                            </div>
                          </Link>
                        </div>
                    }
                  </Row>
                  <div className="col-md-12 col-xl-12" style={{ marginBottom: '10px' }}>
                    <InputGroup className="mb-3" style={{ background: '#FFF' }}>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                          <i className="fa fa-search"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        style={{ background: '#FFF' }}
                        onChange={this.filterMeeting}
                        placeholder="Filter"
                        aria-describedby="basic-addon1"
                      />
                      <InputGroup.Append style={{ cursor: 'pointer' }}>
                        <InputGroup.Text id="basic-addon2">Search</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </div>

                  <Row>
                    <div className="col-md-12">
                      <h3 className="f-20 f-w-800">
                        Meeting Aktif
                      </h3>
                    </div>
                  </Row>
                  <div>
                    {
                      classRoomsActive.length ?

                        <Row>
                          {
                            this.state.classRoomsActive.map(item =>
                              <div className="col-sm-4" key={item.class_id}>
                                <Link onClick={this.onClickInfo.bind(this, item.class_id)}>
                                  <div className="card">
                                    <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url(${item.cover ? item.cover : '/assets/images/component/meeting-default.jpg'})` }}></div>
                                    {/* <img
													className="img-fluid img-kursus radius-top-l-r-5"
													src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
													alt="dashboard-user"
												/> */}
                                    <div className="card-carousel ">
                                      <div className="title-head f-w-900 f-16">
                                        {item.room_name}
                                      </div>
                                      <h3 className="f-14">
                                        {item.name}
                                      </h3>
                                      {
                                        item.active_participants > 0 ?
                                          <medium className="mr-3" style={{ position: 'absolute', top: 20, left: 20, background: '#FFF', borderRadius: '5px', padding: '5px 10px' }}>
                                            <i className='fa fa-video'></i> AKTIF
													</medium>
                                          :
                                          null
                                      }
                                      {/* <small className="mr-3">
														<i className={`fa fa-${item.is_live ? 'video' : 'stop-circle'}`}></i>&nbsp;{item.is_live ? 'LIVE' : 'ENDED'}
													</small> */}
                                      {
                                        item.record &&
                                        <small className="mr-3">
                                          <a target='_blank' href='Activity'>
                                            <i className='fa fa-compact-disc'></i> REKAMAN
														</a>
                                        </small>
                                      }
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            )
                          }
                        </Row>

                        :
                        <div className="col-md-3 col-xl-3 mb-3">
                          There are no active meetings
                        </div>
                    }
                  </div>
                  <Row>
                    <div className="col-md-12">
                      <h3 className="f-20 f-w-800">
                        Inactive Meeting
                      </h3>
                    </div>
                  </Row>
                  <div>
                    {
                      classRooms.length ?
                        <Row>
                          {
                            this.state.classRooms.map(item =>
                              <div className="col-sm-4" key={item.class_id}>
                                <Link onClick={this.onClickInfo.bind(this, item.class_id)}>
                                  <div className="card">
                                    <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url(${item.cover ? item.cover : '/assets/images/component/meeting-default.jpg'})` }}></div>
                                    {/* <img
														className="img-fluid img-kursus radius-top-l-r-5"
														src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
														alt="dashboard-user"
													/> */}
                                    <div className="card-carousel ">
                                      <div className="title-head f-w-900 f-16">
                                        {item.room_name}
                                      </div>
                                      <h3 className="f-14">
                                        {item.name}
                                      </h3>
                                      {
                                        item.active_participants > 0 ?
                                          <medium className="mr-3" style={{ position: 'absolute', top: 20, left: 20, background: '#FFF', borderRadius: '5px', padding: '5px 10px' }}>
                                            <i className='fa fa-video'></i> AKTIF
														</medium>
                                          :
                                          null
                                      }
                                      {/* <small className="mr-3">
															<i className={`fa fa-${item.is_live ? 'video' : 'stop-circle'}`}></i>&nbsp;{item.is_live ? 'LIVE' : 'ENDED'}
														</small> */}
                                      {
                                        item.record &&
                                        <small className="mr-3">
                                          <a target='_blank' href={item.record}>
                                            <i className='fa fa-compact-disc'></i> REKAMAN
															</a>
                                        </small>
                                      }
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            )
                          }
                        </Row>
                        :
                        <div className="col-md-3 col-xl-3 mb-3">
                          There are no active meetings
								</div>
                    }
                  </div>

                  <Modal
                    show={this.state.isModalConfirmation}
                    onHide={this.closeModalConfirmation}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Body>
                      <Modal.Title
                        className="text-c-purple3 f-w-bold f-21"
                        style={{ marginBottom: "30px" }}
                      >
                        Meeting and Attendance Information
                      </Modal.Title>

                      {
                        this.state.needConfirmation >= 1 && this.state.infoClass.is_private == 1
                          ?
                          <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="card" style={{ background: '#dac88c', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                              <div className="card-carousel col-sm-8">
                                <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                  Attendance Confirmation
                              </div>
                                <h3 className="f-14">You were invited to this meeting and have not confirmed attendance. Please confirm attendance.</h3>
                              </div>
                              <div className="card-carousel col-sm-4">
                                <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="float-right btn btn-sm btn-icademy-red" style={{ padding: '5px 10px' }}>
                                  Tidak Hadir
                              </Link>
                                <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="float-right btn btn-sm btn-icademy-green" style={{ padding: '5px 10px' }}>
                                  Hadir
                              </Link>
                              </div>
                            </div>
                          </div>
                          :
                          this.state.needConfirmation == 0 && this.state.infoClass.is_private == 1
                            ?
                            <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                              <div className="card" style={{ background: 'rgb(134 195 92)', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                                <div className="card-carousel col-sm-8">
                                  <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                    You have confirmed : {this.state.attendanceConfirmation[0].confirmation}
                                  </div>
                                  <h3 className="f-14">You have confirmed your attendance status on this meeting.</h3>
                                </div>
                              </div>
                            </div>
                            : null
                      }
                      <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="card">
                          <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url(${this.state.infoClass.cover ? this.state.infoClass.cover : '/assets/images/component/meeting-default.jpg'})` }}></div>

                          <div className="card-carousel">
                            <div className="title-head f-w-900 f-16 mb-2">
                              {this.state.infoClass.room_name}
                            </div>
                            <div class="row">
                              <div className="col-sm-6">
                                <h3 className="f-14">
                                  Moderator : {this.state.infoClass.name}
                                </h3>
                                <h3 className="f-14">
                                  {this.state.infoClass.is_private ? 'Private' : 'Public'} Meeting
                                </h3>
                                {
                                  this.state.infoClass.is_private &&
                                  <h3 className="f-14">
                                    {this.state.infoClass.is_required_confirmation ? 'Mandatory attendance confirmation' : 'Non mandatory attendance confirmation'}
                                  </h3>
                                }
                              </div>
                              {
                                this.state.infoClass.is_scheduled ?
                                  <div className="col-sm-6">
                                    <h3 className="f-14">
                                      Mulai : {infoDateStart.toISOString().slice(0, 16).replace('T', ' ')}
                                    </h3>
                                    <h3 className="f-14">
                                      Selesai : {infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')}
                                    </h3>
                                  </div>
                                  : null
                              }
                            </div>
                          </div>
                        </div>
                        {
                          (this.state.infoClass.is_live && (this.state.infoClass.is_scheduled == 0 || new Date() >= new Date(infoDateStart.toISOString().slice(0, 16).replace('T', ' ')) && new Date() <= new Date(infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')))) && (this.state.infoClass.is_required_confirmation == 0 || (this.state.infoClass.is_required_confirmation == 1 && this.state.attendanceConfirmation[0].confirmation == 'Hadir')) ?
                            <Link target='_blank' to={`/liveclass-room/${this.state.infoClass.class_id}`} onClick={e => this.closeModalConfirmation()} className="btn btn-sm btn-ideku" style={{ width: '100%', padding: '20px 20px' }}>
                              <i className='fa fa-video'></i> Masuk
                              </Link>
                            : null
                        }
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}