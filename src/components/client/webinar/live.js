import React, { Component } from 'react';
import { Card, InputGroup, FormControl,Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API, { API_SERVER, USER_ME, BBB_KEY, BBB_URL, API_SOCKET } from '../../../repository/api';
import { toast } from "react-toastify";
import Iframe from 'react-iframe';
import Storage from '../../../repository/storage';
import TableFiles from '../../Home_new/detail_project/files';
import Moment from 'moment-timezone';
import io from 'socket.io-client';
const bbb = require('bigbluebutton-js')

const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class WebinarLive extends Component {

	state = {
    webinarId:this.props.webinarId ? this.props.webinarId : this.props.match.params.webinarId,
    webinar:[],
    pembucara:'',
    joinUrl:'',
    user: [],
    projectId: '',
    modalEnd: false,
    isWebinarStartDate: false,
    access_project_admin: false,
    pertanyaan: '',
    qna: [],

    lampirans: [
      {id: 1, nama: 'mom-meeting.pdf', url: 'https://google.com'},
      {id: 2, nama: 'file-presentasi.pdf', url: 'https://google.com'},
      {id: 3, nama: 'formulir-pendaftaran.docx', url: 'https://google.com'},
    ],
    pertanyaans: [
      {id: 1, dari: 'John MC', pertanyaan: 'Berapa hasil dari 10x10 berapa hayooo?', datetime: '02 Sep 2020 12:10'},
      {id: 2, dari: 'Arrazaqul', pertanyaan: 'Kalau semisal hasil dari 100 dibagi 10 berapa hayooo?', datetime: '02 Sep 2020 12:12'},
      {id: 3, dari: 'Ahmad Syujan', pertanyaan: 'Gan, Saya yang mau tanya lebih serius. Kalau semisal hasil dari 100 dibagi 10 berapa hayooo?', datetime: '02 Sep 2020 12:12'},
    ]
  }
  closeModalEnd = e => {
    this.setState({ modalEnd: false });
  }

  postLog(webinar_id, peserta_id, type, action){
    API.post(`${API_SERVER}v2/webinar/log/${webinar_id}/${peserta_id}/${type}/${action}`).then(res => {
      if(res.data.error) 
        console.log('Log webinar error')
      else
      console.log('Log webinar posted')
    })
  }
  sendQNA(){
    if (this.state.pertanyaan.length < 10){
      toast.warning('Pertanyaan minimal 10 karakter')
    }
    else{
      let form = {
        webinar_id: this.state.webinarId,
        jenis_peserta: this.state.user.type ? 'tamu' : 'peserta',
        peserta_id: this.state.user.user_id,
        description: this.state.pertanyaan
      }
      API.post(`${API_SERVER}v2/webinar/qna`, form).then(res => {
        if(res.data.error) 
          toast.error('Error mengirim pertanyaan')
        else
          toast.success('Mengirim pertanyaan')
          this.setState({pertanyaan:''})
          socket.emit('send', {
            name: res.data.result.name,
            webinar_id: res.data.result.webinar_id,
            email: res.data.result.email,
            description: res.data.result.description,
            timestamp: new Date()
          })
      })
    }
  }
  fetchQNA(){
    API.get(`${API_SERVER}v2/webinar/qna/${this.state.webinarId}`).then(res => {
      if (res.data.error)
          toast.warning("Error fetch API")
      else
        this.setState({qna: res.data.result})
    })
  }
  fetchWebinar(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if(res.status === 200) {
        this.setState({
          user: res.data.result,
        })
        API.get(`${API_SERVER}v2/webinar/one/${this.state.webinarId}`).then(res => {
            if (res.data.error)
                toast.warning("Error fetch API")
            else
            this.setState({
              webinar: res.data.result,
              pembicara: res.data.result.pembicara.name,
              moderatorId: res.data.result.moderator.user_id,
              sekretarisId: res.data.result.sekretaris.user_id,
              pembicaraId: res.data.result.pembicara.user_id,
              projectId: res.data.result.project_id,
              status: res.data.result.status,
              tanggal: Moment.tz(res.data.result.tanggal, 'Asia/Jakarta').format("DD-MM-YYYY"),
              jamMulai: res.data.result.jam_mulai,
              jamSelesai: res.data.result.jam_selesai
            })
            let tgl = new Date(res.data.result.tanggal)
            let tglJam = new Date(tgl.setHours(this.state.jamMulai.slice(0,2)))
            let tglJamMenit = new Date(tglJam.setMinutes(this.state.jamMulai.slice(3,5)))

            let tglJamSelesai = new Date(tgl.setHours(this.state.jamSelesai.slice(0,2)))
            let tglJamMenitSelesai = new Date(tglJamSelesai.setMinutes(this.state.jamSelesai.slice(3,5)))
            
            let isWebinarStartDate = new Date() >= tglJamMenit && new Date() <= tglJamMenitSelesai ? true : false;
            this.setState({isWebinarStartDate: isWebinarStartDate})

            if (this.state.status == 2 || (isWebinarStartDate && this.state.status != 3)){
              this.updateStatus(this.state.webinar.id, 2)
              if (this.state.webinar.status == 1){
                this.fetchWebinar()
              }
              // BBB JOIN START
              let api = bbb.api(BBB_URL, BBB_KEY)
              let http = bbb.http
      
              // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
              let meetingInfo = api.monitoring.getMeetingInfo(this.state.webinar.id)
              http(meetingInfo).then((result) => {
                  if (result.returncode == 'FAILED' && result.messageKey == 'notFound'){
                      // Jika belum ada, create room nya.
                      let meetingCreateUrl = api.administration.create(this.state.webinar.judul, this.state.webinar.id, {
                          attendeePW: 'peserta',
                          moderatorPW: 'moderator',
                          allowModsToUnmuteUsers: true,
                          record: true
                      })
                      http(meetingCreateUrl).then((result) => {
                          if (result.returncode='SUCCESS'){
                              // Setelah create, join
                              let joinUrl = api.administration.join(
                                  this.state.user.name,
                                  this.state.webinar.id,
                                  this.state.webinar.moderator.user_id == Storage.get("user").data.user_id ? 'moderator' : 'peserta',
                                  {userID: this.state.user.user_id}
                              )
                              this.setState({joinUrl: joinUrl})
                              this.postLog(this.state.webinar.id, this.state.user.user_id, 'peserta', 'join')
                          }
                          else{
                          console.log('GAGAL', result)
                          }
                      })
                  }
                  else{
                      // Jika sudah ada, join
                      let joinUrl = api.administration.join(
                        this.state.user.name,
                        this.state.webinar.id,
                        this.state.webinar.moderator.user_id == Storage.get("user").data.user_id ? 'moderator' : 'peserta',
                        {userID: this.state.user.user_id}
                      )
                      this.setState({joinUrl: joinUrl})
                      this.postLog(this.state.webinar.id, this.state.user.user_id, 'peserta', 'join')
                  }
              })
              // BBB JOIN END
            }
        })
      }
    })
  }
  fetchWebinarPublic(){
    API.get(`${API_SERVER}v2/webinar/tamu/${this.props.voucher}`).then(async res => {
      if(res.status === 200) {
        this.setState({
          user: res.data.result,
        })
        API.get(`${API_SERVER}v2/webinar/tamu/one/${this.props.webinarId}`).then(res => {
            if (res.data.error)
                toast.warning("Error fetch API")
            else
            this.setState({
              webinar: res.data.result,
              pembicara: res.data.result.pembicara.name,
              moderatorId: res.data.result.moderator.user_id,
              sekretarisId: res.data.result.sekretaris.user_id,
              pembicaraId: res.data.result.pembicara.user_id,
              projectId: res.data.result.project_id,
              status: res.data.result.status,
              tanggal: Moment.tz(res.data.result.tanggal, 'Asia/Jakarta').format("DD-MM-YYYY"),
              jamMulai: res.data.result.jam_mulai,
              jamSelesai: res.data.result.jam_selesai
            })
            let tgl = new Date(res.data.result.tanggal)
            let tglJam = new Date(tgl.setHours(this.state.jamMulai.slice(0,2)))
            let tglJamMenit = new Date(tglJam.setMinutes(this.state.jamMulai.slice(3,5)))

            let tglJamSelesai = new Date(tgl.setHours(this.state.jamSelesai.slice(0,2)))
            let tglJamMenitSelesai = new Date(tglJamSelesai.setMinutes(this.state.jamSelesai.slice(3,5)))
            
            let isWebinarStartDate = new Date() >= tglJamMenit && new Date() <= tglJamMenitSelesai ? true : false;
            this.setState({isWebinarStartDate: isWebinarStartDate})

            if (this.state.status == 2 || (isWebinarStartDate && this.state.status != 3)){
              this.updateStatus(this.state.webinar.id, 2)
              if (this.state.webinar.status == 1){
                this.fetchWebinarPublic()
              }
              // BBB JOIN START
              let api = bbb.api(BBB_URL, BBB_KEY)
              let http = bbb.http
      
              // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
              let meetingInfo = api.monitoring.getMeetingInfo(this.state.webinar.id)
              http(meetingInfo).then((result) => {
                  if (result.returncode == 'FAILED' && result.messageKey == 'notFound'){
                      // Jika belum ada, create room nya.
                      let meetingCreateUrl = api.administration.create(this.state.webinar.judul, this.state.webinar.id, {
                          attendeePW: 'peserta',
                          moderatorPW: 'moderator',
                          allowModsToUnmuteUsers: true,
                          record: true
                      })
                      http(meetingCreateUrl).then((result) => {
                          if (result.returncode='SUCCESS'){
                              // Setelah create, join
                              let joinUrl = api.administration.join(
                                  this.state.user.name,
                                  this.state.webinar.id,
                                  this.state.webinar.moderator.user_id == Storage.get("user").data.user_id ? 'moderator' : 'peserta',
                                  {userID: this.state.user.user_id}
                              )
                              this.setState({joinUrl: joinUrl})
                              this.postLog(this.state.webinar.id, this.state.user.user_id, 'tamu', 'join')
                          }
                          else{
                          console.log('GAGAL', result)
                          }
                      })
                  }
                  else{
                      // Jika sudah ada, join
                      let joinUrl = api.administration.join(
                        this.state.user.name,
                        this.state.webinar.id,
                        this.state.webinar.moderator.user_id == Storage.get("user").data.user_id ? 'moderator' : 'peserta',
                        {userID: this.state.user.user_id}
                      )
                      this.setState({joinUrl: joinUrl})
                      this.postLog(this.state.webinar.id, this.state.user.user_id, 'tamu', 'join')
                  }
              })
              // BBB JOIN END
            }
        })
      }
    })
  }
  componentDidMount(){
    socket.on("broadcast", data => {
      console.log(this.state.fileChat, 'socket on')
      if(data.webinar_id == this.state.webinarId) {
        if (this.props.webinarId && this.props.voucher){
          this.fetchWebinarPublic()
        }
        else{
          this.fetchWebinar()
        }
        this.setState({ qna: [data, ...this.state.qna] })
      }
    });
    if (this.props.webinarId && this.props.voucher){
      this.fetchWebinarPublic()
    }
    else{
      this.fetchWebinar()
    }
    this.fetchQNA()
    this.checkProjectAccess()
  }
  checkProjectAccess(){
    API.get(`${API_SERVER}v1/project-access/${this.state.projectId}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        let levelUser = Storage.get('user').data.level;
        if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client' ){
          this.setState({
            access_project_admin: true,
          })
        }
        else{
          this.setState({
            access_project_admin: false,
          })
        }
      }
    })
  }
  updateStatus (id, status) {
    let form = {
      id: id,
      status: status,
    };
    API.put(`${API_SERVER}v2/webinar/status`, form).then(async res => {
      if(res.data.error) 
        toast.warning("Error fetch API")
      else
        status == 3 &&
        toast.success('Webinar selesai')
    })
  }
  endMeeting(){
    // BBB END
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    let endMeeting = api.administration.end(this.state.webinar.id, 'moderator')
    http(endMeeting).then((result) => {
        if (result.returncode == 'SUCCESS'){
            this.closeModalEnd()
            toast.success('Mengakhiri webinar untuk semua peserta.')
            this.updateStatus(this.state.webinar.id, 3)
        }
    })
  }
  
	render() {
    const { webinar, user } = this.state;
    let levelUser = Storage.get('user').data.level;
    // let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    let projectId = this.state.projectId;
    const Lampiran = ({items}) => (
      <div className="row">
        {
          items.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.id}>
              <div className='border-disabled'>
                <div className="box-lampiran">
                  <div className="title-head f-w-900 f-16 fc-skyblue">
                    {item.nama} 
                    <Link to={item.url} className="float-right link-lampiran"><i className="fa fa-download"></i></Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );

    const Pertanyaan = ({items}) => (
      <div className="row">
        {
          items.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.id}>
              <div className='border-disabled'>
                <div className="box-lampiran">
                  <div className="">
                    <span style={{fontWeight: 'bold'}}>{item.name}</span>
                    <span className="float-right">{item.jenis_peserta == 'peserta' ? 'Pengguna' : 'Tamu'}</span> 
                    <br/>
                    <p style={{marginBottom: '1px'}}>
                    {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );

		return (
			<div className="row">                     
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                  	{/* <Link to={`/detail-project/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
                  		border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                  	}}>
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link> */}
                    {this.state.webinar.judul}
                    <p>Pembicara : {this.state.pembicara}</p>
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  {
                      user.user_id == this.state.moderatorId && this.state.status == 2 ?
                      <button onClick={()=> this.setState({modalEnd: true})} className="float-right btn btn-icademy-primary btn-icademy-red">
                        <i className="fa fa-stop-circle"></i>Akhiri Webinar
                      </button>
                      :
                      null
                  }
                  <p className="m-b-0">
                    { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <div className="row">
                  <div className="col-sm-12">
                    {
                      this.state.status == 2 || (this.state.isWebinarStartDate && this.state.status == 2) ?
                      <Iframe url={this.state.joinUrl}
                        width="100%"
                        height="600px"
                        display="initial"
                        frameBorder="0"
                        allow="fullscreen *;geolocation *; microphone *; camera *"
                        position="relative"/>
                      :
                      this.state.status == 3 ?
                      <h3>Webinar telah berakhir</h3>
                      :
                    <h3>Webinar berlangsung pada tanggal {this.state.tanggal} jam {this.state.jamMulai} sampai {this.state.jamSelesai}</h3>
                    }

                    <div className="dekripsi" style={{marginTop: '20px'}}>
                      <h4>Deskripsi</h4>
                      <div dangerouslySetInnerHTML={{ __html: this.state.webinar.isi }} />
                    </div>
                  </div>

                </div>
                
              </div>
            </Card.Body>
          </Card>
        </div>
        {
          this.state.projectId != 0 &&
          <div className="col-sm-6">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      Dokumen
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                    </p>
                  </div>
                </div>
                <div className="wrap" style={{marginTop: '10px', maxHeight:400, overflowY:'scroll'}}>
                  {
                    this.state.projectId && Storage.get('user').data.user_id ? <TableFiles access_project_admin={this.state.access_project_admin} projectId={this.state.projectId}/>
                  :null}
                </div>
              </Card.Body>
            </Card>
          </div>
        }
        {
          (this.state.user.user_id == this.state.pembicaraId || this.state.user.user_id == this.state.moderatorId || this.state.user.user_id == this.state.sekretarisId) ?
          <div className="col-sm-6">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      Pertanyaan
                    </h3>
                  </div>
                </div>
                <div className="wrap" style={{marginTop: '10px', maxHeight:400, overflowY:'scroll', overflowX:'hidden', paddingRight:10}}>
                  <Pertanyaan items={this.state.qna} />
                </div>
              </Card.Body>
            </Card>
          </div>
          :
          <div className="col-sm-6">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      Pertanyaan
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                    </p>
                  </div>
                </div>
                <div style={{marginTop: '10px'}}>
                  {/* <Pertanyaan items={this.state.pertanyaans} /> */}
                      <div className="form-group">
                        <textarea placeholder="Saya kurang jelas di point yang..." rows="4" className="form-control" value={this.state.pertanyaan} onChange={e => this.setState({ pertanyaan: e.target.value })} />
                      </div>
                        <button
                          className="btn btn-icademy-primary float-right"
                          onClick={this.sendQNA.bind(this)}
                        >
                          <i className="fa fa-paper-plane"></i>
                          Kirim
                        </button>
                </div>
              </Card.Body>
            </Card>
          </div>
        }
        <Modal
          show={this.state.modalEnd}
          onHide={this.closeModalEnd}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Konfirmasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Anda yakin akan mengakhiri webinar untuk semua peserta ?</div>
          </Modal.Body>
          <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalEnd.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary btn-icademy-red"
                        onClick={this.endMeeting.bind(this)}
                      >
                        <i className="fa fa-trash"></i>
                        Akhiri Webinar
                      </button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}
