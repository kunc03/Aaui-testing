import React, { Component,useState } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer, Views  } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment-timezone';
import {dataKalender} from '../../modul/data';
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import {OverlayTrigger, Modal} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';
const localizer = momentLocalizer(moment);

class Event extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    infoClass: [],
    event: [],
    show : false,
    setShow : false
  }

  handleShow(){
      console.log(this.props.event, 'asdassdasd');
    this.setState({setShow:true});
  }

  handleClose(){
    this.setState({setShow:false});
  }

  confirmAttendance(confirmation){
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
          schedule_start: `${moment.tz(this.state.infoClass.schedule_start, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
          schedule_end: `${moment.tz(this.state.infoClass.schedule_end, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
          userInvite: [Storage.get('user').data.user_id],
          //url
          message: APPS_SERVER+'redirect/meeting/information/'+this.state.infoClass.class_id,
          messageNonStaff: APPS_SERVER+'meeting/'+this.state.infoClass.class_id
        }
        this.setState({alertSuccess:true})
        API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
          if(res.status === 200) {
            if(!res.data.error) {
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
          desc: Storage.get('user').data.user+' will '+(confirmation === 'Hadir' ? 'Present' : 'Not Present')+' on the meeting : '+this.state.infoClass.room_name,
          dest: `${APPS_SERVER}meeting/information/${this.state.infoClass.class_id}`,
        }
        API.post(`${API_SERVER}v1/notification/broadcast`, formNotif).then(res => {
          if(res.status === 200) {
            if(!res.data.error) {
              console.log('Sukses Notif')
            } else {
              console.log('Gagal Notif')
            }
          }
        })
      }
    })
  }
  fetchMeetingInfo(id){
    API.get(`${API_SERVER}v1/liveclass/meeting-info/${id}`).then(res => {
      if (res.status === 200) {
          this.setState({
              infoClass: res.data.result[0],
              infoParticipant: res.data.result[1],
              countHadir: res.data.result[1].filter((item) => item.confirmation == 'Hadir').length,
              countTidakHadir: res.data.result[1].filter((item) => item.confirmation == 'Tidak Hadir').length,
              countTentative: res.data.result[1].filter((item) => item.confirmation == '').length ,
              needConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation == '').length,
              attendanceConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null
          })
      }
    })
  }

  componentDidMount() {
    if (this.props.event.type === 3){
      this.fetchMeetingInfo(this.props.event.activity_id);
    }
  }

  render() {
    const access_project_admin = this.props.access_project_admin;
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);
    const event = this.props.event;
    return (
        <div>
            <div>
              {
                this.props.event.type === 3 ?
                <span onClick={this.handleShow.bind(this)}>{event.title}</span>
                :
                <span>{event.title}</span>
              }
            </div>
            <Modal show={this.state.setShow} onHide={this.handleClose.bind(this)} dialogClassName="modal-lg">
            <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                Masuk Meeting
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                this.state.needConfirmation >= 1 && this.state.infoClass.is_private == 1
                ?
                <div className="col-sm-12" style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <div className="card" style={{background:'#dac88c',flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row'}}>
                    <div className="card-carousel col-sm-8">
                        <div className="title-head f-w-900 f-16" style={{marginTop:20}}>
                        Attendance Confirmation
                        </div>
                        <h3 className="f-14">You were invited to this meeting and have not confirmed attendance. Please confirm attendance.</h3>
                    </div>
                    <div className="card-carousel col-sm-4">
                        <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="float-right btn btn-sm btn-icademy-red" style={{padding: '5px 10px'}}>
                        Not Present
                        </Link>
                        <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="float-right btn btn-sm btn-icademy-green" style={{padding: '5px 10px'}}>
                        Present
                        </Link>
                    </div>
                    </div>
                </div>
                :
                this.state.needConfirmation == 0 && this.state.infoClass.is_private == 1
                ?
                <div className="col-sm-12" style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <div className="card" style={{background:'rgb(134 195 92)',flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row'}}>
                    <div className="card-carousel col-sm-8">
                        <div className="title-head f-w-900 f-16" style={{marginTop:20}}>
                        Anda Telah Mengkonfirmasi : {this.state.attendanceConfirmation}
                        </div>
                        <h3 className="f-14">Konfirmasi kehadiran anda telah dikirim ke moderator.</h3>
                    </div>
                    </div>
                </div>
                :
                null
                }
                <div className="col-sm-12" style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <div className="card">
                        <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${this.state.infoClass.cover ? this.state.infoClass.cover : '/assets/images/component/meeting-default.jpg'})`}}></div>

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
                                Jenis Meeting : {this.state.infoClass.is_private ? 'Private' : 'Public'}
                            </h3>
                            {
                                this.state.infoClass.is_private ?
                                <h3 className="f-14">
                                Konfirmasi Kehadiran : {this.state.infoClass.is_required_confirmation ? 'Wajib' : 'Tidak Wajib'}
                                </h3>
                                : null
                            }
                            </div>
                            {
                            this.state.infoClass.is_scheduled ?
                            <div className="col-sm-6">
                                <h3 className="f-14">
                                Start : {moment.tz(infoDateStart, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")}
                                </h3>
                                <h3 className="f-14">
                                End : {moment.tz(infoDateEnd, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")}
                                </h3>
                            </div>
                            : null
                            }
                        </div>
                        {
                            this.state.infoClass.is_private && ((levelUser =='client' && (access.manage_group_meeting || access_project_admin)) || levelUser!=='client') ?
                            <div>
                            <div className="title-head f-w-900 f-16" style={{marginTop:20}}>
                                Konfirmasi Kehadiran {this.state.infoParticipant.length} Peserta
                            </div>
                            <div className="row mt-3" style={{flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row', padding:'0px 15px'}}>
                                    <div className='legend-kehadiran hadir'></div><h3 className="f-14 mb-0 mr-2"> Present ({this.state.countHadir})</h3>
                                    <div className='legend-kehadiran tidak-hadir'></div><h3 className="f-14 mb-0 mr-2"> Not Present ({this.state.countTidakHadir})</h3>
                                    <div className='legend-kehadiran tentative'></div><h3 className="f-14 mb-0 mr-2"> Unconfirmed ({this.state.countTidakHadir})</h3>
                            </div>
                            <div className="row mt-3" style={{flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row', padding:'0px 15px'}}>
                                {
                                this.state.infoParticipant.map(item=>
                                    <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{item.name}</div>
                                )
                                }
                            </div>
                            </div>
                            : null
                        }
                        {
                            this.state.infoClass.is_private && ((levelUser =='client' && access.manage_group_meeting) || levelUser!=='client') ?
                            <div>
                            <div className="title-head f-w-900 f-16" style={{marginTop:20}}>
                                Kehadiran Aktual
                            </div>
                            <div className="row mt-3" style={{flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row', padding:'0px 15px'}}>
                                {
                                this.state.infoParticipant.map(item=>
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
                </div>
            </Modal.Body>
            <Modal.Footer>
            {
                (this.state.infoClass.is_live && (this.state.infoClass.is_scheduled == 0 || new Date() >= new Date(infoDateStart.toISOString().slice(0, 16).replace('T', ' ')) && new Date() <= new Date(infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')))) && (this.state.infoClass.is_required_confirmation == 0 || (this.state.infoClass.is_required_confirmation == 1 && this.state.attendanceConfirmation[0].confirmation == 'Hadir')) ?
                <Link target='_blank' to={`/meeting-room/${this.state.infoClass.class_id}`}>
                <button
                    className="btn btn-icademy-primary"
                    onClick={e=> this.closeModalConfirmation()}
                    // style={{width:'100%'}}
                >
                    <i className="fa fa-video"></i>
                    Masuk
                </button>
                </Link>
                : null
            }
            </Modal.Footer>
            </Modal>
        </div>
    );


  }
}


export default Event;
