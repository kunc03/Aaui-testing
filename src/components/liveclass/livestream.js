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
import JitsiMeetComponent from './livejitsi';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import API, { API_JITSI, APPS_SERVER, API_SERVER, USER_ME, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';
import io from 'socket.io-client';
import { Editor } from '@tinymce/tinymce-react';
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

const axios = require('axios');

const tabs =[
  {title : 'File Sharing' },
  {title : 'MOM' }
]

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
    emailResponse: '',
    //multi select invite
    optionsInvite: [],
    valueInvite: [],
    nameFile : null,
    join: false,
    startMic: localStorage.getItem('startMic') === 'true' ? true : false,
    startCam: localStorage.getItem('startCam') === 'true' ? true : false,
    modalStart: true,
    tabIndex : 1,
    body: '',
    editMOM : false,
    jwt: '',
    listMOM: [],
    listSubtitle: [],
    startDate: new Date(),
    title:'',
    momid:'',
    modalExportMOM: false,
    selectSubtitle: '',
    subtitle: '',
  }
  
  tabAktivitas(a,b){
    this.setState({tabIndex: b+1});
  }

  toggleSwitchMic(checked) {
    localStorage.setItem('startMic', !this.state.startMic)
    this.setState({ startMic:!this.state.startMic });
  }
  toggleSwitchCam(checked) {
    localStorage.setItem('startCam', !this.state.startCam)
    this.setState({ startCam:!this.state.startCam });
  }

  handleEditorChange(body, editor) {
    this.setState({ body });
  }

  handleChange(emailInvite) {
    this.setState({emailInvite})
  }

  handleCloseInvite = e =>{
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
    this.onBotoomScroll();
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

        // let url = `${API_SERVER}token?room=${data.room_name}&name=${res.data.result.name}&moderator=${liveClass.data.result.moderator == Storage.get("user").data.user_id}&email=${res.data.result.email}&avatar=${res.data.result.avatar}&id=${res.data.result.user_id}`;
        // let url = `https://api.icademy.id/token?room=${data.room_name}&name=${res.data.result.name}&moderator=${liveClass.data.result.moderator == Storage.get("user").data.user_id}&email=${res.data.result.email}&avatar=${res.data.result.avatar}&id=${res.data.result.user_id}`;

        // let token = await axios.get(url);
        
        this.setState({
          user: res.data.result,
          classRooms: liveClass.data.result,
          // jwt: token.data.token
        });
      }
    }).then(res=>{
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

            API.get(`${API_SERVER}v1/liveclass/mom/${this.state.classId}`).then(res => {
              if(res.status === 200) {
                this.setState({
                  listMOM : res.data.result
                })
                API.get(`${API_SERVER}v1/transcripts/${this.state.classRooms.room_name}`).then(res => {
                  if(res.status === 200) {
                    let publishSubsSelect = []
                    res.data.result.map((item, i) => {
                      if (item.events.length > 0){
                        publishSubsSelect.push(item)
                      }
                    })
                    this.setState({
                      listSubtitle : publishSubsSelect
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
    let form = {
      user: Storage.get('user').data.user,
      email: this.state.emailInvite,
      room_name: this.state.classRooms.room_name,
      is_private: this.state.classRooms.is_private,
      is_scheduled: this.state.classRooms.is_scheduled,
      schedule_start: MomentTZ.tz(this.state.classRooms.schedule_start, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      schedule_end:  MomentTZ.tz(this.state.classRooms.schedule_end, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
      userInvite: this.state.valueInvite,
      message: 'https://'+window.location.hostname+'/redirect/liveclass-room/'+this.state.classId,
      messageNonStaff: 'https://'+window.location.hostname+'/meeting/'+this.state.classId
    }
    console.log('ALVIN KIRIM',form)

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

  onBotoomScroll = (e) => {
    //let scrollingElement = (document.scrollingElement || document.body);
    var element = document.getElementById('scrollin');
    element.scrollTop = element.scrollHeight - element.clientHeight;
    console.log(element, 'kebawah')
  }

  onChangeInput = (e) => {
      const name = e.target.name;
      console.log(e.target.files[0], 'attach');
      this.setState({nameFile : e.target.files[0].name});
      if(name === 'attachment') {
        console.log('ALVIN ATTACHMENT', e.target.files[0])
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
    //console.log('form data',FormData);
    API.post(`${API_SERVER}v1/liveclass/file`, form).then(res => {
      console.log(res, 'response');
      
      
      if(res.status === 200) {
        if(!res.data.error){
          this.onBotoomScroll();
          let splitTags;
          
          let datas = res.data.result;
          console.log(datas, 'datass')
          splitTags =  datas.attachment.split("/")[4];
          datas.filenameattac = splitTags; 
  
          //this.setState({ fileChat: [...this.state.fileChat, res.data.result], attachment : datas.attachment,  nameFile : null });
          socket.emit('send', {
            pengirim: this.state.user.user_id,
            room: this.state.classId,
            attachment: datas.attachment,
            filenameattac: datas.filenameattac,
            created_at: new Date()
          })
        }else{
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
    if (this.state.subtitle == ''){
      alert('Silahkan pilih subtitle')
    }
    else{
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

    if (this.state.momid){
      let form = {
        classId: this.state.classId,
        title: this.state.title,
        content: this.state.body.replace(/'/g, "\\'"),
        time: MomentTZ.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      }
      console.log('MOM DATA', form)
  
      API.put(`${API_SERVER}v1/liveclass/mom/${this.state.momid}`, form).then(res => {
        if(res.status === 200) {
          if(!res.data.error) {
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
    else{
      let form = {
        classId: this.state.classId,
        title: this.state.title,
        content: this.state.body.replace(/'/g, "\\'"),
        time: MomentTZ.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      }
      console.log('MOM DATA', form)
  
      API.post(`${API_SERVER}v1/liveclass/mom`, form).then(res => {
        if(res.status === 200) {
          if(!res.data.error) {
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
      if(res.status === 200) {
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
  
  onChangeTinyMce = e => {
    this.setState({ body: e.target.getContent().replace(/'/g, "\\'") })
  }

  componentDidUpdate() {
    this.onBotoomScroll();
  }

  joinRoom(){
    this.setState({join:true, modalStart:false});
  }

	render() {

    const { classRooms, user } = this.state;

    const dataMOM = this.state.listSubtitle;
    
		return(
			<div className="pcoded-main-container">
			<div className="pcoded-wrapper">
			<div className="pcoded-content" style={{paddingTop: 20}}>
			<div className="pcoded-inner-content">
			<div className="main-body">
			<div className="page-wrapper">
			
        <Row>

          <Col sm={12} style={{marginBottom: '20px'}}>
            <h3 className="f-20 f-w-800">
              {classRooms.room_name}
              <Link onClick={this.onClickInvite} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px'}}>
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
                // jwt={this.state.jwt}
              />
              :
              null
            }
          </Col>

        </Row>

        <div className="row">
            {tabs.map((tab, index)=>{
                return (
                        <div className="col-xl-6 p-b-20">
                            <Link onClick={this.tabAktivitas.bind(this, tab, index)}>
                                <div className={this.state.tabIndex === index+1 ? "kategori-aktif" : "kategori title-disabled"}>
                                    {tab.title}
                                </div>
                            </Link>
                        </div>
                    )
            })}

            {this.state.tabIndex === 1 ?  
              <div>{/* CHATING SEND FILE */}
                <h3 className="f-20 f-w-800">
                  File Sharing
                </h3>
                <div id="scrollin" className='box-chat '>
                    
                    { this.state.fileChat.map((item, i)=>{
                      return (
                        <div className='box-chat-send-left'>
                          <span className="m-b-5"><Link to='#'><b>{item.name} </b></Link></span><br/>
                          <p className="m-t-5">File :<a target='_blank' href={item.attachment}> {item.filenameattac}  <i className="fa fa-download" aria-hidden="true"></i></a></p>
                          <small><Moment format="MMMM Do YYYY, h:mm">{item.created_at}</Moment></small>
                        </div>
                      )
                    })}
                </div>

                <div className='box-chat-send p-20'>
                  <Row>
                    <Col sm={10}>
                      <div>
                        < i className="fa fa-paperclip m-t-10 p-r-5" aria-hidden="true"></i>
                        <input
                          type="file"
                          id="attachment"
                          name="attachment"
                          onChange={this.onChangeInput}
                        /><label id="attachment"> &nbsp;{this.state.nameFile === null ? 'Pilih File' : this.state.nameFile }</label>
                      </div>
                        
                    </Col>
                    <Col sm={2}>
                      <Link onClick={this.sendFileNew.bind(this)} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px'}}>
                        SEND
                      </Link>
                      {/* <button onClick={this.onBotoomScroll}>coba</button> */}
                    </Col>

                  </Row>
                </div>

               </div>
            :  
              <div className="col-sm-12">{/* CHATING SEND FILE */}
                <div id="scrollin" className="card" style={{padding:10}}>
                  <div className={this.state.editMOM ? 'hidden' : ''}>
                    <Link
                      to={"#"}
                      onClick={(a)=>{this.setState({editMOM : true})}}
                      className="btn btn-ideku col-2 float-right f-14"
                      style={{ padding: "7px 8px !important" }}>
                      Add New
                    </Link>
                  </div>
                  {!this.state.editMOM 
                  ?
                  <div className="card">
                    <div className="col-sm-12">
                      {this.state.listMOM.map((item, i) => (
                              <div className="komentar-item p-15" style={{marginBottom: '15px', borderBottom: "#dedede solid 1px"}}>
                                <h3 className="f-18 f-w-bold f-w-800">
                                    {item.title}
                                    <span className="f-12" style={{float: 'right', fontWeight: 'normal'}}>
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
                    <Link to='#' title="Kembali" onClick={this.backMOM}>
                        <h4 className="f-20 f-w-800 p-10">
                          <i className="fa fa-arrow-left"></i> Kembali
                        </h4>
                    </Link>
                    <h4 className="p-10">{classRooms.room_name}</h4>
                          <Form.Group controlId="formJudul" style={{padding:10}}>
                          <Form.Label className="f-w-bold">
                            Judul MOM
                          </Form.Label>
                          <div style={{width:'100%'}}>
                              <input
                                required
                                type="text"
                                name="title"
                                value={this.state.title}
                                className="form-control"
                                placeholder="isi judul MOM..."
                                onChange={this.onChangeInputMOM}
                              />
                            </div>
                        </Form.Group>
                          <Form.Group controlId="formJudul" style={{padding:10}}>
                          <Form.Label className="f-w-bold">
                            Waktu Meeting
                          </Form.Label>
                          <div style={{width:'100%'}}>
                          <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChangeDateFrom}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          </div>
                          </Form.Group>
                          <Form.Group controlId="formJudul" style={{padding:10}}>
                          <Form.Label className="f-w-bold">
                            Text Dari Subtitle
                          </Form.Label>
                          <div style={{width:'100%'}}>
                              <select
                                style={{textTransform: 'capitalize', width: '40%', display:'inline-block'}}
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
                              <Link
                                to={"#"}
                                onClick={this.addSubsToMOM}
                                className="btn btn-ideku col-2 f-14"
                                style={{ marginLeft: '10px', padding: "7px 8px !important" }}>
                                Tambahkan ke MOM
                              </Link>
                          </div>
                        </Form.Group>

                    <div className="chart-container" style={{ position: "relative", margin:20 }}>
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
                      <Link
                        to={"#"}
                        onClick={this.addMOM}
                        className="btn btn-ideku float-right col-2 f-14"
                        style={{ marginLeft: '10px', padding: "7px 8px !important" }}>
                        Simpan
                      </Link>
                    </div>
                  </div>
                }
               </div>
              </div>
            }
          
        </div>

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
                  Masukkan email yang ingin di invite.
                </Form.Text>
              </div>
            </div>
            
            <Form.Text style={{color:'red'}}>
              {this.state.emailResponse}
            </Form.Text>

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
                      <Col><h4><i className="fa fa-microphone"></i> Microphone</h4></Col>
                      <Col><ToggleSwitch onChange={this.toggleSwitchMic.bind(this)} checked={this.state.startMic} /></Col>
                    </Row>
                    <Row>
                      <Col><h4><i className="fa fa-camera"></i> Camera</h4></Col>
                      <Col><ToggleSwitch onChange={this.toggleSwitchCam.bind(this)} checked={this.state.startCam} /></Col>
                    </Row>
                      <Link onClick={this.joinRoom.bind(this)} to="#" className="btn btn-sm btn-ideku" style={{padding: '10px 17px', width:'100%', marginTop:20}}>
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
			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
		);
	}
}