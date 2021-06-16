import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME, APPS_SERVER, BBB_URL, BBB_KEY } from '../../repository/api';
// import '../ganttChart/node_modules/@trendmicro/react-dropdown/dist/react-dropdown.css';

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import {
  Form, FormControl, Modal
} from 'react-bootstrap';
import { toast } from "react-toastify";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import Select from 'react-select';
// import moment from "react-moment";
import Moment from 'moment-timezone';
import ToggleSwitch from "react-switch";
import DatePicker from "react-datepicker";
import DataTable from 'react-data-table-component';
import SocketContext from '../../socket';
import { isMobile } from 'react-device-detect';

import Storage from '../../repository/storage';
import moment from 'moment-timezone'

const bbb = require('bigbluebutton-js')

const LINK_ZOOM = 'https://zoom.us/j/4912503275?pwd=Ujd5QW1seVhIcmU4ZGV3bmRxUUV3UT09'

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
      webinar_id: this.props.webinarId ? this.props.webinarId : 0,
      infoClass: [],
      infoParticipant: [],
      countHadir: 0,
      countTentative: 0,
      countTidakHadir: 0,
      needConfirmation: 0,
      attendanceConfirmation: '',
      tanggal: '',
      jamMulai: '',
      jamSelesai: '',
      keterangan: '',
      bookingMeetingId: '',

      engine: 'bbb',
      mode: 'web',

      checkZoom: [],

      imgPreview: '',

      classId: '',
      speaker: '',
      roomName: '',
      cover: '',
      isClassModal: false,
      modalJadwal: false,
      sendingEmail: false,
      dataBooking: {
        room_name: '',
        booking: []
      },

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
      akses: false,
      private: false,
      scheduled: false,
      requireConfirmation: false,
      startDate: new Date(),
      endDate: new Date(),

      deleteMeetingId: '',
      deleteMeetingName: '',
      filterMeeting: '',
      isInvite: false,
      emailInvite: [],
      emailResponse: '',
      //multi select invite
      optionsInvite: [],
      valueInvite: [],
      classRooms: [],

      limit: 10,
      offset: 0,
      count: 0,
      page: 1,
      value: '10',
      rowsPerPage: 15,

      oldStartDate: new Date(),
      oldEndDate: new Date(),

      limitCompany: [],

      gb: []
    };
  }
  handleChangeEmail(emailInvite) {
    this.setState({ emailInvite })
  }


  handleCloseInvite = e => {
    this.setState({
      isInvite: false,
      emailInvite: [],
      emailResponse: ""
    });
  }
  onClickInvite(class_id) {
    this.setState({ isInvite: true });
    API.get(`${API_SERVER}v1/liveclass/id/${class_id}`).then(res => {
      this.setState({
        classRooms: res.data.result
      });
    })
  }
  onClickSubmitInvite = e => {
    e.preventDefault();
    if (this.state.emailInvite == '' && this.state.valueInvite == '') {
      toast.warning(`Select user or insert participant's email`);
    }
    else {
      this.setState({ sendingEmail: true })
      let form = {
        user: Storage.get('user').data.user,
        email: this.state.emailInvite,
        room_name: this.state.classRooms.room_name,
        is_private: this.state.classRooms.is_private,
        is_scheduled: this.state.classRooms.is_scheduled,
        schedule_start: Moment.tz(this.state.classRooms.schedule_start, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
        schedule_end: Moment.tz(this.state.classRooms.schedule_end, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
        userInvite: this.state.valueInvite,
        message: APPS_SERVER + 'redirect/meeting/information/' + this.state.classRooms.class_id,
        messageNonStaff: APPS_SERVER + 'meeting/' + this.state.classRooms.class_id
      }

      API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            this.setState({
              isInvite: false,
              emailInvite: [],
              valueInvite: [],
              emailResponse: res.data.result,
              sendingEmail: false
            });
            toast.success("Sending invitation to participant's Email.")
          } else {
            toast.error("Email tidak terkirim, periksa kembali email yang dimasukkan.")
            this.setState({ sendingEmail: false })
          }
        }
      })
    }
  }

  filterMeeting = (e) => {
    e.preventDefault();
    this.setState({ filterMeeting: e.target.value });
  }

  testbbb() {
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
    this.setState({ isClassModal: true, infoParticipant: [], valueFolder: [Number(this.props.projectId)] });
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

  toggleSwitchAkses(checked) {
    this.setState({ akses: !this.state.akses });
  }
  toggleSwitch(checked) {
    this.setState({ private: !this.state.private });
    if (!checked) {
      this.setState({ requireConfirmation: false });
    }
  }
  toggleSwitchRequiredConfirmation(checked) {
    this.setState({ requireConfirmation: !this.state.requireConfirmation });
  }

  toggleSwitchScheduled(checked) {
    this.setState({ scheduled: !this.state.scheduled });
  }
  handleChange = e => {
    // const name = e.target.name;
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
  closeClassModal = e => {
    this.setState({ isClassModal: false, speaker: '', roomName: '', imgPreview: '', cover: '', classId: '', valueGroup: [], valueModerator: [], valuePeserta: [], valueFolder: [], infoClass: [], private: false, requireConfirmation: false, akses: false, infoParticipant: [], scheduled: false, startDate: new Date(), endDate: new Date() });
  }
  closemodalJadwal = (id) => {
    this.setState({ modalJadwal: false });
  }

  closeModalConfirmation = e => {
    this.setState({ isModalConfirmation: false });
  }

  fetchMeetingInfo(id) {
    if (isMobile) {
      window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'redirect/meeting/information/' + id))
    }
    API.get(`${API_SERVER}v1/liveclass/meeting-info/${id}`).then(res => {
      console.log(res.data.result, 'prop informationId');
      if (res.status === 200) {
        this.setState({
          infoClass: res.data.result[0],
          infoParticipant: res.data.result[1],
          countHadir: res.data.result[1].filter((item) => item.confirmation == 'Hadir').length,
          countTidakHadir: res.data.result[1].filter((item) => item.confirmation == 'Tidak Hadir').length,
          countTentative: res.data.result[1].filter((item) => item.confirmation == '').length,
          needConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation === '').length,
          attendanceConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null
        })
      }
    })
  }
  deleteParticipant(id, classId) {
    API.delete(`${API_SERVER}v1/liveclass/participant/delete/${id}`).then(res => {
      if (res.status === 200) {
        this.fetchMeetingInfo(classId);
      }
    })
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteMeetingName: '', deleteMeetingId: '' })
  }
  onClickInfo(class_id) {
    this.setState({ isModalConfirmation: true });
    this.fetchMeetingInfo(class_id);

    // console.log(this.props.projectId, 'pROJECTY');
    API.post(`${API_SERVER}v1/liveclass/id/${this.props.projectId}`);
  }

  fetchMeeting() {
    let levelUser = Storage.get('user').data.level;
    let userId = Storage.get('user').data.user_id;
    let apiMeeting = '';
    if (this.props.projectId != 0 && !this.props.webinarId) {
      apiMeeting = `${API_SERVER}v1/liveclass/project/${this.props.access_project_admin ? 'admin' : levelUser}/${userId}/${this.props.projectId}`
    }
    else if (this.props.webinarId) {
      apiMeeting = `${API_SERVER}v1/liveclass/webinar/${this.props.access_project_admin ? 'admin' : levelUser}/${userId}/${this.props.webinarId}`
    }
    else if (this.props.allMeeting) {
      apiMeeting = `${API_SERVER}v1/liveclass/company-user/${levelUser}/${userId}/${this.state.companyId}`
    }

    API.get(apiMeeting).then(res => {
      if (res.status === 200) {
        // console.log('data meeting', res);
        this.totalPage = res.data.result.length;
        res.data.result.map((item, i) => {
          // CHECK BBB ROOM IS RUNNING
          let api = bbb.api(BBB_URL, BBB_KEY)
          let http = bbb.http
          let checkUrl = api.monitoring.isMeetingRunning(item.class_id)
          http(checkUrl).then((result) => {
            if (result.returncode == 'SUCCESS') {
              item.running = result.running
              let dateStart = new Date(item.schedule_start);
              let dateEnd = new Date(item.schedule_end);

              if ((new Date() >= dateStart && new Date() <= dateEnd) || item.is_scheduled == 0) {
                item.status = 'Open'
              } else {
                item.status = 'Close'
              }

              if (item.is_live == 0) {
                item.status = 'Locked'
              }

              if (item.running) {
                item.status = 'Active'
              }

              if (item.running && item.is_live === 0) {
                item.status = 'Active & Locked'
              }

              if (item.is_akses == 0) {
                item.name = '-';
              }

              if (item.name === null) {
                item.name = '-';
              }

              this.forceUpdate()
            }
            else {
              console.log('ERROR', result)
            }
          })
          // END CHECK BBB ROOM IS RUNNING
        })
        this.setState({
          meeting: res.data.result,
        })
      }
    })
  }

  fetchOtherData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

        this.fetchMeeting();
        this.checkLimitCompany();

        //get and push multiselect option
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        let sqlNotFromProject = `${API_SERVER}v1/user/company/${this.state.companyId}`;
        let sqlFromProject = `${API_SERVER}v2/project/user/${this.props.projectId}`;
        API.get(this.props.projectId != 0 ? sqlFromProject : sqlNotFromProject).then(response => {
          response.data.result.map(item => {
            this.state.optionsInvite.push({ value: item.user_id, label: item.name });
          });
        })
          .catch(function (error) {
            console.log(error);
          });

        if (this.state.optionsModerator.length == 0 || this.state.optionsPeserta.length == 0) {
          API.get(this.props.projectId != 0 ? sqlFromProject : sqlNotFromProject).then(response => {
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
          API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
            response.data.result.map(item => {
              this.state.optionsFolder.push({ value: item.id, label: item.title });
            });
          })
            .catch(function (error) {
              console.log(error);
            });
        }
        API.get(`${API_SERVER}v1/branch/company/${this.state.companyId}`).then(res => {
          if (res.status === 200) {
            // console.log(res, 'sdaaaaaaaaaaaaaaaa')
            this.setState({ listBranch: res.data.result[0] })
            res.data.result[0].map(item => {
              this.state.optionsGroup.push({ value: item.branch_id, label: item.branch_name });
            });
          }
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
        let form = {
          confirmation: confirmation,
          user: Storage.get('user').data.user,
          email: [],
          room_name: this.state.infoClass.room_name,
          is_private: this.state.infoClass.is_private,
          is_scheduled: this.state.infoClass.is_scheduled,
          schedule_start: Moment.tz(this.state.infoClass.schedule_start, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
          schedule_end: Moment.tz(this.state.infoClass.schedule_end, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
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
  groupSelect(valueGroup) {
    this.setState({ valueGroup, valuePeserta: [] })
    for (let i = 0; i < valueGroup.length; i++) {
      API.get(`${API_SERVER}v1/user/group/${valueGroup[i]}`).then(res => {
        if (res.status === 200) {
          const participant = res.data.result.user_id ? res.data.result.user_id.split(',').map(Number) : [];
          this.setState({ valuePeserta: this.state.valuePeserta.concat(participant) })
        }
      })
    }

  }
  onSubmitForm = e => {
    e.preventDefault();
    if (this.state.roomName === '' || !this.state.valueFolder.length) {
      toast.warning('Judul meeting dan folder project wajib diisi')
    }
    else {
      if (this.state.checkZoom.length === 1) {
        if (this.state.classId) {
          let isPrivate = this.state.private == true ? 1 : 0;
          let isAkses = this.state.akses == true ? 1 : 0;
          let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;
          let isScheduled = this.state.scheduled == true ? 1 : 0;
          let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          let form = {
            room_name: this.state.roomName,
            moderator: this.state.valueModerator,
            folder_id: this.state.valueFolder.length ? this.state.valueFolder[0] : 0,
            webinar_id: this.state.webinar_id,
            is_private: isPrivate,
            is_akses: isAkses,
            is_required_confirmation: isRequiredConfirmation,
            is_scheduled: isScheduled,
            schedule_start: startDateJkt,
            schedule_end: endDateJkt,
            peserta: this.state.valuePeserta,

            engine: this.state.engine,
            mode: this.state.mode
          }

          console.log(form)

          if ((this.state.oldStartDate != startDateJkt) && (this.state.oldEndDate != endDateJkt)) {
            let userNotif = this.state.valuePeserta.concat(this.state.infoParticipant.map(item => item.user_id));
            for (var i = 0; i < userNotif.length; i++) {
              console.log('User: ', userNotif[i])
              // send notif
              let notif = {
                user_id: userNotif[i],
                activity_id: this.state.valueFolder[0],
                type: 3,
                desc: `Meeting "${form.room_name}" pada tanggal ${moment(this.state.oldStartDate).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm')} diubah ke tanggal ${moment(startDateJkt).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm')}`,
                dest: `${APPS_SERVER}detail-project/${this.state.valueFolder[0]}`,
                types: 2
              }
              API.post(`${API_SERVER}v1/notification/broadcast`, notif).then(res => this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id }));
            }
          }

          API.put(`${API_SERVER}v1/liveclass/id/${this.state.classId}`, form).then(async res => {
            if (res.status === 200) {
              // END BBB START
              let api = bbb.api(BBB_URL, BBB_KEY)
              let http = bbb.http
              let meetingEndUrl = api.administration.end(this.state.classId, 'moderator')
              http(meetingEndUrl).then((result) => {
                if (result.returncode = 'SUCCESS') {
                  // BBB CREATE START
                  let meetingCreateUrl = api.administration.create(this.state.roomName, this.state.classId, {
                    attendeePW: 'Participants',
                    moderatorPW: 'moderator',
                    allowModsToUnmuteUsers: true,
                    record: true
                  })
                  http(meetingCreateUrl).then((result) => {
                    if (result.returncode = 'SUCCESS') {
                      console.log('BBB SUCCESS CREATE')
                    }
                    else {
                      console.log('GAGAL', result)
                    }
                  })
                  // BBB CREATE END
                }
                else {
                  console.log('ERROR', result)
                }
              })
              // END BBB END
              if (this.state.cover) {
                let formData = new FormData();
                formData.append('cover', this.state.cover);
                await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
              }
              if (res.data.result.is_private == 1) {
                this.setState({ sendingEmail: true })
                let form = {
                  user: Storage.get('user').data.user,
                  email: [],
                  room_name: res.data.result.room_name,
                  is_private: res.data.result.is_private,
                  is_scheduled: res.data.result.is_scheduled,
                  schedule_start: Moment.tz(res.data.result.schedule_start, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
                  schedule_end: Moment.tz(res.data.result.schedule_end, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
                  userInvite: this.state.valueModerator === [0] ? this.state.valuePeserta.concat(this.state.valueModerator) : this.state.valuePeserta,
                  //url
                  message: APPS_SERVER + 'redirect/meeting/information/' + res.data.result.class_id,
                  messageNonStaff: APPS_SERVER + 'meeting/' + res.data.result.room_name
                }
                API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
                  if (res.status === 200) {
                    if (!res.data.error) {
                      this.setState({ sendingEmail: false })
                      this.fetchMeeting();
                      this.closeClassModal();
                    } else {
                      console.log('RESS GAGAL', res)
                    }
                  }
                })
              }
              else {
                this.fetchMeeting();
                this.closeClassModal();
              }
            }
          })

        } else {
          let isPrivate = this.state.private == true ? 1 : 0;
          let isAkses = this.state.akses == true ? 1 : 0;
          let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;
          let isScheduled = this.state.scheduled == true ? 1 : 0;
          let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          let form = {
            user_id: Storage.get('user').data.user_id,
            company_id: this.state.companyId,
            folder_id: this.state.valueFolder.length ? this.state.valueFolder[0] : 0,
            webinar_id: this.state.webinar_id,
            speaker: this.state.speaker,
            room_name: this.state.roomName,
            moderator: this.state.valueModerator,
            is_private: isPrivate,
            is_akses: isAkses,
            is_required_confirmation: isRequiredConfirmation,
            is_scheduled: isScheduled,
            schedule_start: startDateJkt,
            schedule_end: endDateJkt,
            peserta: this.state.valuePeserta,

            engine: this.state.engine,
            mode: this.state.mode
          }

          API.post(`${API_SERVER}v1/liveclass`, form).then(async res => {

            console.log('RES: ', res.data);

            if (res.status === 200) {
              // BBB CREATE START
              let api = bbb.api(BBB_URL, BBB_KEY)
              let http = bbb.http
              let meetingCreateUrl = api.administration.create(this.state.roomName, res.data.result.class_id, {
                attendeePW: 'Participants',
                moderatorPW: 'moderator',
                allowModsToUnmuteUsers: true,
                record: true
              })
              http(meetingCreateUrl).then((result) => {
                if (result.returncode = 'SUCCESS') {
                  console.log('BBB SUCCESS CREATE')
                }
                else {
                  console.log('GAGAL', result)
                }
              })
              // BBB CREATE END

              if (this.state.cover) {
                let formData = new FormData();
                formData.append('cover', this.state.cover);
                await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
              }
              if (res.data.result.is_private == 1) {
                this.setState({ sendingEmail: true })
                let form = {
                  user: Storage.get('user').data.user,
                  email: [],
                  room_name: res.data.result.room_name,
                  is_private: res.data.result.is_private,
                  is_scheduled: res.data.result.is_scheduled,
                  schedule_start: Moment.tz(res.data.result.schedule_start, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
                  schedule_end: Moment.tz(res.data.result.schedule_end, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm"),
                  userInvite: this.state.valueModerator === [0] ? this.state.valuePeserta.concat(this.state.valueModerator) : this.state.valuePeserta,
                  //url
                  message: APPS_SERVER + 'redirect/meeting/information/' + res.data.result.class_id,
                  messageNonStaff: APPS_SERVER + 'meeting/' + res.data.result.room_name
                }
                API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
                  if (res.status === 200) {
                    if (!res.data.error) {
                      this.setState({ sendingEmail: false })
                      this.fetchMeeting();
                      this.closeClassModal();
                    } else {
                      console.log('RESS GAGAL', res)
                    }
                  }
                })

                let userNotif = this.state.valuePeserta;
                for (var i = 0; i < userNotif.length; i++) {
                  // send notif
                  let notif = {
                    user_id: userNotif[i],
                    activity_id: this.state.valueFolder[0],
                    type: 3,
                    desc: `Silahkan konfirmasi undangan Anda pada meeting "${res.data.result.room_name}"`,
                    dest: `${APPS_SERVER}detail-project/${this.state.valueFolder[0]}`,
                    types : 1
                  }
                  API.post(`${API_SERVER}v1/notification/broadcast`, notif);
                }
              }
              else {
                this.fetchMeeting();
                this.closeClassModal();
                toast.success('Berhasil membuat meeting baru');
              }
            }
          })
        }
      } else {
        toast.warning(`Silahkan sinkronisasi akun zoom Anda di menu pengaturan.`)
      }
    }


  }
  onSubmitLock(classId, isLive) {
    API.put(`${API_SERVER}v1/liveclass/live/${classId}`, { is_live: isLive == 0 ? '1' : '0' }).then(res => {
      if (res.status === 200) {
        this.fetchMeeting();
        toast.success(`Berhasil ${isLive == 0 ? 'membuka kunci' : 'mengunci'} meeting`)
      }
    })
  }
  onSubmitDelete(classId) {
    API.delete(`${API_SERVER}v1/liveclass/delete/${classId}`).then(res => {
      if (res.status === 200) {
        this.fetchMeeting();
        this.closeModalDelete();
        // END BBB START
        let api = bbb.api(BBB_URL, BBB_KEY)
        let http = bbb.http
        let meetingEndUrl = api.administration.end(classId, 'moderator')
        http(meetingEndUrl).then((result) => {
          if (result.returncode = 'SUCCESS') {
            console.log('Meeting end')
          }
          else {
            console.log('ERROR', result)
          }
        })
        // END BBB END
        toast.success('Berhasil menghapus meeting')
      }
    })
  }
  dialogDelete(id, name) {
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
    const isakses = e.target.getAttribute('data-isakses');
    const isRequiredConfirmation = e.target.getAttribute('data-isrequiredconfirmation');
    // const participant = e.target.getAttribute('data-participant') ? e.target.getAttribute('data-participant').split(',').map(Number): [];
    const isscheduled = e.target.getAttribute('data-isscheduled');
    const schedule_start = new Date(e.target.getAttribute('data-start'));
    const schedule_end = new Date(e.target.getAttribute('data-end'));
    const valueFolder = [Number(e.target.getAttribute('data-folder'))];
    const schedule_start_jkt = new Date(Moment.tz(schedule_start, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
    const schedule_end_jkt = new Date(Moment.tz(schedule_end, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));

    const engine = e.target.getAttribute('data-engine')
    const mode = e.target.getAttribute('data-mode')

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
      endDate: schedule_end_jkt,
      akses: isakses == 1 ? true : false,

      engine: engine,
      mode: mode
    })

    this.fetchMeetingInfo(classId)
  }

  onClickJadwal(id, room_name) {
    this.setState({ modalJadwal: true, bookingMeetingId: id })
    API.get(`${API_SERVER}v2/meeting/booking/${id}`).then(res => {
      if (res.status === 200) {
        this.setState({ dataBooking: { room_name: room_name, booking: res.data.result } })
      }
    })
  }
  booking() {
    if (this.state.bookingMeetingId === '' || this.state.tanggal === '' || this.state.jamMulai === '' || this.state.jamSelesai === '') {
      toast.warning('Tanggal, jam mulai, dan jam selesai wajib diisi')
    }
    else {
      const tanggal = this.state.tanggal.getFullYear() + '-' + ('0' + (this.state.tanggal.getMonth() + 1)).slice(-2) + '-' + ('0' + this.state.tanggal.getDate()).slice(-2);
      const jamMulai = ('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2);
      const jamSelesai = ('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2);
      let form = {
        meeting_id: this.state.bookingMeetingId,
        tanggal: tanggal,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        user_id: Storage.get('user').data.user_id,
        keterangan: this.state.keterangan
      }
      API.post(`${API_SERVER}v2/meeting/booking`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            toast.success('Menyimpan booking jadwal meeting')
            this.setState({ tanggal: '', jamMulai: '', jamSelesai: '', bookingMeetingId: '', keterangan: '', modalJadwal: false })
            this.onClickJadwal(form.meeting_id, this.state.dataBooking.room_name)
          } else {
            toast.error("Error, gagal booking jadwal meeting")
          }
        }
      })
    }
  }

  cancelBooking(id) {
    API.delete(`${API_SERVER}v2/meeting/booking/${id}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          toast.success('MemCancelkan booking jadwal meeting')
          this.onClickJadwal(this.state.bookingMeetingId, this.state.dataBooking.room_name)
        } else {
          toast.error("Error, gagal memCancelkan booking jadwal meeting")
        }
      }
    })
  }

  checkLimitCompany() {
    API.get(`${API_SERVER}v2/company-limit/${this.state.companyId}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          this.setState({ limitCompany: res.data.result });
        } else {
          toast.error("Error, gagal check limit company")
        }
      }
    })
  }

  componentDidMount() {
    this.fetchOtherData();

    if (this.props.informationId) {
      this.fetchMeetingInfo(this.props.informationId)
    }

    this.fetchCheckAccess(Storage.get('user').data.grup_name.toLowerCase(), Storage.get('user').data.company_id, Storage.get('user').data.level,
      ['CD_MEETING', 'R_MEETINGS', 'R_MEETING', 'R_ATTENDANCE']);
    
    this.fetchSyncZoom(Storage.get('user').data.user_id)

  }

  fetchCheckAccess(role, company_id, level, param) {
    API.get(`${API_SERVER}v2/global-settings/check-access`, { role, company_id, level, param }).then(res => {
      if (res.status === 200) {
        this.setState({ gb: res.data.result })
      }
    })
  }


  handlePreviousRowsPage(a, b) {
    // if( a == 10 && b == 0){
    //   return console.log('cant previous')
    // }else{
    //   var offset = this.state.offset - this.state.limit;
    //    this.setState({offset: offset });
    //    this.state.page = this.state.page - 1;
    //    this.getpaginationtrade.bind(this, this.state.limit, offset)();
    // }
  }

  handleNextRowsPerPage(a, b) {
    // var offset = this.state.offset + this.state.limit;

    // if(offset >= this.data.count){
    //   return console.log('cant next')
    // }else{

    //   this.setState({offset: offset });
    //   this.state.page = this.state.page + 1;

    //this.getpaginationtrade.bind(this, this.state.limit, offset)();
    //}
  }

  fetchSyncZoom(userId) {
    API.get(`${API_SERVER}v3/zoom/user/${userId}`).then(res => {
      if (res.status === 200) {
        this.setState({ checkZoom: res.data.result })
      }
    })
  }

  handleEngine(e) {
    if (e.target.value === 'zoom') {
      if (this.state.checkZoom.length !== 1) {
        toast.warning(`Silahkan konek dan sinkronisasi akun zoom Anda pada menu Pengaturan.`)
      }
      else {
        this.setState({ engine: e.target.value })
      }
    } else {
      this.setState({ engine: e.target.value })
    }
  }

  render() {

    // ** GLOBAL SETTINGS ** //
    let cdMeeting =  this.state.gb.length && this.state.gb.filter(item => item.code === 'CD_MEETING')[0].status;
    console.log(cdMeeting, 'cdMeeting')

    // All MEETING ROOMS { SEMUA RUANGAN MEETING }
    let Rmeetings = this.state.gb.length && this.state.gb.filter(item => item.code === 'R_MEETINGS')[0].status;

    // DISABLE { SALAH SATU RUANG MEETING }
    let  Rmeeting = this.state.gb.length && this.state.gb.filter(item => item.code === 'R_MEETING')[0].status;

    // let  R_attendance = this.state.gb.length && this.state.gb.filter(item => item.code === 'R_ATTENDANCE')[0].status;

    // ========= End ======== //

    const notify = () => toast.warning("Access Denied");


    // const headerTabble = [
    //   // {title : 'Meeting Name', width: null, status: true},
    //   {title : 'Moderator', width: null, status: true},
    //   {title : 'Status', width: null, status: true},
    //   {title : 'Time', width: null, status: true},
    //   {title : 'Date', width: null, status: true},
    //   {title : 'Participants', width: null, status: true},
    //   // {title : 'File Project', width: null, status: true},
    // ];
    const columns = [
      {
        name: 'Meeting Name',
        selector: 'room_name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Moderator',
        selector: 'name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: true,
        center: true,
        cell: row =>
          <div style={{ color: row.status === 'Open' ? '#FA6400' : row.status === 'Locked' ? '#F00' : row.status === 'Active' || row.status === 'Active & Locked' ? '#1b9a1b' : '#0091FF' }}>
            {row.status}
          </div>,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Time',
        // selector: 'status',
        center: true,
        cell: row => <div>{row.is_scheduled == 1 ? row.waktu_start + ' - ' + row.waktu_end : '-'} </div>,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Date',
        // selector: `${'is_scheduled' == 1 ? 'Date' : '-'}`,
        cell: row => <div>{row.is_scheduled == 1 ? Moment(row.tanggal).tz('Asia/Jakarta').format('DD/MM/YYYY') : '-'}</div>,
        center: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Participants',
        // selector: 'total_participant',
        cell: row => <div>{row.is_private == 1 ? row.total_participant : '-'}</div>,
        center: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => <span class="btn-group dropleft">
          <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i
              className="fa fa-ellipsis-v"
              style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
            />
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
            <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onClickJadwal.bind(this, row.class_id, row.room_name)}>Schedule & Booking</button>
            <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onClickInvite.bind(this, row.class_id)}>Invite</button>
            {access_project_admin && <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onSubmitLock.bind(this, row.class_id, row.is_live)}>{row.is_live ? 'Lock' : 'Unlock'}</button>}
            {access_project_admin && <button
              style={{ cursor: 'pointer' }}
              class="dropdown-item"
              type="button"
              onClick={this.onClickEdit}
              data-id={row.class_id}
              data-cover={row.cover}
              data-speaker={row.speaker}
              data-roomname={row.room_name}
              data-moderator={row.moderator}
              data-isprivate={row.is_private}
              data-isakses={row.is_akses}
              data-isrequiredconfirmation={row.is_required_confirmation}
              data-participant={row.participant}
              data-isscheduled={row.is_scheduled}
              data-start={row.schedule_start}
              data-end={row.schedule_end}
              data-folder={row.folder_id}
              data-engine={row.engine}
              data-mode={row.mode}
            >
              Edit
                        </button>}

            {
              cdMeeting &&
              <>
                {access_project_admin && <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, row.class_id, row.room_name)}> Delete </button>}
              </>
            }
          </div>
        </span>,
        allowOverflow: true,
        button: true,
        width: '56px',
      },
      Rmeeting ?
      {
        name: 'Action',
        cell: row => <button className={`btn btn-icademy-primary btn-icademy-${row.status == 'Open' || row.status == 'Active' ? 'warning' : 'grey'}`}
          onClick={ this.onClickInfo.bind(this, row.class_id)  }> { row.status == 'Open' || row.status == 'Active' && Rmeeting ? 'Enter' : 'Information'}</button>,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      }
      :
      {
        name: 'Action',
      }
    ];
    // console.log(bodyTabble, 'body table meeting');
    const access_project_admin = this.props.access_project_admin;
    let bodyTabble = this.state.meeting;
    if (access_project_admin === false) {
      bodyTabble = bodyTabble.filter(item => item.status !== 'Locked')
    }

    console.log(bodyTabble, 'bodyTabble')
    console.log(this.state.infoClass, 'bodyTabble')

    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);
    let { filterMeeting } = this.state;
    if (filterMeeting != "") {
      bodyTabble = bodyTabble.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterMeeting, "gmi"))
      )
    }

    return (
      <div className="card p-20">


        <span className="">
          <strong className="f-w-bold f-18 fc-skyblue ">Meeting</strong>

          {
            cdMeeting &&
            <>
              {access_project_admin == true && this.state.limitCompany.meeting ? <button
                onClick={this.handleCreateMeeting.bind(this)}
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important", marginLeft: 14 }}
              >
                <i className="fa fa-plus"></i>

              Create New
              </button> : null}
            </>
          }

          <input
            type="text"
            placeholder="Search"
            onChange={this.filterMeeting}
            className="form-control float-right col-sm-3" />
        </span>

        {
          this.state.limitCompany.meeting === false &&
          <span>
            You cannot create a new meeting because you have reached the limit.
          </span>
        }
        {
          Rmeetings ?
            <DataTable
              style={{ marginTop: 20 }} columns={columns} data={bodyTabble} highlightOnHover // defaultSortField="title" pagination
            />
            :
            <span>sorry your access is not allowed to access the meeting room</span>
        }

        <div className="table-responsive">
          {/*
          <table className="table table-hover">
            <thead>
              <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                <td>Meeting Name</td>
                { headerTabble.map((item, i) => { return (
                <td align="center" width={item.width}>{item.title}</td>
                ) }) }
                <td colSpan="2" align="center"> Action </td>
              </tr>
            </thead>
            <tbody>
              { bodyTabble.length == 0 ?
              <tr>
                <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>There is no</td>
              </tr>
              : bodyTabble.map((item, i) => { let dateStart = new Date(item.schedule_start); let dateEnd = new Date(item.schedule_end); let status=''; if ((new Date() >= dateStart && new Date()
              <=d ateEnd) || item.is_scheduled==0 ){ status='Open' } else{ status='Close'
              } if (item.is_live==0 ){ status='Terkunci' } if (item.running){ status='Aktif' } return ( <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                <td className="fc-muted f-14 f-w-300 p-t-20">{item.room_name}</td>
                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.name}</td>
                <td className="fc-muted f-14 f-w-300 p-t-20" align="center" style={{color: status=='Open' ? '#FA6400': status=='Terkunci' ? '#F00' : status=='Aktif' ? '#1b9a1b' : '#0091FF'}}>{status}</td>
                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.waktu_start+' - '+item.waktu_end : '-'}</td>
                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.tanggal : '-'}</td>
                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_private == 1 ? item.total_participant : '-'}</td>
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
                                              <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, item.class_id, item.room_name)}> Delete </button>
                                            </div>
                                          </span>
                </td>
                <td className="fc-muted f-14 f-w-300 " align="center">
                  <button className={`btn btn-icademy-primary btn-icademy-${status=='Open' || status=='Aktif' ? 'warning' : 'grey'}`} onClick={this.onClickInfo.bind(this, item.class_id)}>{status == 'Open' || status == 'Aktif' ? 'Masuk' : 'Informasi'}</button>
                </td>
                </tr>
                ) }) }
            </tbody>
          </table> */}
        </div>

        <Modal show={this.state.modalJadwal} onHide={this.closemodalJadwal} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Meeting Room Schedule : {this.state.dataBooking.room_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-hover">
              <thead>
                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                  <td> Date </td>
                  <td> Starting Hours </td>
                  <td> End Hours </td>
                  <td>By</td>
                  <td>Keterangan</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.dataBooking.booking.length ?
                    this.state.dataBooking.booking.map((item) => {
                      const now = String(('0' + new Date().getDate()).slice(-2) + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + (new Date().getFullYear()))
                      return (
                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                          <td>{now === item.tanggal ? 'Hari ini' : item.tanggal}</td>
                          <td>{item.jam_mulai}</td>
                          <td>{item.jam_selesai}</td>
                          <td>{item.name}</td>
                          <td>{item.keterangan ? item.keterangan : '-'}</td>
                          <td>
                            {item.user_id === Storage.get('user').data.user_id &&
                              <span class="badge badge-pill badge-danger" style={{ cursor: 'pointer' }} onClick={this.cancelBooking.bind(this, item.id)}>Cancel</span>}
                          </td>
                        </tr>
                      )
                    })
                    :
                    (<tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                      <td colspan='5'>There is no booking</td>
                    </tr>)
                }
              </tbody>
            </table>

            <h4 style={{ padding: 10, marginTop: 20, marginBottom: 10 }}>Booking</h4>
            <div className="form-group row">
              <div className="col-sm-4">
                <label className="bold col-sm-12"> Date </label>
                <DatePicker dateFormat="yyyy-MM-dd" selected={this.state.tanggal} onChange={e => this.setState({ tanggal: e })} />
              </div>
              <div className="col-sm-4">
                <label className="bold col-sm-12"> Starting Hours </label>
                <DatePicker selected={this.state.jamMulai} onChange={date => this.setState({ jamMulai: date })} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="h:mm aa" />
              </div>
              <div className="col-sm-4">
                <label className="bold col-sm-12"> End Hours </label>
                <DatePicker selected={this.state.jamSelesai} onChange={date => this.setState({ jamSelesai: date })} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="h:mm aa" />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-12">
                <label className="bold col-sm-12">Keterangan (optional)</label>
                <textarea rows="4" className="form-control" value={this.state.keterangan} onChange={e => this.setState({ keterangan: e.target.value })} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closemodalJadwal}>
              Cancel
            </button>
            <button className="btn btn-icademy-primary" onClick={this.booking.bind(this)}>
              <i className="fa fa-save"></i> Booking
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isClassModal} onHide={this.closeClassModal} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              {this.state.classId ? 'Edit Group Meeting' : 'Create Group Meeting'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form>
              <Form.Group controlId="formJudul">
                <img alt="media" src={this.state.cover == null || this.state.cover == '' ?
                  "/assets/images/component/placeholder-image.png" :
                  this.state.imgPreview == null || this.state.imgPreview == '' ?
                    this.state.cover : this.state.imgPreview}
                  className="img-fluid" style={{ width: "200px", height: "160px" }} />

                <Form.Label className="f-w-bold ml-4">
                  <h4 className="btn-default">Masukkan Gambar</h4>
                  <input accept="image/*" className="btn-default" name="cover" type="file" onChange={this.handleChange} />
                  <Form.Text className="text-muted">
                    Ukuran gambar 200x200 piksel.
                  </Form.Text>
                </Form.Label>
              </Form.Group>

              <Form.Group controlId="formJudul">
                <Form.Label className="f-w-bold">
                  Judul Meeting
                </Form.Label>
                <FormControl type="text" placeholder="Judul" value={this.state.roomName} onChange={e =>
                  this.setState({ roomName: e.target.value })} />
                <Form.Text className="text-muted">
                  The title cannot use special characters
                  </Form.Text>
              </Form.Group>

              <Form.Group controlId="formJudul">
                <Form.Label className="f-w-bold">
                  Folder Project
                </Form.Label>
                <MultiSelect id="folder" options={this.state.optionsFolder} value={this.state.valueFolder} onChange={valueFolder => this.setState({ valueFolder })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Folder Project" />
                <Form.Text className="text-muted">
                  Seluruh MOM akan dikumpulkan dalam 1 folder project pada menu Files.
                  </Form.Text>
              </Form.Group>

              {/*
              <Form.Group controlId="formJudul">
                <Form.Label className="f-w-bold">
                  Pengisi Class
                </Form.Label>
                <FormControl type="text" placeholder="Pengisi Class" value={this.state.speaker} onChange={e=>
                  this.setState({ speaker: e.target.value }) } />
                  <Form.Text className="text-muted">
                    Nama pengisi kelas atau speaker.
                  </Form.Text>
              </Form.Group> */}

              <Form.Group controlId="formJudul">
                <Form.Label className="f-w-bold">
                  Access Restrictions
                </Form.Label>
                <div style={{ width: '100%' }}>
                  <ToggleSwitch onChange={this.toggleSwitchAkses.bind(this)} checked={this.state.akses} />
                </div>
                <Form.Text className="text-muted">
                  {this.state.akses ? 'Meetings are arranged by 1 moderator' : 'The meeting room is free '}
                </Form.Text>
              </Form.Group>
              {this.state.akses &&
                <Form.Group controlId="formJudul">
                  <Form.Label className="f-w-bold">
                    Moderator
                </Form.Label>
                  <MultiSelect id="moderator" options={this.state.optionsModerator} value={this.state.valueModerator} onChange={valueModerator => this.setState({ valueModerator })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Pilih Moderator" />
                  <Form.Text className="text-muted">
                    Pengisi kelas, moderator, atau speaker.
                  </Form.Text>
                </Form.Group>
              }

              <Form.Group controlId="formJudul">
                <Form.Label className="f-w-bold">
                  Private Meeting
                </Form.Label>
                <div style={{ width: '100%' }}>
                  <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.private} />
                </div>
                <Form.Text className="text-muted">
                  {this.state.private ? 'Only people registered as participants can join the meeting.' : 'The meeting room is open. All users can join.'}
                </Form.Text>
              </Form.Group>
              {this.state.private ?
                <Form.Group controlId="formJudul">
                  <Form.Label className="f-w-bold">
                    Wajib Konfirmasi Kehadiran
                </Form.Label>
                  <div style={{ width: '100%' }}>
                    <ToggleSwitch checked={false} onChange={this.toggleSwitchRequiredConfirmation.bind(this)} checked={this.state.requireConfirmation} />
                  </div>
                  <Form.Text className="text-muted">
                    {this.state.requireConfirmation ? 'Hanya peserta yang konfirmasi hadir yang dapat bergabung ke meeting.' : 'Semua peserta meeting dapat gabung ke meeting.'}
                  </Form.Text>
                </Form.Group>
                : null} {this.state.private ?
                  <Form.Group controlId="formJudul">
                    <Form.Label className="f-w-bold">
                      Peserta Dari Group
                </Form.Label>
                    <MultiSelect id="group" options={this.state.optionsGroup} value={this.state.valueGroup} onChange={valueGroup => this.groupSelect(valueGroup)} mode="tags" removableTags={true} hasSelectAll={true} selectAllLabel="Choose all" enableSearch={true} resetable={true} valuePlaceholder="Select Participants " />
                    <Form.Text className="text-muted">
                      Pilih peserta dari group untuk private meeting.
                  </Form.Text>
                  </Form.Group>
                  : null} {this.state.private ?
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Peserta
                </Form.Label>
                      <div className="row mt-1" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                        {this.state.infoParticipant && this.state.infoParticipant.map(item =>
                          <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>
                            {item.name}
                            <button type="button" className="" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(31 31 31)' }} onClick={this.deleteParticipant.bind(this, item.participant_id, item.class_id)}>
                              X
                    </button>
                          </div>
                        )}
                      </div>
                      <Form.Label className="f-w-bold">
                        Add Participants
                </Form.Label>
                      <MultiSelect id="peserta" options={this.state.optionsPeserta} value={this.state.valuePeserta} onChange={valuePeserta => this.setState({ valuePeserta })} mode="tags" removableTags={true} hasSelectAll={true} selectAllLabel="Choose all" enableSearch={true} resetable={true} valuePlaceholder="Select Participants " />
                      <Form.Text className="text-muted">
                        Pilih peserta untuk private meeting.
                  </Form.Text>
                    </Form.Group>
                    : null}

              <Form.Group controlId="formJudul">
                <Form.Label className="f-w-bold">
                  Scheduled Meeting
                </Form.Label>
                <div style={{ width: '100%' }}>
                  <ToggleSwitch checked={false} onChange={this.toggleSwitchScheduled.bind(this)} checked={this.state.scheduled} />
                </div>
                <Form.Text className="text-muted">
                  {this.state.scheduled ? 'Meeting terjadwal.' : 'Meeting tidak terjadwal. Selalu dapat diakses.'}
                </Form.Text>
              </Form.Group>
              {this.state.scheduled &&
                <Form.Group controlId="formJudul">
                  <Form.Label className="f-w-bold">
                    Waktu
                </Form.Label>
                  <div style={{ width: '100%' }}>
                    <DatePicker selected={this.state.startDate} onChange={this.handleChangeDateFrom} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" /> &nbsp;&mdash;&nbsp;
                  <DatePicker selected={this.state.endDate} onChange={this.handleChangeDateEnd} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" />
                  </div>
                  <Form.Text className="text-muted">
                    Pilih waktu meeting akan berlangsung.
                </Form.Text>
                </Form.Group>
              }
                    <Modal show={this.state.isInvite} onHide={this.handleCloseInvite}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                          Invite Participants
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="form-vertical">
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              From User
                          </Form.Label>
                            <Select
                              options={this.state.optionsInvite}
                              isMulti
                              closeMenuOnSelect={false}
                              onChange={valueInvite => { let arr = []; valueInvite.map((item) => arr.push(item.value)); this.setState({ valueInvite: arr })}}
                            />
                            <Form.Text className="text-muted">
                              Select user to invite.
                          </Form.Text>
                          </Form.Group>
                          <div className="form-group">
                            <label style={{ fontWeight: "bold" }}>Email</label>
                            <TagsInput
                              value={this.state.emailInvite}
                              onChange={this.handleChange.bind(this)}
                              addOnPaste={true}
                              addOnBlur={true}
                              inputProps={{ placeholder: `Participant's Email` }}
                            />
                            <Form.Text>
                              Insert email to invite. Use [Tab] or [Enter] key to insert multiple email.
                            </Form.Text>
                          </div>
                        </div>
                        <button className="btn btn-icademy-primary float-right" style={{marginLeft: 10}} onClick={this.handleCloseInvite}>
                          <i className="fa fa-envelope"></i> {this.state.sendingEmail ? 'Sending Invitation...' : 'Send Invitation'}
                        </button>
                        <button className="btn btm-icademy-primary btn-icademy-grey float-right" onClick={this.onClickSubmitInvite}>
                          Cancel
                        </button>
                      </Modal.Body>
                    </Modal>

              <Form.Group className="row" controlId="formJudul">
                <div className="col-sm-6">
                  <Form.Label className="f-w-bold">Engine</Form.Label>
                  <select value={this.state.engine} onChange={e => this.handleEngine(e)} name="engine" className="form-control">
                    <option value="bbb">ICADEMY</option>
                    <option value="zoom">Zoom</option>
                  </select>
                  <Form.Text className="text-muted">
                    Pilih engine yang akan dipakai untuk meeting.
                  </Form.Text>
                </div>
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeClassModal}>
              Cancel
            </button>
            <button className={`btn btn-icademy-primary ${this.state.sendingEmail && 'btn-icademy-grey'}`} onClick={this.onSubmitForm} disabled={this.state.sendingEmail}>
              <i className="fa fa-save"></i> {this.state.sendingEmail ? 'Mengirim Undangan...' : 'Simpan'}
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isModalConfirmation} onHide={this.closeModalConfirmation} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Meeting and Attendance Information
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.needConfirmation >= 1 && this.state.infoClass.is_private == 1 ?
              <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="card" style={{ background: '#dac88c', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                  <div className="card-carousel col-sm-8">
                    <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                      Konfirmasi Kehadiran
                  </div>
                    <h3 className="f-14">Anda diundang dalam meeting ini dan belum mengkonfirmasi kehadiran. Silahkan konfirmasi kehadiran.</h3>
                  </div>
                  <div className="card-carousel col-sm-4">
                    <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="float-right btn btn-sm btn-icademy-red" style={{ padding: '5px 10px' }}> Tidak Hadir
                  </Link>
                    <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="float-right btn btn-sm btn-icademy-green" style={{ padding: '5px 10px' }}> Hadir
                  </Link>
                  </div>
                </div>
              </div>
              : this.state.needConfirmation == 0 && this.state.infoClass.is_private == 1 ?
                <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="card" style={{ background: 'rgb(134 195 92)', flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <div className="card-carousel col-sm-8">
                      <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                        Anda Telah Mengkonfirmasi : {this.state.attendanceConfirmation}
                      </div>
                      <h3 className="f-14">Konfirmasi kehadiran anda telah dikirim ke moderator.</h3>
                    </div>
                  </div>
                </div>
                : null}<div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div className="card">
                <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url(${this.state.infoClass.cover ? this.state.infoClass.cover : '/assets/images/component/meeting-default.jpg'})` }}></div>

                <div className="card-carousel">
                  <div className="title-head f-w-900 f-16 mb-2">
                    {this.state.infoClass.room_name}
                  </div>

                  <div class="row">
                    <div className="col-sm-6">
                      {this.state.infoClass.is_akses ?
                        <h3 className="f-14">
                          Moderator : {this.state.infoClass.name}
                        </h3>
                        : null
                      }
                      <h3 className="f-14">
                        Jenis Meeting : {this.state.infoClass.is_private ? 'Private' : 'Public'}
                      </h3> {this.state.infoClass.is_private ?
                        <h3 className="f-14">
                          Konfirmasi Kehadiran : {this.state.infoClass.is_required_confirmation ? 'Wajib' : 'Tidak Wajib'}
                        </h3> : null}
                    </div>
                    {this.state.infoClass.is_scheduled ?
                      <div className="col-sm-6">
                        <h3 className="f-14">
                          Start : {Moment.tz(infoDateStart, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}
                        </h3>
                        <h3 className="f-14">
                          End : {Moment.tz(infoDateEnd, 'Asia/Jakarta').format("DD-MM-YYYY HH:mm")}
                        </h3>
                      </div>
                      : null}
                  </div>

                  {this.state.infoClass.is_private && ((levelUser == 'client' && (access.manage_group_meeting || access_project_admin)) || levelUser !== 'client') ?
                    <div>
                      <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                        Konfirmasi Kehadiran {this.state.infoParticipant.length} Peserta
                  </div>
                      <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                        <div className='legend-kehadiran hadir'></div>
                        <h3 className="f-14 mb-0 mr-2"> Hadir ({this.state.countHadir})</h3>
                        <div className='legend-kehadiran tidak-hadir'></div>
                        <h3 className="f-14 mb-0 mr-2"> Tidak Hadir ({this.state.countTidakHadir})</h3>
                        <div className='legend-kehadiran tentative'></div>
                        <h3 className="f-14 mb-0 mr-2"> Belum Konfirmasi ({this.state.countTentative})</h3>
                      </div>
                      <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                        {this.state.infoParticipant.map(item =>
                          <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{item.name}</div>
                        )}
                      </div>
                    </div>
                    : null}

                  {this.state.infoClass.is_private && ((levelUser == 'client' && access.manage_group_meeting) || levelUser !== 'client') ?
                    <div>
                      <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                        Kehadiran Aktual
                  </div>
                      <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                        {this.state.infoParticipant.map(item => item.actual == 'Hadir' &&
                          <div className='peserta aktual-hadir'>{item.name}</div>
                        )}
                      </div>
                    </div>
                    : null}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {(Rmeeting && this.state.infoClass.is_live && (this.state.infoClass.is_scheduled == 0 || new Date() >= new Date(Moment.tz(infoDateStart, 'Asia/Jakarta')) && new Date()
              <= new Date(Moment.tz(infoDateEnd, 'Asia/Jakarta'))))
              && (this.state.infoClass.is_required_confirmation == 0 || (this.state.infoClass.is_required_confirmation == 1 && this.state.attendanceConfirmation === 'Hadir')) ?
              <a target='_blank' href={(this.state.infoClass.engine === 'zoom') ? this.state.checkZoom[0].link : `/meeting-room/${this.state.infoClass.class_id}`}>
                <button className="btn btn-icademy-primary" onClick={e => this.closeModalConfirmation()}>
                  <i className="fa fa-video"></i> Masuk
                  </button>
              </a>
              : null}
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Konfirmasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Anda yakin akan menghapus meeting <b>{this.state.deleteMeetingName}</b> ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
              Cancel
            </button>
            <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.onSubmitDelete.bind(this, this.state.deleteMeetingId)}>
              <i className="fa fa-trash"></i> Hapus
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isInvite} onHide={this.handleCloseInvite}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                          Invite Participants
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="form-vertical">
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              From User
                          </Form.Label>
                            <Select
                              options={this.state.optionsInvite}
                              isMulti
                              closeMenuOnSelect={false}
                              onChange={valueInvite => { let arr = []; valueInvite.map((item) => arr.push(item.value)); this.setState({ valueInvite: arr })}}
                            />
                            <Form.Text className="text-muted">
                              Select user to invite.
                          </Form.Text>
                          </Form.Group>
                          <div className="form-group">
                            <label style={{ fontWeight: "bold" }}>Email</label>
                            <TagsInput
                              value={this.state.emailInvite}
                              onChange={this.handleChangeEmail.bind(this)}
                              addOnPaste={true}
                              addOnBlur={true}
                              inputProps={{ placeholder: `Participant's Email` }}
                            />
                            <Form.Text>
                              Insert email to invite. Use [Tab] or [Enter] key to insert multiple email.
                            </Form.Text>
                          </div>
                        </div>
                        <button className="btn btn-icademy-primary float-right" style={{marginLeft: 10}} onClick={this.onClickSubmitInvite}>
                          <i className="fa fa-envelope"></i> {this.state.sendingEmail ? 'Sending Invitation...' : 'Send Invitation'}
                        </button>
                        <button className="btn btm-icademy-primary btn-icademy-grey float-right" onClick={this.handleCloseInvite}>
                          Cancel
                        </button>
                      </Modal.Body>
                    </Modal>
      </div>
    );
  }
}

const Meetings = props => (
  <SocketContext.Consumer>
    { socket => <MeetingTable {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default Meetings;
