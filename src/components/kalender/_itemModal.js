import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment-timezone';
import { dataKalender } from '../../modul/data';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import { OverlayTrigger, Modal } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import Moment from 'moment-timezone'

const localizer = momentLocalizer(moment);

class Event extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    infoClass: {},
    event: [],
    show: false,
    setShow: false,
    webinarShow: false,

    linkZoom: '',
  }

  handleShow(a) {
    // eslint-disable-next-line default-case
    switch (a) {
      case 'webinar':
        this.setState({ webinarShow: true });
        break;

      case 'meeting':
        this.setState({ setShow: true });
        break;
    }
  }

  handleClose() {
    this.setState({ setShow: false });
  }

  handleCloseWebinar() {
    this.setState({ webinarShow: false });
  }

  confirmAttendance(confirmation) {
    let form = {
      confirmation: confirmation,
    }

    API.put(`${API_SERVER}v1/liveclass/confirmation/${this.props.event.activity_id}/${Storage.get('user').data.user_id}`, form).then(async res => {
      if (res.status === 200) {
        this.fetchMeetingInfo(this.props.event.activity_id)
        this.fetchMeetPub(this.props.event.activity_id)

        let formNotif = {
          user_id: this.state.infoClass.moderator,
          type: 3,
          activity_id: this.state.infoClass.class_id,
          desc: Storage.get('user').data.user + ' will ' + (confirmation === 'Hadir' ? 'Present' : 'Not Present') + ' on the meeting : ' + this.state.infoClass.room_name,
          dest: `${APPS_SERVER}meeting/information/${this.props.event.activity_id}`,
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

  componentDidMount() {
    if (this.props.event.type === 3) {
      // this.fetchMeetingInfo(this.props.event.activity_id);
      this.fetchMeetPub(this.props.event.activity_id);
    }
  }

  fetchMeetingInfo(meeting_id) {
    API.get(`${API_SERVER}v1/liveclass/meeting-info/${meeting_id}`).then(res => {
      if (res.status === 200) {
        this.setState({
          infoClass: res.data.result[0],
          infoParticipant: res.data.result[1],
          countHadir: res.data.result[1] ? res.data.result[1].filter((item) => item.confirmation == 'Hadir').length : 0,
          countTidakHadir: res.data.result[1] ? res.data.result[1].filter((item) => item.confirmation == 'Tidak Hadir').length : 0,
          countTentative: res.data.result[1] ? res.data.result[1].filter((item) => item.confirmation == '').length : 0,
          needConfirmation: res.data.result[1] ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation == '').length : 0,
          attendanceConfirmation: res.data.result[1] ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null : null
        })
      }
    })
  }

  fetchMeetPub(booking_id) {
    API.get(`${API_SERVER}v2/meetpub/id/${booking_id}`).then(res => {
      let { result } = res.data
      let { participants } = result
      this.setState({
        infoClass: result,
        infoParticipant: participants,
        countHadir: participants && participants.length ? participants.filter((item) => item.confirmation == 'Hadir').length : 0,
        countTidakHadir: participants && participants.length ? participants.filter((item) => item.confirmation == 'Tidak Hadir').length : 0,
        countTentative: participants && participants.length ? participants.filter((item) => item.confirmation == '').length : 0,
        needConfirmation: participants && participants.length ? participants.filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation === '').length : 0,
        attendanceConfirmation: participants && participants.length ? participants.filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? participants.filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null : ''
      })
    })
  }

  updateRecent() {
    console.log('ke apdet')
  }

  render() {
    const access_project_admin = this.props.access_project_admin;
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    
    let jamSekarang = Moment()
    let infoDateStart = Moment.tz(`${Moment(this.state.infoClass.tanggal).format('YYYY-MM-DD')} ${this.state.infoClass.jam_mulai}`, Moment.tz.guess(true));
    let infoDateEnd = Moment.tz(`${Moment(this.state.infoClass.tanggal).format('YYYY-MM-DD')} ${this.state.infoClass.jam_selesai}`, Moment.tz.guess(true));
    
    console.log('jamSekarang', { jamSekarang, infoDateStart, infoDateEnd, kondisi: jamSekarang.isBetween(infoDateStart, infoDateEnd) })
    const event = this.props.event;
    return (
      <div>
        <div>
          {
            this.props.event.type === 3 ?
              <span onClick={this.handleShow.bind(this, 'meeting')}>{event.title}</span>
              :
              <span onClick={this.handleShow.bind(this, 'webinar')}>{event.title}</span>
          }
        </div>
        {/* MODAL WEBINAR */}
        <Modal show={this.state.webinarShow} onHide={this.handleCloseWebinar.bind(this)} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Webinar
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div className="card" style={{ background: '#fff', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                <div className="card-carousel col-sm-8">
                  <p className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                    {event.title}
                  </p>
                  <h6>Start : {moment.tz(event.start, moment.tz.guess(true)).format("DD MMMM YYYY HH:mm")}</h6>
                  <h6>End : {moment.tz(event.end, moment.tz.guess(true)).format("DD MMMM YYYY HH:mm")}</h6>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
          <Link target='_blank' to={`/webinar/live/${this.props.event.activity_id}`}>
            <button className="btn btn-icademy-primary">
              <i className="fa fa-video"></i> Join
              </button>
          </Link>
          </Modal.Footer>
        </Modal>

        {/* MODAL MEETING */}
        <Modal show={this.state.setShow} onHide={this.handleClose.bind(this)} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Meeting and Attendance Information
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.needConfirmation >= 1 && this.state.infoClass.is_required_confirmation === 1 ?
              <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="card" style={{ background: '#dac88c', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <div className="card-carousel col-sm-8">
                    <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                      Attendance Confirmation
                  </div>
                    <h3 className="f-14">You were invited to this meeting and have not confirmed attendance. Please confirm attendance.</h3>
                  </div>
                  <div className="card-carousel col-sm-4">
                    <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="float-right btn btn-sm btn-icademy-red" style={{ padding: '5px 10px' }}> Not Present
                  </Link>
                    <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="float-right btn btn-sm btn-icademy-green" style={{ padding: '5px 10px' }}> Present
                  </Link>
                  </div>
                </div>
              </div>
                :
                this.state.needConfirmation === 0 && this.state.infoClass.is_required_confirmation === 1 ?
                  <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="card" style={{ background: 'rgb(134 195 92)', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                      <div className="card-carousel col-sm-8">
                        <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                          You Have Confirmed : {this.state.attendanceConfirmation === 'Hadir' ? 'Present' : 'Not Present'}
                        </div>
                        <h3 className="f-14">Confirmation of your attendance has been sent to the moderator.</h3>
                      </div>
                    </div>
                  </div>
                :
                null
            }
            
            <div className="row">
              <div className="col-sm-6">
                <div className="title-head f-w-900 f-16" style={{marginBottom:20}}>
                  {this.state.infoClass.room_name}
                </div>
              </div>
            </div>
            <div class="row">
              <div className="col-sm-6">
                <h3 className="f-14">{this.state.infoClass.keterangan}</h3>
                {
                  this.state.infoClass.is_akses ?
                    <h3 className="f-14">
                      Moderator : {this.state.infoClass.moderator_name}
                    </h3>
                  : null
                }
                {
                  this.state.infoClass.is_private ?
                  <h3 className="f-14">
                    {this.state.infoClass.is_required_confirmation ? 'Mandatory attendance confirmation' : 'Non mandatory attendance confirmation'}
                  </h3>
                  : null
                }
              </div>
              <div className="col-sm-6">
                <h3 className="f-14">
                  Start : {Moment.tz(`${Moment(this.state.infoClass.tanggal).format('YYYY-MM-DD')} ${this.state.infoClass.jam_mulai}`, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}
                </h3>
                <h3 className="f-14">
                  End : {Moment.tz(`${Moment(this.state.infoClass.tanggal).format('YYYY-MM-DD')} ${this.state.infoClass.jam_selesai}`, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}
                </h3>
              </div>
            </div>

            {
              this.state.infoClass.is_private ?
              <div>
                <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                  Attendance Confirmation of {this.state.infoParticipant.length} Participants
                </div>
                <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                  <div className='legend-kehadiran hadir'></div>
                  <h3 className="f-14 mb-0 mr-2"> Present ({this.state.countHadir})</h3>
                  <div className='legend-kehadiran tidak-hadir'></div>
                  <h3 className="f-14 mb-0 mr-2"> Not Present ({this.state.countTidakHadir})</h3>
                  <div className='legend-kehadiran tentative'></div>
                  <h3 className="f-14 mb-0 mr-2"> Unconfirmed ({this.state.countTentative})</h3>
                </div>
                <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                  {this.state.infoParticipant.map(item =>
                    <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{item.name}</div>
                  )}
                </div>
              </div>
              : null
            }

            {
              this.state.infoClass.is_private ?
              <div>
                <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                Actual Attendance In Meeting Room
                </div>
                {
                  this.state.infoParticipant.filter(item=> item.actual === 'Hadir').length ? null : <h3 className="f-14" style={{marginTop:20}}>There's no participant attended</h3>
                }
                <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                  {this.state.infoParticipant.map(item => item.actual === 'Hadir' &&
                    <div className='peserta aktual-hadir'>{item.name}</div>
                  )}
                </div>
              </div>
              : null
            }
          </Modal.Body>
          {
            (this.state.infoClass.is_private === 1 && Moment().isBetween(infoDateStart, infoDateEnd)) || Moment().isBetween(infoDateStart, infoDateEnd) ?
              <Modal.Footer>
                <a className="btn btn-v2 btn-primary" rel="noopener noreferrer" target='_blank' href={`/meet/${this.state.infoClass.id}`}>
                  <i className="fa fa-video"></i> Join
                </a>
              </Modal.Footer>
            : null
          }

        </Modal>
      </div>
    );


  }
}


export default Event;
