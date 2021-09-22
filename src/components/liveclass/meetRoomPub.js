import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import moment from 'moment-timezone';
import { Alert } from 'react-bootstrap';
import {
  Form, Card, Col, Row, Modal
} from 'react-bootstrap';

import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'
import Tooltip from '@material-ui/core/Tooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import 'react-tagsinput/react-tagsinput.css'
import { toast } from "react-toastify";

import API, { USER_ME, APPS_SERVER, API_SERVER, API_SOCKET, BBB_URL, BBB_KEY, CHIME_URL, ZOOM_URL } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
import Iframe from 'react-iframe';
import { isMobile, isIOS } from 'react-device-detect';
import ReactFullScreenElement from "react-fullscreen-element";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Gantt from '../Gantt';
import Dictation from './dictation';
import { Editor } from '@tinymce/tinymce-react';

import TableFiles from '../files/_files';
import FileViewer from 'react-file-viewer';

import Select from 'react-select';


// import { ThemeProvider } from 'styled-components';
// import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';
// import ChimeMeeting from '../meeting/chime'
import axios from 'axios'
import Moment from "moment-timezone";

const bbb = require('bigbluebutton-js')
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class MeetRoomPub extends Component {
  state = {
    jamNow : Moment().local(),
    showOpenApps: true,
    showToolTipInvitation: false,
    copied: false,
    dataParticipants:{
      audio : 0,
      camera : 0,
    },
    fileKey: Math.random().toString(36),
    session: Storage.get('user').data,
    welcome: true,
    fullscreen: false,
    classId: this.props.match.params.roomid,
    user: {
      user_id: Storage.get('user').data ? Storage.get('user').data.user_id : '',
      name: Storage.get('user').data ? Storage.get('user').data.user : '',
      email: Storage.get('user').data ? Storage.get('user').data.email : '',
      avatar: Storage.get('user').data ? Storage.get('user').data.avatar : ''
    },
    classRooms: {},
    fileChat: [],
    attachment: '',
    isNotifikasi: false,
    isiNotifikasi: '',
    isInvite: false,
    emailInvite: [],
    emailResponse: '',
    //multi select invite
    optionsInvite: [],
    valueInvite: [],
    nameFile: null,
    join: false,
    startMic: localStorage.getItem('startMic') === 'true' ? true : false,
    startCam: localStorage.getItem('startCam') === 'true' ? true : false,
    modalStart: false,
    tabIndex: 1,
    body: '',
    editMOM: false,
    jwt: '',
    listMOM: [],
    listSubtitle: [],
    startDate: new Date(),
    title: '',
    momid: '',
    modalExportMOM: false,
    selectSubtitle: '',
    subtitle: '',
    sendingEmail: false,

    engine: 'bbb',
    mode: 'web',

    folder: [],
    mom: [],
    recordedMeeting: [],
    folderName: '',
    selectFolder: false,
    folderId: 0,
    prevFolderId: 0,
    files: [],
    projectName: '',
    project: [],
    modalNewFolder: false,
    modalUpload: false,
    attachmentId: [],
    uploading: false,
    alert: '',

    shareGantt: '',
    newShareGantt: false,
    newFileShow: false,

    //kehadiran
    isModalConfirmation: false,
    infoClass: [],
    infoParticipant: [],
    countHadir: 0,
    countTentative: 0,
    countTidakHadir: 0,
    needConfirmation: 0,
    joinUrl: '',
    modalEnd: false,
    loadingFileSharing: false,
    selectedFileShow: '',

    //modal
    modalFileSharing: false,
    modalMOM: false,
    modalGantt: false,
    modalFileShow: false,

    attendee: {},
    zoomUrl: '',
    isZoom: false,
    gb: [],
    joined: false

  }

  fetchDataParticipants(){
    if (this.state.classRooms.id){
      let api = bbb.api(BBB_URL, BBB_KEY)
      let http = bbb.http
  
      let meetingInfo = api.monitoring.getMeetingInfo(this.state.classRooms.id)
      http(meetingInfo).then((result) => {
        if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
          // Jika belum ada
        }
        else {
          // Jika sudah ada
          this.setState({
            dataParticipants:{
              audio : result.attendees.attendee ? Array.isArray(result.attendees.attendee) ?
                        result.attendees.attendee.filter(x=> x.hasJoinedVoice || x.isListeningOnly).length : result.attendees.attendee.hasJoinedVoice || result.attendees.attendee.isListeningOnly ?
                          1
                        : 0
                      : 0,
              camera : result.attendees.attendee ? Array.isArray(result.attendees.attendee) ?
                        result.attendees.attendee.filter(x=> x.hasVideo).length : result.attendees.attendee.hasVideo ?
                          1
                        : 0
                      : 0,
            }
          })
        }
      })
    }
  }

  joinChime = async (e) => {
    const title     = this.state.classRooms.room_name+'-'+moment(new Date).format('YYYY-MM-DD-HH');
    const name      = this.state.user.name;
    const region    = `ap-southeast-1`;

    axios.post(`${CHIME_URL}/join?title=${title}&name=${name}&region=${region}`).then(res => {
      this.setState({ attendee: res.data.JoinInfo })
    })
  }

  toggleSwitchMic(checked) {
    localStorage.setItem('startMic', !this.state.startMic)
    this.setState({ startMic: !this.state.startMic });
  }
  toggleSwitchCam(checked) {
    localStorage.setItem('startCam', !this.state.startCam)
    this.setState({ startCam: !this.state.startCam });
  }

  handleChange(emailInvite) {
    this.setState({ emailInvite })
  }

  handleCloseInvite = e => {
    this.setState({
      isInvite: false,
      emailInvite: [],
      emailResponse: "Masukkan email yang ingin di invite."
    });
  }
  
  handleCloseStart = e => {
    this.setState({ modalStart: true })
  }

  componentDidMount() {
    this.fetchProject()
    // if (isMobile) {
    //   window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/' + this.state.classId))
    // }
    // else {
      this.setState({ isLoading: true })
      this.onBotoomScroll();
      socket.on("broadcast", data => {
        if (data.room == this.state.classId) {
          this.fetchData();
          this.setState({ fileChat: [...this.state.fileChat, data] })
        }
        if (data.socketAction == 'shareGantt' && data.meetingId === this.state.classRooms.id && data.userId !== this.state.user.user_id && Storage.get('user').data) {
          this.setState({ newShareGantt: true, shareGantt: data.projectId })
        }
        if (data.socketAction == 'fileShow' && data.meetingId === this.state.classRooms.id && data.userId !== this.state.user.user_id && Storage.get('user').data) {
          this.setState({ newFileShow: true, modalFileShow: true }, () => {
            this.setState({selectedFileShow: data.selectedFileShow})
          })
        }
      });
      this.fetchData();

      this.timer = setInterval(
        () => {
          this.fetchDataParticipants();
          this.setState({jamNow: Moment().local()})
        },
        5000,
      );
    // }
    // window.onbeforeunload = function() {
    //   return "Are you sure you want to leave?";
    // };

    //semua link open new tab
    var links = document.getElementsByTagName('a');
    var len = links.length;

    for (var i = 0; i < len; i++) {
      links[i].target = "_blank";
    }

    // Update kehadiran aktual
    if (Storage.get('user').data.user_id){
      let form = {
        confirmation: 'Hadir',
      }
      API.put(`${API_SERVER}v1/liveclass/actualattendance/${this.state.classId}/${Storage.get('user').data.user_id}`, form).then(async res => {
        if (res.status === 200) {
          console.log('Kehadiran Aktual : Hadir')
        }
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onSubmitLock(classId, isLive) {
    API.put(`${API_SERVER}v1/liveclass/live/${classId}`, { is_live: isLive == 0 ? '1' : '0' }).then(res => {
      if (res.status === 200) {
        this.fetchData();
        toast.success(`Success ${isLive == 0 ? 'unlock' : 'lock'} meeting`)
      }
    })
  }

  fetchData() {
    this.onBotoomScroll();
    API.get(`${API_SERVER}v2/meetpub/id/${this.state.classId}`).then(response => {
      this.setState({
        isLoading: false,
        classRooms: response.data.result,
        // user: {
        //   user_id: Storage.get('user').data ? Storage.get('user').data.user_id : '',
        //   name: Storage.get('user').data ? Storage.get('user').data.user : '',
        //   email: Storage.get('user').data ? Storage.get('user').data.email : '',
        //   avatar: Storage.get('user').data ? Storage.get('user').data.avatar : ''
        // }
      })
      API.get(`${API_SERVER}v2/meetpub/file/${this.state.classId}`).then(res => {
        let splitTags;
        let datas = res.data.result;
        for (let a in datas) {
          splitTags = datas[a].attachment.split("/")[5];
          datas[a].filenameattac = splitTags;
        }
        if (res.status === 200) {
          this.setState({
            fileChat: res.data.result
          })

         this.fetchMOMAndTranscript(this.state.classId)
        }
      })
    })
    .catch(function (error) {
      console.log(error);
    });

    API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id}`).then(response => {
      response.data.result.map(item => {
        this.state.optionsInvite.push({ value: item.user_id, label: item.name });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  fetchMOMAndTranscript = (classId) => {
    API.get(`${API_SERVER}v1/liveclass/mom/${classId}`).then(res => {
      if (res.status === 200) {
        this.setState({
          listMOM: res.data.result ? res.data.result : []
        })
        // API.get(`${API_SERVER}v1/transcripts/${this.state.classRooms.room_name}`).then(res => {
        //   if (res.status === 200) {
        //     let publishSubsSelect = []
        //     res.data.result.map((item, i) => {
        //       if (item.events.length > 0) {
        //         publishSubsSelect.push(item)
        //       }
        //     })
        //     this.setState({
        //       listSubtitle: publishSubsSelect
        //     })

        //   }

        // })
      }
    })
  }

  joinMeeting() {
    // BBB JOIN START
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
    let meetingInfo = api.monitoring.getMeetingInfo(this.state.classRooms.booking_id)
    http(meetingInfo).then(async (result) => {
      if (result.returncode === 'FAILED' && result.messageKey === 'notFound') {
        // Jika belum ada, create room nya.
        let meetingCreateUrl = api.administration.create(this.state.classRooms.room_name, this.state.classRooms.booking_id, {
          attendeePW: 'peserta',
          moderatorPW: 'moderator',
          allowModsToUnmuteUsers: true,
          record: true
        })
        http(meetingCreateUrl).then(async (result) => {
          if (result.returncode === 'SUCCESS') {
            // Setelah create, join
            let joinUrl = api.administration.join(
              this.state.user.name,
              this.state.classRooms.booking_id,
              this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 'moderator' : 'peserta',
              {
                userID: this.state.user.user_id,
                guest: Storage.get("user").data.user_id ? false : true
              }
            )

            let zoomUrl = await API.get(`${API_SERVER}v2/liveclass/zoom/${this.state.classRooms.meeting_id}`);
            let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
            this.setState({isZoom:  zoomUrl.data.result.length ? true : false})
            let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 1 : 0}`

            this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })
            // if (isMobile) {
            //   window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/' + this.state.classId))
            // }
          }
          else {
            console.log('GAGAL', result)
          }
        })
      }
      else {
        let checkAttendee = !result.attendees.attendee ? 0 : Array.isArray(result.attendees.attendee) ?
        result.attendees.attendee.filter(x=>
          x.userID === this.state.user.user_id &&
          (
            x.isListeningOnly ||
            x.hasJoinedVoice ||
            x.hasVideo
          )
        ).length
        :
        result.attendees.attendee.userID === this.state.user.user_id &&
        (
          result.attendees.attendee.isListeningOnly ||
          result.attendees.attendee.hasJoinedVoice ||
          result.attendees.attendee.hasVideo
        );
        if (checkAttendee){
          this.setState({joined: true});
        }
        else{
          // Jika sudah ada, join
          let joinUrl = api.administration.join(
            this.state.user.name,
            this.state.classRooms.booking_id,
            this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0  ? 'moderator' : 'peserta',
            {
              userID: this.state.user.user_id,
              guest: Storage.get("user").data.user_id ? false : true
            }
          )
  
          let zoomUrl = await API.get(`${API_SERVER}v2/liveclass/zoom/${this.state.classRooms.booking_id}`);
          let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
          this.setState({isZoom:  zoomUrl.data.result.length ? true : false})
          let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 1 : 0}`
  
          this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })
          // if (isMobile) {
          //   window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/' + this.state.classId))
          // }
        }
      }
    })
    // BBB JOIN END
    
    // check tampilkan invite participants
    if (Storage.get("user").data.user_id){
      this.setState({
        isInvite: this.state.classRooms.user_id === Storage.get("user").data.user_id && this.state.classRooms.participants.length < 2 && this.state.classRooms.participants[0].user_id === Storage.get("user").data.user_id ? true : false
      },()=>{
        setTimeout(
          ()=>{
            this.setState({
              showToolTipInvitation: true
            })
          }, 1000)
      })
    }
  }

  onClickInvite = e => {
    e.preventDefault();
    this.setState({ isInvite: true });
  }


  onClickSubmitInvite = e => {
    e.preventDefault();
    let { classRooms } = this.state
    if (this.state.emailInvite == '' && this.state.userInvite == '') {
      toast.warning('Please select the invited user or email.')
    }
    else {
      this.setState({ sendingEmail: true })
      let form = {
        user: Storage.get('user').data.user,
        email: this.state.emailInvite,
        room_name: this.state.classRooms.room_name,
        is_private: this.state.classRooms.is_private,
        is_scheduled: this.state.classRooms.is_scheduled,
        schedule_start: `${moment.tz(this.state.classRooms.tgl_mulai, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (${moment.tz.guess(true)} Time Zone)`,
        schedule_end: `${moment.tz(this.state.classRooms.tgl_selesai, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (${moment.tz.guess(true)} Time Zone)`,
        userInvite: this.state.valueInvite,
        message: APPS_SERVER + 'redirect/meeting/information/' + this.state.classId,
        messageNonStaff: APPS_SERVER + 'meet/' + this.state.classId
      }

      API.post(`${API_SERVER}v1/liveclasspublic/share`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            // add to parti
            if (form.userInvite.length) {
              for (let index = 0; index < form.userInvite.length; index++) {
                let f = {
                  meeting_id: classRooms.booking_id,
                  user_id: form.userInvite[index]
                }
                this.addToCalendar(form.userInvite[index]);
                // API.post(`${API_SERVER}v2/meetpub/participant`, f) 
              }
            }
            
            this.setState({
              isInvite: false,
              showToolTipInvitation: false,
              emailInvite: [],
              valueInvite: [],
              emailResponse: res.data.result,
              sendingEmail: false
            });
            toast.success("Send email to participants.")
          } else {
            toast.error("Email failed to send, please check the email address.")
            this.setState({ sendingEmail: false })
          }
        }
      })
    }
  }

  onBotoomScroll = (e) => {
    //let scrollingElement = (document.scrollingElement || document.body);
    var element = document.getElementById('scrollin');
    if (element){
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }

  onChangeInput = (e) => {
    const name = e.target.name;
    if (name === 'attachment') {
      if (e.target.files[0].size <= 500000) {
        this.setState({ nameFile: e.target.files[0].name });
        this.setState({ [name]: e.target.files[0] });
      } else {
        e.target.value = null;
        this.setState({ isNotifikasi: true, isiNotifikasi: 'The file does not match the format, please check again.' })
      }
    } else {
      this.setState({ [name]: e.target.value })
    }
  }

  onChangeName = (e) => {
    this.setState({ user: { ...this.state.user, name: e.target.value } })
  }
  onChangeEmail = (e) => {
    this.setState({ user: { ...this.state.user, email: e.target.value } })
  }

  onChangeInputFile = e => {
    // const target = e.target;
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  sendFileNew() {

    if (this.state.user.user_id) {
      let form = new FormData();
      form.append('class_id', this.state.classId);
      form.append('pengirim', String(this.state.user.user_id));
      form.append('file', this.state.attachment);
      //console.log('form data',FormData);
      API.post(`${API_SERVER}v1/liveclass/file`, form).then(res => {
        console.log(res, 'response');

        if (res.status === 200) {
          if (!res.data.error) {
            this.onBotoomScroll();
            let splitTags;

            let datas = res.data.result;
            console.log(datas, 'datass')
            splitTags = datas.attachment.split("/")[4];
            datas.filenameattac = splitTags;

            //this.setState({ fileChat: [...this.state.fileChat, res.data.result], attachment : datas.attachment,  nameFile : null });
            socket.emit('send', {
              pengirim: this.state.user.user_id,
              room: this.state.classId,
              attachment: datas.attachment,
              filenameattac: datas.filenameattac,
              created_at: new Date()
            })

          } else {
            alert('File yang anda input salah')
          }
          this.setState({ fileKey: Math.random().toString(36), nameFile: null })
        }
      })
    } else {
      toast.info(`Can't send files because you're a guest.`)
    }
    
  }

  componentDidUpdate() {
    this.onBotoomScroll();
  }

  joinRoom = async () => {
    let { session, classRooms } = this.state
    if (this.state.user.name && this.state.user.email) {
      // if (!session) {
      this.addParticipant(this.state.user)
      // }

      if (classRooms.engine === 'zoom') {
        let getLink = await API.get(`${API_SERVER}v3/zoom/user/${this.state.classRooms.moderator}`);
        let { error, result } = getLink.data;

        if (result.length) {
          window.open(result[0].link, '_blank').focus();
        } else {
          toast.warning(`Moderator haven't synced zoom yet.`)
        }
      } else {
        this.joinMeeting()
        this.setState({ join: true, modalStart: false, welcome: false });
      }

    }
    else {
      this.setState({ toggle_alert: true, alertMessage: 'Please insert your name and email.' });
    }
  }

  addParticipant = (user) => {
    let { classRooms } = this.state
    let form = { ...user, meeting_id: classRooms.booking_id }
    API.post(`${API_SERVER}v2/meetpub/participant`, form)
  }

  notYetTime() {
    let { classRooms } = this.state
    const jamStartDB = Moment(`${classRooms.tgl_mulai}`).local().tz(Moment.tz.guess(true))
    const jamEndDB = Moment(`${classRooms.tgl_selesai}`).local().tz(Moment.tz.guess(true))
    toast.info(`Schedule at ${Moment(classRooms.tgl_mulai).local().format('LL')} ${jamStartDB.format('HH:mm')} - ${jamEndDB.format('HH:mm')}`)
  }

  addToCalendar = (user) => {
    let { classRooms } = this.state
    let form = {
      type: 3,
      activity_id: classRooms.booking_id,
      description: `${classRooms.room_name} - ${classRooms.keterangan}`,
      destination: `${APPS_SERVER}meet/${classRooms.booking_id}`,
      start: moment(classRooms.tgl_mulai).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(classRooms.tgl_selesai).format('YYYY-MM-DD HH:mm:ss'),
    }
    API.post(`${API_SERVER}v1/agenda/${user ? user : Storage.get('user').data.user_id}`, form).then(res => {
      if (res.status === 200) {
        let { result, message } = res.data
        if (!user){
          toast.success(message ? message : 'Meeting added to calendar.')
        }
        this.fetchData();

        if (!message) {
          // insert to parti
          let form = {
            meeting_id: classRooms.booking_id,
            user_id: user ? user : Storage.get('user').data.user_id
          }
          API.post(`${API_SERVER}v2/meetpub/participant`, form)
        }
      }
    })
  }

  confirmAttendance(confirmation) {
    let form = {
      confirmation: confirmation,
    }

    API.put(`${API_SERVER}v1/liveclass/confirmation/${this.state.classRooms.id}/${Storage.get('user').data.user_id}`, form).then(async res => {
      if (res.status === 200) {
        this.fetchData()

        let formNotif = {
          user_id: this.state.classRooms.moderator,
          type: 3,
          activity_id: this.state.classRooms.id,
          desc: Storage.get('user').data.user + ' Akan ' + confirmation + ' Pada Meeting : ' + this.state.classRooms.room_name,
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

  closeModalGantt = e => {
    this.setState({ modalGantt: false });
  }
  closeModalFileShow = e => {
    this.setState({ modalFileShow: false });
  }
  closeModalConfirmation = e => {
    this.setState({ isModalConfirmation: false });
  }
  closeModalEnd = e => {
    this.setState({ modalEnd: false });
  }
  closeModalFileSharing = e => {
    this.setState({ modalFileSharing: false });
  }
  closeModalMOM = e => {
    this.setState({ modalMOM: false });
  }
  handleSelectFileShow = (val) => {
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http
    let meetingInfo = api.monitoring.getMeetingInfo(this.state.classRooms.id)
    http(meetingInfo).then((result) => {
      let role = 'VIEWER';
      if (this.state.isZoom) {
        role = this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 'MODERATOR' : 'VIEWER';
      }
      else {
        if (Array.isArray(result.attendees.attendee) && result.attendees.attendee.filter(item => item.userID === this.state.user.user_id).length) {
          role = result.attendees.attendee.filter(item => item.userID === this.state.user.user_id)[0].role
        }
        else {
          role = result.attendees.attendee.role
        }
      }

      if (result.returncode == 'SUCCESS' && role === 'MODERATOR') {
        let form = {
          selectedFileShow: val
        }
        API.put(`${API_SERVER}v1/liveclass/share-file/${this.state.classRooms.id}`, form).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              this.setState({ selectedFileShow: val })
              socket.emit('send', {
                socketAction: 'fileShow',
                userId: this.state.user.user_id,
                meetingId: this.state.classRooms.id,
                selectedFileShow: val
              })
            } else {
              toast.error('Error update share file');
            }
          }
        })
      }
      else if (result.returncode == 'SUCCESS' && role === 'VIEWER') {
        toast.warning('You are not moderator');
      }
    })
  }
  fetchMOM(folder) {
    if (folder == 0) {
      this.setState({ mom: [] })
    }
    else {
      API.get(`${API_SERVER}v1/files-mom/${folder}`).then(res => {
        if (res.status === 200) {
          this.setState({
            mom: res.data.result
          })
        }
      })
    }
  }
  fetchRekaman(folder) {
    if (folder == 0) {
      this.setState({ recordedMeeting: [] })
    }
    else {
      API.get(`${API_SERVER}v1/files-recorded/${folder}`).then(res => {
        if (res.status === 200) {
          this.setState({
            recordedMeeting: res.data.result
          })
        }
      })
    }
  }
  fetchFolder(mother) {
    API.get(`${API_SERVER}v1/folder/${this.state.companyId}/${mother}`).then(res => {
      if (res.status === 200) {
        this.setState({ folder: res.data.result })
      }
    })
    API.get(`${API_SERVER}v1/folder/back/${this.state.companyId}/${mother}`).then(res => {
      if (res.status === 200) {
        this.setState({ prevFolderId: res.data.result })
      }
    })
  }
  fetchFile(folder) {
    API.get(`${API_SERVER}v1/files/${folder}`).then(res => {
      if (res.status === 200) {
        this.setState({ files: res.data.result })
      }
    })
  }

  selectFolder(id, name) {
    this.setState({ selectFolder: id == this.state.classRooms.folder_id ? false : true, folderId: id })
    this.fetchFolder(id)
    this.fetchFile(id)
    this.fetchMOM(id)
    this.fetchRekaman(id)
  }

  saveFolder = e => {
    e.preventDefault();
    const formData = {
      name: this.state.folderName,
      company: this.state.companyId,
      mother: this.state.folderId
    };

    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          this.setState({ alert: res.data.result });
        } else {
          this.setState({ modalNewFolder: false, alert: '' })
          this.fetchFolder(this.state.folderId);
        }
      }
    })
  }

  uploadFile = e => {
    e.preventDefault();
    this.setState({ uploading: true })
    for (let i = 0; i <= this.state.attachmentId.length - 1; i++) {
      let form = new FormData();
      form.append('folder', this.state.folderId);
      form.append('file', this.state.attachmentId[i]);
      API.post(`${API_SERVER}v1/folder/files`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            this.setState({ alert: res.data.result, uploading: false, attachmentId: [] });
          } else {
            this.setState({ modalUpload: false, alert: '', uploading: false, attachmentId: [] })
            this.fetchFolder(this.state.folderId);
            this.fetchFile(this.state.folderId)
          }
        }
      })
    }
  }
  tabAktivitas(a, b) {
    this.setState({ tabIndex: b + 1 });
  }

  toggleSwitchMic(checked) {
    localStorage.setItem('startMic', !this.state.startMic)
    this.setState({ startMic: !this.state.startMic });
  }
  toggleSwitchCam(checked) {
    localStorage.setItem('startCam', !this.state.startCam)
    this.setState({ startCam: !this.state.startCam });
  }

  handleEditorChange(body, editor) {
    this.setState({ body });
  }

  handleChange(emailInvite) {
    this.setState({ emailInvite })
  }

  handleCloseInvite = e => {
    this.setState({
      isInvite: false,
      showToolTipInvitation: false,
      emailInvite: [],
      emailResponse: ""
    });
    this.forceUpdate();
  }
  handleTranscript = (value) => {
    window.tinymce.activeEditor.execCommand("mceInsertContent", false, value);
  }
  handleCloseMeeting = e => {
    window.close();
  }

  handleCloseLive = e => {
    this.setState({ isLive: false, liveURL: '' })
  }

  fetchProject() {
    let { session } = this.state
    if (session) {
      API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
          API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
            this.setState({ project: response.data.result });
          }).catch(function (error) {
            console.log(error);
          });
        }
      })
    }
  }

  endMeeting() {
    // BBB END
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    let endMeeting = api.administration.end(this.state.classRooms.id, 'moderator')
    http(endMeeting).then((result) => {
      if (result.returncode == 'SUCCESS') {
        this.closeModalEnd()
        toast.success('Meeting ended')
        API.delete(`${API_SERVER}v1/liveclass/file/delete/${this.state.classRooms.id}`).then(res => {
          if (res.status === 200) {
            toast.success('All file sharing deleted')
            window.close()
          }
        })
      }
    })
  }

  onChangeInputMOM = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  addSubsToMOM = e => {
    e.preventDefault();
    if (this.state.subtitle == '') {
      alert('Silahkan pilih subtitle')
    }
    else {
      let subsContainer = ''
      this.state.listSubtitle[this.state.subtitle].events.map((item, i) => {
        subsContainer = subsContainer + this.state.listSubtitle[this.state.subtitle].events[i].participant.name + " : " + this.state.listSubtitle[this.state.subtitle].events[i].transcript[0].text + "<br>"
      })
      this.setState({
        body: this.state.body + "<br>" + subsContainer + "<br>"
      })
    }
  }

  addMOM = e => {
    e.preventDefault();

    if (this.state.momid) {
      let form = {
        classId: this.state.classId,
        title: this.state.title,
        content: this.state.body.replace(/'/g, "\\'"),
        time: moment.tz(this.state.startDate, moment.tz.guess(true)).format("YYYY-MM-DD HH:mm:ss"),
        created_by : Storage.get('user').data.user_id
      }
      console.log('MOM DATA', form)

      API.put(`${API_SERVER}v1/liveclass/mom/${this.state.momid}`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            this.setState({
              editMOM: false
            });
            this.fetchData();
            this.setState({
              momid: '',
              title: '',
              body: '',
              time: new Date()
            })
          }
        }
      })
    }
    else {
      let form = {
        classId: this.state.classId,
        title: this.state.title,
        content: this.state.body.replace(/'/g, "\\'"),
        time: moment.tz(this.state.startDate, moment.tz.guess(true)).format("YYYY-MM-DD HH:mm:ss"),
        created_by : Storage.get('user').data.user_id
      }
      console.log('MOM DATA', form)

      API.post(`${API_SERVER}v1/liveclass/mom`, form).then(res => {
        if (res.status === 200) {
          if (!res.data.error) {
            this.setState({
              editMOM: false
            });
            this.fetchData();
            this.setState({
              momid: '',
              title: '',
              body: '',
              time: new Date()
            })
          }
        }
      })
    }
  }

  handleChangeDateFrom = date => {
    this.setState({
      startDate: date
    });
  };

  onClickEditMOM = e => {
    e.preventDefault();
    const momid = e.target.getAttribute('data-id');
    const title = e.target.getAttribute('data-title');
    const content = e.target.getAttribute('data-content');
    const time = new Date(e.target.getAttribute('data-time'));
    this.setState({
      editMOM: true,
      momid: momid,
      title: title,
      body: content,
      startDate: time
    })
    console.log('MOM DATA STATE', this.state.title)
  }

  exportMOM = e => {
    e.preventDefault();
    const momid = e.target.getAttribute('data-id');
    window.open(`${APPS_SERVER}mom/?id=${momid}`, "_blank");
  }

  deleteMOM = e => {
    e.preventDefault();
    const momid = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v1/liveclass/mom/delete/${momid}`).then(res => {
      if (res.status === 200) {
        this.fetchData();
      }
    })
  }

  backMOM = e => {
    e.preventDefault();
    this.setState({
      momid: '',
      title: '',
      body: '',
      time: new Date(),
      editMOM: false
    })
  }

  changeShareGantt = (e) => {
    let projectId = e.target.value;
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http
    let meetingInfo = api.monitoring.getMeetingInfo(this.state.classRooms.id)
    http(meetingInfo).then((result) => {
      let role = 'VIEWER';
      if (this.state.isZoom) {
        role = this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 'MODERATOR' : 'VIEWER';
      }
      else {
        if (Array.isArray(result.attendees.attendee) && result.attendees.attendee.filter(item => item.userID === this.state.user.user_id).length) {
          role = result.attendees.attendee.filter(item => item.userID === this.state.user.user_id)[0].role
        }
        else {
          role = result.attendees.attendee.role
        }
      }

      if (result.returncode == 'SUCCESS' && role === 'MODERATOR') {
        let form = {
          projectId: projectId
        }
        API.put(`${API_SERVER}v1/liveclass/share-gantt/${this.state.classRooms.id}`, form).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              this.setState({
                shareGantt: projectId
              })
              socket.emit('send', {
                socketAction: 'shareGantt',
                userId: this.state.user.user_id,
                meetingId: this.state.classRooms.id,
                projectId: projectId
              })
            } else {
              alert('Error update share timeline')
            }
          }
        })
      }
      else if (result.returncode == 'SUCCESS' && role === 'VIEWER') {
        toast.warning('You are not moderator');
      }
    })
  }

  onClickRemoveChat = e => {
    e.preventDefault();
    if (this.state.user.user_id) {
      let form = { attachment: e.target.getAttribute('data-file') };
      API.post(`${API_SERVER}v1/liveclass/file/remove`, form).then(res => {
        if (res.status === 200) {
          this.fetchData();
          socket.emit('send', {
            pengirim: this.state.user.user_id,
            room: this.state.classId,
            attachment: form.attachment,
            filenameattac: form.attachment,
            created_at: new Date()
          })
        }
      })
    } else {
      toast.info(`Can't delete files because you're a guest.`)
    }
  }

  render() {
    let plainURL = `${APPS_SERVER}meet/${this.state.classId}`;
    let lengthURL = plainURL.length;
    let iosURL = 'icademy'+plainURL.slice(5, lengthURL)

    const { classRooms, user, toggle_alert, session, isLoading } = this.state;

    // let levelUser = Storage.get('user').data.level;
    const dataMOM = this.state.listSubtitle;
    let sharing_file = this.state.gb.length && this.state.gb.filter(item => item.code === 'SHARE_FILES')[0].status;
    let create_mom = this.state.gb.length && this.state.gb.filter(item => item.code === 'C_MOM')[0].status;
    const notify = () => toast.warning('Access denied')

    const jamStartDB = Moment(`${classRooms.tgl_mulai}`).local().tz(Moment.tz.guess(true))
    const jamEndDB = Moment(`${classRooms.tgl_selesai}`).local().tz(Moment.tz.guess(true))
    
    const jamNow = Moment().local()
    const infoStart = jamStartDB.clone().tz(Moment.tz.guess(true))
    const infoEnd = jamEndDB.clone().tz(Moment.tz.guess(true))

    const diKurangi5Menit = infoStart.clone().subtract(5, "minutes")
    const onlyModerator5Menit = classRooms.moderator === Storage.get('user').data.user_id && jamNow.isBetween(diKurangi5Menit, infoStart) ? true : false;

    const me = [];
    if (classRooms.hasOwnProperty('participants')) {
      const filterMe = classRooms.participants.filter(i => i.user_id === Storage.get('user').data.user_id)
      if(filterMe.length) me.push(filterMe[0])
    }

    const CheckMedia = ({ media }) => {
      if (media) {
        let ekSplit = media.split('.');
        let ektension = ekSplit[ekSplit.length - 1];
        if (ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
          return (
            <div>
              <img src={media} style={{ maxWidth: '100%' }} />
            </div>
          )
        }
        // else if (ektension === "pdf") {
        //   return (
        //     <div>
        //       <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js">
        //         <Viewer fileUrl={media} defaultScale={SpecialZoomLevel.PageFit} />
        //       </Worker>
        //     </div>
        //   )
        // }
        else {
          return (
            <div>
              <FileViewer
                fileType={ektension}
                filePath={media} />
            </div>
          )
        }
      }

      return null
    };

    let checkMeParti = 0;
    if (classRooms && classRooms.hasOwnProperty('participants')) {
      checkMeParti = classRooms.participants.filter(item => item.user_id === Storage.get('user').data.user_id).length;
    }

    let jamMl = new Date(Moment(`${this.state.classRooms.tgl_mulai}`).local());
    let jamMulai = Moment(`${this.state.classRooms.tgl_mulai}`).local() ? ('0' + jamMl.getHours()).slice(-2) + ':' + ('0' + jamMl.getMinutes()).slice(-2) : '-';
    let jamSl = new Date(Moment(`${this.state.classRooms.tgl_selesai}`).local());
    let diff = Math.abs(jamSl - jamMl);
    let diffHour = Math.floor((diff % 86400000) / 3600000);
    let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
    let durasi = this.state.classRooms.jam_mulai ? (diffHour !== 0 ? diffHour + ' hours ' : '') + (diffMin !== 0 ? diffMin + ' minutes' : '') : '-';
    return (
      <Fragment>
      {
          !this.state.welcome ?
            <Fragment>
              {
                session ?
                  <Fragment>
                    <div className="pcoded-main-container">
                      <div className="pcoded-wrapper">
                        <div className="pcoded-content">
                          <div className="pcoded-inner-content">
                            <div className="main-body">
                              <div className="page-wrapper">
                                <ReactFullScreenElement fullScreen={this.state.fullscreen} allowScrollbar={false}>
                                  <Row>
                                    <Col sm={12} style={{ marginBottom: '20px' }}>

                                      <div className="card p-20">
                                        <div>
                                          <span className="f-w-bold f-18 fc-blue" style={{float:'left'}}>{classRooms.room_name}</span>

                                          <span className="f-w-bold f-12 fc-black" style={{float:'left', clear:'both', marginTop:'10px'}}>
                                            <Tooltip title="Listening" arrow placement="top">
                                              <span>
                                                <i className="fa fa-headphones" /> {this.state.dataParticipants.audio}
                                              </span>
                                            </Tooltip>
                                            <Tooltip title="Camera On" arrow placement="top" style={{marginLeft:8}}>
                                              <span>
                                                <i className="fa fa-camera" /> {this.state.dataParticipants.camera}
                                              </span>
                                            </Tooltip>
                                          </span>

                                          <div className="float-right dropleft">
                                            <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                              <i className="fa fa-ellipsis-v" style={{ fontSize: 20, marginRight: 0, color: 'rgb(148 148 148)' }} />
                                            </button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                                              <button style={{ cursor: 'pointer' }} onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} type="button" class="dropdown-item">
                                                <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'} style={{ marginRight: 10 }}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                                              </button>
                                              <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onClickInvite}>
                                                <i className="fa fa-user-plus" style={{ marginRight: 10 }}></i> Invite People
                                              </button>
                                              {
                                                // (user.user_id == classRooms.moderator || classRooms.is_akses === 0) &&
                                                // <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.onSubmitLock.bind(this, classRooms.id, classRooms.is_live)}>
                                                //   <i className={classRooms.is_live === 1 ? 'fa fa-lock' : 'fa fa-lock-open'} style={{ marginRight: 10 }}></i> {classRooms.is_live === 1 ? 'Lock Meeting' : 'Unlock Meeting'}
                                                // </button>
                                              }
                                              {user.user_id == classRooms.moderator &&
                                                <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={() => this.setState({ modalEnd: true })}>
                                                  <i className="fa fa-stop-circle" style={{ marginRight: 10 }}></i> End Meeting
                                            </button>
                                              }
                                              <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={() => window.close()}>
                                                <i className="fa fa-sign-out-alt" style={{ marginRight: 10 }}></i> Exit Meeting
                                            </button>
                                            </div>
                                          </div>

                                          <Tooltip title="MOM" arrow placement="top">
                                            <span style={{ marginRight: 14, cursor: 'pointer', padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important' }} onClick={!create_mom ? () => { this.setState({ modalMOM: true }); this.fetchMOMAndTranscript(this.state.classId) } : notify } className="float-right m-b-10">
                                              <img
                                                src={`newasset/room/room-mom.svg`}
                                                alt=""
                                                width={32}
                                              ></img>
                                            </span>
                                          </Tooltip>

                                          <Tooltip title="File Sharing" arrow placement="top">
                                                <span style={{ marginRight: 14, cursor: 'pointer', padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important'}} onClick={ !sharing_file ? () => this.setState({ modalFileSharing: true }) : notify} className="float-right m-b-10">
                                              <img
                                                src={`newasset/room/room-share.svg`}
                                                alt=""
                                                width={32}
                                                ></img>
                                            </span>
                                          </Tooltip>

                                          <Tooltip title="Task & Timeline" arrow placement="top">
                                            <span style={{ marginRight: 14, cursor: 'pointer', padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important', borderRadius:50, border: this.state.newShareGantt ? '4px solid #12db9f' : 'none' }} onClick={() => this.setState({ modalGantt: true, newShareGantt: false })} className="float-right m-b-10">
                                              <img
                                                src={`newasset/room/room-task.svg`}
                                                alt=""
                                                width={32}
                                              ></img>
                                            </span>
                                          </Tooltip>
                                          <Tooltip title="File Show" arrow placement="top">
                                            <span style={{ marginRight: 14, cursor: 'pointer', padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important', borderRadius:50, border: this.state.newFileShow ? '4px solid #12db9f' : 'none' }} onClick={() => this.setState({ modalFileShow: true, newFileShow: false }, () => {this.setState({selectedFileShow: this.state.selectedFileShow})})} className="float-right m-b-10">
                                              <img
                                                src={`newasset/room/room-file.svg`}
                                                alt=""
                                                width={32}
                                              ></img>
                                            </span>
                                          </Tooltip>

                                          {
                                            user.name && classRooms.room_name && this.state.join && !this.state.joined ?
                    
                                            <div style={{background:`url('newasset/loading.gif') center center no-repeat`}}>
                                              <Iframe url={this.state.isZoom ? this.state.zoomUrl : this.state.joinUrl}
                                                width="100%"
                                                height="600px"
                                                display="initial"
                                                frameBorder="0"
                                                allow="fullscreen *;geolocation *; microphone *; camera *; display-capture"
                                                position="relative" />
                                            </div>
                    
                                              
                                              :
                                              null
                                          }
                                          {
                                            this.state.joined ?
                                            <h4 style={{marginTop:'20px'}}>You are currently a participant of this meeting on another device or browser tab.<br/>If you want to access this meeting/webinar from this page, exit from the other device and refresh this page afterwards.</h4>
                                            : null
                                          }
                                          {
                                            isMobile && this.state.showOpenApps ?
                                            <div className="floating-message">
                                              <button className="floating-close" onClick={()=> this.setState({showOpenApps: false})}><i className="fa fa-times"></i></button>
                                              <p style={{marginTop:8}}>Want to use mobile apps ?</p>
                                              <a href={isIOS ? 'https://apps.apple.com/id/app/icademy/id1546069748#?platform=iphone' : 'https://play.google.com/store/apps/details?id=id.app.icademy'}>
                                                <button className="button-flat-light"><i className="fa fa-download"></i> Install</button>
                                              </a>
                                              <a href={isIOS ? iosURL : plainURL}>
                                                <button className="button-flat-fill"><i className="fa fa-mobile-alt"></i> Open Apps</button>
                                              </a>
                                            </div>
                                            : null
                                          }

                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </ReactFullScreenElement>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                  :
                  <Fragment>
                    <ReactFullScreenElement fullScreen={this.state.fullscreen} allowScrollbar={false}>
                      <div>
                        <span className="f-w-bold f-18 fc-blue">{classRooms.room_name}</span>

                        <span className="f-w-bold f-12 fc-black" style={{position:'absolute', left:0, top:17}}>
                          <Tooltip title="Listening" arrow placement="top">
                            <span>
                              <i className="fa fa-headphones" /> {this.state.dataParticipants.audio}
                            </span>
                          </Tooltip>
                          <Tooltip title="Camera On" arrow placement="top" style={{marginLeft:8}}>
                            <span>
                              <i className="fa fa-camera" /> {this.state.dataParticipants.camera}
                            </span>
                          </Tooltip>
                        </span>

                        <div className="float-right dropleft">
                          <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-ellipsis-v" style={{ fontSize: 20, marginRight: 0, color: 'rgb(148 148 148)' }} />
                          </button>
                          <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                            <button style={{ cursor: 'pointer' }} onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} type="button" class="dropdown-item">
                              <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'} style={{ marginRight: 10 }}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                            </button>
                            <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={() => window.close()}>
                              <i className="fa fa-sign-out-alt" style={{ marginRight: 10 }}></i> Exit Meeting
                            </button>
                          </div>
                        </div>

                        <Tooltip title="File Sharing" arrow placement="top">
                              <span style={{ marginRight: 14, cursor: 'pointer', padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important'}} onClick={ !sharing_file ? () => this.setState({ modalFileSharing: true }) : notify} className="float-right m-b-10">
                            <img
                              src={`newasset/room/room-share.svg`}
                              alt=""
                              width={32}
                              ></img>
                          </span>
                        </Tooltip>

                        {
                          user.name && classRooms.room_name && this.state.join ?
                            <div style={{background:`url('newasset/loading.gif') center center no-repeat`, marginTop: '14px'}}>
                              <Iframe url={this.state.isZoom ? this.state.zoomUrl : this.state.joinUrl}
                                display="initial"
                                frameBorder="0"
                                allow="fullscreen *;geolocation *; microphone *; camera *; display-capture"
                                position='fixed'
                                background='#000'
                                border='none'
                                top='0'
                                right='0'
                                bottom='0'
                                left='0'
                                width='100%'
                                height='94%'
                              />
                            </div>
                            :
                            null
                        }
                        {
                          isMobile && this.state.showOpenApps ?
                          <div className="floating-message">
                            <button className="floating-close" onClick={()=> this.setState({showOpenApps: false})}><i className="fa fa-times"></i></button>
                            <p style={{marginTop:8}}>Want to use mobile apps ?</p>
                            <a href={isIOS ? 'https://apps.apple.com/id/app/icademy/id1546069748#?platform=iphone' : 'https://play.google.com/store/apps/details?id=id.app.icademy'}>
                              <button className="button-flat-light"><i className="fa fa-download"></i> Install</button>
                            </a>
                            <a href={isIOS ? iosURL : plainURL}>
                              <button className="button-flat-fill"><i className="fa fa-mobile-alt"></i> Open Apps</button>
                            </a>
                          </div>
                          : null
                        }

                      </div>
                    </ReactFullScreenElement>
                  </Fragment>
              }

              <Modal show={this.state.isModalConfirmation} onHide={this.closeModalConfirmation} dialogClassName="modal-lg">
                <Modal.Body>
                  <Modal.Title className="text-c-purple3 f-w-bold f-21" style={{ marginBottom: "30px" }}>
                    Meeting and Attendance Information
                  </Modal.Title>

                  {this.state.needConfirmation >= 1 ?
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
                    : null}
                  <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="card">
                      <div className="card-carousel">
                        <div className="title-head f-w-900 f-16">
                          {classRooms.room_name}
                        </div>
                        <div class="row">
                          <div className="col-sm-6">
                            {classRooms.is_akses ?
                            <h3 className="f-14">
                              Moderator : {classRooms.name}
                            </h3>
                            :null
                            }
                            <h3 className="f-14">
                              {classRooms.is_private ? 'Private' : 'Public'} Meeting
                            </h3>
                          </div>
                          {classRooms.is_scheduled ?
                            <div className="col-sm-6">
                              <h3 className="f-14">
                                Start : {infoStart}
                              </h3>
                              <h3 className="f-14">
                                End : {infoEnd}
                              </h3>
                            </div>
                            : null}
                        </div>
                        {classRooms.is_private ?
                          <div>
                            <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                              Attendance Confirmation of {classRooms.participants.length} Participant
                          </div>
                            <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                              <div className='legend-kehadiran hadir'></div>
                              <h3 className="f-14 mb-0 mr-2"> Present ({this.state.countHadir})</h3>
                              <div className='legend-kehadiran tidak-hadir'></div>
                              <h3 className="f-14 mb-0 mr-2"> Not Present ({this.state.countTidakHadir})</h3>
                              <div className='legend-kehadiran tentative'></div>
                              <h3 className="f-14 mb-0 mr-2"> Unconfirmed ({this.state.countTidakHadir})</h3>
                            </div>
                            <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                              {classRooms.participants.map(item =>
                                <div className={item.confirmation === 'Hadir' ? 'peserta hadir' : item.confirmation === 'Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{item.name}</div>
                              )}
                            </div>
                          </div>
                          : null} {classRooms.is_private ?
                            <div>
                              <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                Actual Attendance In Meeting Room
                          </div>
                              <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                {classRooms.participants.map(item => item.actual == 'Hadir' &&
                                  <div className='peserta aktual-hadir'>{item.name}</div>
                                )}
                              </div>
                            </div>
                            : null}
                      </div>
                    </div>
                    <button type="button" className="btn btn-block f-w-bold" onClick={e => this.closeModalConfirmation()} > Close
                    </button>
                  </div>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.isInvite} onHide={this.handleCloseInvite} centered size="lg">
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Invite Participants
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-vertical" style={{minHeight:240}}>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        From User
                      </Form.Label>
                      <Tooltip title="You can select the users that you want to invite" arrow placement="top" open={this.state.showToolTipInvitation}>
                        <Select
                          options={this.state.optionsInvite}
                          isMulti
                          closeMenuOnSelect={false}
                          onChange={valueInvite => { let arr = []; valueInvite.map((item) => arr.push(item.value)); this.setState({ valueInvite: arr })}}
                        />
                      </Tooltip>
                      <Form.Text className="text-muted">
                        Select user to invite.
                      </Form.Text>
                    </Form.Group>
                    <div className="form-group">
                      <label style={{ fontWeight: "bold" }}>Email</label>
                      <Tooltip title="You can fill this field with email address that you want to invite" arrow placement="top" open={this.state.showToolTipInvitation}>
                        <TagsInput
                          value={this.state.emailInvite}
                          onChange={this.handleChange.bind(this)}
                          addOnPaste={true}
                          addOnBlur={true}
                          inputProps={{ placeholder: `Participant's Email` }}
                        />
                      </Tooltip>
                      <Form.Text>
                        Insert email to invite. Use [Tab] or [Enter] key to insert multiple email.
                      </Form.Text>
                    </div>
                  </div>
                  
                  <CopyToClipboard text={`Meeting Room : ${classRooms.room_name}\nSchedule : ${moment(classRooms.tgl_mulai).local().format('dddd, MMMM Do YYYY')}, ${moment(classRooms.tgl_mulai).local().format('HH:mm')} - ${moment(classRooms.tgl_selesai).local().format('HH:mm')}\nTime Zone : ${moment.tz.guess(true)}\nDuration : ${durasi}\nDescription : ${classRooms.keterangan}\nURL : ${APPS_SERVER}meet/${classRooms.id}`}
                    onCopy={() => { this.setState({ copied: true }); toast.info('Copied.') }}>
                    <Tooltip title="Click here to copy the invitation text and sharing URL" arrow placement="bottom" open={this.state.showToolTipInvitation}>
                    <button className="btn btn-v2 btn-primary"><i className="fa fa-copy cursor"></i> Copy Invitation</button>
                    </Tooltip>
                  </CopyToClipboard>

                  <button className="btn btn-icademy-primary float-right" style={{marginLeft: 10}} onClick={this.onClickSubmitInvite}>
                    <i className="fa fa-envelope"></i> {this.state.sendingEmail ? 'Sending Invitation...' : 'Send Invitation'}
                  </button>
                  <button className="btn btm-icademy-primary btn-icademy-grey float-right" onClick={this.handleCloseInvite}>
                    Cancel
                  </button>
                </Modal.Body>
              </Modal>
                
              <Modal show={this.state.modalEnd} onHide={this.closeModalEnd} centered>
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Confirmation
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>Are you sure you want to end the meeting for all participants?</div>
                </Modal.Body>
                <Modal.Footer>
                  <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalEnd.bind(this)}>
                    Cancel
                  </button>
                  <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.endMeeting.bind(this)}>
                    <i className="fa fa-trash"></i> End The Meeting
                  </button>
                </Modal.Footer>
              </Modal>

              <Modal show={this.state.modalFileSharing} onHide={this.closeModalFileSharing} centered>
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    File Sharing
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: 0}}>
                  <div id="scrollin" className='card ' style={{ height: '400px', marginBottom: '0px' }}>
                    <div style={{ height: '100%', overflowY: 'scroll' }}>
                      {this.state.fileChat.map((item, i) => {
                        return (
                          <div className='box-chat-send-left'>
                            <span>
                              <b>{item.name} </b>
                              <small className="float-right">
                                {moment(item.created_at).tz(moment.tz.guess(true)).format('DD/MM/YYYY')}  &nbsp;
                                {moment(item.created_at).tz(moment.tz.guess(true)).format('h:sA')}
                              </small>
                            </span>
                            <br />
                            <p className="fc-skyblue mt-2"> {decodeURI(item.filenameattac)}
                              {
                                classRooms.moderator == Storage.get("user").data.user_id ?
                                  <i data-file={item.attachment} onClick={this.onClickRemoveChat} className="float-right fa fa-trash" style={{ cursor: 'pointer' }}></i>
                                : null
                              }
                              <a target='_blank' rel="noopener noreferrer" className="float-right mr-2" href={item.attachment}> <i className="fa fa-download" aria-hidden="true"></i></a>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className='card p-20' style={{marginBottom: 0}}>
                    <Row className='filesharing'>
                      <Col sm={10}>
                        <label for="attachment" class="custom-file-upload" onChange={this.onChangeInput}>
                          < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i> {this.state.nameFile === null ? 'Choose File' : this.state.nameFile}
                        </label>
                        <input key={this.state.fileKey} className="hidden" type="file" id="attachment" name="attachment" onChange={this.onChangeInput} />
                      </Col>
                      <Col sm={2}>
                        <button onClick={this.sendFileNew.bind(this)} to="#" className="float-right btn btn-icademy-primary ml-2">
                          {this.state.loadingFileSharing ? 'Sending...' : 'Send'}
                        </button>
                        {/*
                        <button onClick={this.onBotoomScroll}>coba</button> */}
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.modalMOM} onHide={this.closeModalMOM} dialogClassName='modal-lg' centered>
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Minutes Of Meeting
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div id="scrollin" className="card" style={{ padding: 10 }}>
                    <div className={this.state.editMOM ? 'hidden' : ''}>
                      <button to={"#"} onClick={(a) => { this.setState({ editMOM: true }) }} className="btn btn-icademy-primary ml-2 float-right"> Add New
                      </button>
                    </div>
                    {!this.state.editMOM ?
                      <div className="card">
                        <div className="col-sm-12">
                          {this.state.listMOM.map((item, i) => (
                            <div className="komentar-item p-15" style={{ marginBottom: '15px', borderBottom: "#dedede solid 1px" }}>
                              <h3 className="f-18 f-w-bold f-w-800">
                                {item.title}
                                <span className="f-12" style={{ float: 'right', fontWeight: 'normal' }}>
                                  <Link to='#' data-id={item.id} className="buttonku ml-2" title="Export PDF" onClick={this.exportMOM}>
                                    Export PDF
                                  </Link>
                                  <Link to='#' data-id={item.id} data-title={item.title} data-content={item.content} data-time={item.time} className="buttonku ml-2" title="Edit" onClick={this.onClickEditMOM}>
                                    <i data-id={item.id} data-title={item.title} data-content={item.content} data-time={item.time} className="fa fa-edit"></i>
                                  </Link>
                                  <Link to="#" data-id={item.id} className="buttonku ml-2" title="Hapus" onClick={this.deleteMOM}>
                                    <i data-id={item.id} className="fa fa-trash"></i>
                                  </Link>
                                </span>
                              </h3>
                              <p>{moment.tz(item.time, moment.tz.guess(true)).format("YYYY-MM-DD HH:mm:ss")}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      :
                      <div>
                        <Link to='#' title="Back" onClick={this.backMOM}>
                          <h4 className="f-20 f-w-800 p-10">
                            <i className="fa fa-arrow-left"></i> Back
                          </h4>
                        </Link>
                        <h4 className="p-10">{classRooms.room_name}</h4>
                        <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                          <Form.Label className="f-w-bold">
                            MOM Title
                        </Form.Label>
                          <div style={{ width: '100%' }}>
                            <input required type="text" name="title" value={this.state.title} className="form-control" placeholder="Insert MOM Title" onChange={this.onChangeInputMOM} />
                          </div>
                        </Form.Group>
                        <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                          <Form.Label className="f-w-bold">
                            Time
                        </Form.Label>
                          <div style={{ width: '100%' }}>
                            <DatePicker selected={this.state.startDate} onChange={this.handleChangeDateFrom} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" />
                          </div>
                        </Form.Group>
                        {/* <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                        <Form.Label className="f-w-bold">
                          Text Dari Subtitle
                        </Form.Label>
                        <div style={{ width: '100%' }}>
                          <select style={{ textTransform: 'capitalize', width: '40%', display: 'inline-block' }} name="subtitle" className="form-control" onChange={this.onChangeInputMOM} required>
                            <option value="">Pilih</option>
                            {dataMOM.map((item, index) => (
                            <option value={index} selected={ item._id===this.state.selectSubtitle ? "selected" : "" }>
                              {moment.tz(item.start_time, moment.tz.guess(true)).format("DD MMMM YYYY, HH:mm") + " - " + moment.tz(item.end_time, moment.tz.guess(true)).format("HH:mm")}
                            </option>
                            ))}
                          </select>
                          <button to={ "#"} onClick={this.addSubsToMOM} className="btn btn-icademy-primary ml-2">
                            Add to MOM
                          </button>
                        </div>
                      </Form.Group> */}


                        <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                          <Form.Label className="f-w-bold">
                            Speech recognition
                        </Form.Label>
                          <Dictation newTranscript={this.handleTranscript} />
                        </Form.Group>

                        <div className="chart-container" style={{ position: "relative", margin: 20 }}>
                          <div className="form-group">
                            <Editor apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5" initialValue={this.state.body} value={this.state.body} onEditorChange={this.handleEditorChange.bind(this)} init={{
                              height: 400, menubar: true, plugins: [
                                "advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount"], toolbar: "undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help" }} />
                          </div>
                        </div>
                        <div>
                          <button to={"#"} onClick={this.addMOM} className="btn btn-icademy-primary ml-2 float-right col-2 f-14" style={{ marginLeft: '10px', padding: "7px 8px !important" }}>
                            Save
                        </button>
                        </div>
                      </div>
                    }
                  </div>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.modalGantt} onHide={this.closeModalGantt} dialogClassName='modal-2xl' centered>
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Task & Timeline - &nbsp;
                    <select className="select-project" name="shareGantt" value={this.state.shareGantt} onChange={this.changeShareGantt}>
                      <option value={0}>Project Not Selected</option>
                      {this.state.project.map(item =>
                        <option value={item.id}>{item.title}</option>
                      )}
                    </select>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="gantt-container">
                    {this.state.shareGantt != 0 &&
                      <Gantt projectId={this.state.shareGantt} />}
                  </div>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.modalFileShow} onHide={this.closeModalFileShow} dialogClassName='modal-2xl' centered>
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Files on project {classRooms.project_name}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="wrap" style={{ marginTop: '10px', overflowY: 'scroll' }}>
                    {this.state.selectedFileShow === '' && <TableFiles access_project_admin={false} projectId={classRooms.folder_id} selectedFileShow={this.handleSelectFileShow} />}
                    {this.state.selectedFileShow !== '' &&
                      <div>
                        <button to={"#"} onClick={this.handleSelectFileShow.bind(this, '')} className="btn btn-icademy-primary ml-2 col-2 f-14">
                          <i className="fa fa-stop" style={{ marginRight: 10 }}></i> Stop File Show
                      </button>
                        <CheckMedia media={this.state.selectedFileShow} />
                      </div>
                    }
                  </div>
                </Modal.Body>
              </Modal>
            </Fragment>
        :
        <Fragment>
        {
          session ?
            <div className="pcoded-main-container">
              <div className="pcoded-wrapper">
                <div className="pcoded-content">
                  <div className="pcoded-inner-content">
                    <div className="main-body">
                      <div className="page-wrapper">          
                      
                        <div className="auth-wrapper">
                          <div className="auth-content mb-4" style={{ display: isMobile ? 'none' : 'block' }}>
                            <div className=" b-r-15">
                              <div
                                className=" text-center"
                                style={{ padding: "50px !important" }}
                              >
                                <div className="mb-4">
                                  <img
                                    src="newasset/user-computer.svg"
                                    style={{ width: 350 }}
                                    alt=""
                                  />
                                </div>
                                <h4 className="mb-0 mt-1" style={{ textTransform: 'uppercase' }}>
                                  <b>
                                    {
                                      isLoading ?
                                      <h4>Loading...</h4>
                                      :
                                      classRooms.room_name
                                    }
                                  </b>
                                </h4>
                                <p className="mb-0 mt-1">
                                  We are ready to connect you with others
                                </p>
                
                              </div>
                            </div>
                          </div>
                          <div className="auth-content mb-4">
                            <div className="card b-r-15">
                              <div
                                className="card-body"
                                style={{ padding: "50px !important" }}
                              >
                                <div className="row">
                                  <div className="col-sm-12">
                                    <p>
                                      <b style={{ color: 'black' }}>
                                        Join the room "
                                        {
                                          isLoading ?
                                            <Fragment>Loading...</Fragment>
                                          :
                                          classRooms.room_name
                                        }
                                        "
                                      </b>
                                      <br />
                                      {
                                        isLoading ?
                                          "Loading..."
                                        :
                                        <span style={{fontSize: '12px'}}>
                                          {Moment(classRooms.tgl_mulai).local().format('LL')} {infoStart.format('HH:mm')} - {infoEnd.format('HH:mm')}
                                        </span>
                                      }    
                                    </p>
                                          
                                    {
                                      classRooms.is_required_confirmation === 1 && me.length === 1 && me[0].confirmation === '' ? 
                                        <div className="col-sm-12 mb-3">
                                          <div className="card" style={{ background: '#dac88c', padding: 12 }}>
                                            <div className="title-head f-w-900 f-16">
                                              Confirmation of attendance
                                            </div>
                                            <h3 className="f-14">You were invited to this meeting and have not confirmed attendance. Please confirm attendance.</h3>
                                            <Link onClick={this.confirmAttendance.bind(this, 'Hadir')} to="#" className="btn btn-sm btn-icademy-green" style={{ padding: '5px 10px' }}>
                                              Present
                                            </Link>
                                            <Link onClick={this.confirmAttendance.bind(this, 'Tidak Hadir')} to="#" className="btn btn-sm btn-icademy-red" style={{ padding: '5px 10px' }}>
                                              Not present
                                            </Link>
                                          </div>
                                        </div>
                                      : null
                                    }
                                      
                                    <button style={onlyModerator5Menit ||jamNow.isBetween(infoStart, infoEnd) || classRooms.is_running ? { height: 60, backgroundColor:'#ef843c' } : { height: 60, backgroundColor: '#e9e9e9', color: '#848181' }} onClick={onlyModerator5Menit || jamNow.isBetween(infoStart, infoEnd) || classRooms.is_running ? this.joinRoom.bind(this) : this.notYetTime.bind(this)} type="submit" className="btn btn-ideku col-12 shadow-2 b-r-3 f-16">
                                      Join The Meeting
                                    </button>
                                    
                                    <button disabled={checkMeParti} onClick={() => this.addToCalendar()} className="btn btn-info btn-block mt-2" style={{backgroundColor: '#407bff', borderColor:'#344a7b'}}>{checkMeParti ? 'Already added to calendar' : 'Add to Calendar'}</button>
                                      
                                    {
                                      toggle_alert &&
                                      <Alert variant={'danger'}>
                                        {this.state.alertMessage}
                                      </Alert>
                                    }

                          {
                            isMobile && this.state.showOpenApps ?
                            <div className="floating-message">
                              <button className="floating-close" onClick={()=> this.setState({showOpenApps: false})}><i className="fa fa-times"></i></button>
                              <p style={{marginTop:8}}>Want to use mobile apps ?</p>
                              <a href={isIOS ? 'https://apps.apple.com/id/app/icademy/id1546069748#?platform=iphone' : 'https://play.google.com/store/apps/details?id=id.app.icademy'}>
                                <button className="button-flat-light"><i className="fa fa-download"></i> Install</button>
                              </a>
                              <a href={isIOS ? iosURL : plainURL}>
                                <button className="button-flat-fill"><i className="fa fa-mobile-alt"></i> Open Apps</button>
                              </a>
                            </div>
                            : null
                          }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div style={{ background: "#fafbfc"}}>
              <header className="header-login">
                <center>
                  <div className="mb-4">
                    <img
                      src="newasset/logo-horizontal.svg"
                      style={{ paddingTop: 18 }}
                      alt=""
                    />
                  </div>
                </center>
              </header>
              <div className="auth-wrapper">
                <div className="auth-content mb-4" style={{ display: isMobile ? 'none' : 'block' }}>
                  <div className=" b-r-15">
                    <div
                      className=" text-center"
                      style={{ padding: "50px !important" }}
                    >
                      <div className="mb-4">
                        <img
                          src="newasset/user-computer.svg"
                          style={{ width: 350 }}
                          alt=""
                        />
                      </div>
                      <h4 className="mb-0 mt-1" style={{ textTransform: 'uppercase' }}>
                        <b>
                          {
                            isLoading ?
                            <h4>Loading...</h4>
                            :
                            classRooms.room_name
                          }
                        </b>
                      </h4>
                      <p className="mb-0 mt-1">
                        We are ready to connect you with others
                      </p>
      
                    </div>
                  </div>
                </div>
                <div className="auth-content mb-4" style={{}}>
                  <div className="card b-r-15">
                    <div
                      className="card-body"
                      style={{ padding: "50px !important" }}
                    >
                      <div className="row">
                        <div className="col-sm-12">
                          <p>
                            <b style={{ color: 'black' }}>
                              Join the room "
                              {
                                isLoading ?
                                  <Fragment>Loading...</Fragment>
                                :
                                classRooms.room_name
                              }
                              "
                            </b>
                            <br />
                            {
                              isLoading ?
                                "Loading..."
                              :
                              <span style={{fontSize: '12px'}}>
                                {Moment(classRooms.tgl_mulai).local().format('LL')} {infoStart.format('HH:mm')} - {infoEnd.format('HH:mm')}
                              </span>
                            }    
                          </p>
                          
                          {
                            jamNow.isBetween(infoStart, infoEnd) ?
                              <Fragment>
                                <input
                                  type="text"
                                  value={this.state.user.name}
                                  className="form-control"
                                  style={{ marginTop: 8, minHeight: '40px' }}
                                  placeholder="Enter your name"
                                  onChange={this.onChangeName}
                                  required
                                />
                                <input
                                  type="text"
                                  value={this.state.user.email}
                                  className="form-control"
                                  style={{ marginTop: 8, minHeight: '40px' }}
                                  placeholder="Enter your email"
                                  onChange={this.onChangeEmail}
                                  required
                                />
                              </Fragment>
                            : null
                          }
                            
                          <button onClick={onlyModerator5Menit || jamNow.isBetween(infoStart, infoEnd) || classRooms.is_running ? this.joinRoom.bind(this) : this.notYetTime.bind(this)} type="submit" className="btn btn-ideku col-12 mt-3 shadow-2 b-r-3 f-16" style={onlyModerator5Menit || jamNow.isBetween(infoStart, infoEnd) || classRooms.is_running ? { height: 60 } : { height: 60, backgroundColor: '#e9e9e9', color: '#848181' }}>
                            Join The Meeting
                          </button>
                          
                          {
                            session ?
                              <button className="btn btn-info-outline btn-block mt-2">Add to Calendar</button>
                            : null
                          }
                              
                          {
                            toggle_alert &&
                            <Alert variant={'danger'}>
                              {this.state.alertMessage}
                            </Alert>
                          }

                          {
                            !session ?
                              <p className="mt-3">Already have ICADEMY account? <a href={`/?dst=${window.location.href}`}>Login Here</a></p>
                            : null
                          }
                          {
                            isMobile && this.state.showOpenApps ?
                            <div className="floating-message">
                              <button className="floating-close" onClick={()=> this.setState({showOpenApps: false})}><i className="fa fa-times"></i></button>
                              <p style={{marginTop:8}}>Want to use mobile apps ?</p>
                              <a href={isIOS ? 'https://apps.apple.com/id/app/icademy/id1546069748#?platform=iphone' : 'https://play.google.com/store/apps/details?id=id.app.icademy'}>
                                <button className="button-flat-light"><i className="fa fa-download"></i> Install</button>
                              </a>
                              <a href={isIOS ? iosURL : plainURL}>
                                <button className="button-flat-fill"><i className="fa fa-mobile-alt"></i> Open Apps</button>
                              </a>
                            </div>
                            : null
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
        </Fragment>
      }
      </Fragment>
    );
  }
}
