import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from 'moment-timezone';
import { Alert } from 'react-bootstrap';
import {
  Form, Card, Col, Row, Modal
} from 'react-bootstrap';

import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'
import { toast } from "react-toastify";

import API, { APPS_SERVER, API_SERVER, API_SOCKET, BBB_URL, BBB_KEY, CHIME_URL, ZOOM_URL } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
import Iframe from 'react-iframe';
import { isMobile, isIOS } from 'react-device-detect';

// import { ThemeProvider } from 'styled-components';
// import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';
// import ChimeMeeting from '../meeting/chime'
import axios from 'axios'

const bbb = require('bigbluebutton-js')
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class MeetingRoomPublic extends Component {
  state = {
    classId: this.props.match.params.roomid,
    user: {
      name: '',
      email: '',
      avatar: ''
    },
    classRooms: {},
    fileChat: [],
    attachment: '',
    isNotifikasi: false,
    isiNotifikasi: '',
    toggle_alert: false,
    alertMessage: '',
    isInvite: false,
    emailInvite: [],
    emailResponse: 'Masukkan email yang ingin di invite.',
    //multi select invite
    optionsInvite: [],
    valueInvite: [],
    nameFile: null,
    join: false,
    startMic: localStorage.getItem('startMic') === 'true' ? true : false,
    startCam: localStorage.getItem('startCam') === 'true' ? true : false,
    modalStart: false,
    joinUrl: '',
    welcome: true,

    attendee: {},
    zoomUrl: '',
    isZoom: false,
    isLoading: false
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

  handleCloseMeeting = e => {
    window.close();
  }

  handleCloseLive = e => {
    this.setState({ isLive: false, liveURL: '' })
  }
  handleCloseStart = e => {
    this.setState({ modalStart: true })
  }

  componentDidMount() {
    if (isMobile) {
      window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/' + this.state.classId))
    }
    else{
      this.setState({isLoading: true})
      this.onBotoomScroll();
      socket.on("broadcast", data => {
        console.log(this.state.fileChat, 'sockett onnnnn')
        if (data.room == this.state.classId) {
          this.fetchData();
          this.setState({ fileChat: [...this.state.fileChat, data] })
        }
      });
      this.fetchData();
    }
    // window.onbeforeunload = function() {
    //   return "Are you sure you want to leave?";
    // };
  }

  fetchData() {
    this.onBotoomScroll();
    API.get(`${API_SERVER}v1/liveclasspublic/id/${this.state.classId}`).then(response => {
      this.setState({isLoading: false})
      this.setState({ classRooms: response.data.result })
      API.get(`${API_SERVER}v1/liveclasspublic/file/${this.state.classId}`).then(res => {
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


        }

      })
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  joinMeeting() {

    this.joinChime()

    // BBB JOIN START
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
    let meetingInfo = api.monitoring.getMeetingInfo(this.state.classRooms.class_id)
    http(meetingInfo).then(async (result) => {
      if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
        // Jika belum ada, create room nya.
        let meetingCreateUrl = api.administration.create(this.state.classRooms.room_name, this.state.classRooms.class_id, {
          attendeePW: 'peserta',
          moderatorPW: 'moderator',
          allowModsToUnmuteUsers: true,
          record: true
        })
        http(meetingCreateUrl).then(async (result) => {
          if (result.returncode = 'SUCCESS') {
            // Setelah create, join
            let joinUrl = api.administration.join(
              this.state.user.name,
              this.state.classRooms.class_id,
              this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 'moderator' : 'peserta',
              {
                userID: this.state.user.user_id,
                guest: true
              }
            )

            let zoomUrl = await API.get(`${API_SERVER}v2/liveclass/zoom/${this.state.classId}`);
            let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
            this.setState({isZoom:  zoomUrl.data.result.length ? true : false})
            let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 1 : 0}`

            this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })
            if (isMobile) {
              window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/' + this.state.classId))
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
          {
            userID: this.state.user.user_id,
            guest: true
          }
        )

        let zoomUrl = await API.get(`${API_SERVER}v2/liveclass/zoom/${this.state.classRooms.class_id}`);
        let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
        this.setState({isZoom:  zoomUrl.data.result.length ? true : false})
        let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.classRooms.moderator == Storage.get("user").data.user_id || this.state.classRooms.is_akses === 0 ? 1 : 0}`

        this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })
        if (isMobile) {
          window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/' + this.state.classId))
        }
      }
    })
    // BBB JOIN END
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

      API.post(`${API_SERVER}v1/liveclasspublic/share`, form).then(res => {
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
    this.setState({ user: { name: e.target.value } })
  }

  sendFileNew() {

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
      }
    })
  }

  componentDidUpdate() {
    this.onBotoomScroll();
  }

  joinRoom() {
    if (this.state.user.name) {
      this.joinMeeting()

      this.joinChime()

      this.setState({ join: true, modalStart: false, welcome: false });
    }
    else {
      this.setState({ toggle_alert: true, alertMessage: 'Please insert your name.' });
    }
  }

  render() {

    const { classRooms, user, toggle_alert } = this.state;

    return (
      <div>
      {
        !this.state.welcome ?
        <div className="pcoded-main-container" style={{ marginLeft: 0 }}>
          <div className="pcoded-wrapper">
            <div className="pcoded-content" style={{ padding: 14 }}>
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <Row>
  
                      {/*
            <div className="col-md-4 col-xl-4 mb-3">
              <Link to={`/`} className="menu-mati">
                <div className="kategori title-disabled">
                <img src="/assets/images/component/kursusoff.png" className="img-fluid" alt="media" />
                &nbsp;
                Kursus & Materi
                </div>
              </Link>
            </div>
  
            <div className="col-md-4 col-xl-4 mb-3">
              <Link to={`/forum`} className="menu-mati">
                <div className="kategori title-disabled">
                  <img src="/assets/images/component/forumoff.png" className="img-fluid" alt="media" />
                &nbsp;
                Forum
                </div>
              </Link>
            </div>
  
            <div className="col-md-4 col-xl-4 mb-3">
              <Link to={`/liveclass`}>
                <div className="kategori-aktif">
                  <img src="/assets/images/component/liveon.png" className="img-fluid" alt="media" />
                &nbsp;
                Group Meeting
                </div>
              </Link>
            </div>
            */}
  
                      <Col sm={12} style={{ marginBottom: '20px' }}>
                        {
                          this.state.welcome ? null :
                          <h3 className="f-20 f-w-800">
                            {classRooms.room_name}
                            <button style={{ marginRight: 14 }} onClick={this.onClickInvite} className="float-right btn btn-icademy-primary">
                              <i className="fa fa-user"></i>Undang Peserta
                            </button>
                          </h3>
                        }
                        {
                          user.name && classRooms.room_name && this.state.join ?
  
                          <div style={{background:`url('newasset/loading.gif') center center no-repeat`}}>
                            <Iframe url={this.state.isZoom ? this.state.zoomUrl : this.state.joinUrl}
                              width="100%"
                              height="600px"
                              display="initial"
                              frameBorder="0"
                              allow="fullscreen *;geolocation *; microphone *; camera *; display-capture"
                              position="relative" />
                          </div>
  
                            // <ThemeProvider theme={lightTheme}>
                            //   <MeetingProvider>
                            //     <ChimeMeeting
                            //       ref={`child`}
                            //       attendee={this.state.attendee}
                            //       name={Storage.get('user').data.user}
                            //       title={classRooms.room_name+'-'+moment(new Date).format('YYYY-MM-DD-HH')}
                            //       region={`ap-southeast-1`} />
                            //   </MeetingProvider>
                            // </ThemeProvider>
  
                            //   <JitsiMeetComponent
                            //     roomName={classRooms.room_name}
                            //     roomId={classRooms.class_id}
                            //     moderator={classRooms.moderator == Storage.get("user").data.user_id ? true : false}
                            //     userId={user.user_id}
                            //     userName={user.name}
                            //     userEmail={user.email}
                            //     userAvatar={user.avatar}
                            //     startMic={this.state.startMic}
                            //     startCam={this.state.startCam}
                            //   />
                            :
                            null
                        }
                      </Col>
                    </Row>
  
                    {/* CHATING SEND FILE */}
                        {
                          this.state.welcome ? null :
                          <div>
                            <h3 className="f-20 f-w-800">
                              File Sharing
                            </h3>
                            <div id="scrollin" className='box-chat'>
          
                              {this.state.fileChat.map((item, i) => {
                                return (
                                  <div className='box-chat-send-left'>
                                    <span className="m-b-5"><Link to='#'><b>{item.name} </b></Link></span><br />
                                    <p className="fc-skyblue"> {decodeURI(item.filenameattac)} <a target='_blank' className="float-right" href={item.attachment}> <i className="fa fa-download" aria-hidden="true"></i></a></p>
                                    <small >
                                      {moment(item.created_at).tz(moment.tz.guess(true)).format('DD/MM/YYYY')}  &nbsp;
                              {moment(item.created_at).tz(moment.tz.guess(true)).format('h:sA')}
                                    </small>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        }
  
  
                    {/*  */}
  
  
  
                    <Modal show={this.state.isInvite} onHide={this.handleCloseInvite}>
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            Invite Participants
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="form-vertical">
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
                          <button className="btn btn-icademy-primary float-right" style={{marginLeft: 10}} onClick={this.onClickSubmitInvite}>
                            <i className="fa fa-envelope"></i> {this.state.sendingEmail ? 'Sending Invitation...' : 'Send Invitation'}
                          </button>
                          <button className="btn btm-icademy-primary btn-icademy-grey float-right" onClick={this.handleCloseInvite}>
                            Cancel
                          </button>
                        </Modal.Body>
                      </Modal>
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
          <div
            className="auth-wrapper"
  
          >
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
                        this.state.isLoading ?
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
                  className="card-body text-center"
                  style={{ padding: "50px !important" }}
                >
                  <div className="row">
                    <div className="col-sm-12">
                        <b style={{ float: 'left', color: 'black' }}>
                          Join the room "
                          {
                            this.state.isLoading ?
                            <h4>Loading...</h4>
                            :
                            classRooms.room_name
                          }
                          "
                        </b>
                        <div className="input-group mb-4 mt-5">
                          <input
                            type="text"
                            value={this.state.user.name}
                            className="form-control"
                            style={{ marginTop: 8 }}
                            placeholder="Enter your name"
                            onChange={this.onChangeName}
                            required
                          />
                        </div>
                        <button onClick={this.joinRoom.bind(this)} type="submit" className="btn btn-ideku col-12 shadow-2 b-r-3 f-16" style={{ height: 60 }}>
                          Join The Meeting
                        </button>
                        {
                          toggle_alert &&
                          <Alert variant={'danger'}>
                            {this.state.alertMessage}
                          </Alert>
                        }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      </div>
    );
  }
}
