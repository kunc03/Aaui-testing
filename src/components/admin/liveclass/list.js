import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
// import moment from "react-moment";
import Moment from 'moment-timezone';

import ToggleSwitch from "react-switch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image,
  InputGroup, FormControl, Modal
} from 'react-bootstrap';

import API, { API_JITSI, API_SERVER, USER_ME, APPS_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { isMobile } from 'react-device-detect';

export default class LiveClassAdmin extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      companyId: '',
      classRooms: [],
      classRoomsActive: [],

      classId: '',
      speaker: '',
      roomName: '',
      cover: '',

      isNotifikasi: false,
      isiNotifikasi: '',
      filterMeeting: '',

      imgPreview: '',

      isClassModal: false,
      isModalConfirmation: this.props.match.params.roomid ? true : false,
      infoClass: [],
      infoParticipant: [],
      countHadir: 0,
      countTentative: 0,
      countTidakHadir: 0,
      needConfirmation: 0,
      attendanceConfirmation: '',
      sendingEmail: false,

      //single select moderator
      optionsModerator: [],
      valueModerator: [],

      //single select folder
      optionsFolder: [],
      valueFolder: [],

      //multi select peserta
      optionsPeserta: [],
      valuePeserta: [],
      //multi select group
      optionsGroup: [],
      valueGroup: [],
      //Toggle Switch
      private: false,
      scheduled: false,
      requireConfirmation: false,
      startDate: new Date(),
      endDate: new Date(),
    }
  }
  goBack() {
    this.props.history.goBack();
  }

  filterMeeting = (e) => {
    e.preventDefault();
    this.setState({ filterMeeting: e.target.value });
  }

  handleCreateMeeting() {
    this.setState({ isClassModal: true });
  };

  handleChangeDateFrom = date => {
    this.setState({
      startDate: date
    });
  };

  handleChangeDateEnd = date => {
    this.setState({
      endDate: date
    });
  };

  toggleSwitch(checked) {
    this.setState({ private: !this.state.private });
  }
  toggleSwitchRequiredConfirmation(checked) {
    this.setState({ requireConfirmation: !this.state.requireConfirmation });
  }

  toggleSwitchScheduled(checked) {
    this.setState({ scheduled: !this.state.scheduled });
  }

  closeClassModal = e => {
    this.setState({ isClassModal: false, speaker: '', roomName: '', imgPreview: '', cover: '', classId: '', valueGroup: [], valueModerator: [], valuePeserta: [], valueFolder: [], infoParticipant: [], infoClass: [], private: false, requireConfirmation: false, scheduled: false, startDate: new Date(), endDate: new Date() });
  }

  closeModalConfirmation = e => {
    this.setState({ isModalConfirmation: false });
  }

  closeNotifikasi = e => {
    this.setState({ isNotifikasi: false, isiNotifikasi: '' })
  }

  groupSelect(valueGroup) {
    this.setState({ valueGroup, valuePeserta: [] })
    for (let i = 0; i < valueGroup.length; i++) {
      API.get(`${API_SERVER}v1/user/group/${valueGroup[i]}`).then(res => {
        if (res.status === 200) {
          const participant = res.data.result.user_id ? res.data.result.user_id.split(',').map(Number) : [];
          this.setState({ valuePeserta: this.state.valuePeserta.concat(participant) })
          console.log('ALVIN PES', this.state.valuePeserta)
        }
      })
    }

  }
  handleChange = e => {
    const name = e.target.name;
    if (e.target.files[0].size <= 500000) {
      this.setState({
        cover: e.target.files[0],
        imgPreview: URL.createObjectURL(e.target.files[0])
      });
    } else {
      e.target.value = null;
      this.setState({ isNotifikasi: true, isiNotifikasi: 'The file does not match the format, please check again.' })
    }
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

  deleteParticipant(id, classId) {
    API.delete(`${API_SERVER}v1/liveclass/participant/delete/${id}`).then(res => {
      if (res.status === 200) {
        this.fetchMeetingInfo(classId);
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
          userInvite: [Storage.get('user').data.user_id],
          //url
          message: APPS_SERVER + 'redirect/meeting/information/' + this.state.infoClass.class_id,
          messageNonStaff: APPS_SERVER + 'meeting/' + this.state.infoClass.class_id
        }
        this.setState({ alertSuccess: true })
        API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              console.log('sukses konfirmasi')
            } else {
              alert('Email error');
            }
          }
        })
        let formNotif = {
          user_id: this.state.infoClass.moderator,
          type: 3,
          activity_id: this.state.infoClass.class_id,
          desc: Storage.get('user').data.user + ' Akan ' + confirmation + ' Pada Meeting : ' + this.state.infoClass.room_name,
          dest: null,
        }
        API.post(`${API_SERVER}v1/notification/broadcast`, formNotif).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              console.log('Sukses Notif')
            } else {
              console.log('Gagal Notif')
            }
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
          attendanceConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null
        })
      }
    })
  }

  onClickInfo(class_id) {
    this.setState({ isModalConfirmation: true })
    this.fetchMeetingInfo(class_id)
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/liveclass/company-user/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
          if (res.status === 200) {
            let dataClass = res.data.result
            this.setState({
              classRooms: dataClass.filter((item) => item.active_participants <= 0).reverse(),
              classRoomsActive: dataClass.filter((item) => item.active_participants >= 1).reverse()
            })
          }
        });
        API.get(`${API_SERVER}v1/branch/company/${this.state.companyId}`).then(res => {
          if (res.status === 200) {
            this.setState({ listBranch: res.data.result[0] })
            res.data.result[0].map(item => {
              this.state.optionsGroup.push({ value: item.branch_id, label: item.branch_name });
            });
          }
        })
        if (this.state.optionsModerator.length == 0 || this.state.optionsPeserta.length == 0) {
          API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(response => {
            response.data.result.map(item => {
              this.state.optionsModerator.push({ value: item.user_id, label: item.name });
              this.state.optionsPeserta.push({ value: item.user_id, label: item.name });
            });
          })
            .catch(function (error) {
              console.log(error);
            });
        }
        if (this.state.optionsFolder.length == 0) {
          API.get(`${API_SERVER}v1/folder/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}/0`).then(response => {
            response.data.result.map(item => {
              this.state.optionsFolder.push({ value: item.id, label: item.name });
            });
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    })
  }

  onSubmitForm = e => {
    e.preventDefault();

    if (this.state.classId) {
      let isPrivate = this.state.private == true ? 1 : 0;
      let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;
      let isScheduled = this.state.scheduled == true ? 1 : 0;
      let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let form = {
        room_name: this.state.roomName,
        moderator: this.state.valueModerator,
        folder_id: this.state.valueFolder,
        is_private: isPrivate,
        is_required_confirmation: isRequiredConfirmation,
        is_scheduled: isScheduled,
        schedule_start: startDateJkt,
        schedule_end: endDateJkt,
        peserta: this.state.valuePeserta
      }

      API.put(`${API_SERVER}v1/liveclass/id/${this.state.classId}`, form).then(async res => {
        if (res.status === 200) {
          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }
          if (res.data.result.is_private == 1) {
            this.setState({ sendingEmail: true })
            let start = new Date(res.data.result.schedule_start);
            let end = new Date(res.data.result.schedule_end);
            let form = {
              user: Storage.get('user').data.user,
              email: [],
              room_name: res.data.result.room_name,
              is_private: res.data.result.is_private,
              is_scheduled: res.data.result.is_scheduled,
              schedule_start: start.toISOString().slice(0, 16).replace('T', ' '),
              schedule_end: end.toISOString().slice(0, 16).replace('T', ' '),
              userInvite: this.state.valuePeserta.concat(this.state.valueModerator),
              //url
              message: APPS_SERVER + 'redirect/meeting/information/' + res.data.result.class_id,
              messageNonStaff: APPS_SERVER + 'meeting/' + res.data.result.room_name
            }
            API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
              if (res.status === 200) {
                if (!res.data.error) {
                  this.setState({ sendingEmail: false })
                  this.fetchData();
                  this.closeClassModal();
                } else {
                  console.log('RESS GAGAL', res)
                }
              }
            })
          }
          else {
            this.fetchData();
            this.closeClassModal();
          }
        }
      })
    } else {
      let isPrivate = this.state.private == true ? 1 : 0;
      let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;
      let isScheduled = this.state.scheduled == true ? 1 : 0;
      let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let form = {
        user_id: Storage.get('user').data.user_id,
        company_id: this.state.companyId,
        folder_id: this.state.valueFolder,
        speaker: this.state.speaker,
        room_name: this.state.roomName,
        moderator: this.state.valueModerator,
        is_private: isPrivate,
        is_required_confirmation: isRequiredConfirmation,
        is_scheduled: isScheduled,
        schedule_start: startDateJkt,
        schedule_end: endDateJkt,
        peserta: this.state.valuePeserta
      }

      API.post(`${API_SERVER}v1/liveclass`, form).then(async res => {
        if (res.status === 200) {
          console.log('RESS', res)
          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }
          if (res.data.result.is_private == 1) {
            this.setState({ sendingEmail: true })
            let start = new Date(res.data.result.schedule_start);
            let end = new Date(res.data.result.schedule_end);
            let form = {
              user: Storage.get('user').data.user,
              email: [],
              room_name: res.data.result.room_name,
              is_private: res.data.result.is_private,
              is_scheduled: res.data.result.is_scheduled,
              schedule_start: start.toISOString().slice(0, 16).replace('T', ' '),
              schedule_end: end.toISOString().slice(0, 16).replace('T', ' '),
              userInvite: this.state.valuePeserta.concat(this.state.valueModerator),
              //url
              message: APPS_SERVER + 'redirect/meeting/information/' + res.data.result.class_id,
              messageNonStaff: APPS_SERVER + 'meeting/' + res.data.result.room_name
            }
            API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
              if (res.status === 200) {
                if (!res.data.error) {
                  this.setState({ sendingEmail: false })
                  this.fetchData();
                  this.closeClassModal();
                } else {
                  console.log('RESS GAGAL', res)
                }
              }
            })
          }
          else {
            this.fetchData();
            this.closeClassModal();
          }
        }
      })
    }

  }

  onSubmitDelete = e => {
    e.preventDefault();
    const classId = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v1/liveclass/delete/${classId}`).then(res => {
      if (res.status === 200) {
        this.fetchData();
      }
    })
  }

  onClickEdit = e => {
    e.preventDefault();
    const classId = e.target.getAttribute('data-id');
    const cover = e.target.getAttribute('data-cover');
    const speaker = e.target.getAttribute('data-speaker');
    const roomName = e.target.getAttribute('data-roomname');
    const valueModerator = [Number(e.target.getAttribute('data-moderator'))];
    const isprivate = e.target.getAttribute('data-isprivate');
    const isRequiredConfirmation = e.target.getAttribute('data-isrequiredconfirmation');
    const participant = e.target.getAttribute('data-participant') ? e.target.getAttribute('data-participant').split(',').map(Number) : [];
    const isscheduled = e.target.getAttribute('data-isscheduled');
    const schedule_start = new Date(e.target.getAttribute('data-start'));
    const schedule_end = new Date(e.target.getAttribute('data-end'));
    const valueFolder = [Number(e.target.getAttribute('data-folder'))];
    const schedule_start_jkt = new Date(schedule_start.toISOString().slice(0, 16).replace('T', ' '));
    const schedule_end_jkt = new Date(schedule_end.toISOString().slice(0, 16).replace('T', ' '));
    this.setState({
      isClassModal: true,
      classId: classId,
      cover: cover,
      speaker: speaker,
      roomName: roomName,
      valueModerator: valueModerator,
      valueFolder: valueFolder,
      private: isprivate == 1 ? true : false,
      requireConfirmation: isRequiredConfirmation == 1 ? true : false,
      // valuePeserta: participant,
      scheduled: isscheduled == 1 ? true : false,
      startDate: schedule_start_jkt,
      endDate: schedule_end_jkt
    })

    this.fetchMeetingInfo(classId)
  }

  onSubmitLock = e => {
    e.preventDefault();
    const classId = e.target.getAttribute('data-id');
    const isLive = e.target.getAttribute('data-live');
    API.put(`${API_SERVER}v1/liveclass/live/${classId}`, { is_live: isLive == 0 ? '1' : '0' }).then(res => {
      if (res.status === 200) {
        this.fetchData();
      }
    })
  }

  render() {

    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let { classRooms, classRoomsActive, isLive } = this.state;
    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);


    let { filterMeeting } = this.state;
    if (filterMeeting != "") {
      classRooms = classRooms.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterMeeting, "gmi"))
      )
    }
    const ClassRooms = ({ list }) => <Row>
      {list.map(item =>
        <div className="col-sm-4" key={item.class_id}>
          <div className="card card-meeting">
            <Link onClick={this.onClickInfo.bind(this, item.class_id)}>
              <div className="responsive-image-content" style={{ backgroundImage: `url(${item.cover ? item.cover : '/assets/images/component/meeting-default.jpg'})` }}></div>
              {/* <img
                className="img-fluid img-kursus radius-top-l-r-5"
                src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
                alt="dashboard-user"
              /> */}
            </Link>
            <div className="card-carousel ">
              <Link onClick={this.onClickInfo.bind(this, item.class_id)}>
                <div className="title-head f-w-900 f-14" style={{ color: '#797979', marginBottom: 6 }}>
                  {item.room_name}
                </div>
                <h3 className="f-12" style={{ color: '#797979', marginBottom: 0 }}>
                  Moderator : {item.name}
                </h3>
                <h3 className="f-12" style={{ color: '#797979' }}>
                  {item.is_private == 1 ? 'Private' : 'Public'} Meeting
                </h3>
              </Link>
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
                (levelUser == 'client' && access.manage_group_meeting) || levelUser != 'client' ?
                  <div>
                    <small className="mr-3">
                      <Link className="small-button" data-id={item.class_id} data-live={item.is_live} onClick={this.onSubmitLock}>
                        <i className={`fa fa-${item.is_live ? 'lock' : 'lock-open'}`}></i> {item.is_live ? 'LOCK' : 'UNLOCK'}
                      </Link>
                    </small>
                    <small className="mr-3" style={{ zIndex: 10 }}>
                      <Link
                        className="small-button"
                        data-id={item.class_id}
                        data-cover={item.cover}
                        data-speaker={item.speaker}
                        data-roomname={item.room_name}
                        data-moderator={item.moderator}
                        data-isprivate={item.is_private}
                        data-isrequiredconfirmation={item.is_required_confirmation}
                        data-participant={item.participant}
                        data-isscheduled={item.is_scheduled}
                        data-start={item.schedule_start}
                        data-end={item.schedule_end}
                        data-folder={item.folder_id}
                        onClick={this.onClickEdit}>
                        <i className='fa fa-edit'></i> EDIT
                  </Link>
                    </small>
                    <small className="mr-3">
                      <Link className="small-button" data-id={item.class_id} onClick={this.onSubmitDelete}>
                        <i className='fa fa-trash'></i> DELETE
                  </Link>
                    </small><br />
                  </div>
                  : null
              }
              {
                // item.record &&
                // <small className="mr-3">
                //   <a className="small-button" target='_blank' href='Activity'>
                //     <i className='fa fa-compact-disc'></i> REKAMAN
                //   </a>
                // </small>
              }
            </div>
          </div>
        </div>
      )}
    </Row>;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                      onClick={this.goBack}
                    ></img>
                  </div>
                  <div className="card p-20">
                    <row>
                      <h3 className="f-w-bold f-18 fc-blue col-sm-6" style={{ float: 'left' }}>Group Meeting</h3>
                      <div className="col-sm-4" style={{ marginBottom: '10px', float: 'right' }}>
                        <InputGroup className="mb-3" style={{ background: '#FFF' }}>
                          <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                              <i className="fa fa-search"></i>
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            style={{ background: '#FFF' }}
                            onChange={this.filterMeeting}
                            placeholder="Cari Group Meeting..."
                            aria-describedby="basic-addon1"
                          />
                        </InputGroup>
                      </div>
                    </row>
                    {
                      (levelUser == 'client' && access.manage_group_meeting) || levelUser != 'client' ?
                        <Row>
                          <div className="col-md-12">
                            <button onClick={this.handleCreateMeeting.bind(this)} to="#" className="float-left btn btn-icademy-primary ml-2">
                              <i className="fa fa-plus"></i> Buat Group Meeting
                        </button>
                          </div>
                        </Row>
                        : null
                    }
                    <div>
                      {
                        classRoomsActive.length ?
                          <div>
                            <Row>
                              <div className="col-md-12 mt-4 mb-2">
                                <h3 className="f-14 f-w-800">
                                  Meeting Aktif
                            </h3>
                              </div>
                            </Row>
                            <ClassRooms list={classRoomsActive} />
                          </div>
                          :
                          null
                      }
                    </div>
                    <Row>
                      <div className="col-md-12 mt-4 mb-2">
                        <h3 className="f-14 f-w-800">
                          Meeting Tidak Aktif
                      </h3>
                      </div>
                    </Row>
                    <div>
                      {
                        classRooms.length ?

                          <ClassRooms list={classRooms} />

                          :
                          <div className="col-md-3 col-xl-3 mb-3">
                            There is no meeting
                        </div>
                      }
                    </div>

                    <Modal
                      show={this.state.isNotifikasi}
                      onHide={this.closeNotifikasi}
                    >
                      <Modal.Body>
                        <Modal.Title className="text-c-purple3 f-w-bold">
                          Notifikasi
                      </Modal.Title>

                        <p style={{ color: "black", margin: "20px 0px" }}>
                          {this.state.isiNotifikasi}
                        </p>

                        <button
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.closeNotifikasi}
                        >
                          Mengerti
                      </button>
                      </Modal.Body>
                    </Modal>

                    <Modal
                      show={this.state.isClassModal}
                      onHide={this.closeClassModal}
                      dialogClassName="modal-lg"
                    >
                      <Modal.Body>
                        <Modal.Title
                          className="text-c-purple3 f-w-bold f-21"
                          style={{ marginBottom: "30px" }}
                        >
                          {this.state.classId ? 'Change Group Meeting' : 'Create Group Meeting'}
                        </Modal.Title>

                        <Form>
                          <Form.Group controlId="formJudul">
                            <img
                              alt="media"
                              src={
                                this.state.cover == null || this.state.cover == ''
                                  ? "/assets/images/component/placeholder-image.png"
                                  :
                                  this.state.imgPreview == null || this.state.imgPreview == ''
                                    ? this.state.cover
                                    : this.state.imgPreview
                              }
                              className="img-fluid"
                              style={{ width: "200px", height: "160px" }}
                            />

                            <Form.Label className="f-w-bold ml-4">
                              <h4 className="btn-default">Image</h4>
                              <input
                                accept="image/*"
                                className="btn-default"
                                name="cover"
                                type="file"
                                onChange={this.handleChange}
                              />
                              <Form.Text className="text-muted">
                                Optimum image size is 200x200
                            </Form.Text>
                            </Form.Label>
                          </Form.Group>

                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Title
                          </Form.Label>
                            <FormControl
                              type="text"
                              placeholder="Title"
                              value={this.state.roomName}
                              onChange={e =>
                                this.setState({ roomName: e.target.value })
                              }
                            />
                            <Form.Text className="text-muted">
                              The title cannot use special characters
                          </Form.Text>
                          </Form.Group>


                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Folder Project
                          </Form.Label>
                            <MultiSelect
                              id="folder"
                              options={this.state.optionsFolder}
                              value={this.state.valueFolder}
                              onChange={valueFolder => this.setState({ valueFolder })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Select Folder Project"
                            />
                            <Form.Text className="text-muted">
                              All MOM will be collected in 1 project folder on the Files menu.
                          </Form.Text>
                          </Form.Group>

                          {/* <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Pengisi Class
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Pengisi Class"
                            value={this.state.speaker}
                            onChange={e =>
                              this.setState({ speaker: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Nama pengisi kelas atau speaker.
                          </Form.Text>
                        </Form.Group> */}

                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Moderator
                          </Form.Label>
                            <MultiSelect
                              id="moderator"
                              options={this.state.optionsModerator}
                              value={this.state.valueModerator}
                              onChange={valueModerator => this.setState({ valueModerator })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Pilih Moderator"
                            />
                            <Form.Text className="text-muted">
                              Class performers, moderators, or speakers.
                          </Form.Text>
                          </Form.Group>

                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Private Meeting
                          </Form.Label>
                            <div style={{ width: '100%' }}>
                              <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.private} />
                            </div>
                            <Form.Text className="text-muted">
                              {
                                this.state.private ? 'Only people registered as participants can join the meeting.'
                                  :
                                  'The meeting room is open. All users can join.'
                              }
                            </Form.Text>
                          </Form.Group>
                          {
                            this.state.private ?
                              <Form.Group controlId="formJudul">
                                <Form.Label className="f-w-bold">
                                  Required Confirmation of Attendance
                          </Form.Label>
                                <div style={{ width: '100%' }}>
                                  <ToggleSwitch checked={false} onChange={this.toggleSwitchRequiredConfirmation.bind(this)} checked={this.state.requireConfirmation} />
                                </div>
                                <Form.Text className="text-muted">
                                  {
                                    this.state.requireConfirmation ? 'Only participants who confirm attendance can join the meeting.'
                                      :
                                      'All meeting participants can join the meeting.'
                                  }
                                </Form.Text>
                              </Form.Group>
                              : null
                          }
                          {
                            this.state.private ?
                              <Form.Group controlId="formJudul">
                                <Form.Label className="f-w-bold">
                                  Participants from the Group
                          </Form.Label>
                                <MultiSelect
                                  id="group"
                                  options={this.state.optionsGroup}
                                  value={this.state.valueGroup}
                                  onChange={valueGroup => this.groupSelect(valueGroup)}
                                  mode="tags"
                                  removableTags={true}
                                  hasSelectAll={true}
                                  selectAllLabel="Choose all"
                                  enableSearch={true}
                                  resetable={true}
                                  valuePlaceholder="Select Participants "
                                />
                                <Form.Text className="text-muted">
                                  Select participants from the group for the private meeting.
                          </Form.Text>
                              </Form.Group>
                              : null
                          }
                          {
                            this.state.private ?
                              <Form.Group controlId="formJudul">
                                <Form.Label className="f-w-bold">
                                  Participants
                          </Form.Label>
                                <div className="row mt-1" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                  {
                                    this.state.infoParticipant.map(item =>
                                      <div className={item.confirmation === 'Hadir' ? 'attendees attend' : item.confirmation === 'Tidak Hadir' ? 'absent attendees' : 'tentative participants'}>
                                        {item.name}
                                        <button
                                          type="button"
                                          className=""
                                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(31 31 31)' }}
                                          onClick={this.deleteParticipant.bind(this, item.participant_id, item.class_id)}
                                        >
                                          X
                                            </button>
                                      </div>
                                    )
                                  }
                                </div>
                                <Form.Label className="f-w-bold">
                                  Add Participants
                          </Form.Label>
                                <MultiSelect
                                  id="peserta"
                                  options={this.state.optionsPeserta}
                                  value={this.state.valuePeserta}
                                  onChange={valuePeserta => this.setState({ valuePeserta })}
                                  mode="tags"
                                  removableTags={true}
                                  hasSelectAll={true}
                                  selectAllLabel="Choose all"
                                  enableSearch={true}
                                  resetable={true}
                                  valuePlaceholder="Select Participants"
                                />
                                <Form.Text className="text-muted">
                                  Select participants for private meetings.
                          </Form.Text>
                              </Form.Group>
                              : null
                          }

                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Scheduled Meeting
                          </Form.Label>
                            <div style={{ width: '100%' }}>
                              <ToggleSwitch checked={false} onChange={this.toggleSwitchScheduled.bind(this)} checked={this.state.scheduled} />
                            </div>
                            <Form.Text className="text-muted">
                              {
                                this.state.scheduled ? 'Scheduled meeting.'
                                  :
                                  'Meeting unscheduled. Always accessible.'
                              }
                            </Form.Text>
                          </Form.Group>
                          {
                            this.state.scheduled &&
                            <Form.Group controlId="formJudul">
                              <Form.Label className="f-w-bold">
                                Time
                          </Form.Label>
                              <div style={{ width: '100%' }}>
                                <DatePicker
                                  selected={this.state.startDate}
                                  onChange={this.handleChangeDateFrom}
                                  showTimeSelect
                                  dateFormat="yyyy-MM-dd HH:mm"
                                />
                          &nbsp;&mdash;&nbsp;
                          <DatePicker
                                  selected={this.state.endDate}
                                  onChange={this.handleChangeDateEnd}
                                  showTimeSelect
                                  dateFormat="yyyy-MM-dd HH:mm"
                                />
                              </div>
                              <Form.Text className="text-muted">
                                Choose when the meeting will take place.
                          </Form.Text>
                            </Form.Group>
                          }

                          <div style={{ marginTop: "20px" }}>
                            <button disabled={this.state.sendingEmail} type="button" onClick={this.onSubmitForm} className="btn btn-primary f-w-bold mr-3">
                              {this.state.sendingEmail ? 'Sending Invitations...' : 'Save'}
                            </button>
                          &nbsp;
                          <button
                              type="button"
                              className="btn f-w-bold"
                              onClick={this.closeClassModal}
                            >
                              Close
                          </button>
                          </div>
                        </Form>
                      </Modal.Body>
                    </Modal>

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
                                    Confirmation of attendance
                              </div>
                                  <h3 className="f-14">You have been invited to this meeting and have not confirmed attendance. Please confirm attendance.</h3>
                                </div>
                                <div className="card-carousel col-sm-4">
                                  <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="float-right btn btn-sm btn-icademy-red" style={{ padding: '5px 10px' }}>
                                    Not present
                              </Link>
                                  <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="float-right btn btn-sm btn-icademy-green" style={{ padding: '5px 10px' }}>
                                    Be present
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
                                      You have confirmed : {this.state.attendanceConfirmation}
                                    </div>
                                    <h3 className="f-14">A confirmation of your attendance has been sent to the moderator.</h3>
                                  </div>
                                </div>
                              </div>
                              :
                              null
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
                                    Type of Meeting : {this.state.infoClass.is_private ? 'Private' : 'Public'}
                                  </h3>
                                  {
                                    this.state.infoClass.is_private ?
                                      <h3 className="f-14">
                                        Confirmation of attendance : {this.state.infoClass.is_required_confirmation ? 'Wajib' : 'Tidak Wajib'}
                                      </h3>
                                      : null
                                  }
                                </div>
                                {
                                  this.state.infoClass.is_scheduled ?
                                    <div className="col-sm-6">
                                      <h3 className="f-14">
                                        Star : {infoDateStart.toISOString().slice(0, 16).replace('T', ' ')}
                                      </h3>
                                      <h3 className="f-14">
                                        End : {infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')}
                                      </h3>
                                    </div>
                                    : null
                                }
                              </div>
                              {
                                this.state.infoClass.is_private && ((levelUser == 'client' && access.manage_group_meeting) || levelUser !== 'client') ?
                                  <div>
                                    <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                      Confirmation of attendance {this.state.infoParticipant.length} Peserta
                                    </div>
                                    <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                      <div className='legend-kehadiran hadir'></div><h3 className="f-14 mb-0 mr-2"> Be present ({this.state.countHadir})</h3>
                                      <div className='legend-kehadiran tidak-hadir'></div><h3 className="f-14 mb-0 mr-2"> Not present ({this.state.countTidakHadir})</h3>
                                      <div className='legend-kehadiran tentative'></div><h3 className="f-14 mb-0 mr-2"> Not Confirmed ({this.state.countTentative})</h3>
                                    </div>
                                    <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                      {
                                        this.state.infoParticipant.map(item =>
                                          <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{item.name}</div>
                                        )
                                      }
                                    </div>
                                  </div>
                                  : null
                              }
                              {
                                this.state.infoClass.is_private && ((levelUser == 'client' && access.manage_group_meeting) || levelUser !== 'client') ?
                                  <div>
                                    <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                      Actual Attendance
                                    </div>
                                    <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                      {
                                        this.state.infoParticipant.map(item =>
                                          item.actual == 'Hadir' &&
                                          <div className='peserta aktual-hadir'>{item.name}</div>
                                        )
                                      }
                                    </div>
                                  </div>
                                  : null
                              }
                            </div>
                          </div>
                          {
                            (this.state.infoClass.is_live && (this.state.infoClass.is_scheduled == 0 || new Date() >= new Date(infoDateStart.toISOString().slice(0, 16).replace('T', ' ')) && new Date() <= new Date(infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')))) && (this.state.infoClass.is_required_confirmation == 0 || (this.state.infoClass.is_required_confirmation == 1 && this.state.attendanceConfirmation[0].confirmation == 'Hadir')) ?
                              <Link target='_blank' to={`/liveclass-room/${this.state.infoClass.class_id}`} onClick={e => this.closeModalConfirmation()} className="btn btn-sm btn-ideku" style={{ width: '100%', padding: '20px 20px' }}>
                                <i className='fa fa-video'></i> Enter
                              </Link>
                              : null
                          }
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={e => this.closeModalConfirmation()}
                          >
                            Cancel
                            </button>
                        </div>
                      </Modal.Body>
                    </Modal>
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