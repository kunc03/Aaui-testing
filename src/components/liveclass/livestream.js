import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import {
  Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image,
  InputGroup, FormControl, Modal
} from 'react-bootstrap';

import ToggleSwitch from "react-switch";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'


import Moment from 'react-moment';
import MomentTZ from 'moment-timezone';
import moment from 'moment-timezone';
import JitsiMeetComponent from './livejitsi';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import API, { API_JITSI, APPS_SERVER, API_SERVER, USER_ME, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
import { Editor } from '@tinymce/tinymce-react';
import { isMobile } from 'react-device-detect';

import { QandA } from './data';

const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

const axios = require('axios');

const tabs = [
  { title: 'File Sharing' },
  { title: 'MOM' }
]

export default class LiveStream extends Component {
  state = {
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
    modalStart: true,
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
    modalNewFolder: false,
    modalUpload: false,
    attachmentId: [],
    folderName: '',
    uploading: false,
    alert: '',

    //kehadiran
    isModalConfirmation: false,
    infoClass: [],
    infoParticipant: [],
    countHadir: 0,
    countTentative: 0,
    countTidakHadir: 0,
    needConfirmation: 0,
  }

  closeModalConfirmation = e => {
    this.setState({ isModalConfirmation: false });
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

  componentDidMount() {
    this.onBotoomScroll();
    socket.on("broadcast", data => {
      console.log(this.state.fileChat, 'sockett onnnnn')
      if (data.room == this.state.classId) {
        this.fetchData();
        this.setState({ fileChat: [...this.state.fileChat, data] })
      }
    });
    this.fetchData();
    window.onbeforeunload = function () {
      return "Are you sure you want to leave?";
    };
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
    this.onBotoomScroll();
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      console.log(res, 'ini ini inini')
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
          // jwt: token.data.token
        });
        if (isMobile) {
          window.location.replace(APPS_SERVER + 'mobile-meeting/' + this.state.classRooms.room_name + '/no-user')
        }
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


  onClickInvite = e => {
    e.preventDefault();
    this.setState({ isInvite: true });
  }

  onClickSubmitInvite = e => {
    e.preventDefault();
    this.setState({ sendingEmail: true })
    let form = {
      user: Storage.get('user').data.user,
      email: this.state.emailInvite,
      room_name: this.state.classRooms.room_name,
      is_private: this.state.classRooms.is_private,
      is_scheduled: this.state.classRooms.is_scheduled,
      schedule_start: MomentTZ.tz(this.state.classRooms.schedule_start, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      schedule_end: MomentTZ.tz(this.state.classRooms.schedule_end, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      userInvite: this.state.valueInvite,
      message: APPS_SERVER + 'redirect/meeting/information/' + this.state.classId,
      messageNonStaff: APPS_SERVER + 'meeting/' + this.state.classId
    }
    console.log('ALVIN KIRIM', form)

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
        } else {
          this.setState({
            emailResponse: "Email failed to send, please check the email address."
          });
          console.log('RESS GAGAL', res)
        }
      }
    })
  }

  onBotoomScroll = (e) => {
    //let scrollingElement = (document.scrollingElement || document.body);
    var element = document.getElementById('scrollin');
    element.scrollTop = element.scrollHeight - element.clientHeight;
    console.log(element, 'kebawah')
  }

  onChangeInputFile = e => {
    const target = e.target;
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

  sendFileNew() {

    let form = new FormData();
    form.append('class_id', this.state.classId);
    form.append('pengirim', String(this.state.user.user_id));
    form.append('file', this.state.attachment);
    console.log('form data', form);
    API.post(`${API_SERVER}v1/liveclass/file`, form).then(res => {
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
    this.onBotoomScroll();
  }

  joinRoom() {
    this.setState({ join: true, modalStart: false });
  }

  render() {

    const { classRooms, user } = this.state;

    let levelUser = Storage.get('user').data.level;
    const dataMOM = this.state.listSubtitle;

    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ paddingTop: 20 }}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <Row>

                    <Col sm={12} style={{ marginBottom: '20px' }}>
                      {/* <h3 className="f-20 f-w-800">
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
            </h3> */}
                      {
                        user.name && classRooms.room_name && this.state.join ?
                          <div className="card p-20">
                            <div>
                              <span className="f-w-bold f-18 fc-blue">{classRooms.room_name}</span>
                              <button onClick={this.onClickInvite} className="float-right btn btn btn-icademy-primary">
                                <i className="fa fa-user"></i>Invite People
                  </button>
                            </div>
                            {/* <p className="fc-muted mt-1 mb-4">Moderator : {classRooms.name}</p> */}
                            <JitsiMeetComponent
                              roomName={classRooms.room_name}
                              roomId={classRooms.class_id}
                              moderator={classRooms.moderator == Storage.get("user").data.user_id ? true : false}
                              userId={user.user_id}
                              userName={user.name}
                              userEmail={user.email}
                              userAvatar={user.avatar}
                              startMic={this.state.startMic}
                              startCam={this.state.startCam}
                            // jwt={this.state.jwt}
                            />
                          </div>
                          :
                          null
                      }
                    </Col>

                  </Row>

                  <div className="row">
                    {tabs.map((tab, index) => {
                      return (
                        <div className="col-sm-3 p-b-20">
                          <Link onClick={this.tabAktivitas.bind(this, tab, index)}>
                            <div className={this.state.tabIndex === index + 1 ? "tab-icademy" : "kategori title-disabled"}>
                              {tab.title}
                            </div>
                          </Link>
                        </div>
                      )
                    })}

                    {this.state.tabIndex === 1 ?
                      <div className="row col-sm-12">
                        <div className="col-sm-6">
                          <div id="scrollin" className='card ' style={{ height: '492px', marginBottom: '0px' }}>
                            <h3 className="f-20 f-w-800 fc-blue p-10">
                              File Sharing
                    </h3>

                            {this.state.fileChat.map((item, i) => {
                              return (
                                <div className='box-chat-send-left'>
                                  <span className="m-b-5"><Link to='#'><b>{item.name} </b></Link></span><br />
                                  <p className="fc-skyblue"> {item.filenameattac} <a target='_blank' className="float-right" href={item.attachment}> <i className="fa fa-download" aria-hidden="true"></i></a></p>
                                  <small >
                                    {moment(item.created_at).tz('Asia/Jakarta').format('DD/MM/YYYY')}  &nbsp;
                              {moment(item.created_at).tz('Asia/Jakarta').format('h:sA')}
                                  </small>
                                  {
                                    classRooms.moderator == Storage.get("user").data.user_id &&
                                    <button style={{ cursor: 'pointer' }} className="btn btn-sm"><i data-file={item.attachment} onClick={this.onClickRemoveChat} className="fa fa-trash"></i></button>
                                  }
                                </div>
                              )
                            })}
                          </div>

                          <div className='card p-20'>
                            <Row className='filesharing'>
                              <Col sm={10}>
                                <label for="attachment" class="custom-file-upload" onChange={this.onChangeInput}>
                                  < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i> {this.state.nameFile === null ? 'Pilih File' : this.state.nameFile}
                                </label>
                                <input
                                  className="hidden"
                                  type="file"
                                  id="attachment"
                                  name="attachment"
                                  onChange={this.onChangeInput}
                                />

                                {/* FIle Upload Yang Lama */}
                                {/* <div>
                          < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i>
                          <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            onChange={this.onChangeInput}
                          /><label id="attachment"> &nbsp;{this.state.nameFile === null ? 'Pilih File' : this.state.nameFile }</label>
                        </div> */}

                              </Col>
                              <Col sm={2}>
                                <button onClick={this.sendFileNew.bind(this)} to="#" className="float-right btn btn-icademy-primary ml-2">
                                  Submit
                        </button>
                                {/* <button onClick={this.onBotoomScroll}>coba</button> */}
                              </Col>

                            </Row>
                          </div>

                        </div>

                        {/* <div className="col-sm-6">
                  <div id="scrollin" className='card ' style={{height:'400px', marginBottom: '0px'}}>
                    <h3 className="f-20 f-w-800 fc-blue p-10">
                      Q&A
                    </h3>
                      
                      { QandA.map((item, i)=>{
                        return (
                          <div className='box-chat-send-left'>
                            <p className="fc-muted"> {item.title} <small className="float-right"> {item.date}</small></p>                            
                            <ul className="list-unstyled">
                              <li>Q : {item.nanya}</li>
                              <li>A : {item.jawab}</li>
                            </ul>
                            Balas
                          </div>
                        )
                      })}
                  </div>

                  <div className='card p-20'>
                    <Row>
                      <Col sm={12}>
                        <textarea className='form-control mb-3' rows={3} placeholder="Silahkan masukan pertanyaan atau jawaban anda.." />
                      </Col>
                      <Col sm={10}>
                        <label for="attachment" class="custom-file-upload" onChange={this.onChangeInput}>
                        < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i> {this.state.nameFile === null ? 'Pilih File' : this.state.nameFile }
                        </label>
                        <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            onChange={this.onChangeInput}
                          />
                      </Col>
                      <Col sm={2}>
                        <button onClick={this.sendFileNew.bind(this)} to="#" className="float-right btn btn-icademy-primary ml-2">
                          Submit
                        </button>
                      </Col>

                    </Row>
                  </div>

                </div> */}



                        {/* PROJECT TIDAK TERKAIT */}
                        {/* <div className="col-sm-6">
                  <div id="scrollin" className='card ' style={{height:'492px', marginBottom: '0px'}}>
                  <h3 className="f-20 f-w-800 fc-blue p-10">
                    {this.state.classRooms.folder_id !==0 ? 'Project Files : '+classRooms.project_name : 'Project Files : Tidak terkait'}
                  </h3>
                        <div className="row" style={{marginLeft:0, marginRight:0}}>
                          {
                            ((levelUser == 'admin' || levelUser == 'superadmin') && this.state.classRooms.folder_id !==0) &&
                            <Button
                                onClick={e=>this.setState({modalNewFolder:true})}
                                className="btn-block btn-primary"
                                style={{width:250, margin:5}}
                            >
                                <i className="fa fa-plus"></i> &nbsp; Tambah Folder Project
                            </Button>
                          }
                            {
                              (this.state.selectFolder !== 0 && this.state.classRooms.folder_id !==0) &&
                              <Button
                                  onClick={e=>this.setState({modalUpload:true})}
                                  className="btn-block btn-primary"
                                  style={{width:150, margin:5}}
                              >
                                  <i className="fa fa-upload"></i> &nbsp; Upload File
                              </Button>
                            }
                        </div>
                    <div className='row' style={{marginLeft:0, marginRight:0, height:380, overflowY: 'scroll'}}>
                            {
                              this.state.folderId !== 0 &&
                              this.state.selectFolder &&
                              <div className="folder" onDoubleClick={this.selectFolder.bind(this,this.state.prevFolderId, null)}>
                                  <img
                                  src='assets/images/component/folder-back.png'
                                  className="folder-icon"
                                  />
                                  <div className="filename">
                                      Back
                                  </div>
                              </div>
                            }
                            {this.state.folder.map(item =>
                            <div className="folder" onDoubleClick={this.selectFolder.bind(this, item.id, item.name)}>
                                <img
                                src='assets/images/component/folder.png'
                                className="folder-icon"
                                />
                                <div className="filename">
                                    {item.name}
                                </div>
                            </div>
                            )}
                            {
                              this.state.files.map(item =>
                              <div className="folder" onDoubleClick={e=>window.open(item.location, 'Downloading files')}>
                                  <img
                                  src={
                                    item.type == 'png' || item.type == 'pdf' || item.type == 'dox' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg'
                                    ? `assets/images/component/${item.type}.png`
                                    : 'assets/images/component/file.png'
                                  }
                                  className="folder-icon"
                                  />
                                  <div className="filename">
                                    {item.name}
                                  </div>
                              </div>
                              )
                            }
                            {
                              this.state.mom.map(item =>
                              <div className="folder" onDoubleClick={e=>window.open(`${APPS_SERVER}mom/?id=${item.id}`, 'Downloading files')}>
                                  <img
                                  src='assets/images/component/file.png'
                                  className="folder-icon"
                                  />
                                  <div className="filename">
                                    MOM-{item.title}
                                  </div>
                              </div>
                              )
                            }
                            {
                              this.state.recordedMeeting.map(item =>
                                item.record && item.record.split(',').map(item =>
                                  <div className="folder" onDoubleClick={e=>window.open(item, 'Rekaman Meeting')}>
                                      <img
                                      src='assets/images/component/mp4.png'
                                      className="folder-icon"
                                      />
                                      <div className="filename">
                                        {item.substring(40)}
                                      </div>
                                  </div>
                                )
                              )
                            }
                    </div>
                    </div>
                </div> */}
                      </div>
                      :
                      <div className="col-sm-12">{/* CHATING SEND FILE */}
                        <div id="scrollin" className="card" style={{ padding: 10 }}>
                          <div className={this.state.editMOM ? 'hidden' : ''}>
                            <button
                              to={"#"}
                              onClick={(a) => { this.setState({ editMOM: true }) }}
                              className="btn btn-icademy-primary ml-2 float-right">
                              Add New
                    </button>
                          </div>
                          {!this.state.editMOM
                            ?
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
                                ))
                                }
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
                                  <input
                                    required
                                    type="text"
                                    name="title"
                                    value={this.state.title}
                                    className="form-control"
                                    placeholder="Insert MOM Title"
                                    onChange={this.onChangeInputMOM}
                                  />
                                </div>
                              </Form.Group>
                              <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                                <Form.Label className="f-w-bold">
                                  Waktu Meeting
                          </Form.Label>
                                <div style={{ width: '100%' }}>
                                  <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleChangeDateFrom}
                                    showTimeSelect
                                    dateFormat="yyyy-MM-dd HH:mm"
                                  />
                                </div>
                              </Form.Group>
                              <Form.Group controlId="formJudul" style={{ padding: 10 }}>
                                <Form.Label className="f-w-bold">
                                  Text Dari Subtitle
                          </Form.Label>
                                <div style={{ width: '100%' }}>
                                  <select
                                    style={{ textTransform: 'capitalize', width: '40%', display: 'inline-block' }}
                                    name="subtitle"
                                    className="form-control"
                                    onChange={this.onChangeInputMOM}
                                    required
                                  >
                                    <option value="">Pilih</option>
                                    {dataMOM.map((item, index) => (
                                      <option
                                        value={index}
                                        selected={
                                          item._id === this.state.selectSubtitle
                                            ? "selected"
                                            : ""
                                        }
                                      >
                                        {MomentTZ.tz(item.start_time, 'Asia/Jakarta').format("DD MMMM YYYY, HH:mm") + " - " + MomentTZ.tz(item.end_time, 'Asia/Jakarta').format("HH:mm")}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    to={"#"}
                                    onClick={this.addSubsToMOM}
                                    className="btn btn-icademy-primary ml-2">
                                    Add to MOM
                              </button>
                                </div>
                              </Form.Group>

                              <div className="chart-container" style={{ position: "relative", margin: 20 }}>
                                <div className="form-group">
                                  <Editor
                                    apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                    initialValue={this.state.body}
                                    value={this.state.body}
                                    onEditorChange={this.handleEditorChange.bind(this)}
                                    init={{
                                      height: 400,
                                      menubar: true,
                                      plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code help wordcount"
                                      ],
                                      toolbar:
                                        "undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help"
                                    }}
                                  // onChange={this.onChangeTinyMce}
                                  />
                                </div>
                              </div>
                              <div>
                                <button
                                  to={"#"}
                                  onClick={this.addMOM}
                                  className="btn btn-icademy-primary ml-2 float-right col-2 f-14"
                                  style={{ marginLeft: '10px', padding: "7px 8px !important" }}>
                                  Save
                      </button>
                              </div>
                            </div>
                          }
                        </div>
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
                        this.state.needConfirmation >= 1
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
                          : null
                      }
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
                                  {this.state.infoClass.is_private ? 'Private' : 'Public'} Meeting
                                </h3>
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
                              this.state.infoClass.is_private ?
                                <div>
                                  <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                    Attendance Confirmation of {this.state.infoParticipant.length} Participant
                                    </div>
                                  <div className="row mt-3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', padding: '0px 15px' }}>
                                    <div className='legend-kehadiran hadir'></div><h3 className="f-14 mb-0 mr-2"> Confirmed ({this.state.countHadir})</h3>
                                    <div className='legend-kehadiran tidak-hadir'></div><h3 className="f-14 mb-0 mr-2"> Unconfirmed ({this.state.countTidakHadir})</h3>
                                    <div className='legend-kehadiran tentative'></div><h3 className="f-14 mb-0 mr-2"> Not confirmed yet ({this.state.countTidakHadir})</h3>
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
                              this.state.infoClass.is_private ?
                                <div>
                                  <div className="title-head f-w-900 f-16" style={{ marginTop: 20 }}>
                                    Actual Attendance In Meeting Room
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
                        <button
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={e => this.closeModalConfirmation()}
                        >
                          Close
                            </button>
                      </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                    show={this.state.isInvite}
                    onHide={this.handleCloseInvite}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Invite People
            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="form-vertical">
                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Invite User
                          </Form.Label>
                          <MultiSelect
                            id="peserta"
                            options={this.state.optionsInvite}
                            value={this.state.valueInvite}
                            onChange={valueInvite => this.setState({ valueInvite })}
                            mode="tags"
                            removableTags={true}
                            hasSelectAll={true}
                            selectAllLabel="Choose all"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih"
                          />
                          <Form.Text className="text-muted">
                            Pilih user yang ingin diundang.
                          </Form.Text>
                        </Form.Group>
                        <div className="form-group">
                          <label style={{ fontWeight: "bold" }}>Email</label>
                          <TagsInput
                            value={this.state.emailInvite}
                            onChange={this.handleChange.bind(this)}
                            addOnPaste={true}
                            inputProps={{ placeholder: 'Email Peserta' }}
                          />
                          <Form.Text>
                            Masukkan email yang ingin di invite.
                </Form.Text>
                        </div>
                      </div>

                      <Form.Text style={{ color: 'red' }}>
                        {this.state.emailResponse}
                      </Form.Text>

                      <button
                        style={{ marginTop: "30px" }}
                        disabled={this.state.sendingEmail}
                        type="button"
                        onClick={this.onClickSubmitInvite}
                        className="btn btn-block btn-ideku f-w-bold"
                      >
                        {this.state.sendingEmail ? 'Sending Invitation...' : 'Undang'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleCloseInvite}
                      >
                        Tidak
            </button>
                    </Modal.Body>
                  </Modal>


                  <Modal
                    show={this.state.modalStart}
                  >
                    <Modal.Header>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        {classRooms.room_name}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Card className="cardku">
                        <Card.Body>
                          <Row>
                            <Col><h4><i className="fa fa-microphone"></i> Microphone</h4></Col>
                            <Col><ToggleSwitch onChange={this.toggleSwitchMic.bind(this)} checked={this.state.startMic} /></Col>
                          </Row>
                          <Row>
                            <Col><h4><i className="fa fa-camera"></i> Camera</h4></Col>
                            <Col><ToggleSwitch onChange={this.toggleSwitchCam.bind(this)} checked={this.state.startCam} /></Col>
                          </Row>
                          <Link onClick={this.joinRoom.bind(this)} to="#" className="btn btn-sm btn-ideku" style={{ padding: '10px 17px', width: '100%', marginTop: 20 }}>
                            <i className="fa fa-video"></i>Join Meeting
                      </Link>
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={this.handleCloseMeeting}
                          >
                            Keluar
                      </button>
                        </Card.Body>
                      </Card>
                    </Modal.Body>
                  </Modal>
                  <Modal
                    show={this.state.modalNewFolder}
                  >
                    <Modal.Header>
                      <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                        Add New Project Folder
            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Card className="cardku">
                        <Card.Body>
                          <Row>
                            <Col>
                              <div className="input-group mb-4">
                                <input
                                  type="text"
                                  name="folderName"
                                  value={this.state.folderName}
                                  className="form-control"
                                  placeholder="Name"
                                  onChange={this.onChangeInputFile}
                                  required
                                />
                              </div>
                              <div style={{ color: '#F00' }}>{this.state.alert}</div>
                            </Col>
                          </Row>
                          <Link onClick={this.saveFolder.bind(this)} to="#" className="btn btn-sm btn-ideku" style={{ padding: '10px 17px', width: '100%', marginTop: 20 }}>
                            <i className="fa fa-save"></i>Save
                      </Link>
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={e => this.setState({ modalNewFolder: false, alert: '' })}
                          >
                            Cancel
                      </button>
                        </Card.Body>
                      </Card>
                    </Modal.Body>
                  </Modal>
                  <Modal
                    show={this.state.modalUpload}
                  >
                    <Modal.Header>
                      <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                        Upload File
            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Card className="cardku">
                        <Card.Body>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label>Attachment</label>
                                <input
                                  accept="all"
                                  name="attachmentId"
                                  onChange={this.onChangeInputFile}
                                  type="file"
                                  multiple
                                  placeholder="media chapter"
                                  className="form-control"
                                />
                                <label style={{ color: '#000', padding: '5px 10px' }}>{this.state.attachmentId.length} File</label>
                                <Form.Text>
                                  Support multiple files (make sure all the files does not exceed 500MB)
                              {/* dan ukuran file tidak melebihi 20MB. */}
                                </Form.Text>
                              </div>
                              <div style={{ color: '#F00' }}>{this.state.alert}</div>
                            </Col>
                          </Row>
                          <Link disabled={this.state.uploading} onClick={this.uploadFile.bind(this)} to="#" className="btn btn-sm btn-ideku" style={{ padding: '10px 17px', width: '100%', marginTop: 20 }}>
                            <i className="fa fa-upload"></i>{this.state.uploading ? 'Uploading...' : 'Upload'}
                          </Link>
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={e => this.setState({ modalUpload: false })}
                          >
                            Cancel
                      </button>
                        </Card.Body>
                      </Card>
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