import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form, Col, Row, Modal
} from 'react-bootstrap';
import ReactFullScreenElement from "react-fullscreen-element";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import MomentTZ from 'moment-timezone';
import moment from 'moment-timezone';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import API, { APPS_SERVER, API_SERVER, USER_ME, API_SOCKET, BBB_KEY, BBB_URL } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
import { Editor } from '@tinymce/tinymce-react';
import { isMobile } from 'react-device-detect';
import Iframe from 'react-iframe';
import Gantt from '../Gantt';

import { toast } from "react-toastify";
const bbb = require('bigbluebutton-js')

const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class MeetingRoom extends Component {
  state = {
    fullscreen: false,
    classId: this.props.match.params.roomid,
    user: {},
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

    //modal
    modalFileSharing: false,
    modalMOM: false,
    modalGantt: false
  }

  closeModalGantt = e => {
    this.setState({ modalGantt: false });
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
      emailInvite: [],
      emailResponse: ""
    });
  }
  handleCloseMeeting = e => {
    window.close();
  }

  handleCloseLive = e => {
    this.setState({ isLive: false, liveURL: '' })
  }

  fetchProject(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
          this.setState({ project: response.data.result });
        }).catch(function(error) {
          console.log(error);
        });
      }
    })
  }

  componentDidMount() {
    // this.onBotoomScroll();
    this.fetchProject()
    socket.on("broadcast", data => {
      if(data.room == this.state.classId) {
        this.fetchData();
        this.setState({ loadingFileSharing: false, fileChat: [...this.state.fileChat, data] })
      }
      if(data.socketAction == 'shareGantt' && data.meetingId===this.state.classRooms.class_id && data.userId!==this.state.user.user_id) {
        this.setState({newShareGantt: true, shareGantt: data.projectId})
      }
    });
    this.fetchData();

    var links = document.getElementsByTagName('a');
    var len = links.length;

    for (var i = 0; i < len; i++) {
      links[i].target = "_blank";
    }

    // Update kehadiran aktual
    let form = {
      confirmation: 'Hadir',
    }
    API.put(`${API_SERVER}v1/liveclass/actualattendance/${this.state.classId}/${Storage.get('user').data.user_id}`, form).then(async res => {
      if (res.status === 200) {
        console.log('Kehadiran Aktual : Hadir')
      }
    })
  }

  onClickInfo(class_id) {
    this.setState({ isModalConfirmation: true })
    this.fetchMeetingInfo(class_id)
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
          needConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation == '').length
        })
      }
    })
  }
  fetchData() {
    // this.onBotoomScroll();
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if (res.status === 200) {
        let liveClass = await API.get(`${API_SERVER}v1/liveclass/id/${this.state.classId}`);

        var data = liveClass.data.result
        /*mark api get new history course*/
        let form = {
          user_id: Storage.get('user').data.user_id,
          class_id: data.class_id,
          description: data.room_name,
          title: data.speaker
        }

        //get and push multiselect option
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(response => {
          response.data.result.map(item => {
            this.state.optionsInvite.push({ value: item.user_id, label: item.name });
          });
        })
          .catch(function (error) {
            console.log(error);
          });


        // console.log('alsdlaksdklasjdlkasjdlk',form)
        API.post(`${API_SERVER}v1/api-activity/new-class`, form).then(console.log);

        // let url = `${API_SERVER}token?room=${data.room_name}&name=${res.data.result.name}&moderator=${liveClass.data.result.moderator == Storage.get("user").data.user_id}&email=${res.data.result.email}&avatar=${res.data.result.avatar}&id=${res.data.result.user_id}`;
        // let url = `https://api.icademy.id/token?room=${data.room_name}&name=${res.data.result.name}&moderator=${liveClass.data.result.moderator == Storage.get("user").data.user_id}&email=${res.data.result.email}&avatar=${res.data.result.avatar}&id=${res.data.result.user_id}`;

        // let token = await axios.get(url);

        this.setState({
          user: res.data.result,
          classRooms: liveClass.data.result,
          shareGantt: liveClass.data.result.share_gantt
          // jwt: token.data.token
        });
        // BBB JOIN START
        let api = bbb.api(BBB_URL, BBB_KEY)
        let http = bbb.http

        // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
        let meetingInfo = api.monitoring.getMeetingInfo(this.state.classRooms.class_id)
        console.log('meetingInfo: ', meetingInfo)
        http(meetingInfo).then((result) => {
          console.log('result: ', result)
          if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
            // Jika belum ada, create room nya.
            let meetingCreateUrl = api.administration.create(this.state.classRooms.room_name, this.state.classRooms.class_id, {
              attendeePW: 'peserta',
              moderatorPW: 'moderator',
              allowModsToUnmuteUsers: true,
              record: true
            })
            http(meetingCreateUrl).then((result) => {
              console.log('createMeeting: ', result);
              if (result.returncode = 'SUCCESS') {
                // Setelah create, join
                let joinUrl = api.administration.join(
                  this.state.user.name,
                  this.state.classRooms.class_id,
                  this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 'moderator' : 'peserta',
                  { userID: this.state.user.user_id }
                )
                console.log('joinUrl: ', joinUrl)
                this.setState({ joinUrl: joinUrl })
                if (isMobile) {
                  window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(this.state.joinUrl))
                }
              }
              else {
                console.log('GAGAL', result)
              }
            })
          }
          else {
            // Jika sudah ada, join
            let joinUrl = api.administration.join(
              this.state.user.name,
              this.state.classRooms.class_id,
              this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 'moderator' : 'peserta',
              { userID: this.state.user.user_id }
            )

            console.log('joinUrl: ', joinUrl);
            this.setState({ joinUrl: joinUrl })
            if (isMobile) {
              window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(this.state.joinUrl))
            }
          }
        })
        // BBB JOIN END
      }
    }).then(res => {
      if (this.state.classRooms.folder_id !== 0) {
        this.selectFolder(this.state.classRooms.folder_id)
      }
      API.get(`${API_SERVER}v1/liveclass/file/${this.state.classId}`).then(res => {
        console.log(res, 'ini responseeee');
        let splitTags;
        let datas = res.data.result;
        for (let a in datas) {
          splitTags = datas[a].attachment.split("/")[4];
          datas[a].filenameattac = splitTags;
        }
        if (res.status === 200) {
          this.setState({
            fileChat: res.data.result
          })

          API.get(`${API_SERVER}v1/liveclass/mom/${this.state.classId}`).then(res => {
            if (res.status === 200) {
              this.setState({
                listMOM: res.data.result
              })
              API.get(`${API_SERVER}v1/transcripts/${this.state.classRooms.room_name}`).then(res => {
                if (res.status === 200) {
                  let publishSubsSelect = []
                  res.data.result.map((item, i) => {
                    if (item.events.length > 0) {
                      publishSubsSelect.push(item)
                    }
                  })
                  this.setState({
                    listSubtitle: publishSubsSelect
                  })

                }

              })

            }

          })

        }

      })
    })

  }

  endMeeting() {
    // BBB END
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    let endMeeting = api.administration.end(this.state.classRooms.class_id, 'moderator')
    http(endMeeting).then((result) => {
      if (result.returncode == 'SUCCESS') {
        this.closeModalEnd()
        toast.success('Mengakhiri meeting untuk semua peserta.')
        API.delete(`${API_SERVER}v1/liveclass/file/delete/${this.state.classRooms.class_id}`).then(res => {
          if (res.status === 200) {
            toast.success('Menghapus semua file sharing.')
          }
        })
      }
    })
  }


  onClickInvite = e => {
    e.preventDefault();
    this.setState({ isInvite: true });
  }

  onClickSubmitInvite = e => {
    e.preventDefault();
    if (this.state.emailInvite == '' && this.state.userInvite == '') {
      toast.warning('Silahkan pilih user atau email yang diundang.')
    }
    else {
      this.setState({ sendingEmail: true })
      let form = {
        user: Storage.get('user').data.user,
        email: this.state.emailInvite,
        room_name: this.state.classRooms.room_name,
        is_private: this.state.classRooms.is_private,
        is_scheduled: this.state.classRooms.is_scheduled,
        schedule_start: new Date(this.state.classRooms.schedule_start).toISOString().slice(0, 16).replace('T', ' '),
        schedule_end: new Date(this.state.classRooms.schedule_end).toISOString().slice(0, 16).replace('T', ' '),
        userInvite: this.state.valueInvite,
        message: APPS_SERVER + 'redirect/meeting/information/' + this.state.classId,
        messageNonStaff: APPS_SERVER + 'meeting/' + this.state.classId
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
            toast.success("Mengirim email ke peserta.")
          } else {
            toast.error("Email tidak terkirim, periksa kembali email yang dimasukkan.")
            console.log('RESS GAGAL', res)
          }
        }
      })
    }
  }

  onBotoomScroll = (e) => {
    //let scrollingElement = (document.scrollingElement || document.body);
    var element = document.getElementById('scrollin');
    element.scrollTop = element.scrollHeight - element.clientHeight;
    console.log(element, 'kebawah')
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
  onChangeInput = (e) => {
    const name = e.target.name;
    console.log(e.target.files[0], 'attach');
    this.setState({ nameFile: e.target.files[0].name });
    if (name === 'attachment') {
      if (e.target.files[0].size <= 50000000) {
        this.setState({ [name]: e.target.files[0] });
      } else {
        e.target.value = null;
        this.setState({ isNotifikasi: true, isiNotifikasi: 'The file does not match the format, please check again.' })
      }
    } else {
      this.setState({ [name]: e.target.value })
    }
  }

  changeShareGantt = (e) => {
    let projectId = e.target.value;
    let form = {
      projectId: projectId
    }
    API.put(`${API_SERVER}v1/liveclass/share-gantt/${this.state.classRooms.class_id}`, form).then(res => {
      if(res.status === 200) {
        if(!res.data.error){
          this.setState({
            shareGantt: projectId
          })
          socket.emit('send', {
            socketAction: 'shareGantt',
            userId: this.state.user.user_id,
            meetingId: this.state.classRooms.class_id,
            projectId: projectId
          })
        }else{
          alert('Error update share timeline')
        }
      }
    })
  }

  sendFileNew(){

    let form = new FormData();
    form.append('class_id', this.state.classId);
    form.append('pengirim', String(this.state.user.user_id));
    form.append('file', this.state.attachment);
    this.setState({ loadingFileSharing: true })
    API.post(`${API_SERVER}v1/liveclass/file`, form).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          // this.onBotoomScroll();
          let splitTags;

          let datas = res.data.result;
          console.log(datas, 'datass kirim filesssss')

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
      }
    })
  }

  handleChangeDateFrom = date => {
    this.setState({
      startDate: date
    });
  };

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
        time: MomentTZ.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
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
        time: MomentTZ.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
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

  onClickRemoveChat = e => {
    e.preventDefault();
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
  }

  onChangeTinyMce = e => {
    this.setState({ body: e.target.getContent().replace(/'/g, "\\'") })
  }

  componentDidUpdate() {
    // this.onBotoomScroll();
  }

  joinRoom() {
    this.setState({ join: true, modalStart: false });
  }

  render() {

    const { classRooms, user } = this.state;

    // let levelUser = Storage.get('user').data.level;
    const dataMOM = this.state.listSubtitle;

    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ paddingTop: 20 }}>
            <div className="pcoded-inner-content">

              <div className="main-body">
                <ReactFullScreenElement fullScreen={this.state.fullscreen} allowScrollbar={false}>
                  <div className="page-wrapper" style={{ zIndex: 1029, height: '100%' }}>

                    <Row>

                      <Col sm={12} style={{ marginBottom: '20px' }}>
                        {/*
                        <h3 className="f-20 f-w-800">
                          {classRooms.room_name}
                          <Link onClick={this.onClickInvite} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px'}}>
                            <i className="fa fa-user"></i>Invite People
                          </Link>
                          {
                            classRooms.is_private ?
                            <Link onClick={this.onClickInfo.bind(this, classRooms.class_id)} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px', marginRight:20}}>
                              <i className="far fa-list-alt"></i> Attendance
                            </Link>
                            :
                            null
                          }
                        </h3> */} { user.name && classRooms.room_name ?
                        <div className="card p-20">
                          <div>
                            <span className="f-w-bold f-18 fc-blue">{classRooms.room_name}</span>

                            <div className="float-right dropleft">
                              <button style={{padding: '6px 18px', border: 'none', marginBottom:0, background: 'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-ellipsis-v" style={{ fontSize: 20, marginRight:0, color: 'rgb(148 148 148)' }} />
                              </button>
                              <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                <button style={{cursor: 'pointer'}} onClick={()=> this.setState({fullscreen: !this.state.fullscreen})} type="button" class="dropdown-item">
                                  <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'} style={{marginRight:10}}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                                </button>
                                <button style={{cursor: 'pointer'}} class="dropdown-item" type="button" onClick={this.onClickInvite}>
                                  <i className="fa fa-user-plus" style={{marginRight:10}}></i> Invite People
                                </button>
                                { user.user_id == classRooms.moderator &&
                                <button style={{cursor: 'pointer'}} class="dropdown-item" type="button" onClick={()=> this.setState({modalEnd: true})}>
                                  <i className="fa fa-stop-circle" style={{marginRight:10}}></i> End Meeting
                                </button>
                                }
                                <button style={{cursor: 'pointer'}} class="dropdown-item" type="button" onClick={()=> window.close()}>
                                  <i className="fa fa-sign-out-alt" style={{marginRight:10}}></i> Exit Meeting
                                </button>
                              </div>
                            </div>
                            <button style={{marginRight:14, padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important'}} onClick={()=> this.setState({modalFileSharing: true})} className="float-right btn btn-icademy-primary">
                              <i className="fa fa-file" style={{marginRight: '0px !important'}}></i>File Sharing
                            </button>
                            <button style={{ marginRight: 14, padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important' }} onClick={()=> this.setState({ modalFileSharing: true })} className="float-right btn btn-icademy-primary">
                              <i className="fa fa-file" style={{ marginRight: '0px !important' }}></i>File Sharing
                            </button>
                            <button style={{marginRight:14, padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important', border: this.state.newShareGantt ? '4px solid #12db9f' : 'none'}} onClick={()=> this.setState({modalGantt: true, newShareGantt: false})} className="float-right btn btn-icademy-primary">
                              <i className="fa fa-tasks" style={{marginRight: '0px !important'}}></i>Task & Timeline
                            </button>
                            <button style={{ marginRight: 14 }} onClick={()=> this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'float-right btn btn-icademy-warning' : 'float-right btn btn-icademy-primary'}>
                              <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'} style={{ marginRight: '0px !important' }}></i>{this.state.fullscreen ? 'Minimize' : 'Maximize'}
                            </button>
                            {/*
                            <a target='_blank' href={this.state.joinUrl}>
                              <button className="float-right btn btn-icademy-primary">
                                <i className="fa fa-external-link-alt"></i>Buka di Tab Baru
                              </button>
                            </a> */}
                          </div>
                          {/*
                          <p className="fc-muted mt-1 mb-4">Moderator : {classRooms.name}</p> */}

                          <Iframe url={this.state.joinUrl} width="100%" height="600px" display="initial" frameBorder="0" allow="fullscreen *;geolocation *; microphone *; camera *" position="relative" />

                        </div>
                        : null }
                      </Col>

                    </Row>

                    <Modal show={this.state.isModalConfirmation} onHide={this.closeModalConfirmation} dialogClassName="modal-lg">
                      <Modal.Body>
                        <Modal.Title className="text-c-purple3 f-w-bold f-21" style={{ marginBottom: "30px" }}>
                          Meeting and Attendance Information
                        </Modal.Title>

                        { this.state.needConfirmation >= 1 ?
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
                        : null }
                        <div className="col-sm-12" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                          <div className="card">
                            <div className="responsive-image-content radius-top-l-r-5" style={{ backgroundImage: `url(${this.state.infoClass.cover ? this.state.infoClass.cover : '/assets/images/component/meeting-default.jpg'})` }}></div>

                            <div className="card-carousel">
                              <div className="title-head f-w-900 f-16">
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
                                </div>
                                { this.state.infoClass.is_scheduled ?
                                <div className="col-sm-6">
                                  <h3 className="f-14">
                                                    Mulai : {infoDateStart.toISOString().slice(0, 16).replace('T', ' ')}
                                                  </h3>
                                  <h3 className="f-14">
                                                    Selesai : {infoDateEnd.toISOString().slice(0, 16).replace('T', ' ')}
                                                  </h3>
                                </div>
                                : null }
                              </div>
                              { this.state.infoClass.is_private ?
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
                                  { this.state.infoParticipant.map(item =>
                                  <div className={item.confirmation==='Hadir' ? 'peserta hadir' : item.confirmation==='Tidak Hadir' ? 'peserta tidak-hadir' : 'peserta tentative'}>{item.name}</div>
                                  ) }
                                </div>
                              </div>
                              : null } { this.state.infoClass.is_private ?
                              <div>
                                <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                  Kehadiran Aktual
                                </div>
                                <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                  { this.state.infoParticipant.map(item => item.actual == 'Hadir' &&
                                  <div className='peserta aktual-hadir'>{item.name}</div>
                                  ) }
                                </div>
                              </div>
                              : null }
                            </div>
                          </div>
                          <button type="button" className="btn btn-block f-w-bold" onClick={e=> this.closeModalConfirmation()} > Close
                          </button>
                        </div>
                      </Modal.Body>
                    </Modal>

                    <Modal show={this.state.isInvite} onHide={this.handleCloseInvite}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                          Undang Peserta
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="form-vertical">
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Invite User
                            </Form.Label>
                            <MultiSelect id="peserta" options={this.state.optionsInvite} value={this.state.valueInvite} onChange={valueInvite=> this.setState({ valueInvite })} mode="tags" removableTags={true} hasSelectAll={true} selectAllLabel="Choose all" enableSearch={true} resetable={true} valuePlaceholder="Pilih" />
                              <Form.Text className="text-muted">
                                Pilih user yang ingin diundang.
                              </Form.Text>
                          </Form.Group>
                          <div className="form-group">
                            <label style={{ fontWeight: "bold" }}>Email</label>
                            <TagsInput value={this.state.emailInvite} onChange={this.handleChange.bind(this)} addOnPaste={true} addOnBlur={true} inputProps={{ placeholder: 'Email Peserta' }} />
                            <Form.Text>
                              Masukkan email yang ingin di invite.
                            </Form.Text>
                          </div>
                        </div>

                        <button style={{ marginTop: "30px" }} disabled={this.state.sendingEmail} type="button" onClick={this.onClickSubmitInvite} className="btn btn-block btn-ideku f-w-bold">
                          {this.state.sendingEmail ? 'Mengirim Undangan...' : 'Undang'}
                        </button>
                        <button type="button" className="btn btn-block f-w-bold" onClick={this.handleCloseInvite}>
                          Tidak
                        </button>
                      </Modal.Body>
                    </Modal>

                    <Modal show={this.state.modalEnd} onHide={this.closeModalEnd} centered>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                          Konfirmasi
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div>Anda yakin akan mengakhiri meeting untuk semua peserta ?</div>
                      </Modal.Body>
                      <Modal.Footer>
                        <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalEnd.bind(this)}>
                          Cancel
                        </button>
                        <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.endMeeting.bind(this)}>
                          <i className="fa fa-trash"></i> Akhiri Meeting
                        </button>
                      </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalFileSharing} onHide={this.closeModalFileSharing} centered>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                          File Sharing
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>

                        <div>
                          <div className="col-sm-12">
                            <div id="scrollin" className='card ' style={{ height: '400px', marginBottom: '0px' }}>
                              <div style={{ height: '100%', overflowY: 'scroll' }}>
                                {this.state.fileChat.map((item, i) => { return (
                                <div className='box-chat-send-left'>
                                  <span className="m-b-5"><Link to='#'><b>{item.name} </b></Link></span>
                                  <br />
                                  <p className="fc-skyblue"> {item.filenameattac}
                                    <a target='_blank' className="float-right" href={item.attachment}> <i className="fa fa-download" aria-hidden="true"></i></a>
                                  </p>
                                  <small>
                                                    {moment(item.created_at).tz('Asia/Jakarta').format('DD/MM/YYYY')}  &nbsp;
                                          {moment(item.created_at).tz('Asia/Jakarta').format('h:sA')}
                                                  </small> { classRooms.moderator == Storage.get("user").data.user_id &&
                                  <button style={{ cursor: 'pointer' }} className="btn btn-sm"><i data-file={item.attachment} onClick={this.onClickRemoveChat} className="fa fa-trash"></i></button>
                                  }
                                </div>
                                ) })}
                              </div>
                            </div>

                            <div className='card p-20'>
                              <Row className='filesharing'>
                                <Col sm={10}>
                                  <label for="attachment" class="custom-file-upload" onChange={this.onChangeInput}>
                                    < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i> {this.state.nameFile === null ? 'Pilih File' : this.state.nameFile}
                                  </label>
                                  <input className="hidden" type="file" id="attachment" name="attachment" onChange={this.onChangeInput} />
                                </Col>
                                <Col sm={2}>
                                  <button onClick={this.sendFileNew.bind(this)} to="#" className="float-right btn btn-icademy-primary ml-2">
                                    {this.state.loadingFileSharing ? 'Loading...' : 'Kirim'}
                                  </button>
                                  {/*
                                  <button onClick={this.onBotoomScroll}>coba</button> */}
                                </Col>
                              </Row>
                            </div>
                          </div>
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

                        <div className="col-sm-12">{/* CHATING SEND FILE */}
                          <div id="scrollin" className="card" style={{ padding: 10 }}>
                            <div className={this.state.editMOM ? 'hidden' : ''}>
                              <button to={ "#"} onClick={(a)=> { this.setState({ editMOM: true }) }} className="btn btn-icademy-primary ml-2 float-right"> Add New
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
                                  <p>{MomentTZ.tz(item.time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")}</p>
                                </div>
                                )) }
                              </div>
                            </div>
                            :
                            <div>
                              <Link to='#' title="Kembali" onClick={this.backMOM}>
                              <h4 className="f-20 f-w-800 p-10">
                                                    <i className="fa fa-arrow-left"></i> Kembali
                                        </h4>
                              </Link>
                              <h4 className="p-10">{classRooms.room_name}</h4>
                              <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                                <Form.Label className="f-w-bold">
                                  Judul MOM
                                </Form.Label>
                                <div style={{ width: '100%' }}>
                                  <input required type="text" name="title" value={this.state.title} className="form-control" placeholder="isi judul MOM..." onChange={this.onChangeInputMOM} />
                                </div>
                              </Form.Group>
                              <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                                <Form.Label className="f-w-bold">
                                  Waktu Meeting
                                </Form.Label>
                                <div style={{ width: '100%' }}>
                                  <DatePicker selected={this.state.startDate} onChange={this.handleChangeDateFrom} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" />
                                </div>
                              </Form.Group>
                              <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                                <Form.Label className="f-w-bold">
                                  Text Dari Subtitle
                                </Form.Label>
                                <div style={{ width: '100%' }}>
                                  <select style={{ textTransform: 'capitalize', width: '40%', display: 'inline-block' }} name="subtitle" className="form-control" onChange={this.onChangeInputMOM} required>
                                    <option value="">Pilih</option>
                                    {dataMOM.map((item, index) => (
                                    <option value={index} selected={ item._id===this.state.selectSubtitle ? "selected" : "" }>
                                      {MomentTZ.tz(item.start_time, 'Asia/Jakarta').format("DD MMMM YYYY, HH:mm") + " - " + MomentTZ.tz(item.end_time, 'Asia/Jakarta').format("HH:mm")}
                                    </option>
                                    ))}
                                  </select>
                                  <button to={ "#"} onClick={this.addSubsToMOM} className="btn btn-icademy-primary ml-2">
                                    Add to MOM
                                  </button>
                                </div>
                              </Form.Group>

                              <div className="chart-container" style={{ position: "relative", margin: 20 }}>
                                <div className="form-group">
                                  <Editor apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5" initialValue={this.state.body} value={this.state.body} onEditorChange={this.handleEditorChange.bind(this)} init={{ height: 400, menubar: true, plugins: [
                                  "advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount" ], toolbar: "undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help" }} />
                                </div>
                              </div>
                              <div>
                                <button to={ "#"} onClick={this.addMOM} className="btn btn-icademy-primary ml-2 float-right col-2 f-14" style={{ marginLeft: '10px', padding: "7px 8px !important" }}>
                                  Simpan
                                </button>
                              </div>
                            </div>
                            }
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>

                    <Modal show={this.state.modalGantt} onHide={this.closeModalGantt} dialogClassName='modal-2xl' centered>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold" style={{color: '#00478C'}}>
                          Task & Timeline - &nbsp;
                          <select className="select-project" name="shareGantt" value={this.state.shareGantt} onChange={this.changeShareGantt}>
                            <option value={0}>Project Not Selected</option>
                            {this.state.project.map(item=>
                            <option value={item.id}>{item.title}</option>
                            )}
                          </select>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="gantt-container">
                          { this.state.shareGantt != 0 &&
                          <Gantt projectId={this.state.shareGantt}/> }
                        </div>
                      </Modal.Body>
                    </Modal>

                  </div>
                </ReactFullScreenElement>
              </div>

            </div>
          </div>
        </div>
      </div>
		);
	}
}
