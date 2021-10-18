import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME, APPS_SERVER, BBB_URL, BBB_KEY, API_SOCKET } from '../../repository/api';
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
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Storage from '../../repository/storage';
import moment from 'moment-timezone'
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from 'react-spinners/BeatLoader';
import { Fragment } from "react";
import { compose } from "redux";
import io from 'socket.io-client';
import { withTranslation } from "react-i18next";

const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect");
});



const bbb = require('bigbluebutton-js')

const LINK_ZOOM = 'https://zoom.us/j/4912503275?pwd=Ujd5QW1seVhIcmU4ZGV3bmRxUUV3UT09'

class MeetingTable extends Component {
  constructor(props) {
    super(props);

    this.roomId = null;
    this.rooms = {};

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      isOpenBooking: false,
      idBooking: '',
      isSaving: false,
      isLoadBooking: false,
      hide_add_participant: false,
      isFetch: false,
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

      isModalBooking: false,

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
      private: true,
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

      gb: [],

      bookingToday: {
        meeting_id: null,
        booking_id: null
      }
    };
  }
  handleChangeEmail(emailInvite) {
    this.setState({ emailInvite })
  }

  closeModalBooking = () => {
    this.roomId = null;
    this.rooms = {};
    this.setState({
      classId: '',
      isModalBooking: false,
      // roomName: '',
      bookingToday: {
        meeting_id: null,
        booking_id: null
      },
      dataBooking: {
        room_name: '',
        booking: []
      },
      infoParticipant: [],
    })
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
        schedule_start: `${Moment.tz(this.state.classRooms.schedule_start).local().format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
        schedule_end: `${Moment.tz(this.state.classRooms.schedule_end).local().format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
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
            toast.error("Email was not sent, please check the email entered again.")
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
    this.setState({ akses: !this.state.akses }, () => {
      if (!this.state.akses) {
        this.setState({ valueModerator: [] })
      }
    });
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
    this.setState({ isClassModal: false, speaker: '', roomName: '', imgPreview: '', cover: '', classId: '', valueGroup: [], valueModerator: [], valuePeserta: [], valueFolder: [], infoClass: [], private: true, requireConfirmation: false, akses: false, infoParticipant: [], scheduled: false, startDate: new Date(), endDate: new Date() });
  }
  closemodalJadwal = (id) => {
    this.fetchMeeting(true)
    this.setState({ modalJadwal: false, isOpenBooking: false, infoParticipant: [], tanggal: '', jamMulai: '', jamSelesai: '', keterangan: '', akses: 0, private: true, requireConfirmation: 0, valueGroup: [], valueModerator: [], valuePeserta: [], idBooking: '' });
  }

  closeModalConfirmation = e => {

    if (this.state.isOpenBooking) {
      this.setState({
        isModalConfirmation: false,
        dataBooking: {
          room_name: '',
          booking: []
        },
        isModalBooking: false,
        speaker: '',
        // classId: '',
        // roomName: '',
        imgPreview: '',
        cover: '',
        valueGroup: [],
        valueModerator: [],
        valuePeserta: [],
        valueFolder: [],
        infoClass: [],
        private: true,
        requireConfirmation: false,
        akses: false,
        infoParticipant: [],
        scheduled: false,
        startDate: new Date(),
        endDate: new Date()
      });
      this.fetchBooking(this.state.classId, this.state.roomName);
    } else {
      this.setState({
        isModalConfirmation: false,
        dataBooking: {
          room_name: '',
          booking: []
        },
        isModalBooking: true,
        speaker: '',
        // classId: '',
        // roomName: '',
        imgPreview: '',
        cover: '',
        valueGroup: [],
        valueModerator: [],
        valuePeserta: [],
        valueFolder: [],
        infoClass: [],
        private: true,
        requireConfirmation: false,
        akses: false,
        infoParticipant: [],
        scheduled: false,
        startDate: new Date(),
        endDate: new Date()
      });
      this.fetchBooking(this.state.classId, this.state.roomName);
    }
  }

  fetchMeetingInfo(id) {
    if (isMobile) {
      window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'redirect/meeting/information/' + id))
    }
    this.fetchMeetingInfoBooking(null, id);
  }

  fetchMeetingInfoBooking(meetingId, bookingId) {
    if (isMobile) {
      window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'redirect/meeting/information/' + meetingId))
    }
    API.post(`${API_SERVER}v1/liveclass/meeting-booking-info`, { meeting_id: meetingId, booking_id: bookingId }).then(res => {
      if (res.status === 200 && res.data.error === false) {
        this.setState({
          infoClass: res.data.result[0],
          infoParticipant: res.data.result[1],
          countHadir: res.data.result[1].length ? res.data.result[1].filter((item) => item.confirmation == 'Hadir').length : 0,
          countTidakHadir: res.data.result[1].length ? res.data.result[1].filter((item) => item.confirmation == 'Tidak Hadir').length : 0,
          countTentative: res.data.result[1].length ? res.data.result[1].filter((item) => item.confirmation == '').length : 0,
          needConfirmation: res.data.result[1].length ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation === '').length : 0,
          attendanceConfirmation: res.data.result[1].length ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null : ''
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

  onClickInfo(classId, roomName) {
    // this.setState({ isModalConfirmation: true });
    // this.fetchMeetingInfo(class_id);
    // this.fetchMeetingInfoBooking(class_id, 0);

    this.setState({ isModalBooking: true, roomName, classId });
    this.fetchBooking(classId, roomName)

    // console.log(this.props.projectId, 'pROJECTY');
    API.post(`${API_SERVER}v1/liveclass/id/${this.props.projectId}`);
  }

  fetchMeeting(noLoading) {
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

    console.log(apiMeeting, 'apiMeeting')
    if (!noLoading) {
      this.setState({ isFetch: true })
    }
    API.get(apiMeeting).then(async res => {
      if (res.status === 200) {
        // console.log('data meeting', res);
        this.totalPage = res.data.result.length;
        if (JSON.stringify(this.state.meeting) == JSON.stringify(res.data.result)) {
          this.setState({ isFetch: false })
        }
        else {
          this.setState({ meeting: res.data.result, isFetch: false })
        }
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
            let tmp_duplicate = [];

            response.data.result.map(item => {
              // console.log(item, "TEST PESERTA")
              // this.state.optionsModerator.push({ value: item.user_id, label: item.name });
              // this.state.optionsPeserta.push({ value: item.user_id, label: item.name });

              let idx = tmp_duplicate.findIndex(str => str.value == item.user_id || str.label === item.name);
              let dupLabel = item.name;
              if (idx > -1) {

                if (item.company_name) {
                  dupLabel += `(${item.company_name} | ${item.email})`;
                  tmp_duplicate[idx].label += ` (${response.data.result[idx].company_name} | ${response.data.result[idx].email})`;
                } else {
                  dupLabel += `(${item.email})`;
                  tmp_duplicate[idx].label += ` (${response.data.result[idx].email})`;
                }
                tmp_duplicate.push({ value: item.user_id, label: dupLabel })
                // this.state.optionsModerator.push({ value: item.user_id, label: dupLabel });
                // this.state.optionsPeserta.push({ value: item.user_id, label: dupLabel });
              } else {
                tmp_duplicate.push({ value: item.user_id, label: dupLabel })
                // this.state.optionsModerator.push({ value: item.user_id, label: dupLabel });
                // this.state.optionsPeserta.push({ value: item.user_id, label: dupLabel });
              }
            });
            this.setState({ optionsModerator: tmp_duplicate, optionsPeserta: tmp_duplicate })
            console.log(tmp_duplicate, "TEST")
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
        // console.log(this.state.optionsPeserta, "TEST 1");
        // console.log(this.state.valuePeserta, "TEST 2");

        API.get(`${API_SERVER}v1/branch/company/${this.state.companyId}`).then(res => {
          if (res.status === 200) {
            this.setState({ listBranch: res.data.result[0] })

            this.state.optionsGroup.push({ value: null, label: 'Select manually' })
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

    API.put(`${API_SERVER}v1/liveclass/confirmation/${this.state.infoClass.id}/${Storage.get('user').data.user_id}`, form).then(async res => {
      if (res.status === 200) {
        // this.fetchMeetingInfo(this.state.infoClass.class_id)
        this.fetchMeetingInfoBooking(this.state.infoClass.class_id, this.state.infoClass.id)
        let form = {
          confirmation: confirmation,
          user: Storage.get('user').data.user,
          email: [],
          room_name: this.state.infoClass.room_name,
          is_private: this.state.infoClass.is_private,
          is_scheduled: this.state.infoClass.is_scheduled,
          schedule_start: `${Moment.tz(this.state.infoClass.schedule_start).local().format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
          schedule_end: `${Moment.tz(this.state.infoClass.schedule_end).local().format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
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
    console.log(valueGroup)
    if (valueGroup.length) {
      this.setState({ valueGroup: [...this.state.valueGroup, valueGroup[0].value], valuePeserta: [] })
      for (let i = 0; i < valueGroup.length; i++) {
        API.get(`${API_SERVER}v1/user/group/${valueGroup[i].value}`).then(res => {
          if (res.status === 200) {
            const participant = res.data.result.user_id ? res.data.result.user_id.split(',').map(Number) : [];
            this.setState({ valuePeserta: this.state.valuePeserta.concat(participant) })
          }

        })
      }
    }
    else {
      this.setState({ valueGroup: [], valuePeserta: [] })
    }

  }

  onSubmitForm = e => {
    e.preventDefault();
    if (this.state.roomName === '' || this.state.valueFolder[0] == 0 || !this.state.valueFolder.length) {
      toast.warning('The title of the meeting and the project folder is mandatory.')
    }
    else {
      if ((this.state.checkZoom.length === 1 && this.state.engine === 'zoom') || (this.state.engine === 'bbb')) {
        if (this.state.classId) {
          // let isPrivate = this.state.private == true ? 1 : 0;
          // let isAkses = this.state.akses == true ? 1 : 0;
          // let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;
          // let isScheduled = this.state.scheduled == true ? 1 : 0;
          // let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          // let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          let form = {
            room_name: this.state.roomName,
            // moderator: this.state.akses ? this.state.valueModerator : [],
            folder_id: this.state.valueFolder.length ? this.state.valueFolder[0] : 0,
            webinar_id: this.state.webinar_id,
            // is_private: isPrivate,
            // is_akses: isAkses,
            // is_required_confirmation: isRequiredConfirmation,
            // is_scheduled: isScheduled,
            // schedule_start: startDateJkt,
            // schedule_end: endDateJkt,
            // peserta: this.state.valuePeserta,

            engine: this.state.engine,
            // mode: this.state.mode
          }

          console.log(form)

          /**
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
          */

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
                    attendeePW: 'peserta',
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
                  schedule_start: `${Moment.tz(res.data.result.schedule_start).local().format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
                  schedule_end: `${Moment.tz(res.data.result.schedule_end).local().format("DD-MM-YYYY HH:mm")} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
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

              this.fetchMeeting();
              this.closeClassModal();
              socket.emit('send', {
                socketAction: 'updateDataMeeting',
                company_id: this.state.companyId,
                user_id: Storage.get('user').data.user_id
              })
            }
          })

        } else {
          // let isPrivate = this.state.private == true ? 1 : 0;
          // let isAkses = this.state.akses == true ? 1 : 0;
          // let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;
          // let isScheduled = this.state.scheduled == true ? 1 : 0;
          // let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          // let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
          let form = {
            user_id: Storage.get('user').data.user_id,
            company_id: this.state.companyId,

            room_name: this.state.roomName,
            folder_id: this.state.valueFolder.length ? this.state.valueFolder[0] : 0,

            webinar_id: this.state.webinar_id,
            // speaker: this.state.speaker,
            // moderator: this.state.akses ? this.state.valueModerator : [],
            // is_private: isPrivate,
            // is_akses: isAkses,
            // is_required_confirmation: isRequiredConfirmation,
            // is_scheduled: isScheduled,
            // schedule_start: startDateJkt,
            // schedule_end: endDateJkt,
            // peserta: this.state.valuePeserta,

            engine: this.state.engine,
            // mode: this.state.mode
          }

          API.post(`${API_SERVER}v1/liveclass`, form).then(async res => {

            // console.log('RES: ', res.data);

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

              /**
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
              */
              this.fetchMeeting();
              this.closeClassModal();
              toast.success('Successfully created a new meeting.');
              socket.emit('send', {
                socketAction: 'updateDataMeeting',
                company_id: this.state.companyId,
                user_id: Storage.get('user').data.user_id
              })
            }
          })
        }
      } else {
        toast.warning(`Please sync your zoom account in the settings menu.`)
      }
    }

  }

  onSubmitLock(classId, isLive) {
    API.put(`${API_SERVER}v1/liveclass/live/${classId}`, { is_live: isLive == 0 ? '1' : '0' }).then(res => {
      if (res.status === 200) {
        this.fetchMeeting();
        toast.success(`Successfully ${isLive == 0 ? 'unlock' : 'lock'} meeting`)
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
        toast.success('Successfully deleted meeting.')
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
    // const speaker = e.target.getAttribute('data-speaker');
    const roomName = e.target.getAttribute('data-roomname');
    // const valueModerator = [Number(e.target.getAttribute('data-moderator'))];
    // const isprivate = e.target.getAttribute('data-isprivate');
    // const isakses = e.target.getAttribute('data-isakses');
    // const isRequiredConfirmation = e.target.getAttribute('data-isrequiredconfirmation');
    // const participant = e.target.getAttribute('data-participant') ? e.target.getAttribute('data-participant').split(',').map(Number): [];
    // const isscheduled = e.target.getAttribute('data-isscheduled');
    // const schedule_start = new Date(e.target.getAttribute('data-start'));
    // const schedule_end = new Date(e.target.getAttribute('data-end'));
    const valueFolder = [Number(e.target.getAttribute('data-folder'))];
    // const schedule_start_jkt = new Date(Moment.tz(schedule_start, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
    // const schedule_end_jkt = new Date(Moment.tz(schedule_end, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));

    const engine = e.target.getAttribute('data-engine')
    // const mode = e.target.getAttribute('data-mode')

    this.setState({
      isClassModal: true,
      classId: classId,
      cover: cover,
      // speaker: speaker,
      roomName: roomName,
      // valueModerator: valueModerator,
      valueFolder: valueFolder,
      // private: isprivate == 1 ? true : false,
      // requireConfirmation: isRequiredConfirmation == 1 ? true : false,
      // valuePeserta: participant,
      // scheduled: isscheduled == 1 ? true : false,
      // startDate: schedule_start_jkt,
      // endDate: schedule_end_jkt,
      // akses: isakses == 1 ? true : false,

      engine: engine,
      // mode: mode
    })

    this.fetchMeetingInfo(classId)
  }

  onClickJadwal(id, room_name) {
    this.setState({ modalJadwal: true, isOpenBooking: true, bookingMeetingId: id, classId: id, roomName: room_name, valuePeserta: [Storage.get("user").data.user_id] })
    this.fetchBooking(id, room_name)
  }

  fetchBooking(id, room) {
    this.setState({ isLoadBooking: true })
    API.get(`${API_SERVER}v2/meeting/booking/${id}`).then(res => {
      if (res.status === 200) {
        res.data.result.reverse().map(item => {
          const split = item.tanggal.split('-')
          const reTanggal = `${split[2]}-${split[1]}-${split[0]}`
          const jamIni = moment()
          const sJadwal = Moment(`${item.tgl_mulai}`).local()
          const eJadwal = Moment(`${item.tgl_selesai}`).local()
          const range = jamIni.isBetween(sJadwal, eJadwal)

          // item.hariini = range
          if (range || item.running) {
            // this.setState({ bokingToday: { meeting_id: item.meeting_id, booking_id: item.id } })
            // console.log('run range')
            // this.fetchMeetingInfoBooking(item.meeting_id, item.id);
            this.roomId = item.id
            this.rooms = item
          }
        })
        this.setState({ dataBooking: { room_name: room, booking: res.data.result } })
      }
      this.setState({ isLoadBooking: false })
    })
  }

  booking() {
    if (this.state.bookingMeetingId === '' || this.state.tanggal === '' || this.state.jamMulai === '' || this.state.jamSelesai === '') {
      toast.warning('Date, start time, and end time are mandatory.')
    }
    else {
      this.setState({ isSaving: true });
      const tanggal = this.state.tanggal.getFullYear() + '-' + ('0' + (this.state.tanggal.getMonth() + 1)).slice(-2) + '-' + ('0' + this.state.tanggal.getDate()).slice(-2);
      const jamMulai = Moment.tz(new Date(`${tanggal} ${('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2)}`), 'Asia/Jakarta').format('HH:mm');
      const jamSelesai = Moment.tz(new Date(`${tanggal} ${('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2)}`), 'Asia/Jakarta').format('HH:mm');

      let isPrivate = this.state.private == true ? 1 : 0;
      let isAkses = this.state.akses == true ? 1 : 0;
      let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;

      let form = {
        meeting_id: this.state.bookingMeetingId,
        tanggal: tanggal,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        user_id: Storage.get('user').data.user_id,
        keterangan: this.state.keterangan,

        is_private: isPrivate,
        is_required_confirmation: isRequiredConfirmation,
        peserta: this.state.valuePeserta,

        is_akses: isAkses,
        moderator: this.state.akses ? this.state.valueModerator : [],

        date_start: Moment.tz(new Date(`${tanggal} ${('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2)}`), 'Asia/Jakarta').format('YYYY-MM-DD HH:mm'),
        date_end: Moment.tz(new Date(`${tanggal} ${('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2)}`), 'Asia/Jakarta').format('YYYY-MM-DD HH:mm'),
      }

      API.post(`${API_SERVER}v2/meeting/booking`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            toast.success('Saved.')

            this.onClickJadwal(form.meeting_id, this.state.dataBooking.room_name)

            // share
            this.setState({ sendingEmail: true })
            let form1 = {
              user: Storage.get('user').data.user,
              email: this.state.emailInvite,
              room_name: this.state.roomName,
              is_private: isPrivate,
              is_scheduled: 1,
              schedule_start: `${Moment(new Date(`${tanggal} ${('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2)}`)).local().format('YYYY-MM-DD HH:mm')} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
              schedule_end: `${Moment(new Date(`${tanggal} ${('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2)}`)).local().format('YYYY-MM-DD HH:mm')} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
              userInvite: this.state.valueModerator == [] ? form.peserta.concat(this.state.valueModerator) : form.peserta,
              message: APPS_SERVER + 'redirect/meeting/information/' + res.data.result.id,
              messageNonStaff: APPS_SERVER + 'meet/' + res.data.result.id
            }

            API.post(`${API_SERVER}v1/liveclass/share`, form1).then(res => {
              if (res.status === 200) {
                if (!res.data.error) {
                  this.setState({ emailInvite: [], sendingEmail: false, isSaving: false });
                  toast.success("Email sent to participant")
                } else {
                  toast.error("Email failed to send, please check the email address.")
                  this.setState({ sendingEmail: false, isSaving: false })
                }
              }
            })

            socket.emit('send', {
              socketAction: 'updateDataBooking',
              meeting_id: this.state.bookingMeetingId,
              user_id: Storage.get('user').data.user_id,
              room_name: this.state.roomName
            })

            this.setState({
              tanggal: '', jamMulai: '', jamSelesai: '', keterangan: '',
              akses: 0, private: true, requireConfirmation: 0, valueGroup: [], valueModerator: [], valuePeserta: [Storage.get('user').data.user_id]
            })

            this.fetchMeeting(true)

          } else {
            if (res.data.type === 'warning') {
              toast.warning(res.data.result);
            }
            else {
              toast.error("Error, failed to book a meeting schedule.");
            }
            this.setState({ isSaving: false });
          }
        }
      })

    }
  }

  cancelBooking(id) {
    API.delete(`${API_SERVER}v2/meeting/booking/${id}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          toast.success('Canceling a meeting schedule booking.')
          this.fetchBooking(this.state.classId, this.state.roomName)
        } else {
          toast.error("Error, failed to cancel the meeting schedule booking.")
        }
      }
    })
  }
  editBooking(id) {
    let dataBooking = this.state.dataBooking.booking.filter((x) => x.id === id)[0];

    const split_date = dataBooking.tgl_mulai.split('T')[0];
    this.setState({
      bookingMeetingId: id, classId: this.state.classId, roomName: this.state.roomName,
      modalJadwal: true,
      idBooking: id,
      tanggal: new Date(Moment(dataBooking.tgl_mulai).local().format('YYYY-MM-DD')),
      jamMulai: new Date(Moment(dataBooking.tgl_mulai).local().format('YYYY-MM-DD HH:mm')),
      jamSelesai: new Date(Moment(dataBooking.tgl_selesai).local().format('YYYY-MM-DD HH:mm')),
      keterangan: dataBooking.keterangan,
      is_private: dataBooking.is_private ? true : false,
      requireConfirmation: dataBooking.is_required_confirmation ? true : false,
      akses: dataBooking.is_akses ? true : false,
      valueModerator: dataBooking.moderator ? [dataBooking.moderator] : []
    });
    dataBooking.participants.map(item => {
      this.state.valuePeserta.push(item.user_id);
    })
  }

  saveEditBooking() {
    if (this.state.bookingMeetingId === '' || this.state.tanggal === '' || this.state.jamMulai === '' || this.state.jamSelesai === '') {
      toast.warning('Date, start time, and end time are mandatory.')
    }
    else {
      this.setState({ isSaving: true });
      const tanggal = this.state.tanggal.getFullYear() + '-' + ('0' + (this.state.tanggal.getMonth() + 1)).slice(-2) + '-' + ('0' + this.state.tanggal.getDate()).slice(-2);
      const jamMulai = ('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2);
      const jamSelesai = ('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2);

      let isPrivate = this.state.private == true ? 1 : 0;
      let isAkses = this.state.akses == true ? 1 : 0;
      let isRequiredConfirmation = this.state.requireConfirmation == true ? 1 : 0;

      let form = {
        meeting_id: this.state.classId,
        tanggal: tanggal,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        user_id: Storage.get('user').data.user_id,
        keterangan: this.state.keterangan,

        is_private: isPrivate,
        is_required_confirmation: isRequiredConfirmation,
        peserta: this.state.valuePeserta,

        is_akses: isAkses,
        moderator: this.state.akses ? this.state.valueModerator : [],

        date_start: Moment.tz(new Date(`${tanggal} ${('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2)}`), 'Asia/Jakarta').format('YYYY-MM-DD HH:mm'),
        date_end: Moment.tz(new Date(`${tanggal} ${('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2)}`), 'Asia/Jakarta').format('YYYY-MM-DD HH:mm')
      }

      API.put(`${API_SERVER}v2/meeting/booking/${this.state.idBooking}`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            toast.success('Saved.')

            this.onClickJadwal(form.meeting_id, this.state.dataBooking.room_name)

            // share
            this.setState({ sendingEmail: true })
            let form1 = {
              user: Storage.get('user').data.user,
              email: this.state.emailInvite,
              room_name: this.state.roomName,
              is_private: isPrivate,
              is_scheduled: 1,
              schedule_start: `${Moment(new Date(`${tanggal} ${('0' + this.state.jamMulai.getHours()).slice(-2) + ':' + ('0' + this.state.jamMulai.getMinutes()).slice(-2)}`)).local().format('YYYY-MM-DD HH:mm')} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
              schedule_end: `${Moment(new Date(`${tanggal} ${('0' + this.state.jamSelesai.getHours()).slice(-2) + ':' + ('0' + this.state.jamSelesai.getMinutes()).slice(-2)}`)).local().format('YYYY-MM-DD HH:mm')} (GMT${moment().local().format('Z')} ${moment.tz.guess(true)} Time Zone)`,
              userInvite: this.state.valueModerator === [0] ? this.state.valuePeserta.concat(this.state.valueModerator) : this.state.valuePeserta,
              message: APPS_SERVER + 'redirect/meeting/information/' + this.state.idBooking,
              messageNonStaff: APPS_SERVER + 'meet/' + this.state.idBooking
            }

            API.post(`${API_SERVER}v1/liveclass/share`, form1).then(res => {
              if (res.status === 200) {
                if (!res.data.error) {
                  this.setState({ emailInvite: [], sendingEmail: false, isSaving: false });
                  toast.success("Email sent to participant")
                } else {
                  toast.error("Email failed to send, please check the email address.")
                  this.setState({ sendingEmail: false, isSaving: false })
                }
              }
            })

            socket.emit('send', {
              socketAction: 'updateDataBooking',
              meeting_id: this.state.bookingMeetingId,
              user_id: Storage.get('user').data.user_id,
              room_name: this.state.roomName
            })

            this.setState({
              tanggal: '', jamMulai: '', jamSelesai: '', keterangan: '',
              akses: 0, private: true, requireConfirmation: 0, valueGroup: [], valueModerator: [], valuePeserta: [Storage.get('user').data.user_id], idBooking: ''
            })

            this.fetchMeeting(true)

          } else {
            if (res.data.type === 'warning') {
              toast.warning(res.data.result);
            }
            else {
              toast.error("Error, failed to book a meeting schedule.");
            }
            this.setState({ isSaving: false });
          }
        }
      })

    }
  }

  checkLimitCompany() {
    API.get(`${API_SERVER}v2/company-limit/${this.state.companyId}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          this.setState({ limitCompany: res.data.result });
        } else {
          toast.error("Error, failed check limit company")
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

    socket.on("broadcast", data => {
      if (data.socketAction == 'updateDataMeeting' && data.company_id === this.state.companyId && data.user_id !== Storage.get('user').data.user_id) {
        this.fetchMeeting()
      }
      if (data.socketAction == 'updateDataBooking' && data.meeting_id === this.state.classId && data.user_id !== Storage.get('user').data.user_id) {
        this.fetchBooking(data.meeting_id, data.room_name)
      }
    });
    this.timer = setInterval(
      () => this.fetchMeeting(true),
      5000,
    );
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
        toast.warning(`Please connect and sync your zoom account on the Settings menu.`)
      }
      else {
        this.setState({ engine: e.target.value })
      }
    } else {
      this.setState({ engine: e.target.value })
    }
  }

  onClickInformation = (meeting_id, id) => {
    this.setState({ isModalConfirmation: true, isModalBooking: false });
    this.fetchMeetingInfoBooking(meeting_id, id);
  }

  openBooking = (classId, roomName) => {
    this.closeModalBooking()
    this.onClickJadwal(classId, roomName);
  }

  startMeetingNow = (classId, roomName) => {
    var startDate = Moment.tz(new Date(), 'Asia/Jakarta');
    var checkEndDate = Moment.tz(new Date(), 'Asia/Jakarta').add(2, 'hours')
    var finalEndDate = checkEndDate.format('DD-MM-YYYY') === startDate.format('DD-MM-YYYY') ? checkEndDate.format('HH:mm') : '23:59';
    let form = {
      meeting_id: classId,
      tanggal: Moment.tz(new Date(), 'Asia/Jakarta').format('YYYY-MM-DD'),
      jam_mulai: startDate.format('HH:mm'),
      jam_selesai: finalEndDate,
      user_id: Storage.get('user').data.user_id,
      keterangan: `Meeting by ${Storage.get('user').data.user}`,

      is_private: 1,
      is_required_confirmation: 0,
      peserta: [],

      is_akses: 1,
      moderator: [Storage.get('user').data.user_id],

      date_start: startDate.format('YYYY-MM-DD HH:mm'),
      date_end: checkEndDate.format('YYYY-MM-DD HH:mm'),
    }

    API.post(`${API_SERVER}v2/meeting/booking`, form).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          toast.success('Save the meeting schedule booking.')
          this.setState({
            tanggal: '', jamMulai: '', jamSelesai: '', bookingMeetingId: '', keterangan: '',
            akses: 0, private: true, requireConfirmation: 0, valueGroup: [], valueModerator: [], valuePeserta: [],
            modalJadwal: false
          })

          socket.emit('send', {
            socketAction: 'updateDataBooking',
            meeting_id: classId,
            user_id: Storage.get('user').data.user_id,
            room_name: roomName
          })
          this.fetchBooking(classId, roomName)

          window.open(`/meet/${res.data.result.id}`, '_blank').focus();
        } else {
          if (res.data.type === 'warning') {
            toast.warning(`${res.data.result + ' "Start meeting now" need 2 hours schedule'}`);
          }
          else {
            toast.error("Error, failed to book a meeting schedule.");
          }
        }
      }
    })
  }

  render() {

    // ** GLOBAL SETTINGS ** //
    let cdMeeting = this.state.gb.length && this.state.gb.filter(item => item.code === 'CD_MEETING')[0].status;
    console.log(cdMeeting, 'cdMeeting')

    // All MEETING ROOMS { SEMUA RUANGAN MEETING }
    let Rmeetings = this.state.gb.length && this.state.gb.filter(item => item.code === 'R_MEETINGS')[0].status;

    // DISABLE { SALAH SATU RUANG MEETING }
    let Rmeeting = this.state.gb.length && this.state.gb.filter(item => item.code === 'R_MEETING')[0].status;

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
        name: 'Meeting Room Name',
        selector: 'room_name',
        sortable: true,
        grow: 2,
      },
      {
        cell: row => row.status === 'Active' ? <font color='#16b10b'>Active</font> : row.status,
        name: 'Status',
        selector: 'status',
        sortable: true
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
            {/* <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onClickInvite.bind(this, row.class_id)}>Invite</button> */}
            {/* {access_project_admin && <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onSubmitLock.bind(this, row.class_id, row.is_live)}>{row.is_live ? 'Lock' : 'Unlock'}</button>} */}
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
          cell: row => row.on_schedule ? <a rel="noopener noreferrer" target='_blank' href={`/meet/${row.on_schedule_id}`}><button className={`btn btn-icademy-primary btn-icademy-warning`} >Join</button></a>
            : <button className={`btn btn-icademy-primary btn-icademy-grey`} onClick={this.onClickInfo.bind(this, row.class_id, row.room_name)}>Schedule</button>,
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

    // console.log(bodyTabble, 'bodyTabble')
    // console.log(this.state.infoClass, 'bodyTabble')

    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;

    let infoDateStart = new Date(`${Moment(this.state.infoClass.date_start).format('YYYY-MM-DD HH:mm')}`);
    let infoDateEnd = new Date(`${Moment(this.state.infoClass.date_end).format('YYYY-MM-DD HH:mm')}`);

    console.log('infoDate', Moment().isBetween(infoDateStart ? infoDateStart : Moment(), infoDateEnd ? infoDateEnd : Moment()))

    let { filterMeeting } = this.state;
    if (filterMeeting != "") {
      bodyTabble = bodyTabble.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterMeeting, "gmi"))
      )
    }

    let jamMl = new Date(Moment(`${this.state.infoClass.tgl_mulai}`).local());
    let jamMulai = Moment(`${this.state.infoClass.tgl_mulai}`).local() ? ('0' + jamMl.getHours()).slice(-2) + ':' + ('0' + jamMl.getMinutes()).slice(-2) : '-';
    let jamSl = new Date(Moment(`${this.state.infoClass.tgl_selesai}`).local());
    let diff = Math.abs(jamSl - jamMl);
    let diffHour = Math.floor((diff % 86400000) / 3600000);
    let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
    let durasi = this.state.infoClass.jam_mulai ? (diffHour !== 0 ? diffHour + ' hours ' : '') + (diffMin !== 0 ? diffMin + ' minutes' : '') : '-';
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
          this.state.isFetch ?
            <div className="text-center">
              <LoadingOverlay
                active={this.state.isFetch}
                spinner={<BeatLoader size='30' color='#008ae6' />}
              ></LoadingOverlay>
              <p style={{ marginTop: '3.5rem' }}>Loading...</p>
            </div>
            :
            <Fragment>

              <DataTable
                style={{ marginTop: 20 }} columns={columns} data={bodyTabble} highlightOnHover // defaultSortField="title" pagination
              />

            </Fragment>
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

        <Modal show={this.state.modalJadwal} onHide={this.closemodalJadwal} dialogClassName="modal-xlg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Meeting Room Schedule : {this.state.roomName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm-12">
                <table className="table table-hover table-list_booking">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                      <td><b>Date </b></td>
                      <td><b>Starting Hours </b></td>
                      <td><b>End Hours </b></td>
                      <td><b>By</b></td>
                      <td><b>Moderator</b></td>
                      <td><b>Participants</b></td>
                      <td><b>Description</b></td>
                      <td><b>Share</b></td>
                      <td><b>Action</b></td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.isLoadBooking ?
                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                          <td colspan='9'>Loading</td>
                        </tr>
                        :
                        !this.state.isLoadBooking && this.state.dataBooking.booking.length ?
                          this.state.dataBooking.booking.map((item) => {
                            const now = String(('0' + new Date().getDate()).slice(-2) + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + (new Date().getFullYear()))

                            const split = item.tanggal.split('-')
                            const reTanggal = `${split[2]}-${split[1]}-${split[0]}`
                            const jamIni = moment()
                            const sJadwal = Moment(`${item.tgl_mulai}`).local()
                            const eJadwal = Moment(`${item.tgl_selesai}`).local()
                            const range = jamIni.isBetween(sJadwal, eJadwal)

                            let checkParty = item.participants.filter(x => x.user_id === Storage.get('user').data.user_id).length

                            let jamMl = new Date(Moment(`${item.tgl_mulai}`).local());
                            let jamMulai = Moment(`${item.tgl_mulai}`).local() ? ('0' + jamMl.getHours()).slice(-2) + ':' + ('0' + jamMl.getMinutes()).slice(-2) : '-';
                            let jamSl = new Date(Moment(`${item.tgl_selesai}`).local());
                            let diff = Math.abs(jamSl - jamMl);
                            let diffHour = Math.floor((diff % 86400000) / 3600000);
                            let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
                            let durasi = item.jam_mulai ? (diffHour !== 0 ? diffHour + ' hours ' : '') + (diffMin !== 0 ? diffMin + ' minutes' : '') : '-';
                            return (
                              <Fragment>
                                <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                                  <td>{now === moment(item.tgl_mulai).local().format('DD-MM-YYYY') ? 'Today' : moment(item.tgl_mulai).local().format('DD-MM-YYYY')}</td>
                                  <td>{moment(item.tgl_mulai).local().format('HH:mm')}</td>
                                  <td>{moment(item.tgl_selesai).local().format('HH:mm')}</td>
                                  <td>{item.name}</td>
                                  <td>{item.moderator_name ? item.moderator_name : '-'}</td>
                                  <td className="text-center cursor" data-target={`#col${item.id}`} data-toggle="collapse">{item.participants.length}</td>
                                  <td>{item.keterangan ? item.keterangan : '-'}</td>
                                  <td>
                                    {
                                      //item.participants.filter(x => x.user_id === Storage.get('user').data.user_id).length ?
                                      item.isShare == true ?
                                        <CopyToClipboard text={`Meeting Room : ${this.state.roomName}\nSchedule : ${moment(item.tgl_mulai).local().format('dddd, MMMM Do YYYY')}, ${moment(item.tgl_mulai).local().format('HH:mm')} - ${moment(item.tgl_selesai).local().format('HH:mm')}\nTime Zone : GMT${moment().local().format('Z')} ${moment.tz.guess(true)}\nDuration : ${durasi}\nDescription : ${item.keterangan}\nURL : ${APPS_SERVER}meet/${item.id}`}
                                          onCopy={() => { this.setState({ copied: true }); toast.info('Copied to your clipboard.') }}>
                                          <i className="fa fa-copy cursor">&nbsp; Copy</i>
                                        </CopyToClipboard>
                                        : '-'
                                    }
                                  </td>
                                  <td>
                                    <span onClick={() => this.onClickInformation(item.meeting_id, item.id)} className="badge badge-pill badge-info cursor" style={{ fontSize: "1em", cursor: 'pointer' }}>Information</span>
                                    {
                                      //checkParty && range 
                                      item.isJoin || (checkParty && range) ?
                                        <a rel="noopener noreferrer" target='_blank' href={`/meet/${item.id}`}>
                                          <span className="badge badge-pill badge-success ml-2 cursor" style={{ fontSize: "1em", cursor: 'pointer' }}>Join</span>
                                        </a>
                                        : null
                                    }
                                    {
                                      (item.user_id === Storage.get('user').data.user_id) && !item.expired ?
                                        <span class="badge badge-pill badge-secondary ml-2" onClick={this.editBooking.bind(this, item.id)} style={{ fontSize: "1em", cursor: 'pointer' }}>Edit</span>
                                        : null
                                    }
                                    {
                                      (item.user_id === Storage.get('user').data.user_id) && !item.expired ?
                                        <span class="badge badge-pill badge-danger ml-2" onClick={this.cancelBooking.bind(this, item.id)} style={{ fontSize: "1em", cursor: 'pointer' }}>Cancel</span>
                                        : null
                                    }
                                  </td>
                                </tr>
                                <tr className="collapse" id={`col${item.id}`} ariaExpanded="true">
                                  <td colSpan="9">
                                    <div className="title-head f-w-900 f-16">
                                      Confirmation Attendace {item.participants.length} Participants
                                    </div>
                                    <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                      <div className='legend-kehadiran hadir'></div>
                                      <h3 className="f-14 mb-0 mr-2"> Present ({item.participants.filter(k => k.confirmation === 'Hadir').length})</h3>
                                      <div className='legend-kehadiran tidak-hadir'></div>
                                      <h3 className="f-14 mb-0 mr-2"> Not Present ({item.participants.filter(k => k.confirmation === 'Tidak Hadir').length})</h3>
                                      <div className='legend-kehadiran tentative'></div>
                                      <h3 className="f-14 mb-0 mr-2"> Unconfirmed ({item.participants.filter(k => k.confirmation === '').length})</h3>
                                    </div>
                                    <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                      {
                                        item.participants.map(r => (
                                          <div className={r.confirmation === 'Hadir' ? 'peserta hadir' : r.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{r.name}</div>
                                        ))
                                      }
                                    </div>
                                  </td>
                                </tr>
                              </Fragment>
                            )
                          })
                          :
                          (<tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                            <td colspan='9'>There is no booking</td>
                          </tr>)
                    }
                  </tbody>
                </table>
              </div>

              <div className="col-sm-12">
                <h4>Booking</h4>
                <div className="form-group row">
                  <div className="col-sm-2">
                    <label className="bold col-sm-12"> Date </label>
                    <DatePicker dateFormat="yyyy-MM-dd" selected={this.state.tanggal} onChange={e => this.setState({ tanggal: e })} />
                  </div>
                  <div className="col-sm-2">
                    <label className="bold col-sm-12"> Starting Hours </label>
                    <DatePicker selected={this.state.jamMulai} onChange={date => this.setState({ jamMulai: date })} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="h:mm aa" />
                  </div>
                  <div className="col-sm-2">
                    <label className="bold col-sm-12"> End Hours </label>
                    <DatePicker selected={this.state.jamSelesai} onChange={date => this.setState({ jamSelesai: date })} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="h:mm aa" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-6">
                    <label className="bold col-sm-12">Description (optional)</label>
                    <textarea rows="4" className="form-control" value={this.state.keterangan} onChange={e => this.setState({ keterangan: e.target.value })} />
                  </div>
                </div>

                {
                  /** 
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
                  */
                }
                {
                  this.state.private ?
                    <Form.Group controlId="formJudul">
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <Form.Label className="f-w-bold">
                            Add Participants
                          </Form.Label>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-6">
                          <Form.Text className="text-muted">
                            + Add from groups
                          </Form.Text>
                          <Select
                            value={[...this.state.optionsGroup].filter(x => this.state.valueGroup.includes(x.value))}
                            options={this.state.optionsGroup}
                            isMulti
                            closeMenuOnSelect={false}
                            onChange={valuePeserta => {
                              this.groupSelect(valuePeserta)
                              this.setState({ hide_add_participant: 'visible' });
                            }}
                          />
                        </div>
                      </div>
                    </Form.Group>
                    : null
                }

                {
                  this.state.hide_add_participant ?

                    <Form.Group controlId="formJudul">

                      <div className="form-group row">
                        <div className="col-sm-6">
                          <Form.Text className="text-muted">
                            + Add more participants from user list
                          </Form.Text>
                          <Select
                            value={[...this.state.optionsPeserta].filter(x => this.state.valuePeserta.includes(x.value))}
                            options={this.state.optionsPeserta}
                            isMulti
                            closeMenuOnSelect={false}
                            onChange={valuePeserta => {
                              let arr = [];
                              valuePeserta.map((item) => arr.push(item.value));
                              this.setState({
                                valuePeserta: arr
                              })
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-6">
                          <Form.Text className="text-muted">
                            + Email
                          </Form.Text>
                          <TagsInput
                            value={this.state.emailInvite}
                            onChange={this.handleChangeEmail.bind(this)}
                            addOnPaste={true}
                            addOnBlur={true}
                            inputProps={{ placeholder: `Insert Email` }}
                          />
                        </div>
                      </div>

                    </Form.Group>
                    : null
                }

                {
                  this.state.private ?
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Attendance confirmation is mandatory
                          </Form.Label>
                          <div style={{ width: '100%' }}>
                            <ToggleSwitch checked={false} onChange={this.toggleSwitchRequiredConfirmation.bind(this)} checked={this.state.requireConfirmation} />
                          </div>
                          <Form.Text className="text-muted">
                            {this.state.requireConfirmation ? 'Only participants who confirm attendance can join the meeting.' : 'All meeting participants can join the meeting.'}
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </div>
                    : null
                }
                <div className="form-group row">
                  <div className="col-sm-6">
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
                  </div>
                </div>
                {
                  this.state.akses ?
                    <Form.Group controlId="formJudul">
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <Form.Label className="f-w-bold">
                            Moderator
                          </Form.Label>
                          <Select
                            value={[...this.state.optionsModerator].filter(x => this.state.valueModerator.includes(x.value))}
                            options={this.state.optionsModerator}
                            closeMenuOnSelect={false}
                            onChange={selected => {
                              this.setState({ valueModerator: [selected.value] })
                            }}
                          />
                          <Form.Text className="text-muted">
                            Moderator, presenter, or speaker
                          </Form.Text>
                        </div>
                      </div>
                    </Form.Group>
                    : null
                }

                <div className="form-group row">
                  <div className="col-sm-6">
                    <Form.Label className="f-w-bold">Engine<required>*</required></Form.Label>
                    <Select id="engine"
                      options={[
                        { label: 'ICADEMY', value: 'bbb' },
                        { label: 'ZOOM', value: 'zoom' }
                      ]}
                      value={[{ label: 'ICADEMY', value: 'bbb' }, { label: 'ZOOM', value: 'zoom' }].filter(x => this.state.engine === x.value)}
                      onChange={engine => { this.setState({ engine: engine ? engine.value : '' }); }}
                    />
                    <p className="form-notes">
                      Choose meeting engine.
                    </p>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-sm-6">
                    <Form.Label className="f-w-bold">Mode<required>*</required></Form.Label>
                    <Select id="mode"
                      options={[
                        { label: 'WEB', value: 'web' },
                        { label: 'APP', value: 'app' }
                      ]}
                      value={[{ label: 'WEB', value: 'web' }, { label: 'APP', value: 'app' }].filter(x => this.state.mode === x.value)}
                      onChange={engine => { this.setState({ mode: engine ? engine.value : '' }); console.log(engine, 'engine') }}
                    />
                    <p className="form-notes">
                      Choose meeting mode.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/** 
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

            {
              this.state.scheduled ?
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
              : null
            }
            */}

          </Modal.Body>
          <Modal.Footer>
            {
              this.state.idBooking ?
                <button disabled={this.state.isSaving} className="btn btn-icademy-primary" onClick={this.saveEditBooking.bind(this)}>
                  <i className="fa fa-save"></i> {this.state.isSaving ? 'Sending Invitation...' : 'Save'}
                </button>
                :
                <button disabled={this.state.isSaving} className="btn btn-icademy-primary" onClick={this.booking.bind(this)}>
                  <i className="fa fa-save"></i> {this.state.isSaving ? 'Sending Invitation...' : 'Book'}
                </button>
            }
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closemodalJadwal}>
              Cancel
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
              <div className="row">
                <div className="form-field-top-label">
                  <label for="time">Meeting Room Name<required>*</required></label>
                  <input type="text" value={this.state.roomName} onChange={e => this.setState({ roomName: e.target.value })} name="judul" style={{ width: '450px' }} id="judul" placeholder="Insert Title" />
                  <p className="form-notes">
                    The title cannot use special characters.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="form-field-top-label">
                  <label for="time">Project<required>*</required></label>
                  <MultiSelect id="folder" options={this.state.optionsFolder} value={this.state.valueFolder} onChange={valueFolder => this.setState({ valueFolder })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Folder Project" />
                  <p className="form-notes">
                    All MOM and recording are stored in the project’s file folder.
                  </p>
                </div>
              </div>

              {/* <div className="row">
                <div className="form-field-top-label">
                  <label for="time">Engine<required>*</required></label>
                  <MultiSelect id="engine"
                    options={[
                      {label: 'ICADEMY', value: 'bbb'},
                      {label: 'ZOOM', value: 'zoom'}
                    ]}
                    value={[this.state.engine]}
                    onChange={engine => this.setState({ engine: engine.length ? engine[0] : [] })}
                    mode="single"
                    enableSearch={true} resetable={true} valuePlaceholder="Select Engine" />
                  <p className="form-notes">
                    Choose meeting engine.
                  </p>
                </div>
              </div> */}

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeClassModal}>
              Cancel
            </button>
            <button className={`btn btn-icademy-primary ${this.state.sendingEmail && 'btn-icademy-grey'}`} onClick={this.onSubmitForm} disabled={this.state.sendingEmail}>
              <i className="fa fa-save"></i> {this.state.sendingEmail ? 'Saving...' : 'Save'}
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
            {
              this.state.needConfirmation >= 1 && this.state.infoClass.is_required_confirmation === 1 ?
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
            {
              this.state.infoClass === [] || this.state.infoClass.length === 0 || this.state.infoClass.class_id === null ?
                `No meeting found with this meeting ID or has been deleted.`
                : null
            }
            <div className="row">
              <div className="col-sm-6">
                <div className="title-head f-w-900 f-16" style={{ marginBottom: 20 }}>
                  {this.state.infoClass.room_name}
                </div>
              </div>
            </div>
            <div class="row">
              <div className="col-sm-6">
                {
                  this.state.infoClass.hasOwnProperty('room_name') && this.state.infoClass.room_name !== null ?
                    <h3 className="f-14">{this.state.infoClass.keterangan}</h3>
                    : null
                }
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
              {
                this.state.infoClass.hasOwnProperty('tanggal') && this.state.infoClass.tanggal !== null ?
                  <div className="col-sm-6">
                    <h3 className="f-14">
                      Start : {moment(this.state.infoClass.tgl_mulai).local().format("DD-MM-YYYY HH:mm")}
                    </h3>
                    <h3 className="f-14">
                      End : {moment(this.state.infoClass.tgl_selesai).local().format("DD-MM-YYYY HH:mm")}
                    </h3>
                  </div>
                  : null
              }
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
                    this.state.infoParticipant.filter(item => item.actual === 'Hadir').length ? null : <h3 className="f-14" style={{ marginTop: 20 }}>There's no participant attended</h3>
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
          <Modal.Footer>
            {
              // this.state.infoParticipant.filter(x => x.user_id === Storage.get('user').data.user_id).length ?
              this.state.infoClass.isShare == true ?
                <CopyToClipboard text={`Meeting Room : ${this.state.infoClass.room_name}\nSchedule : ${moment(this.state.infoClass.tgl_mulai).local().format('dddd, MMMM Do YYYY')}, ${moment(this.state.infoClass.tgl_mulai).local().format('HH:mm')} - ${moment(this.state.infoClass.tgl_selesai).local().format('HH:mm')}\nTime Zone : GMT${moment().local().format('Z')} ${moment.tz.guess(true)}\nDuration : ${durasi}\nDescription : ${this.state.infoClass.keterangan}\nURL : ${APPS_SERVER}meet/${this.state.infoClass.id}`}
                  onCopy={() => { this.setState({ copied: true }); toast.info('Copied to your clipboard.') }}>
                  <button className="btn btn-v2 btn-primary"><i className="fa fa-copy cursor"></i>&nbsp; Copy Invitation</button>
                </CopyToClipboard>
                : null
            }
            {
              // this.state.infoParticipant.filter(x => x.user_id === Storage.get('user').data.user_id).length && Moment().isBetween(infoDateStart, infoDateEnd) 
              this.state.infoClass.isJoin || (this.state.infoParticipant.filter(x => x.user_id === Storage.get('user').data.user_id).length && Moment().isBetween(infoDateStart, infoDateEnd)) ?
                <a className="btn btn-v2 btn-warning" style={{ background: '#EF843C', borderColor: '#EF843C' }} rel="noopener noreferrer" target='_blank' href={(this.state.infoClass.engine === 'zoom') ? this.state.checkZoom[0].link : `/meet/${this.state.infoClass.id}`}>
                  <i className="fa fa-video"></i> Join
                </a>
                : null
            }
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.isModalBooking} onHide={() => this.closeModalBooking()} dialogClassName="modal-xlg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              {this.state.roomName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="title-head f-w-900 f-16 mb-2">
              Schedule & Booking Meeting
            </div>
            <table className="table table-hover table-striped table-list_booking">
              <thead>
                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                  <td><b>Date</b></td>
                  <td><b>Starting Hours</b></td>
                  <td><b>End Hours</b></td>
                  <td><b>By</b></td>
                  <td><b>Moderator</b></td>
                  <td className="text-center"><b>Participants</b></td>
                  <td><b>Description</b></td>
                  <td><b>Share</b></td>
                  <td><b>Action</b></td>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.isLoadBooking ?
                    <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                      <td colspan='9'>Loading</td>
                    </tr>
                    :
                    !this.state.isLoadBooking && this.state.dataBooking.booking.length ?
                      this.state.dataBooking.booking.map((item) => {
                        const now = String(('0' + new Date().getDate()).slice(-2) + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + (new Date().getFullYear()))

                        const split = item.tanggal.split('-')
                        const reTanggal = `${split[2]}-${split[1]}-${split[0]}`
                        const jamIni = moment()
                        const sJadwal = Moment(`${item.tgl_mulai}`).local()
                        const eJadwal = Moment(`${item.tgl_selesai}`).local()
                        const range = jamIni.isBetween(sJadwal, eJadwal)

                        let checkParty = item.participants.filter(x => x.user_id === Storage.get('user').data.user_id).length


                        let jamMl = new Date(Moment(`${item.tgl_mulai}`).local());
                        let jamMulai = Moment(`${item.tgl_mulai}`).local() ? ('0' + jamMl.getHours()).slice(-2) + ':' + ('0' + jamMl.getMinutes()).slice(-2) : '-';
                        let jamSl = new Date(Moment(`${item.tgl_selesai}`).local());
                        let diff = Math.abs(jamSl - jamMl);
                        let diffHour = Math.floor((diff % 86400000) / 3600000);
                        let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
                        let durasi = item.jam_mulai ? (diffHour !== 0 ? diffHour + ' hours ' : '') + (diffMin !== 0 ? diffMin + ' minutes' : '') : '-';
                        return (
                          <Fragment>
                            <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                              <td>{now === moment(item.tgl_mulai).local().format('DD-MM-YYYY') ? 'Today' : moment(item.tgl_mulai).local().format('DD-MM-YYYY')}</td>
                              <td>{moment(item.tgl_mulai).local().format('HH:mm')}</td>
                              <td>{moment(item.tgl_selesai).local().format('HH:mm')}</td>
                              <td>{item.name}</td>
                              <td>{item.moderator_name ? item.moderator_name : '-'}</td>
                              <td className="text-center cursor" data-target={`#col${item.id}`} data-toggle="collapse" style={{ color: '#0778ce' }}>{item.participants.length}</td>
                              <td>{item.keterangan ? item.keterangan : '-'}</td>
                              <td>
                                {
                                  // item.participants.filter(x => x.user_id === Storage.get('user').data.user_id).length ?
                                  item.isShare == true ?
                                    <CopyToClipboard text={`Meeting Room : ${this.state.roomName}\nSchedule : ${moment(item.tgl_mulai).local().format('dddd, MMMM Do YYYY')}, ${moment(item.tgl_mulai).local().format('HH:mm')} - ${moment(item.tgl_selesai).local().format('HH:mm')}\nTime Zone : GMT${moment().local().format('Z')} ${moment.tz.guess(true)}\nDuration : ${durasi}\nDescription : ${item.keterangan}\nURL : ${APPS_SERVER}meet/${item.id}`}
                                      onCopy={() => { this.setState({ copied: true }); toast.info('Copied to your clipboard.') }}>
                                      <i className="fa fa-copy cursor">&nbsp; Copy</i>
                                    </CopyToClipboard>
                                    : '-'
                                }
                              </td>
                              <td>
                                <span onClick={() => this.onClickInformation(item.meeting_id, item.id)} className="badge badge-pill badge-info cursor" style={{ fontSize: "1em", cursor: 'pointer' }} >Information</span>
                                {
                                  // checkParty && range
                                  item.isJoin || (checkParty && range) ?
                                    <a rel="noopener noreferrer" target='_blank' href={(this.state.infoClass.engine === 'zoom') ? this.state.checkZoom[0].link : `/meet/${item.id}`}>
                                      <span className="badge badge-pill badge-success ml-2 cursor" style={{ fontSize: "1em", cursor: 'pointer' }}>Join</span>
                                    </a>
                                    : null
                                }
                                {
                                  (item.user_id === Storage.get('user').data.user_id) && !item.expired ?
                                    <span class="badge badge-pill badge-secondary ml-2" onClick={this.editBooking.bind(this, item.id)} style={{ fontSize: "1em", cursor: 'pointer' }}>Edit</span>
                                    : null
                                }
                                {
                                  (item.user_id === Storage.get('user').data.user_id) && !item.expired ?
                                    <span class="badge badge-pill badge-danger ml-2" onClick={this.cancelBooking.bind(this, item.id)} style={{ fontSize: "1em", cursor: 'pointer' }}>Cancel</span>
                                    : null
                                }
                              </td>
                            </tr>
                            <tr className="collapse" id={`col${item.id}`} ariaExpanded="true">
                              <td colSpan="9">
                                <div className="title-head f-w-900 f-16">
                                  Confirmation Attendace {item.participants.length} Participants
                                </div>
                                <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                  <div className='legend-kehadiran hadir'></div>
                                  <h3 className="f-14 mb-0 mr-2"> Present ({item.participants.filter(k => k.confirmation === 'Hadir').length})</h3>
                                  <div className='legend-kehadiran tidak-hadir'></div>
                                  <h3 className="f-14 mb-0 mr-2"> Not Present ({item.participants.filter(k => k.confirmation === 'Tidak Hadir').length})</h3>
                                  <div className='legend-kehadiran tentative'></div>
                                  <h3 className="f-14 mb-0 mr-2"> Unconfirmed ({item.participants.filter(k => k.confirmation === '').length})</h3>
                                </div>
                                <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                  {
                                    item.participants.map(r => (
                                      <div className={r.confirmation === 'Hadir' ? 'peserta hadir' : r.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{r.name}</div>
                                    ))
                                  }
                                </div>
                              </td>
                            </tr>
                          </Fragment>
                        )
                      })
                      :
                      (<tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                        <td colspan='9'>There is no booking</td>
                      </tr>)
                }
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            {
              (this.rooms.isJoin && this.roomId) || (this.roomId && this.rooms.hasOwnProperty('participants') && this.rooms.participants.filter(x => x.user_id === Storage.get('user').data.user_id).length) ?
                <a href={`/meet/${this.roomId}`} target="_blank" rel="noopener noreferrer" className="btn btn-v2 btn-warning" style={{ background: '#EF843C', borderColor: '#EF843C' }}>
                  <i className="fa fa-video"></i> Join
                </a>
                :
                !this.roomId && !this.state.isLoadBooking ?
                  <button className="btn btn-v2 btn-primary" onClick={() => this.startMeetingNow(this.state.classId, this.state.roomName)}>
                    <i className="fa fa-video"></i> Start meeting now
                  </button>
                  : null
            }
            <button className="btn btn-v2 btn-primary" onClick={() => this.openBooking(this.state.classId, this.state.roomName)}>
              <i className="fa fa-book"></i> Book new meeting
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure want to delete meeting <b>{this.state.deleteMeetingName}</b> ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
              Cancel
            </button>
            <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.onSubmitDelete.bind(this, this.state.deleteMeetingId)}>
              <i className="fa fa-trash"></i> Delete
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
                  onChange={valueInvite => { let arr = []; valueInvite.map((item) => arr.push(item.value)); this.setState({ valueInvite: arr }) }}
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
            <button className="btn btn-icademy-primary float-right" style={{ marginLeft: 10 }} onClick={this.onClickSubmitInvite}>
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
    {socket => <MeetingTable {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const MeetingWithTranslation = withTranslation('common')(Meetings)

export default MeetingWithTranslation;
