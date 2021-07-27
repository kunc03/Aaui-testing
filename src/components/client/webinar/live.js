import React, { Component } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API, { APPS_SERVER, API_SERVER, USER_ME, BBB_KEY, BBB_URL, API_SOCKET, ZOOM_URL } from '../../../repository/api';
import { toast } from "react-toastify";
import Iframe from 'react-iframe';
import Storage from '../../../repository/storage';
import TableFiles from '../../files/_files';
import moment from 'moment-timezone';
import Timer from 'react-compound-timer';
import io from 'socket.io-client';
import { isMobile } from 'react-device-detect';
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
    resultPretest: [],
    resultPosttest: [],
    modalResultPretest: false,
    modalResultPosttest: false,
    pretestTerjawab: false,
    posttestTerjawab: false,
    jawabanPretest: [],
    jawabanPosttest: [],
    enablePretest: false,
    enablePosttest: false,
    webinarId: this.props.webinarId ? this.props.webinarId : this.props.match.params.webinarId,
    webinar: [],
    jawabKuesioner: [],
    pemenangDoorprize: [],
    modalDoorprize: false,
    pembucara: '',
    joinUrl: '',
    tanggal:'',
    tanggalEnd:'',
    user: [],
    projectId: '',
    dokumenId: '',
    modalConfirmClose: false,
    modalEnd: false,
    modalKuesioner: false,
    modalKuesionerPeserta: false,
    modalSendPosttest: false,
    waitingKuesioner: false,
    startKuesioner: false,
    startPosttest: false,
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
    loadingTest: false,

    engine: 'bbb',
    mode: 'web',

    zoomUrl: '',
    isLoading: false,

    //webinar role
    pembicara: [],
    sekretarisId: [],
    moderatorId: [],
    pembicaraId: [],
    ownerId: [],

    lampirans: [
      { id: 1, nama: 'mom-meeting.pdf', url: 'https://google.com' },
      { id: 2, nama: 'file-presentasi.pdf', url: 'https://google.com' },
      { id: 3, nama: 'formulir-pendaftaran.docx', url: 'https://google.com' },
    ],
    pertanyaans: [
      { id: 1, dari: 'John MC', pertanyaan: 'Berapa hasil dari 10x10 berapa hayooo?', datetime: '02 Sep 2020 12:10' },
      { id: 2, dari: 'Arrazaqul', pertanyaan: 'Kalau semisal hasil dari 100 dibagi 10 berapa hayooo?', datetime: '02 Sep 2020 12:12' },
      { id: 3, dari: 'Ahmad Syujan', pertanyaan: 'Gan, Saya yang mau tanya lebih serius. Kalau semisal hasil dari 100 dibagi 10 berapa hayooo?', datetime: '02 Sep 2020 12:12' },
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
  closeModalSendPosttest = e => {
    this.setState({ modalSendPosttest: false });
  }
  closeModalResult = e => {
    this.setState({ modalResultPretest: false, modalResultPosttest: false });
  }
  closeModalKuesionerPeserta = e => {
    this.setState({ modalKuesionerPeserta: false, });
    this.closeModalConfirmClose();
  }
  closeModalConfirmClose = e => {
    this.setState({ modalConfirmClose: false });
  }

  findArray(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
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
      this.setState({ jawaban: array });
      this.state.jawaban.push({ questions_id: name, options_id: value })
    }
    else {
      this.state.jawaban.push({ questions_id: name, options_id: value })
    }
  }
  handleJawabPretest = e => {
    const { value, name } = e.target;
    var array = this.state.jawabanPretest;
    var index = this.findArray(array, 'questions_id', name);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ jawabanPretest: array });
      this.state.jawabanPretest.push({ questions_id: name, options_id: value })
    }
    else {
      this.state.jawabanPretest.push({ questions_id: name, options_id: value })
    }
  }
  handleJawabPosttest = e => {
    const { value, name } = e.target;
    var array = this.state.jawabanPosttest;
    var index = this.findArray(array, 'questions_id', name);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ jawabanPosttest: array });
      this.state.jawabanPosttest.push({ questions_id: name, options_id: value })
    }
    else {
      this.state.jawabanPosttest.push({ questions_id: name, options_id: value })
    }
  }
  kirimJawabanPosttest() {
    // if (this.state.jawabanPosttest.length === this.state.posttest.length){
    if (this.state.jawabanPosttest.length > 0) {
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        webinar_test: this.state.jawabanPosttest
      }
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if (res.data.error)
          toast.error('Failed to submit answer')
        else
          toast.success('Post-test submission sent')
        if (this.props.webinarId && this.props.voucher) {
          this.fetchWebinarPublic()
        }
        else {
          this.fetchWebinar()
        }
        this.fetchPostTest()
        this.fetchResultPosttest();
        this.setState({ modalResultPosttest: true })
      })
    }
    else {
      toast.warning('Post-test is mandatory')
    }
  }
  kirimJawabanPretest() {
    // if (this.state.jawabanPretest.length === this.state.pretest.length){
    if (this.state.jawabanPretest.length > 0) {
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        webinar_test: this.state.jawabanPretest
      }
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if (res.data.error)
          toast.error('Failed to Submit Pre-Test answers webinar')
        else
          toast.success('Submit Pre-Test answers webinar')
        this.fetchPreTest()
        this.fetchResultPretest();
        this.openModalPretest();
      })
    }
    else {
      toast.warning('Pre-test is mandatory')
    }
  }
  waktuPretestHabis() {
    let form = {
      id: this.state.webinarId,
      user_id: this.state.user.user_id,
      pengguna: this.state.user.type ? 0 : 1,
      webinar_test: this.state.jawabanPretest
    }
    if (this.state.resultPretest.list.length === 0) {
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if (res.data.error)
          toast.error('Failed to Submit Pre-Test answers webinar')
        else
          toast.warning('Waktu habis')
        toast.success('Submit Pre-Test answers webinar')
        this.fetchPreTest()
        this.fetchResultPretest();
        this.openModalPretest();
      })
    }
  }
  waktuPosttestHabis() {
    let form = {
      id: this.state.webinarId,
      user_id: this.state.user.user_id,
      pengguna: this.state.user.type ? 0 : 1,
      webinar_test: this.state.jawabanPosttest
    }
    if (this.state.resultPosttest.list.length === 0) {
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if (res.data.error)
          toast.error('Failed')
        else
          toast.warning('Time out')
        toast.success('Post-test submission sent')
        this.fetchPostTest();
        this.fetchResultPosttest();
      })
    }
  }
  kirimJawabanKuesioner() {
    if (this.state.jawaban.length >= this.state.pertanyaan.length) {
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        pengguna: this.state.user.type ? 0 : 1,
        kuesioner: this.state.jawaban
      }
      this.setState({isLoading: true});
      API.post(`${API_SERVER}v2/kuesioner/input`, form).then(res => {
        if (res.data.error){
          toast.error('Already sent answers to the Feedback Form on this webinar')
          this.setState({isLoading: false});
        }
        else{
          socket.emit('send', {
            socketAction: 'jawabKuesioner',
            webinar_id: this.state.webinarId,
            name: this.state.user.name
          })
        toast.success('Feedback Form submission sent')
        this.closeModalKuesionerPeserta()
        this.setState({ startKuesioner: false, isLoading: false })
        }
      })
    }
    else {
      toast.warning('You must answer all questions')
    }
  }
  postLog(webinar_id, peserta_id, type, action) {
    API.post(`${API_SERVER}v2/webinar/log/${webinar_id}/${peserta_id}/${type}/${action}`).then(res => {
      if (res.data.error)
        console.log('Log webinar error')
      else
        console.log('Log webinar posted')
    })
  }
  sendQNA() {
    if (this.state.pertanyaanQNA.length < 10) {
      toast.warning('Question at least 10 characters')
    }
    else {
      let form = {
        webinar_id: this.state.webinarId,
        jenis_peserta: this.state.user.type ? 'tamu' : 'peserta',
        peserta_id: this.state.user.user_id,
        description: this.state.pertanyaanQNA
      }
      API.post(`${API_SERVER}v2/webinar/qna`, form).then(res => {
        if (res.data.error)
          toast.error('Failed to send quistionnaire')
        else
          toast.success('Question sent')
        this.setState({ pertanyaanQNA: '' })
        socket.emit('send', {
          name: res.data.result.name,
          webinar_id: res.data.result.webinar_id,
          email: res.data.result.email,
          description: res.data.result.description,
          jenis_peserta: this.state.user.type ? 'tamu' : 'peserta',
          timestamp: new Date()
        })
        this.fetchQNAByUser()
      })
    }
  }
  fetchQNA() {
    API.get(`${API_SERVER}v2/webinar/qna/${this.state.webinarId}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ qna: res.data.result })
    })
  }

  fetchQNAByUser() {
    API.get(`${API_SERVER}v2/webinar/qna-peserta/${this.state.webinarId}/${this.state.user.user_id}`).then(res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        this.setState({ qnaPeserta: res.data.result })
    })
  }

  fetchKuesioner() {
    this.setState({ jawaban: [] })
    API.get(`${API_SERVER}v2/kuesioner-peserta/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ pertanyaan: res.data.result })
        }
      }
    })
  }
  fetchWebinar() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if (res.status === 200) {
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
              moderatorId: res.data.result.moderator,
              sekretarisId: res.data.result.sekretaris,
              pembicaraId: res.data.result.pembicara,
              ownerId: res.data.result.owner,
              projectId: res.data.result.project_id,
              dokumenId: res.data.result.dokumen_id,
              status: res.data.result.status,
              tanggal: res.data.result.start_time,
              tanggalEnd: res.data.result.end_time,
              peserta: res.data.result.peserta,
              tamu: res.data.result.tamu,

              engine: res.data.result.engine,
              mode: res.data.result.mode,

              waitingKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startPosttest: res.data.result.posttest_sent === 1 ? true : false
            })
          this.setState({ pembicara: [] })
          res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
          res.data.result.kuesioner_sent === 1 && this.fetchKuesioner()
          this.fetchQNAByUser()
          this.checkProjectAccess()
          this.fetchResultPretest()
          this.fetchResultPosttest()
          // let tgl = new Date(res.data.result.tanggal)
          // let tglJam = new Date(tgl.setHours(this.state.jamMulai.slice(0, 2)))
          // let tglJamMenit = new Date(tglJam.setMinutes(this.state.jamMulai.slice(3, 5)))

          // let tglJamSelesai = new Date(tgl.setHours(this.state.jamSelesai.slice(0, 2)))
          // let tglJamMenitSelesai = new Date(tglJamSelesai.setMinutes(this.state.jamSelesai.slice(3, 5)))

          let isWebinarStartDate = moment(new Date()).local() >= moment(this.state.tanggal).local() && moment(new Date()).local() <= moment(this.state.tanggalEnd).local() ? true : false;
          this.setState({ isWebinarStartDate: isWebinarStartDate })

          if (this.state.status == 2 || (isWebinarStartDate && this.state.status != 3)) {
            this.updateStatus(this.state.webinar.id, 2)
            if (this.state.webinar.status == 1) {
              this.fetchWebinar()
            }
            // BBB JOIN START
            let api = bbb.api(BBB_URL, BBB_KEY)
            let http = bbb.http

            // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
            let meetingInfo = api.monitoring.getMeetingInfo(this.state.webinar.id)
            http(meetingInfo).then(async (result) => {
              if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
                // Jika belum ada, create room nya.
                let meetingCreateUrl = api.administration.create(this.state.webinar.judul, this.state.webinar.id, {
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
                      this.state.webinar.id,
                      this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                      { userID: this.state.user.user_id }
                    )

                    let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                    let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                    let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 1 : 0}`

                    this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })

                    this.postLog(this.state.webinar.id, this.state.user.user_id, 'peserta', 'join')
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
                  this.state.webinar.id,
                  this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                  { userID: this.state.user.user_id }
                )

                let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 1 : 0}`

                this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })

                this.postLog(this.state.webinar.id, this.state.user.user_id, 'peserta', 'join')
              }
            })
            // BBB JOIN END
          }
        })
      }
    })
  }
  fetchWebinarPublic() {
    API.get(`${API_SERVER}v2/webinar/tamu/${this.props.voucher}`).then(async res => {
      if (res.status === 200) {
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
              moderatorId: res.data.result.moderator,
              sekretarisId: res.data.result.sekretaris,
              pembicaraId: res.data.result.pembicara,
              projectId: res.data.result.project_id,
              dokumenId: res.data.result.dokumen_id,
              status: res.data.result.status,
              tanggal: moment.tz(res.data.result.start_time, moment.tz.guess(true)).format("DD-MM-YYYY"),
              tanggalEnd: moment.tz(res.data.result.end_time, moment.tz.guess(true)).format("DD-MM-YYYY"),
              peserta: res.data.result.peserta,
              tamu: res.data.result.tamu,

              engine: res.data.result.engine,
              mode: res.data.result.mode,

              waitingKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startPosttest: res.data.result.posttest_sent === 1 ? true : false
            })
          this.setState({ pembicara: [] })
          res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
          res.data.result.kuesioner_sent === 1 && this.fetchKuesioner()
          this.fetchQNAByUser()
          this.checkProjectAccess()
          this.fetchResultPretest()
          this.fetchResultPosttest()
          // let tgl = new Date(res.data.result.tanggal)
          // let tglJam = new Date(tgl.setHours(this.state.jamMulai.slice(0, 2)))
          // let tglJamMenit = new Date(tglJam.setMinutes(this.state.jamMulai.slice(3, 5)))

          // let tglJamSelesai = new Date(tgl.setHours(this.state.jamSelesai.slice(0, 2)))
          // let tglJamMenitSelesai = new Date(tglJamSelesai.setMinutes(this.state.jamSelesai.slice(3, 5)))

          let isWebinarStartDate = moment(new Date()).local() >= moment(this.state.tanggal).local() && moment(new Date()).local() <= moment(this.state.tanggalEnd).local() ? true : false;
          this.setState({ isWebinarStartDate: isWebinarStartDate })

          if (this.state.status == 2 || (isWebinarStartDate && this.state.status != 3)) {
            this.updateStatus(this.state.webinar.id, 2)
            if (this.state.webinar.status == 1) {
              this.fetchWebinarPublic()
            }
            // BBB JOIN START
            let api = bbb.api(BBB_URL, BBB_KEY)
            let http = bbb.http

            // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
            let meetingInfo = api.monitoring.getMeetingInfo(this.state.webinar.id)
            http(meetingInfo).then(async (result) => {
              if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
                // Jika belum ada, create room nya.
                let meetingCreateUrl = api.administration.create(this.state.webinar.judul, this.state.webinar.id, {
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
                      this.state.webinar.id,
                      this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                      { userID: this.state.user.user_id }
                    )

                    let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                    let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                    let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=0}`

                    this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })

                    this.postLog(this.state.webinar.id, this.state.user.user_id, 'tamu', 'join')
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
                  this.state.webinar.id,
                  this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                  { userID: this.state.user.user_id }
                )

                let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=0}`

                this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl })

                this.postLog(this.state.webinar.id, this.state.user.user_id, 'tamu', 'join')
              }
            })
            // BBB JOIN END
          }
        })
      }
    })
  }
  acakDoorprize() {
    const random = Math.floor(Math.random() * this.state.jawabKuesioner.length);
    socket.emit('send', {
      socketAction: 'pemenangDoorprize',
      webinar_id: this.state.webinarId,
      name: this.state.jawabKuesioner[random]
    })
  }
  fetchResultPretest(){
    this.setState({loadingTest: true})
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}/0/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({resultPretest: res.data.result}, ()=>{
            this.setState({loadingTest: false})
          })
        }
      }
    })
  }
  openModalPretest() {
    this.setState({ modalResultPretest: true })
  }
  fetchResultPosttest(){
    this.setState({loadingTest: true})
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}/1/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({resultPosttest: res.data.result},()=>{
            this.setState({loadingTest: false})
          })
        }
      }
    })
  }
  fetchPreTest() {
    API.get(`${API_SERVER}v2/webinar-test-peserta/${this.state.webinarId}/0/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ pretestTerjawab: res.data.terjawab, enablePretest: res.data.enable, pretest: res.data.result, waktuPretest: res.data.waktu })
        }
      }
    })
  }
  fetchPostTest() {
    API.get(`${API_SERVER}v2/webinar-test-peserta/${this.state.webinarId}/1/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ posttestTerjawab: res.data.terjawab, enablePosttest: res.data.enable, posttest: res.data.result, waktuPosttest: res.data.waktu })
        }
      }
    })
  }
  fetchKuesionerSender() {
    API.get(`${API_SERVER}v2/kuesioner/sender/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ jawabKuesioner: res.data.result })
        }
      }
    })
  }
  componentDidMount() {
    if (isMobile) {
      if (this.props.webinarId && this.props.voucher){
        window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'webinar-guest/' + this.props.webinarId + '/' + this.props.voucher))
      }
      else{
        window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'webinar/live/' + this.state.webinarId))
      }
    }
    this.fetchKuesionerSender()
    socket.on("broadcast", data => {
      if (data.webinar_id == this.state.webinarId) {
        if (this.props.webinarId && this.props.voucher) {
          this.fetchWebinarPublic()
        }
        else {
          this.fetchWebinar()
        }
      }
      if (data.description && data.webinar_id == this.state.webinarId) {
        this.setState({ qna: [data, ...this.state.qna] })
      }
      if (data.socketAction == 'pemenangDoorprize' && data.webinar_id === this.state.webinarId) {
        this.state.pemenangDoorprize.push(data.name)
        this.setState({ modalDoorprize: true })
        this.closeModalKuesioner()
      }
      if (data.socketAction == 'sendKuesioner' && data.webinar_id === this.state.webinarId) {
        this.setState({ startKuesioner: true, modalKuesionerPeserta: true })
        this.fetchKuesioner()
      }
      if (data.socketAction == 'sendPosttest' && data.webinar_id === this.state.webinarId) {
        this.setState({ startPosttest: true });
        this.fetchPostTest();
      }
      if (data.socketAction == 'jawabKuesioner' && data.webinar_id === this.state.webinarId) {
        this.fetchKuesionerSender()
        this.forceUpdate()
      }
      if (data.socketAction == 'fetchPostTest' && data.webinar_id === this.state.webinarId) {
        if (this.props.webinarId && this.props.voucher) {
          this.fetchWebinarPublic()
        }
        else {
          this.fetchWebinar()
        }
        this.fetchPostTest()
      }
    });
    if (this.props.webinarId && this.props.voucher) {
      this.fetchWebinarPublic()
    }
    else {
      this.fetchWebinar()
    }
    this.fetchQNA()
    // INI SCRIPT JIKA BBB HOOKS MATI

    // let conference_id = this.props.webinarId ? this.props.webinarId : this.props.match.params.webinarId;
    // let user_id = this.props.voucher ? this.props.voucher : Storage.get('user').data.user_id;
    // window.receiveMessageFromIndex = function ( event ) {
    //     if(event!=undefined){
    //         let form = {
    //             conference_id : conference_id,
    //             user_id : user_id,
    //             event : event.data.response
    //         }
    //         API.post(`${API_SERVER}v2/conference-logs`, form).then(res => {
    //             if (res.data.error){
    //                 console.log('Logging Failed')
    //             }
    //         })
    //     }
    // }
    // window.addEventListener("message", window.receiveMessageFromIndex, false);
  }
  checkProjectAccess() {
    if (this.props.voucher) {
      this.setState({
        access_project_admin: false,
      })
    }
    else {
      API.get(`${API_SERVER}v1/project-access/${this.state.projectId}/${Storage.get('user').data.user_id}`).then(res => {
        if (res.status === 200) {
          let levelUser = Storage.get('user').data.level;
          if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client') {
            this.setState({
              access_project_admin: true,
            })
          }
          else {
            this.setState({
              access_project_admin: false,
            })
          }
        }
      })
    }
  }
  updateStatus(id, status) {
    let form = {
      id: id,
      status: status,
    };
    API.put(`${API_SERVER}v2/webinar/status`, form).then(async res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        status == 3 &&
          toast.success('Webinar has ended')
    })
  }
  endMeeting() {
    // BBB END
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    let endMeeting = api.administration.end(this.state.webinar.id, 'moderator')
    http(endMeeting).then((result) => {
      if (result.returncode == 'SUCCESS') {
        this.closeModalEnd()
        toast.success('You have ended the webinar for all participants')
        this.updateStatus(this.state.webinar.id, 3)
        socket.emit('send', {
          socketAction: 'fetchPostTest',
          webinar_id: this.state.webinarId
        })
      }
    })
  }

  sendKuesioner() {
    API.put(`${API_SERVER}v2/webinar/send-kuesioner/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        socket.emit('send', {
          socketAction: 'sendKuesioner',
          webinar_id: this.state.webinarId
        })
        toast.success('Feedback Form sent to participants');
        this.setState({ waitingKuesioner: true })
      }
    })
  }

  sendPosttest() {
    API.put(`${API_SERVER}v2/webinar/send-posttest/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        socket.emit('send', {
          socketAction: 'sendPosttest',
          webinar_id: this.state.webinarId
        })
        toast.success('Post test sent');
        this.closeModalSendPosttest();
      }
    })
  }

  render() {
    //console.log('state: ', this.state)
    const { /* webinar, */ user } = this.state;
    // let levelUser = Storage.get('user').data.level;
    // let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    // let projectId = this.state.projectId;
    // const Lampiran = ({items}) => (
    //   <div className="row">
    //     {
    //       items.map((item, i) => (
    //         <div className="col-sm-12 mb-3" key={item.id}>
    //           <div className='border-disabled'>
    //             <div className="box-lampiran">
    //               <div className="title-head f-w-900 f-16 fc-skyblue">
    //                 {item.nama}
    //                 <Link to={item.url} className="float-right link-lampiran"><i className="fa fa-download"></i></Link>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))
    //     }
    //   </div>
    // );

    const Pertanyaan = ({ items }) => (
      <div className="row">
        {
          items.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.id}>
              <div className='border-disabled'>
                <div className="box-lampiran">
                  <div className="">
                    <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                    <span className="float-right">{item.jenis_peserta == 'peserta' ? 'User' : 'Guest'}</span>
                    <br />
                    <p style={{ marginBottom: '1px' }}>
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
                    <p>Speaker : {this.state.pembicara.toString()}</p>
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  {
                    this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 && this.state.status == 2 ?
                      <button onClick={() => this.setState({ modalEnd: true })} className="float-right btn btn-icademy-primary btn-icademy-red">
                        <i className="fa fa-stop-circle"></i>End Webinar
                      </button>
                      :
                      null
                  }
                  {
                    this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ?
                      <button onClick={() => this.setState({ modalKuesioner: true })} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Feedback Form & Doorprize
                      </button>
                      :
                      null
                  }
                  {
                    this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 && this.state.posttest.length > 0 ?
                      <button onClick={() => this.setState({ modalSendPosttest: true })} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-paper-plane"></i>Send Post Test
                      </button>
                      :
                      null
                  }
                  {
                    (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1) && this.state.startKuesioner ?
                      <button onClick={() => this.setState({ modalKuesionerPeserta: true })} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Feedback Form
                      </button>
                      :
                      null
                  }
                  {
                    this.state.resultPretest.nilai != null && this.state.resultPretest.nilai != 'NaN' && this.state.pretest.length >= 1 ?
                      <button onClick={this.openModalPretest.bind(this)} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Pre-Test Result
                      </button>
                      :
                      null
                  }
                  {
                    this.state.resultPosttest.nilai != null && this.state.resultPosttest.nilai != 'NaN' && this.state.posttest.length >= 1 ?
                      <button onClick={() => this.setState({ modalResultPosttest: true })} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Hasil Post Test
                      </button>
                      :
                      null
                  }
                  <p className="m-b-0">
                    { /* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              {
                this.state.enablePretest && this.state.pretestTerjawab === false && (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length === 0) ?
                  <div>
                  <h4>Before entering the Webinar, please answer the questions below (in {this.state.waktuPretest} minutes).<br />
If you have finished answering the questions, please click ""Send Pre-Test Answers"".<br />
Please complete the answers for not over than allotted time, orherwise the result in the pre-test will  be automatically closed and directed in to the Webinar room<br /></h4>
                    <div className="fc-blue" style={{ position: 'absolute', right: 20, top: 10, fontSize: '18px', fontWeight: 'bold' }}>
                      <Timer
                        initialTime={this.state.waktuPretest * 60000}
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
                            Time limit <Timer.Hours />:
                            <Timer.Minutes />:
                            <Timer.Seconds />
                          </React.Fragment>
                        )}
                      </Timer>
                    </div>
                    {
                      this.state.pretest.map((item, index) => (
                        <div className="mb-3">
                          <p className="f-w-900" style={{ lineHeight: '18px' }}>{index + 1 + '. ' + item.tanya}</p>
                          {item.a && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawabPretest} /> <label for='a'> {item.a[1]}</label></div>}
                          {item.b && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawabPretest} /> <label for='b'> {item.b[1]}</label></div>}
                          {item.c && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawabPretest} /> <label for='c'> {item.c[1]}</label></div>}
                          {item.d && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawabPretest} /> <label for='d'> {item.d[1]}</label></div>}
                          {item.e && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawabPretest} /> <label for='e'> {item.e[1]}</label></div>}
                        </div>
                      ))
                    }
                    <button
                      className="btn btn-icademy-primary"
                      onClick={this.kirimJawabanPretest.bind(this)}
                    >
                      <i className="fa fa-paper-plane"></i>
                    Send Pre-Test Answers
                  </button>
                  </div>
                  :
                  <div style={{ marginTop: '10px' }}>
                    <div className="row">
                      <div className="col-sm-12">
                        {
                          this.state.status == 2 || (this.state.isWebinarStartDate && this.state.status == 2) ?
                          <div style={{background:`url('newasset/loading.gif') center center no-repeat`}}>
                            <Iframe url={this.state.engine === 'zoom' ? this.state.zoomUrl : this.state.joinUrl}
                              width="100%"
                              height="600px"
                              display="initial"
                              frameBorder="0"
                              allow="fullscreen *;geolocation *; microphone *; camera *"
                              position="relative" />
                          </div>
                            :
                            this.state.status == 3 ?
                              <h3>The webinar has ended</h3>
                              :
                              <h3>Webinars start on {moment(this.state.tanggal).local().format('DD MMMM YYYY HH:mm')} until {moment(this.state.tanggalEnd).local().format('DD MMMM YYYY HH:mm')}</h3>
                        }
                        {
                          this.state.status !== 3 &&
                          <div className="dekripsi" style={{ marginTop: '20px' }}>
                            <h4>Description</h4>
                            <div dangerouslySetInnerHTML={{ __html: this.state.webinar.isi }} />
                          </div>
                        }
                        {
                          this.state.startPosttest && this.state.posttestTerjawab === false && (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length === 0) &&
                          <div style={{marginTop:20}}>
                            <h4>Answer the post-test</h4>
                            <div className="fc-blue" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 20 }}>
                              <Timer
                                initialTime={this.state.waktuPosttest * 60000}
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
                                  <p className="f-w-900" style={{ lineHeight: '18px' }}>{index + 1 + '. ' + item.tanya}</p>
                                  {item.a && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawabPosttest} /> <label for='a'> {item.a[1]}</label></div>}
                                  {item.b && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawabPosttest} /> <label for='b'> {item.b[1]}</label></div>}
                                  {item.c && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawabPosttest} /> <label for='c'> {item.c[1]}</label></div>}
                                  {item.d && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawabPosttest} /> <label for='d'> {item.d[1]}</label></div>}
                                  {item.e && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawabPosttest} /> <label for='e'> {item.e[1]}</label></div>}
                                </div>
                              ))
                            }
                            <button
                              className="btn btn-icademy-primary"
                              onClick={this.kirimJawabanPosttest.bind(this)}
                            >
                              <i className="fa fa-paper-plane"></i>
                    Send Post-Test Answers
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
          (this.state.projectId !== 0 && this.state.status === 2) &&
          <div className="col-sm-6">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      Documents
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      { /* <span className="f-w-600 f-16">Lihat Semua</span> */}
                    </p>
                  </div>
                </div>
                <div className="wrap" style={{ marginTop: '10px', maxHeight: 400, overflowY: 'scroll' }}>
                  <TableFiles voucherTamu={this.state.user.user_id} guest={this.props.voucher ? true : false} access_project_admin={this.state.access_project_admin} webinarId={this.state.webinarId} projectId={this.state.dokumenId ? this.state.dokumenId : this.state.projectId} companyId={this.state.companyId} />
                </div>
              </Card.Body>
            </Card>
          </div>
        }
        {
          (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 || this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 || this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length >= 1) && this.state.status === 2 ?
            <div className="col-sm-6">
              <Card>
                <Card.Body>
                  <div className="row">
                    <div className="col-sm-6">
                      <h3 className="f-w-900 f-18 fc-blue">
                        Question
                    </h3>
                    </div>
                  </div>
                  <div className="wrap" style={{ marginTop: '10px', maxHeight: 400, overflowY: 'scroll', overflowX: 'hidden', paddingRight: 10 }}>
                    {
                      this.state.qna.length ?
                        <Pertanyaan items={this.state.qna} />
                        :
                        <p>There is no question</p>
                    }
                  </div>
                </Card.Body>
              </Card>
            </div>
            :
            (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length === 0) && this.state.status === 2 ?
              <div className="col-sm-6">
                <div className="col-sm-12">
                  <Card>
                    <Card.Body>
                      <div className="row">
                        <div className="col-sm-6">
                          <h3 className="f-w-900 f-18 fc-blue">
                          Your Question
                    </h3>
                        </div>
                      </div>
                      <div className="wrap" style={{ marginTop: '10px', maxHeight: 400, overflowY: 'scroll', overflowX: 'hidden', paddingRight: 10 }}>
                        {
                          this.state.qnaPeserta.length ?
                            <Pertanyaan items={this.state.qnaPeserta} />
                            :
                            <p>There is no question</p>
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
                            Send Your Question
                    </h3>
                        </div>
                        <div className="col-sm-6 text-right">
                          <p className="m-b-0">
                            { /* <span className="f-w-600 f-16">Lihat Semua</span> */}
                          </p>
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        {/* <Pertanyaan items={this.state.pertanyaans} /> */}
                        <div className="form-group">
                          <textarea placeholder="Type your question here..." rows="4" className="form-control" value={this.state.pertanyaanQNA} onChange={e => this.setState({ pertanyaanQNA: e.target.value })} />
                        </div>
                        <button
                          className="btn btn-icademy-primary float-right"
                          onClick={this.sendQNA.bind(this)}
                        >
                          <i className="fa fa-paper-plane"></i>
                          Send
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
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure you want to end the webinar for all participants?</div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btm-icademy-primary btn-icademy-grey"
              onClick={this.closeModalEnd.bind(this)}
            >
              Cancel
                      </button>
            <button
              className="btn btn-icademy-primary btn-icademy-red"
              onClick={this.endMeeting.bind(this)}
            >
              <i className="fa fa-trash"></i>
                        End Webinar
                      </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalSendPosttest}
          onHide={this.closeModalSendPosttest}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Send Post Test
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>There are <b>{this.state.posttest.length}</b> question with <b>{this.state.waktuPosttest} minutes</b> time limit.</div>
            <div>Are you sure want to send post test to attendences ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-icademy-primary"
              onClick={this.sendPosttest.bind(this)}
            >
              <i className="fa fa-paper-plane"></i>
                Send Post Test
              </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalKuesioner}
          onHide={this.closeModalKuesioner}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
            Feedback Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.waitingKuesioner &&
              <div>
                <h4>Waiting...</h4>
                <div>Number of participants who have answered the Feedback Form = <b>{this.state.jawabKuesioner.length}</b></div>
              </div>
            }
            {
              this.state.waitingKuesioner == false &&
              <div>Send the Feedback Form to all participants now?</div>
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
                Random doorprize
              </button>
            }
            {
              this.state.waitingKuesioner == false &&
              <button
                className="btn btn-icademy-primary"
                onClick={this.sendKuesioner.bind(this)}
              >
                <i className="fa fa-paper-plane"></i>
                Send Feedback Form
              </button>
            }
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalConfirmClose}
          onHide={this.closeModalConfirmClose}
          dialogClassName="modal-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              Are you sure want to close questioner ?
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-icademy-primary"
              onClick={this.closeModalKuesionerPeserta.bind(this)}
            >
              Close
              </button>
            <button
              className="btn btn-icademy-grey"
              onClick={this.closeModalConfirmClose.bind(this)}
            >
              Cancel
              </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalKuesionerPeserta && (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1)}
          onHide={() => this.setState({ modalConfirmClose: true })}
          dialogClassName="modal-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Submit Feedback Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.pertanyaan.map((item) => (
                <div className="mb-3">
                  <p className="f-w-900 fc-blue" style={{ lineHeight: '18px' }}>{item.tanya}</p>
                  {item.a && <span style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawab} /> <label for='a'> {item.a[1]}</label></span>}
                  {item.b && <span style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawab} /> <label for='b'> {item.b[1]}</label></span>}
                  {item.c && <span style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawab} /> <label for='c'> {item.c[1]}</label></span>}
                  {item.d && <span style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawab} /> <label for='d'> {item.d[1]}</label></span>}
                  {item.e && <span style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawab} /> <label for='e'> {item.e[1]}</label></span>}
                </div>
              ))
            }
          </Modal.Body>
          <Modal.Footer>
            <button
              disabled={this.state.isLoading}
              className="btn btn-icademy-primary"
              onClick={this.kirimJawabanKuesioner.bind(this)}
            >
              <i className="fa fa-paper-plane"></i>
                {this.state.isLoading ? 'Submitting...' : 'Submit Feedback Form'}
              </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalDoorprize}
          onHide={this.closeModalDoorprize}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Doorprize winner
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Congratulation to : <br />
            {
              this.state.pemenangDoorprize.length && this.state.pemenangDoorprize.map((item) => (
                <span>
                  <h3>{item}</h3>
                </span>
              ))
            }
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalResultPretest}
          onHide={this.closeModalResult}
          dialogClassName="modal-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Pre-Test Result
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.loadingTest || this.state.resultPretest.nilai === 'NaN' ?
              <div>Loading...</div>
              :
              <div>
              <div>Score : {this.state.resultPretest.nilai}</div>
              <div>Correct Answer : {this.state.resultPretest.benar}</div>
              <div>Wrong Answer : {this.state.resultPretest.salah}</div>
              {
                    this.state.resultPretest.list && this.state.resultPretest.list.map((item, index) => (
                      <div className="mb-3 mt-3">
                        <p className="f-w-900" style={{lineHeight:'18px'}}>{index+1+'. '+item.pertanyaan}</p>
                        {
                          item.options.map(items => (
                            <div style={{margin:'0px 10px'}}><input checked={item.jawaban === items.options ? true : false} disabled type="radio" /> <label for={items.options} style={{backgroundColor: item.jawaban_benar === items.options ? '#c6ffc6' : 'transparent'}}> {items.answer}</label></div>
                          ))
                           }
                      </div>
                    ))
                    }
              </div>
            }
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalResultPosttest}
          onHide={this.closeModalResult}
          dialogClassName="modal-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Post-Test Result
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.loadingTest || this.state.resultPosttest.nilai === 'NaN' ?
              <div>Loading...</div>
              :
              <div>
            <div>Score : {this.state.resultPosttest.nilai}</div>
            <div>Correct Answer : {this.state.resultPosttest.benar}</div>
            <div>Wrong Answer : {this.state.resultPosttest.salah}</div>
            {
              this.state.resultPosttest.list && this.state.resultPosttest.list.map((item, index) => (
                <div className="mb-3 mt-3">
                  <p className="f-w-900" style={{ lineHeight: '18px' }}>{index + 1 + '. ' + item.pertanyaan}</p>
                  {
                    item.options.map(items => (
                      <div style={{ margin: '0px 10px' }}><input checked={item.jawaban === items.options ? true : false} disabled type="radio" /> <label for={items.options} style={{ backgroundColor: item.jawaban_benar === items.options ? '#c6ffc6' : 'transparent' }}> {items.answer}</label></div>
                    ))
                  }
              </div>
              ))
            }
            </div>
            }
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
