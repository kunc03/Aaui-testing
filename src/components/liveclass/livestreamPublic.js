import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form, Card, Col, Row, Modal
} from 'react-bootstrap';

import ToggleSwitch from "react-switch";
import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

import Moment from 'react-moment';
import MomentTZ from 'moment-timezone';
import JitsiMeetComponent from './livejitsi';

import API, { APPS_SERVER, API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
import { isMobile } from 'react-device-detect';
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class LiveStream extends Component {
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
    modalStart: true
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

  componentDidMount() {
    this.onBotoomScroll();
    socket.on("broadcast", data => {
      console.log(this.state.fileChat, 'sockett onnnnn')
      if (data.room == this.state.classId) {
        this.setState({ fileChat: [...this.state.fileChat, data] })
      }
    });
    this.fetchData();
    window.onbeforeunload = function () {
      return "Are you sure you want to leave?";
    };
  }

  fetchData() {
    this.onBotoomScroll();
    API.get(`${API_SERVER}v1/liveclasspublic/id/${this.state.classId}`).then(response => {
      console.log('RESSS', response)
      this.setState({ classRooms: response.data.result })
      if (isMobile) {
        window.location.replace(APPS_SERVER + 'mobile-meeting/' + this.state.classRooms.room_name + '/no-user')
      }
      API.get(`${API_SERVER}v1/liveclasspublic/file/${this.state.classId}`).then(res => {
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


        }

      })
    })
      .catch(function (error) {
        console.log(error);
      });
  }

  onClickInvite = e => {
    e.preventDefault();
    this.setState({ isInvite: true });
  }

  onClickSubmitInvite = e => {
    e.preventDefault();
    let form = {
      user: Storage.get('user').data.user,
      email: this.state.emailInvite,
      room_name: this.state.classRooms.room_name,
      is_private: this.state.classRooms.is_private,
      is_scheduled: this.state.classRooms.is_scheduled,
      schedule_start: MomentTZ.tz(this.state.classRooms.schedule_start, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      schedule_end: MomentTZ.tz(this.state.classRooms.schedule_end, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      userInvite: this.state.valueInvite,
      message: 'https://' + window.location.hostname + '/redirect/liveclass-room/' + this.state.classId,
      messageNonStaff: 'https://' + window.location.hostname + '/meeting/' + this.state.classId
    }

    API.post(`${API_SERVER}v1/liveclasspublic/share`, form).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          this.setState({
            isInvite: false,
            emailInvite: [],
            valueInvite: [],
            emailResponse: res.data.result
          });
          console.log('RESS SUKSES', res)
        } else {
          this.setState({
            emailResponse: "Email tidak terkirim, periksa kembali email yang dimasukkan."
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
      this.setState({ join: true, modalStart: false });
    }
    else {
      alert('Nama harus diisi')
    }
  }

  render() {

    const { classRooms, user } = this.state;

    return (
      <div className="pcoded-main-container" style={{ marginLeft: 0 }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ paddingTop: 20 }}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <Row>

                    {/* <div className="col-md-4 col-xl-4 mb-3">
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
          </div> */}

                    <Col sm={12} style={{ marginBottom: '20px' }}>
                      <h3 className="f-20 f-w-800">
                        {classRooms.room_name}
                        <Link onClick={this.onClickInvite} to="#" className="float-right btn btn-sm btn-ideku" style={{ padding: '5px 10px' }}>
                          <i className="fa fa-user"></i>Invite People
              </Link>
                      </h3>
                      {
                        user.name && classRooms.room_name && this.state.join ?
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
                          />
                          :
                          null
                      }
                    </Col>

                  </Row>

                  {/* CHATING SEND FILE */}
                  <h3 className="f-20 f-w-800">
                    File Sharing
        </h3>
                  <div id="scrollin" className='box-chat'>

                    {this.state.fileChat.map((item, i) => {
                      return (
                        <div className='box-chat-send-left'>
                          <span className="m-b-5"><Link to='#'><b>{item.name} </b></Link></span><br />
                          <p className="m-t-5">File :<a target='_blank' href={item.attachment}> {item.filenameattac}  <i className="fa fa-download" aria-hidden="true"></i></a></p>
                          <small><Moment format="MMMM Do YYYY, h:mm">{item.created_at}</Moment></small>
                        </div>
                      )
                    })}
                  </div>


                  {/*  */}



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
                        <div className="form-group">
                          <label style={{ fontWeight: "bold" }}>Email</label>
                          <TagsInput
                            value={this.state.emailInvite}
                            onChange={this.handleChange.bind(this)}
                            addOnPaste={true}
                            inputProps={{ placeholder: 'Email Peserta' }}
                          />
                          <Form.Text>
                            {this.state.emailResponse}
                          </Form.Text>
                        </div>
                      </div>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        onClick={this.onClickSubmitInvite}
                        className="btn btn-block btn-ideku f-w-bold"
                      >
                        Submit
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
                            <Col>
                              <div className="input-group mb-4">
                                <input
                                  type="text"
                                  value={this.state.user.name}
                                  className="form-control"
                                  placeholder="Nama"
                                  onChange={this.onChangeName}
                                  required
                                />
                              </div>
                            </Col>
                          </Row>
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