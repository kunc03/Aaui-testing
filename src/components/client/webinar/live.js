import React, { Component } from 'react';
import { Card, InputGroup, FormControl,Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API, { API_SERVER, USER_ME, BBB_KEY, BBB_URL, API_SOCKET } from '../../../repository/api';
import { toast } from "react-toastify";
import Iframe from 'react-iframe';
import Storage from '../../../repository/storage';
import TableFiles from '../../files/_files';
import Moment from 'moment-timezone';
import Timer from 'react-compound-timer';
import io from 'socket.io-client';
const bbb = require('bigbluebutton-js')

const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class WebinarLive extends Component {

	state = {
    waktuPretest: 0,
    waktuPosttest: 0,
    pretest: [],
    posttest: [],
    pretestTerjawab: false,
    posttestTerjawab: false,
    jawabanPretest: [],
    jawabanPosttest: [],
    enablePretest: false,
    enablePosttest: false,
    webinarId:this.props.webinarId ? this.props.webinarId : this.props.match.params.webinarId,
    webinar:[],
    jawabKuesioner:[],
    pemenangDoorprize:[],
    modalDoorprize:false,
    pembucara:'',
    joinUrl:'',
    user: [],
    projectId: '',
    modalEnd: false,
    modalKuesioner: false,
    modalKuesionerPeserta: false,
    waitingKuesioner: false,
    startKuesioner: false,
    isWebinarStartDate: false,
    access_project_admin: false,
    pertanyaanQNA: '',
    qna: [],
    peserta: [],
    tamu: [],
    pertanyaan: [],
    jawaban: [],
    companyId: '',
    qnaPeserta: '',

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
  closeModalDoorprize = e => {
    this.setState({ modalDoorprize: false });
  }
  closeModalKuesioner = e => {
    this.setState({ modalKuesioner: false });
  }
  closeModalKuesionerPeserta = e => {
    this.setState({ modalKuesionerPeserta: false });
  }

  findArray(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }
  handleJawab = e => {
    const { value, name } = e.target;
      var array = this.state.jawaban;
      var index = this.findArray(array, 'questions_id', name);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({jawaban: array});
        this.state.jawaban.push({questions_id: name, options_id: value})
      }
      else{
        this.state.jawaban.push({questions_id: name, options_id: value})
      }
  }
  handleJawabPretest = e => {
    const { value, name } = e.target;
      var array = this.state.jawabanPretest;
      var index = this.findArray(array, 'questions_id', name);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({jawabanPretest: array});
        this.state.jawabanPretest.push({questions_id: name, options_id: value})
      }
      else{
        this.state.jawabanPretest.push({questions_id: name, options_id: value})
      }
  }
  handleJawabPosttest = e => {
    const { value, name } = e.target;
      var array = this.state.jawabanPosttest;
      var index = this.findArray(array, 'questions_id', name);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({jawabanPosttest: array});
        this.state.jawabanPosttest.push({questions_id: name, options_id: value})
      }
      else{
        this.state.jawabanPosttest.push({questions_id: name, options_id: value})
      }
  }
  kirimJawabanPosttest(){
    if (this.state.jawabanPosttest.length === this.state.posttest.length){
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        webinar_test: this.state.jawabanPosttest
      }
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if(res.data.error) 
          toast.error('Gagal mengirim jawaban post test webinar')
        else
          toast.success('Mengirim jawaban post test webinar')
          this.fetchWebinar()
          this.fetchPostTest()
      })
    }
    else{
      toast.warning('Wajib menjawab semua pertanyaan')
    }
  }
  kirimJawabanPretest(){
    if (this.state.jawabanPretest.length === this.state.pretest.length){
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        webinar_test: this.state.jawabanPretest
      }
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if(res.data.error) 
          toast.error('Gagal mengirim jawaban pre test webinar')
        else
          toast.success('Mengirim jawaban pre test webinar')
          this.fetchPreTest()
      })
    }
    else{
      toast.warning('Wajib menjawab semua pertanyaan')
    }
  }
  waktuPretestHabis(){
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        webinar_test: this.state.jawabanPretest
      }
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if(res.data.error) 
          toast.error('Gagal mengirim jawaban pre test webinar')
        else
          toast.warning('Waktu habis')
          toast.success('Mengirim jawaban pre test webinar')
          this.fetchPreTest()
      })
  }
  waktuPosttestHabis(){
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        webinar_test: this.state.jawabanPosttest
      }
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if(res.data.error) 
          toast.error('Gagal mengirim jawaban post test webinar')
        else
        toast.warning('Waktu habis')
          toast.success('Mengirim jawaban post test webinar')
          this.fetchPostTest()
      })
  }
  kirimJawabanKuesioner(){
    if (this.state.jawaban.length === this.state.pertanyaan.length){
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        kuesioner: this.state.jawaban
      }
      API.post(`${API_SERVER}v2/kuesioner/input`, form).then(res => {
        if(res.data.error) 
          toast.error('Gagal mengirim jawaban kuesioner webinar')
        else
          socket.emit('send', {
            socketAction: 'jawabKuesioner',
            name: this.state.user.name
          })
          toast.success('Mengirim jawaban kuesioner webinar')
          this.closeModalKuesionerPeserta()
          this.setState({startKuesioner: false})
      })
    }
    else{
      toast.warning('Wajib menjawab semua pertanyaan')
    }
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
    if (this.state.pertanyaanQNA.length < 10){
      toast.warning('Pertanyaan minimal 10 karakter')
    }
    else{
      let form = {
        webinar_id: this.state.webinarId,
        jenis_peserta: this.state.user.type ? 'tamu' : 'peserta',
        peserta_id: this.state.user.user_id,
        description: this.state.pertanyaanQNA
      }
      API.post(`${API_SERVER}v2/webinar/qna`, form).then(res => {
        if(res.data.error) 
          toast.error('Error mengirim pertanyaan')
        else
          toast.success('Mengirim pertanyaan')
          this.setState({pertanyaanQNA:''})
          socket.emit('send', {
            name: res.data.result.name,
            webinar_id: res.data.result.webinar_id,
            email: res.data.result.email,
            description: res.data.result.description,
            timestamp: new Date()
          })
          this.fetchQNAByUser()
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

  fetchQNAByUser(){
    API.get(`${API_SERVER}v2/webinar/qna-peserta/${this.state.webinarId}/${this.state.user.user_id}`).then(res => {
      if (res.data.error)
          toast.warning("Error fetch API")
      else
        this.setState({qnaPeserta: res.data.result})
    })
  }

  fetchKuesioner(){
    API.get(`${API_SERVER}v2/kuesioner-peserta/${this.state.webinarId}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({pertanyaan: res.data.result})
        }
      }
    })
  }
  fetchWebinar(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if(res.status === 200) {
        this.setState({
          user: res.data.result,
        })
        this.fetchPreTest()
        this.fetchPostTest()
        API.get(`${API_SERVER}v2/webinar/one/${this.state.webinarId}`).then(res => {
            if (res.data.error)
                toast.warning("Error fetch API")
            else
            this.setState({
              webinar: res.data.result,
              companyId: res.data.result.company_id,
              pembicara: res.data.result.pembicara[0].name,
              moderatorId: res.data.result.moderator[0].user_id,
              sekretarisId: res.data.result.sekretaris[0].user_id,
              pembicaraId: res.data.result.pembicara[0].user_id,
              projectId: res.data.result.project_id,
              status: res.data.result.status,
              tanggal: Moment.tz(res.data.result.tanggal, 'Asia/Jakarta').format("DD-MM-YYYY"),
              jamMulai: res.data.result.jam_mulai,
              jamSelesai: res.data.result.jam_selesai,
              peserta: res.data.result.peserta,
              tamu: res.data.result.tamu
            })
            this.fetchQNAByUser()
            this.checkProjectAccess()
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
                                  this.state.webinar.moderator[0].user_id == Storage.get("user").data.user_id ? 'moderator' : 'peserta',
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
                        this.state.webinar.moderator[0].user_id == Storage.get("user").data.user_id ? 'moderator' : 'peserta',
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
        this.fetchPreTest()
        this.fetchPostTest()
        API.get(`${API_SERVER}v2/webinar/tamu/one/${this.props.webinarId}`).then(res => {
            if (res.data.error)
                toast.warning("Error fetch API")
            else
            this.setState({
              webinar: res.data.result,
              companyId: res.data.result.company_id,
              pembicara: res.data.result.pembicara[0].name,
              moderatorId: res.data.result.moderator[0].user_id,
              sekretarisId: res.data.result.sekretaris[0].user_id,
              pembicaraId: res.data.result.pembicara[0].user_id,
              projectId: res.data.result.project_id,
              status: res.data.result.status,
              tanggal: Moment.tz(res.data.result.tanggal, 'Asia/Jakarta').format("DD-MM-YYYY"),
              jamMulai: res.data.result.jam_mulai,
              jamSelesai: res.data.result.jam_selesai,
              peserta: res.data.result.peserta,
              tamu: res.data.result.tamu
            })
            this.fetchQNAByUser()
            this.checkProjectAccess()
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
  acakDoorprize(){
    const random = Math.floor(Math.random() * this.state.jawabKuesioner.length);
    socket.emit('send', {
      socketAction: 'pemenangDoorprize',
      name: this.state.jawabKuesioner[random]
    })
  }
  fetchPreTest(){
    API.get(`${API_SERVER}v2/webinar-test-peserta/${this.state.webinarId}/0/${this.state.user.user_id}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({pretestTerjawab: res.data.terjawab, enablePretest: res.data.enable, pretest:res.data.result, waktuPretest: res.data.waktu})
        }
      }
    })
  }
  fetchPostTest(){
    API.get(`${API_SERVER}v2/webinar-test-peserta/${this.state.webinarId}/1/${this.state.user.user_id}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({posttestTerjawab: res.data.terjawab, enablePosttest: res.data.enable, posttest:res.data.result, waktuPosttest: res.data.waktu})
        }
      }
    })
  }
  componentDidMount(){
    socket.on("broadcast", data => {
      if(data.webinar_id == this.state.webinarId) {
        if (this.props.webinarId && this.props.voucher){
          this.fetchWebinarPublic()
        }
        else{
          this.fetchWebinar()
        }
        this.setState({ qna: [data, ...this.state.qna] })
      }
      if(data.socketAction == 'pemenangDoorprize') {
        this.state.pemenangDoorprize.push(data.name)
        this.setState({modalDoorprize: true})
        this.closeModalKuesioner()
      }
      if(data.socketAction == 'sendKuesioner') {
        this.setState({startKuesioner: true, modalKuesionerPeserta: true})
        this.fetchKuesioner()
      }
      if(data.socketAction == 'jawabKuesioner') {
        this.state.jawabKuesioner.push(data.name)
        this.forceUpdate()
      }
      if(data.socketAction == 'fetchPostTest') {
        if (this.props.webinarId && this.props.voucher){
          this.fetchWebinarPublic()
        }
        else{
          this.fetchWebinar()
        }
        this.fetchPostTest()
      }
    });
    if (this.props.webinarId && this.props.voucher){
      this.fetchWebinarPublic()
    }
    else{
      this.fetchWebinar()
    }
    this.fetchQNA()
  }
  checkProjectAccess(){
    if (this.props.voucher){
      this.setState({
        access_project_admin: false,
      })
    }
    else{
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
            socket.emit('send', {
              socketAction: 'fetchPostTest',
            })
        }
    })
  }

  sendKuesioner(){
    socket.emit('send', {
      socketAction: 'sendKuesioner',
    })
    toast.success('Kuesioner dikirim ke peserta');
    this.setState({waitingKuesioner: true})
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
                  {
                      user.user_id == this.state.sekretarisId ?
                      <button onClick={()=> this.setState({modalKuesioner: true})} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Kuesioner
                      </button>
                      :
                      null
                  }
                  {
                      (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1) && this.state.startKuesioner ?
                      <button onClick={()=> this.setState({modalKuesionerPeserta: true})} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Kuesioner
                      </button>
                      :
                      null
                  }
                  <p className="m-b-0">
                    { /* <span className="f-w-600 f-16">Lihat Semua</span> */ }
                  </p>
                </div>
              </div>
              {
                this.state.enablePretest && this.state.pretestTerjawab === false && (this.state.user.user_id !== this.state.pembicaraId || this.state.user.user_id !== this.state.moderatorId || this.state.user.user_id !== this.state.sekretarisId) ?
                <div>
                  <h4>Silahkan jawab pre test untuk lanjut mengikuti webinar</h4>
                  <div className="fc-blue" style={{position:'absolute', right:20, top:20, fontSize:'18px', fontWeight:'bold'}}>
                  <Timer
                      initialTime={this.state.waktuPretest*60000}
                      direction="backward"
                      checkpoints={[
                        {
                          time: 0,
                          callback: this.waktuPretestHabis.bind(this),
                        }
                      ]}
                  >
                      {() => (
                          <React.Fragment>
                              Batas Waktu <Timer.Hours />:
                              <Timer.Minutes />:
                              <Timer.Seconds />
                          </React.Fragment>
                      )}
                  </Timer>
                  </div>
                  {
                  this.state.pretest.map((item, index) => (
                    <div className="mb-3">
                      <p className="f-w-900" style={{lineHeight:'18px'}}>{index+1+'. '+item.tanya}</p>
                      {item.a && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawabPretest} /> <label for='a'> {item.a[1]}</label></div>}
                      {item.b && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawabPretest} /> <label for='b'> {item.b[1]}</label></div>}
                      {item.c && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawabPretest} /> <label for='c'> {item.c[1]}</label></div>}
                      {item.d && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawabPretest} /> <label for='d'> {item.d[1]}</label></div>}
                      {item.e && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawabPretest} /> <label for='e'> {item.e[1]}</label></div>}
                    </div>
                  ))
                  }
                  <button
                    className="btn btn-icademy-primary"
                    onClick={this.kirimJawabanPretest.bind(this)}
                  >
                    <i className="fa fa-paper-plane"></i>
                    Kirim Jawaban Pre Test
                  </button>
                </div>
                :
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
                      {
                        this.state.status !== 3 &&
                        <div className="dekripsi" style={{marginTop: '20px'}}>
                          <h4>Deskripsi</h4>
                          <div dangerouslySetInnerHTML={{ __html: this.state.webinar.isi }} />
                        </div>
                      }
                {
                this.state.status == 3 && this.state.enablePosttest && this.state.posttestTerjawab === false && (this.state.user.user_id !== this.state.pembicaraId || this.state.user.user_id !== this.state.moderatorId || this.state.user.user_id !== this.state.sekretarisId) &&
                <div>
                  <h4>Silahkan jawab post test</h4>
                  <div className="fc-blue" style={{position:'absolute', right:20, top:20, fontSize:'18px', fontWeight:'bold'}}>
                  <Timer
                      initialTime={this.state.waktuPosttest*60000}
                      direction="backward"
                      checkpoints={[
                        {
                          time: 0,
                          callback: this.waktuPosttestHabis.bind(this),
                        }
                      ]}
                  >
                      {() => (
                          <React.Fragment>
                              Batas Waktu <Timer.Hours />:
                              <Timer.Minutes />:
                              <Timer.Seconds />
                          </React.Fragment>
                      )}
                  </Timer>
                  </div>
                  {
                  this.state.posttest.map((item, index) => (
                    <div className="mb-3">
                      <p className="f-w-900" style={{lineHeight:'18px'}}>{index+1+'. '+item.tanya}</p>
                      {item.a && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawabPosttest} /> <label for='a'> {item.a[1]}</label></div>}
                      {item.b && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawabPosttest} /> <label for='b'> {item.b[1]}</label></div>}
                      {item.c && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawabPosttest} /> <label for='c'> {item.c[1]}</label></div>}
                      {item.d && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawabPosttest} /> <label for='d'> {item.d[1]}</label></div>}
                      {item.e && <div style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawabPosttest} /> <label for='e'> {item.e[1]}</label></div>}
                    </div>
                  ))
                  }
                  <button
                    className="btn btn-icademy-primary"
                    onClick={this.kirimJawabanPosttest.bind(this)}
                  >
                    <i className="fa fa-paper-plane"></i>
                    Kirim Jawaban Pre Test
                  </button>
                </div>
                }
                    </div>
  
                  </div>
                  
                </div>
              }
              
            </Card.Body>
          </Card>
        </div>
        {
          (this.state.projectId !== 0 && this.state.status===2) &&
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
                    <TableFiles voucherTamu={this.state.user.user_id} guest={this.props.voucher ? true : false} access_project_admin={this.state.access_project_admin} webinarId={this.state.webinarId} projectId={this.state.projectId} companyId={this.state.companyId}/>
                </div>
              </Card.Body>
            </Card>
          </div>
        }
        {
          (this.state.user.user_id == this.state.pembicaraId || this.state.user.user_id == this.state.moderatorId || this.state.user.user_id == this.state.sekretarisId) && this.state.status===2 ?
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
                  {
                    this.state.qna.length ?
                    <Pertanyaan items={this.state.qna} />
                    :
                    <p>Tidak ada pertanyaan</p>
                  }
                </div>
              </Card.Body>
            </Card>
          </div>
          :
          (this.state.user.user_id !== this.state.pembicaraId || this.state.user.user_id !== this.state.moderatorId || this.state.user.user_id !== this.state.sekretarisId) && this.state.status===2 ?
          <div className="col-sm-6">
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      Pertanyaan Anda
                    </h3>
                  </div>
                </div>
                <div className="wrap" style={{marginTop: '10px', maxHeight:400, overflowY:'scroll', overflowX:'hidden', paddingRight:10}}>
                  {
                    this.state.qnaPeserta.length ?
                    <Pertanyaan items={this.state.qnaPeserta} />
                    :
                    <p>Tidak ada pertanyaan</p>
                  }
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      Kirim Pertanyaan
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
                        <textarea placeholder="Saya kurang jelas di point yang..." rows="4" className="form-control" value={this.state.pertanyaanQNA} onChange={e => this.setState({ pertanyaanQNA: e.target.value })} />
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
          </div>
          :
          null
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
        <Modal
          show={this.state.modalKuesioner}
          onHide={this.closeModalKuesioner}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Kuesioner
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.waitingKuesioner &&
              <div>
                <h4>Menunggu...</h4>
                <div>Jumlah peserta telah menjawab kuesioner <b>{this.state.jawabKuesioner.length}</b></div>
              </div>
            }
            {
              this.state.waitingKuesioner == false &&
              <div>Kirim kuesioner ke semua peserta sekarang ?</div>
            }
          </Modal.Body>
          <Modal.Footer>
            {
              this.state.waitingKuesioner &&
              <button
                className="btn btn-icademy-warning"
                onClick={this.acakDoorprize.bind(this)}
              >
                <i className="fa fa-gift"></i>
                Acak Doorprize
              </button>
            }
            {
              this.state.waitingKuesioner == false &&
              <button
                className="btn btn-icademy-primary"
                onClick={this.sendKuesioner.bind(this)}
              >
                <i className="fa fa-paper-plane"></i>
                Kirim Kuesioner
              </button>
            }
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalKuesionerPeserta && (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1)}
          onHide={this.closeModalKuesionerPeserta}
          dialogClassName="modal-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Jawab Kuesioner
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.pertanyaan.map((item) => (
                <div className="mb-3">
                  <p className="f-w-900 fc-blue" style={{lineHeight:'18px'}}>{item.tanya}</p>
                  {item.a && <span style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawab} /> <label for='a'> {item.a[1]}</label></span>}
                  {item.b && <span style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawab} /> <label for='b'> {item.b[1]}</label></span>}
                  {item.c && <span style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawab} /> <label for='c'> {item.c[1]}</label></span>}
                  {item.d && <span style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawab} /> <label for='d'> {item.d[1]}</label></span>}
                  {item.e && <span style={{margin:'0px 10px'}}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawab} /> <label for='e'> {item.e[1]}</label></span>}
                </div>
              ))
            }
          </Modal.Body>
          <Modal.Footer>
              <button
                className="btn btn-icademy-primary"
                onClick={this.kirimJawabanKuesioner.bind(this)}
              >
                <i className="fa fa-paper-plane"></i>
                Kirim Jawaban Kuesioner
              </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalDoorprize}
          onHide={this.closeModalDoorprize}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Pemenang Doorprize
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Selamat kepada : <br />
            {
              this.state.pemenangDoorprize.length && this.state.pemenangDoorprize.map((item) => (
                <span>
                  <h3>{item}</h3>
                </span>
              ))
            }
          </Modal.Body>
        </Modal>
      </div>
		);
	}
}
