import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME, APPS_SERVER, BBB_URL, BBB_KEY } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import {
  Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image,
  InputGroup, FormControl, Modal
} from 'react-bootstrap';
import { toast } from "react-toastify";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
// import moment from "react-moment";
import Moment from 'moment-timezone';
import ToggleSwitch from "react-switch";
import DatePicker from "react-datepicker";
import {isMobile} from 'react-device-detect';

import Storage from './../../../repository/storage';
const bbb = require('bigbluebutton-js')


class MeetingTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      companyId: localStorage.getItem('companyID'),
      meeting: [],
      isModalConfirmation: this.props.informationId ? true : false,
      infoClass: [],
      infoParticipant: [],
      countHadir: 0,
      countTentative: 0,
      countTidakHadir: 0,
      needConfirmation : 0,
      attendanceConfirmation : '',

      imgPreview: '',

      classId: '',
      speaker: '',
      roomName: '',
      cover: '',
      isClassModal: false,
      infoClass: [],
      infoParticipant: [],
      countHadir: 0,
      countTentative: 0,
      countTidakHadir: 0,
      needConfirmation : 0,
      attendanceConfirmation : '',
      sendingEmail: false,

      //single select moderator
      optionsModerator: [],
      valueModerator: [],

      //single select folder
      optionsFolder: [],
      valueFolder: this.props.projectId != '0' ? [Number(this.props.projectId)] : [],

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

      deleteMeetingId: '',
      deleteMeetingName: '',
      filterMeeting:''
    };
  }


  filterMeeting =  (e) => {
    e.preventDefault();
    this.setState({filterMeeting : e.target.value});
  }

  testbbb(){
    let api = bbb.api(
      'https://conference.icademy.id/bigbluebutton/', 
      'pzHkONB47UvPNFQU2fUXPsifV3HHp4ISgBt9W1C0o'
    )
    let http = bbb.http
    let meetingCreateUrl = api.administration.create('My Meeting', '1', {
      duration: 2,
      attendeePW: 'secret',
      moderatorPW: 'supersecret',
      allowModsToUnmuteUsers: true,
      // logo: 'https://app.icademy.id/newasset/logo-horizontal.svg'
    })
    http(meetingCreateUrl).then((result) => {
      console.log(result)
     
      let moderatorUrl = api.administration.join('moderator', '1', 'supersecret')
      let attendeeUrl = api.administration.join('attendee', '1', 'secret')
      console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`)
     
      let meetingEndUrl = api.administration.end('1', 'supersecret')
      console.log(`End meeting link: ${meetingEndUrl}`)
    })
  }
  handleCreateMeeting() {
    this.setState({ isClassModal: true, valueFolder: [Number(this.props.projectId)]});
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
    this.setState({ private:!this.state.private });
  }
  toggleSwitchRequiredConfirmation(checked) {
    this.setState({ requireConfirmation:!this.state.requireConfirmation });
  }

  toggleSwitchScheduled(checked) {
    this.setState({ scheduled:!this.state.scheduled });
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
      this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
    }
  }
  closeClassModal = e => {
    this.setState({ isClassModal: false, speaker: '', roomName: '', imgPreview: '', cover: '', classId: '', valueGroup:[], valueModerator:[], valuePeserta:[], valueFolder:[], infoParticipant: [], infoClass: [], private:false, requireConfirmation:false, scheduled: false, startDate: new Date(), endDate: new Date() });
  }

  closeModalConfirmation = e => {
    this.setState({ isModalConfirmation: false });
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
  deleteParticipant(id, classId){
    API.delete(`${API_SERVER}v1/liveclass/participant/delete/${id}`).then(res => {
      if(res.status === 200) {
        this.fetchMeetingInfo(classId);
      }
    })
  }

  closeModalDelete = e => {
    this.setState({modalDelete:false, deleteMeetingName:'', deleteMeetingId:''})
  }
  onClickInfo(class_id){
    this.setState({isModalConfirmation: true})
    this.fetchMeetingInfo(class_id)
  }

  fetchMeeting(){
    let levelUser = Storage.get('user').data.level;
    let userId = Storage.get('user').data.user_id;
      API.get(
        this.props.projectId != 0 ?
        `${API_SERVER}v1/liveclass/project/${levelUser}/${userId}/${this.props.projectId}`
        :
        `${API_SERVER}v1/liveclass/company-user/${levelUser}/${userId}/${this.state.companyId}`
        ).then(res => {
        if (res.status === 200) {
          this.setState({
            meeting: res.data.result
          })
          this.state.meeting.map((item, i)=> {
            // CHECK BBB ROOM IS RUNNING
            let api = bbb.api(BBB_URL, BBB_KEY)
            let http = bbb.http
            let checkUrl = api.monitoring.isMeetingRunning(item.class_id)
            http(checkUrl).then((result) => {
              if (result.returncode=='SUCCESS'){
                item.running = result.running
                this.forceUpdate()
              }
              else{
                console.log('ERROR', result)
              }
            })
            // END CHECK BBB ROOM IS RUNNING
          })
        }
      })
  }

  fetchOtherData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        
        this.fetchMeeting();  
        if (this.state.optionsModerator.length==0 || this.state.optionsPeserta.length==0){
            API.get(`${API_SERVER}v1/user/company/${this.state.companyId}`).then(response => {
              response.data.result.map(item => {
                this.state.optionsModerator.push({value: item.user_id, label: item.name});
                this.state.optionsPeserta.push({value: item.user_id, label: item.name});
              });
            })
            .catch(function(error) {
              console.log(error);
            });
          }
          if (this.state.optionsFolder.length==0){
            API.get(`${API_SERVER}v1/folder/${this.state.companyId}/0`).then(response => {
              response.data.result.map(item => {
                this.state.optionsFolder.push({value: item.id, label: item.name});
              });
            })
            .catch(function(error) {
              console.log(error);
            });
          }
          API.get(`${API_SERVER}v1/branch/company/${this.state.companyId}`).then(res => {
            if(res.status === 200) {
              console.log(res, 'sdaaaaaaaaaaaaaaaa')
              // this.setState({ listBranch: res.data.result[0] })
              //   res.data.result[0].map(item => {
              //     this.state.optionsGroup.push({value: item.branch_id, label: item.branch_name});
              //   });
            }
          })
      }
    })
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
          schedule_start: start.toISOString().slice(0, 16).replace('T', ' '),
          schedule_end: end.toISOString().slice(0, 16).replace('T', ' '),
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
          desc: Storage.get('user').data.user+' Akan '+confirmation+' Pada Meeting : '+this.state.infoClass.room_name,
          dest: null,
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
  groupSelect (valueGroup){
    this.setState({ valueGroup, valuePeserta:[] })
    for (let i=0; i<valueGroup.length; i++){
      API.get(`${API_SERVER}v1/user/group/${valueGroup[i]}`).then(res => {
        if(res.status === 200) {
          const participant = res.data.result.user_id ? res.data.result.user_id.split(',').map(Number): [];
          this.setState({valuePeserta: this.state.valuePeserta.concat(participant)})
        }
      })
    }

  }
  onSubmitForm = e => {
    e.preventDefault();

    if(this.state.classId) {
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
          // END BBB START
          let api = bbb.api(BBB_URL, BBB_KEY)
          let http = bbb.http
          let meetingEndUrl = api.administration.end(this.state.classId, 'moderator')
          http(meetingEndUrl).then((result) => {
            if (result.returncode='SUCCESS'){
              // BBB CREATE START
              let meetingCreateUrl = api.administration.create(this.state.roomName, this.state.classId, {
                attendeePW: 'peserta',
                moderatorPW: 'moderator',
                allowModsToUnmuteUsers: true,
                record: true
              })
              http(meetingCreateUrl).then((result) => {
                if (result.returncode='SUCCESS'){
                  console.log('BBB SUCCESS CREATE')
                }
                else{
                  console.log('GAGAL', result)
                }
              })
              // BBB CREATE END
            }
            else{
              console.log('ERROR', result)
            }
          })
          // END BBB END
          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }
          if (res.data.result.is_private == 1){
            this.setState({sendingEmail: true})
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
              message: APPS_SERVER+'redirect/meeting/information/'+res.data.result.class_id,
              messageNonStaff: APPS_SERVER+'meeting/'+res.data.result.room_name
            }
            API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
              if(res.status === 200) {
                if(!res.data.error) {
                  this.setState({sendingEmail: false})
                  this.fetchMeeting();
                  this.closeClassModal();
                } else {
                  console.log('RESS GAGAL',res)
                }
              }
            })
          }
          else{
            this.fetchMeeting();
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
          // BBB CREATE START
          let api = bbb.api(BBB_URL, BBB_KEY)
          let http = bbb.http
          let meetingCreateUrl = api.administration.create(this.state.roomName, res.data.result.class_id, {
            attendeePW: 'peserta',
            moderatorPW: 'moderator',
            allowModsToUnmuteUsers: true,
            record: true
          })
          http(meetingCreateUrl).then((result) => {
            if (result.returncode='SUCCESS'){
              console.log('BBB SUCCESS CREATE')
            }
            else{
              console.log('GAGAL', result)
            }
          })
          // BBB CREATE END

          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }
          if (res.data.result.is_private == 1){
            this.setState({sendingEmail: true})
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
              message: APPS_SERVER+'redirect/meeting/information/'+res.data.result.class_id,
              messageNonStaff: APPS_SERVER+'meeting/'+res.data.result.room_name
            }
            API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
              if(res.status === 200) {
                if(!res.data.error) {
                  this.setState({sendingEmail: false})
                  this.fetchMeeting();
                  this.closeClassModal();
                } else {
                  console.log('RESS GAGAL',res)
                }
              }
            })
          }
          else{
            this.fetchMeeting();
            this.closeClassModal();
            toast.success('Berhasil membuat meeting baru');
          }
        }
      })
    }

  }
  onSubmitLock (classId, isLive) {
    API.put(`${API_SERVER}v1/liveclass/live/${classId}`, {is_live: isLive == 0 ? '1':'0'}).then(res => {
      if(res.status === 200) {
        this.fetchMeeting();
        toast.success(`Berhasil ${isLive == 0 ? 'membuka kunci':'mengunci'} meeting`)
      }
    })
  }
  onSubmitDelete (classId) {
    API.delete(`${API_SERVER}v1/liveclass/delete/${classId}`).then(res => {
      if(res.status === 200) {
        this.fetchMeeting();
        this.closeModalDelete();
        // END BBB START
        let api = bbb.api(BBB_URL, BBB_KEY)
        let http = bbb.http
        let meetingEndUrl = api.administration.end(classId, 'moderator')
        http(meetingEndUrl).then((result) => {
          if (result.returncode='SUCCESS'){
            console.log('Meeting end')
          }
          else{
            console.log('ERROR', result)
          }
        })
        // END BBB END
        toast.success('Berhasil menghapus meeting')
      }
    })
  }
  dialogDelete(id, name){
    this.setState({
      deleteMeetingId: id,
      deleteMeetingName: name,
      modalDelete: true
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
    const participant = e.target.getAttribute('data-participant') ? e.target.getAttribute('data-participant').split(',').map(Number): [];
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
  componentDidMount(){
    this.fetchOtherData();
    if (this.props.informationId){
      this.fetchMeetingInfo(this.props.informationId)
      if (isMobile){
        alert('ini mobile')
      }
    }
  }

  render() {
    const headerTabble = [
      // {title : 'Nama Meeting', width: null, status: true},
      {title : 'Moderator', width: null, status: true},
      {title : 'Status', width: null, status: true},
      {title : 'Waktu', width: null, status: true},
      {title : 'Tanggal', width: null, status: true},
      {title : 'Peserta', width: null, status: true},
      // {title : 'File Project', width: null, status: true},
    ];
    let bodyTabble = this.state.meeting;
    const access_project_admin = this.props.access_project_admin;
		let access = Storage.get('access');
		let levelUser = Storage.get('user').data.level;
    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);
    let { filterMeeting } = this.state;
    if(filterMeeting != ""){
      bodyTabble = bodyTabble.filter(x=>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterMeeting,"gmi"))
      )
    }
    return (
            <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Meeting</strong>
                {access_project_admin == true ? <button
                onClick={this.handleCreateMeeting.bind(this)}
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important", marginLeft:14 }}
                >
                <i className="fa fa-plus"></i>
                
                Tambah
                </button> : null}
                <input 
                    type="text"
                    placeholder="Search"
                    onChange={this.filterMeeting}
                    className="form-control float-right col-sm-3"/>
            </span>
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                    <td>Nama Meeting</td>
                    {
                        headerTabble.map((item, i) => {
                            return (
                            <td align="center" width={item.width}>{item.title}</td>
                            )
                        })
                    }
                    <td colSpan="2" align="center">Aksi</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        bodyTabble.length == 0 ?
                        <tr>
                            <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>Tidak ada</td>
                        </tr>
                        :
                        bodyTabble.map((item, i) => {
                            // let dateStart = new Date(new Date(item.schedule_start).toISOString().slice(0, 16).replace('T', ' '));
                            let dateStart = new Date(item.schedule_start);
                            let dateEnd = new Date(item.schedule_end);
                            let status='';
                            if ((new Date() >= dateStart && new Date() <= dateEnd) || item.is_scheduled == 0){
                                status='Open'
                            }
                            else{
                                status='Close'
                            }
                            if (item.is_live == 0){
                              status = 'Terkunci'
                            }
                            if (item.running){
                              status = 'Aktif'
                            }
                            return (
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">{item.room_name}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.name}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center" style={{color: status == 'Open' ? '#FA6400': status == 'Terkunci' ? '#F00' : status == 'Aktif' ? '#1b9a1b' : '#0091FF'}}>{status}</td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.waktu_start+' - '+item.waktu_end : '-'}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.tanggal : '-'}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_private == 1 ? item.total_participant : '-'}</td>
                                {/* <td className="fc-muted f-14 f-w-300" align="center" style={{borderRight: '1px solid #DDDDDD'}}>
                                <button className="btn btn-icademy-file" ><i className="fa fa-download fc-skyblue"></i> Download File</button>
                                </td> */}
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1">
                                    {access_project_admin == true ? <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>:null}
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.onSubmitLock.bind(this, item.class_id, item.is_live)}>{item.is_live ? 'Kunci' : 'Buka Kunci'}</button>
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={this.onClickEdit}
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
                                      >
                                          Ubah
                                      </button>
                                      <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, item.class_id, item.room_name)}>Hapus</button>
                                    </div>
                                  </span>
                                </td>
                                <td className="fc-muted f-14 f-w-300 " align="center"><button className={`btn btn-icademy-primary btn-icademy-${status == 'Open' || status == 'Aktif' ? 'warning' : 'grey'}`} onClick={this.onClickInfo.bind(this, item.class_id)}>{status == 'Open' || status == 'Aktif' ? 'Masuk' : 'Informasi'}</button></td>
                            </tr>
                            )
                        })
                    }
                </tbody>
                </table>
            </div>
                  <Modal
                    show={this.state.isClassModal}
                    onHide={this.closeClassModal}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                        {this.state.classId ? 'Ubah Group Meeting' : 'Membuat Group Meeting'}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

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
                            <h4 className="btn-default">Masukkan Gambar</h4>
                            <input
                              accept="image/*"
                              className="btn-default"
                              name="cover"
                              type="file"
                              onChange={this.handleChange}
                            />
                            <Form.Text className="text-muted">
                              Ukuran gambar 200x200 piksel.
                            </Form.Text>
                          </Form.Label>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Judul Meeting
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Judul"
                            value={this.state.roomName}
                            onChange={e =>
                              this.setState({ roomName: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Judul tidak boleh menggunakan karakter spesial
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
                            valuePlaceholder="Pilih Folder Project"
                          />
                          <Form.Text className="text-muted">
                            Seluruh MOM akan dikumpulkan dalam 1 folder project pada menu Files.
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
                            Pengisi kelas, moderator, atau speaker.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Private Meeting
                          </Form.Label>
                          <div style={{width:'100%'}}>
                           <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.private} />
                          </div>
                          <Form.Text className="text-muted">
                            {
                              this.state.private ? 'Hanya orang yang didaftarkan sebagai peserta yang bisa bergabung pada meeting.'
                              :
                              'Meeting room bersifat terbuka. Semua user dapat bergabung.'
                            }
                          </Form.Text>
                        </Form.Group>
                        {
                        this.state.private ?
                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Wajib Konfirmasi Kehadiran
                          </Form.Label>
                          <div style={{width:'100%'}}>
                           <ToggleSwitch checked={false} onChange={this.toggleSwitchRequiredConfirmation.bind(this)} checked={this.state.requireConfirmation} />
                          </div>
                          <Form.Text className="text-muted">
                            {
                              this.state.requireConfirmation ? 'Hanya peserta yang konfirmasi hadir yang dapat bergabung ke meeting.'
                              :
                              'Semua peserta meeting dapat gabung ke meeting.'
                            }
                          </Form.Text>
                        </Form.Group>
                        : null
                        }
                        {
                        this.state.private ?
                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Peserta Dari Group
                          </Form.Label>
                          <MultiSelect
                            id="group"
                            options={this.state.optionsGroup}
                            value={this.state.valueGroup}
                            onChange={valueGroup => this.groupSelect(valueGroup)}
                            mode="tags"
                            removableTags={true}
                            hasSelectAll={true}
                            selectAllLabel="Pilih Semua"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih Peserta"
                          />
                          <Form.Text className="text-muted">
                            Pilih peserta dari group untuk private meeting.
                          </Form.Text>
                        </Form.Group>
                        :null
                        }
                        {
                        this.state.private ?
                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Peserta
                          </Form.Label>
                          <div className="row mt-1" style={{flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row', padding:'0px 15px'}}>
                                      {
                                        this.state.infoParticipant.map(item=>
                                          <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>
                                            {item.name}
                                            <button
                                              type="button"
                                              className=""
                                              style={{background:'none', border:'none', cursor:'pointer', color:'rgb(31 31 31)'}}
                                              onClick={this.deleteParticipant.bind(this, item.participant_id, item.class_id)}
                                            >
                                              X
                                            </button>
                                          </div>
                                        )
                                      }
                          </div>
                          <Form.Label className="f-w-bold">
                            Tambah Peserta
                          </Form.Label>
                          <MultiSelect
                            id="peserta"
                            options={this.state.optionsPeserta}
                            value={this.state.valuePeserta}
                            onChange={valuePeserta => this.setState({ valuePeserta })}
                            mode="tags"
                            removableTags={true}
                            hasSelectAll={true}
                            selectAllLabel="Pilih Semua"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih Peserta"
                          />
                          <Form.Text className="text-muted">
                            Pilih peserta untuk private meeting.
                          </Form.Text>
                        </Form.Group>
                        :null
                        }

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Scheduled Meeting
                          </Form.Label>
                          <div style={{width:'100%'}}>
                           <ToggleSwitch checked={false} onChange={this.toggleSwitchScheduled.bind(this)} checked={this.state.scheduled} />
                          </div>
                          <Form.Text className="text-muted">
                            {
                              this.state.scheduled ? 'Meeting terjadwal.'
                              :
                              'Meeting tidak terjadwal. Selalu dapat diakses.'
                            }
                          </Form.Text>
                        </Form.Group>
                        {
                          this.state.scheduled &&
                          <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Waktu
                          </Form.Label>
                          <div style={{width:'100%'}}>
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
                            Pilih waktu meeting akan berlangsung.
                          </Form.Text>
                        </Form.Group>
                        }

                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeClassModal}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary"
                        onClick={this.onSubmitForm}
                      >
                        <i className="fa fa-save"></i>
                        {this.state.sendingEmail ? 'Mengirim Undangan...' : 'Simpan'}
                      </button>
                    </Modal.Footer>
                  </Modal>
                  <Modal
                    show={this.state.isModalConfirmation}
                    onHide={this.closeModalConfirmation}
                    dialogClassName="modal-lg"
                  >
                  <Modal.Header closeButton>
                    <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                    Informasi Meeting dan Kehadiran
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
                                Konfirmasi Kehadiran
                              </div>
                              <h3 className="f-14">Anda diundang dalam meeting ini dan belum mengkonfirmasi kehadiran. Silahkan konfirmasi kehadiran.</h3>
                            </div>
                            <div className="card-carousel col-sm-4">
                              <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="float-right btn btn-sm btn-icademy-red" style={{padding: '5px 10px'}}>
                                Tidak Hadir
                              </Link>
                              <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="float-right btn btn-sm btn-icademy-green" style={{padding: '5px 10px'}}>
                                Hadir
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
                                        Mulai : {infoDateStart.toISOString().slice(0, 16).replace('T', ' ')}
                                      </h3>
                                      <h3 className="f-14">
                                        Selesai : {infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')}
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
                                          <div className='legend-kehadiran hadir'></div><h3 className="f-14 mb-0 mr-2"> Hadir ({this.state.countHadir})</h3>
                                          <div className='legend-kehadiran tidak-hadir'></div><h3 className="f-14 mb-0 mr-2"> Tidak Hadir ({this.state.countTidakHadir})</h3>
                                          <div className='legend-kehadiran tentative'></div><h3 className="f-14 mb-0 mr-2"> Belum Konfirmasi ({this.state.countTentative})</h3>
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
              <Modal
                show={this.state.modalDelete}
                onHide={this.closeModalDelete}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                  Konfirmasi
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>Anda yakin akan menghapus meeting <b>{this.state.deleteMeetingName}</b> ?</div>
                </Modal.Body>
                <Modal.Footer>
                            <button
                              className="btn btm-icademy-primary btn-icademy-grey"
                              onClick={this.closeModalDelete.bind(this)}
                            >
                              Batal
                            </button>
                            <button
                              className="btn btn-icademy-primary btn-icademy-red"
                              onClick={this.onSubmitDelete.bind(this, this.state.deleteMeetingId)}
                            >
                              <i className="fa fa-trash"></i>
                              Hapus
                            </button>
                </Modal.Footer>
              </Modal>
            </div>
                    
    );
  }
}

export default MeetingTable;