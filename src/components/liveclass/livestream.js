import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { 
	Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image, 
	InputGroup, FormControl, Modal
} from 'react-bootstrap';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

import Moment from 'react-moment';
import MomentTZ from 'moment-timezone';
import JitsiMeetComponent from './livejitsi';

import API, { API_SERVER, USER_ME, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class LiveStream extends Component {
	state = {
    classId: this.props.match.params.roomid,
    user: {},
    classRooms: {},
    fileChat : [],
    attachment: '',
    isNotifikasi: false, 
		isiNotifikasi:'',
    isInvite: false,
    emailInvite: [],
    emailResponse: 'Masukkan email yang ingin di invite.',
    //multi select invite
    optionsInvite: [],
    valueInvite: [],
  }
  
  handleChange(emailInvite) {
    this.setState({emailInvite})
  }

  handleCloseInvite = e =>{
    this.setState({
      isInvite: false,
      emailInvite: [],
      emailResponse: "Masukkan email yang ingin di invite."
    });
  }

	handleCloseLive = e => {
		this.setState({ isLive: false, liveURL: '' })
  }

  componentDidMount() {
    socket.on("broadcast", data => {
      if(data.room == this.state.classId) {
        this.setState({ fileChat: [...this.state.fileChat, data] })
      }
    });
    this.fetchData();
    window.onbeforeunload = function() {
      return "Are you sure you want to leave?";
    };
  }
  
  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if(res.status === 200) {
        let liveClass = await API.get(`${API_SERVER}v1/liveclass/id/${this.state.classId}`);
 
        var data = liveClass.data.result
        /*mark api get new history course*/
        let form = {
          user_id : Storage.get('user').data.user_id,
          class_id : data.class_id,
          description : data.room_name,
          title : data.speaker
        }

        //get and push multiselect option
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(response => {
          response.data.result.map(item => {
            this.state.optionsInvite.push({value: item.user_id, label: item.name});
          });
        })
        .catch(function(error) {
          console.log(error);
        });


       // console.log('alsdlaksdklasjdlkasjdlk',form)
        API.post(`${API_SERVER}v1/api-activity/new-class`, form).then(console.log);

        this.setState({ user: res.data.result, classRooms: liveClass.data.result })
      }
    }).then(res=>{
        console.log(`${API_SERVER}v1/liveclass/file/${this.state.classId}`,'siniii')
        API.get(`${API_SERVER}v1/liveclass/file/${this.state.classId}`).then(res => {
          console.log(res, 'ini responseeee');
          let splitTags;
          let datas = res.data.result;
          for(let a in datas){
            splitTags =  datas[a].attachment.split("/")[4];
            datas[a].filenameattac = splitTags; 
          }
          if(res.status === 200) {
            this.setState({
              fileChat : res.data.result
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
    let form = {
      user: Storage.get('user').data.user,
      email: this.state.emailInvite,
      room_name: this.state.classRooms.room_name,
      is_private: this.state.classRooms.is_private,
      is_scheduled: this.state.classRooms.is_scheduled,
      schedule_start: MomentTZ.tz(this.state.classRooms.schedule_start, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      schedule_end:  MomentTZ.tz(this.state.classRooms.schedule_end, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      userInvite: this.state.valueInvite,
      message: window.location.href
    }

    API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
      if(res.status === 200) {
        if(!res.data.error) {
          this.setState({
            isInvite: false,
            emailInvite: [],
            valueInvite: [],
            emailResponse: res.data.result
          });
          console.log('RESS SUKSES',res)
        } else {
          this.setState({
            emailResponse: "Email tidak terkirim, periksa kembali email yang dimasukkan."
          });
          console.log('RESS GAGAL',res)
        }
      }
    })
  }

  onChangeInput = (e) => {
      const name = e.target.name;
      console.log(e.target.files[0], 'attach')
      if(name === 'attachment') {
          if (e.target.files[0].size <= 500000) {
              this.setState({ [name]: e.target.files[0] });
          } else {
              e.target.value = null;
              this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
          }
      } else {
          this.setState({ [name]: e.target.value })
      }
  }

  sendFileNew(){

    let form = new FormData();
    form.append('class_id', this.state.classId);
    form.append('pengirim', String(this.state.user.user_id));
    form.append('file', this.state.attachment);
    console.log('form data',FormData);
    API.post(`${API_SERVER}v1/liveclass/file`, form).then(res => {
      console.log(res, 'response');
      
      let splitTags;
      let datas = res.data.result;
      splitTags =  datas.attachment.split("/")[4];
      datas.filenameattac = splitTags; 

      if(res.status === 200) {
        //this.setState({ fileChat: [...this.state.fileChat, res.data.result] });
        socket.emit('send', {
          pengirim: this.state.user.user_id,
          room: this.state.classId,
          attachment: this.state.attachment,
          filenameattac: datas.filenameattac,
          created_at: new Date()
        })
      }
    })
  }

	render() {

    const { classRooms, user } = this.state;

		return(
			<div className="pcoded-main-container">
			<div className="pcoded-wrapper">
			<div className="pcoded-content" style={{paddingTop: 20}}>
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

          <Col sm={12} style={{marginBottom: '20px'}}>
            <h3 className="f-20 f-w-800">
              {classRooms.room_name}
              <Link onClick={this.onClickInvite} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px'}}>
                <i className="fa fa-user"></i>Invite People
              </Link>
            </h3>
            {
              user.name && classRooms.room_name && 
              <JitsiMeetComponent 
                roomName={classRooms.room_name.replace(/\s/g, '')} 
                userName={user.name} 
                userEmail={user.email}
                userAvatar={user.avatar} />
            }
          </Col>

        </Row>

        {/* CHATING SEND FILE */}
        <h3 className="f-20 f-w-800">
          File Sharing
        </h3>
        <div className='box-chat'>
            
            { this.state.fileChat.map((item, i)=>{
              return (
                <div className='box-chat-send-left'>
                  <span className="m-b-5"><Link to='#'><b>{item.name}</b></Link></span><br/>
                  <p className="m-t-5">File :<a target='_blank' href={item.attachment}> {item.filenameattac}  <i className="fa fa-download" aria-hidden="true"></i></a></p>
                  <small><Moment format="MMMM Do YYYY, h:mm">{item.created_at}</Moment></small>
                </div>
              )
            })}
        </div>

        <div className='box-chat-send p-20'>
          <Row>
            <Col sm={10}>
              < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={this.onChangeInput}
              />
            </Col>
            <Col sm={2}>
              <Link onClick={this.sendFileNew.bind(this)} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px'}}>
                SEND
              </Link>
            </Col>

          </Row>
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
                            selectAllLabel="Pilih Semua"
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
                  inputProps={{placeholder:'Email Peserta'}}
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

			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
		);
	}
}