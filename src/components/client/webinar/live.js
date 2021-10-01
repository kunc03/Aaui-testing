import React, { Component } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API, { APPS_SERVER, API_SERVER, USER_ME, BBB_KEY, BBB_URL, API_SOCKET, ZOOM_URL } from '../../../repository/api';
import { toast } from "react-toastify";
import Iframe from 'react-iframe';
import { Editor } from '@tinymce/tinymce-react';

import Storage from '../../../repository/storage';
import TableFiles from '../../files/_files';
import moment from 'moment-timezone';
import Timer from 'react-compound-timer';
import io from 'socket.io-client';
import { isMobile, isIOS } from 'react-device-detect';
import Tooltip from '@material-ui/core/Tooltip';
import { Fragment } from 'react';
import { None } from 'amazon-chime-sdk-js';
const bbb = require('bigbluebutton-js')

const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

export default class WebinarLive extends Component {

  state = {
    isSavingQuestion: false,
    submitPoll: false,
    setting: false,
    checkAllUsersPoll: true,
    usersPoll: [],
    peserta_count: [],
    pollResult:
    {
      // id: 1,
      // tanya: 'Do you agree ?',
      // answer: [
      //   {
      //     value : 'Yes',
      //     percent : 60
      //   },
      //   {
      //     value : 'No',
      //     percent : 40
      //   }
      // ]
    },
    idPoll: '',
    pollFreetext: '',
    polling: [
      // {
      //   id: 1,
      //   tanya: 'Do you agree ?',
      //   jenis: 2,
      //   a: 'Yes',
      //   b: 'No',
      //   answer: [
      //     {
      //       value : 'Yes',
      //       percent : 60
      //     },
      //     {
      //       value : 'No',
      //       percent : 40
      //     }
      //   ],
      //   status: 'Finish'
      // },
      // {
      //   id: 2,
      //   tanya: 'Select your gender ?',
      //   jenis: 1,
      //   a: 'Male',
      //   b: 'Female',
      //   answer: [
      //     {
      //       value : 'Male',
      //       percent : 30
      //     },
      //     {
      //       value : 'Female',
      //       percent : 70
      //     }
      //   ],
      //   status: 'On going'
      // },
      // {
      //   id:3,
      //   tanya: 'How about your opinion ?',
      //   jenis: 3,
      //   status: 'Draft'
      // }
    ],
    newPoll: false,
    createPoll: {
      tanya: '',
      jenis: null,
      a: '',
      b: '',
      c: '',
      d: '',
      e: '',
    },
    hideInputPollDefault: 'hidden',
    modalSendPoll: false,
    modalAnswerPoll: false,
    modalResultPoll: false,
    answerPoll: {
      // poll_id: '',
      // tanya: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ?',
      // jenis: 1,
      // a: 'A',
      // b: 'B',
      // c: 'C',
      // d: 'D'
    },
    showOpenApps: true,
    isJoin: false,
    resultPostPreTest_AllUser: {
      posttest: [],
      pretest: []
    },
    showModalResultPostTest: false,
    showModalResultPreTest: false,
    showDescription: false,
    isLoadingPage: true,
    dataParticipants: {
      audio: 0,
      camera: 0,
    },
    waktuPretest: 0,
    waktuPosttest: 0,
    isFeedback: false,
    pretest: [],
    posttest: [],
    resultPretest: [],
    resultPosttest: [],
    resultEssay: [],
    modalResultPretest: false,
    modalResultPosttest: false,
    pretestTerjawab: false,
    posttestTerjawab: false,
    essayTerjawab: false,
    essayResult: [],
    jawabanPretest: [],
    jawabanPosttest: [],
    jawabanEssayKu: '',
    enablePretest: false,
    enablePosttest: false,
    webinarId: this.props.webinarId ? this.props.webinarId : this.props.match.params.webinarId,
    webinar: [],
    jawabKuesioner: [],
    pemenangDoorprize: [],
    modalDoorprize: false,
    pembucara: '',
    joinUrl: '',
    tanggal: '',
    tanggalEnd: '',
    user: [],
    joined: false,
    projectId: '',
    dokumenId: '',
    modalConfirmClose: false,
    modalEnd: false,
    modalKuesioner: false,
    modalKuesionerPeserta: false,
    modalSendPretest: false,
    modalSendPosttest: false,
    modalSendEssay: false,
    waitingKuesioner: false,
    startKuesioner: false,
    startPretest: false,
    startPosttest: false,
    startEssay: false,
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

    session: Storage.get('user').data,

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
  fetchDataParticipants() {
    if (this.state.webinarId) {
      let api = bbb.api(BBB_URL, BBB_KEY)
      let http = bbb.http

      let meetingInfo = api.monitoring.getMeetingInfo(this.state.webinarId)
      http(meetingInfo).then((result) => {
        if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
          // Jika belum ada
        }
        else {
          // Jika sudah ada
          let tmps = [];

          try {
            let objects = Object.assign({}, result);
            if (objects.attendees.attendee.length > 0) {
              objects.attendees.attendee.forEach((str) => {
                let idx = tmps.findIndex((arg) => { return arg == str.userID; });
                if (idx == -1 && str.role === "VIEWER") {
                  tmps.push(str.userID);
                }
              })
            }
          } catch (e) {
            // not set
          }

          this.setState({
            peserta_count: tmps,
            dataParticipants: {
              audio: result.attendees.attendee ? Array.isArray(result.attendees.attendee) ?
                result.attendees.attendee.filter(x => x.hasJoinedVoice || x.isListeningOnly).length : result.attendees.attendee.hasJoinedVoice || result.attendees.attendee.isListeningOnly ?
                  1
                  : 0
                : 0,
              camera: result.attendees.attendee ? Array.isArray(result.attendees.attendee) ?
                result.attendees.attendee.filter(x => x.hasVideo).length : result.attendees.attendee.hasVideo ?
                  1
                  : 0
                : 0,
            }
          })
        }
      })
    }
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
  closeModalSendPretest = e => {
    this.setState({ modalSendPretest: false });
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
  setting() {
    this.setState({ setting: !this.state.setting });
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
  kirimJawabanEssay() {
    // if (this.state.jawabanPosttest.length === this.state.posttest.length){
    if (this.state.jawabanEssayKu) {
      let form = {
        id: this.state.webinarId,
        user_id: this.state.user.user_id,
        answer: this.state.jawabanEssayKu
      }
      this.setState({ isLoading: true })
      API.post(`${API_SERVER}v2/webinar-test/essay`, form).then(res => {
        if (res.data.error) {
          toast.error('Failed to submit answer')
          this.setState({ isLoading: false })
        }
        else {
          toast.success('Essay submission sent')

          this.actionResultEssay = false;
          this.setState({ isLoading: false })

          socket.emit('send', {
            socketAction: 'sendEssay',
            webinar_id: this.state.webinarId
          })
          if (this.props.webinarId && this.props.voucher) {
            this.fetchWebinarPublic()
          }
          else {
            this.fetchWebinar()
          }
        }
      })
    }
    else {
      toast.warning('Post-test is mandatory')
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
      this.setState({ isLoading: true })
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if (res.data.error) {
          toast.error('Failed to submit answer')
          this.setState({ isLoading: false })
        }
        else {
          toast.success('Post-test submission sent')
          this.actionPostTest = false;
          socket.emit('send', {
            socketAction: 'kirimJawabanPostTest',
            webinar_id: this.state.webinarId
          })
          this.setState({ isLoading: false })
        }
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
      this.setState({ isLoading: true })
      API.post(`${API_SERVER}v2/webinar-test/input`, form).then(res => {
        if (res.data.error) {
          toast.error('Failed to Submit Pre-Test answers webinar')
          this.setState({ isLoading: false })
        }
        else {
          toast.success('Submit Pre-Test answers webinar')
          this.actionPreTest = false;
          socket.emit('send', {
            socketAction: 'kirimJawabanPreTest',
            webinar_id: this.state.webinarId
          })
          this.setState({ isLoading: false })
        }
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
      this.setState({ isLoading: true });
      API.post(`${API_SERVER}v2/kuesioner/input`, form).then(res => {
        if (res.data.error) {
          toast.error('Already sent answers to the Feedback Form on this webinar')
          this.setState({ isLoading: false });
        }
        else {
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
      this.setState({ isSavingQuestion: true });
      let form = {
        webinar_id: this.state.webinarId,
        jenis_peserta: this.state.user.type ? 'tamu' : 'peserta',
        peserta_id: this.state.user.user_id,
        description: this.state.pertanyaanQNA
      }
      API.post(`${API_SERVER}v2/webinar/qna`, form).then(res => {
        if (res.data.error) {
          toast.error('Failed to send quistionnaire')
          this.setState({ isSavingQuestion: false });
        }
        else {
          toast.success('Question sent')
          this.setState({ isSavingQuestion: false });
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
        }
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
  fetchWebinar(skipCheck) {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if (res.status === 200) {
        this.setState({
          user: res.data.result,
        })
        this.getResultPostPreTest('posttest')
        this.getResultPostPreTest('pretest')
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
              isFeedback: res.data.result.isFeedback,

              engine: res.data.result.engine,
              mode: res.data.result.mode,

              waitingKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startPosttest: res.data.result.posttest_sent === 1 ? true : false,
              startPretest: res.data.result.pretest_sent === 1 ? true : false,
              startEssay: res.data.result.essay_sent === 1 ? true : false
            })
          this.setState({ pembicara: [] })
          res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
          res.data.result.kuesioner_sent === 1 && this.fetchKuesioner()
          if (!this.state.usersPoll.length) {
            res.data.result.peserta.map(x => {
              this.state.usersPoll.push({ id: x.user_id, name: x.name, checked: true })
            })
            res.data.result.tamu.map(x => {
              this.state.usersPoll.push({ id: x.voucher, name: x.name, checked: true })
            })
          }
          this.fetchQNAByUser()
          this.checkProjectAccess()
          this.fetchResultPretest()
          this.fetchResultPosttest()

          this.fetchEssay()
          this.fetchResultEssay()


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
                  if (result.returncode === 'SUCCESS') {
                    // Setelah create, join
                    let joinUrl = api.administration.join(
                      this.state.user.name,
                      this.state.webinar.id,
                      (
                        this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ||
                        this.state.pembicaraId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1)
                        ? 'moderator' : 'peserta',
                      { userID: this.state.user.user_id }
                    )

                    let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                    let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                    let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 1 : 0}`

                    this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl, isLoadingPage: false })

                    this.postLog(this.state.webinar.id, this.state.user.user_id, 'peserta', 'join')
                  }
                  else {
                    console.log('GAGAL', result)
                  }
                })
              }
              else {
                let checkAttendee = !result.attendees.attendee ? 0 : Array.isArray(result.attendees.attendee) ?
                  result.attendees.attendee.filter(x =>
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
                if (checkAttendee) {
                  if (!skipCheck) {
                    this.setState({ joined: true });
                  }
                }
                else {
                  // Jika sudah ada, join
                  let joinUrl = api.administration.join(
                    this.state.user.name,
                    this.state.webinar.id,
                    //this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                    (
                      this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1)
                      ? 'moderator' : 'peserta',
                    { userID: this.state.user.user_id }
                  )

                  let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                  let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                  let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=${this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 1 : 0}`

                  this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl, isLoadingPage: false })

                  this.postLog(this.state.webinar.id, this.state.user.user_id, 'peserta', 'join')
                }
              }
            })
            // BBB JOIN END
          }
          this.setState({ isLoadingPage: false })
        })
      }
    })
  }
  fetchWebinarPublic(skipCheck) {
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
              isFeedback: res.data.result.isFeedback,

              engine: res.data.result.engine,
              mode: res.data.result.mode,

              waitingKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startKuesioner: res.data.result.kuesioner_sent === 1 ? true : false,
              startPosttest: res.data.result.posttest_sent === 1 ? true : false,
              startEssay: res.data.result.essay_sent === 1 ? true : false
            })
          this.setState({ pembicara: [] })
          res.data.result.pembicara.map(item => this.state.pembicara.push(item.name))
          res.data.result.kuesioner_sent === 1 && this.fetchKuesioner()
          this.fetchQNAByUser()
          this.checkProjectAccess()
          this.fetchResultPretest()
          this.fetchResultPosttest()

          this.fetchEssay()
          this.fetchResultEssay()

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
                  if (result.returncode === 'SUCCESS') {
                    // Setelah create, join
                    let joinUrl = api.administration.join(
                      this.state.user.name,
                      this.state.webinar.id,
                      //this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                      (
                        this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ||
                        this.state.pembicaraId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1)
                        ? 'moderator' : 'peserta',
                      { userID: this.state.user.user_id }
                    )

                    let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                    let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                    let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=0}`

                    this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl, isLoadingPage: false })

                    this.postLog(this.state.webinar.id, this.state.user.user_id, 'tamu', 'join')
                  }
                  else {
                    console.log('GAGAL', result)
                  }
                })
              }
              else {
                let checkAttendee = !result.attendees.attendee ? 0 : Array.isArray(result.attendees.attendee) ?
                  result.attendees.attendee.filter(x =>
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
                if (checkAttendee) {
                  if (!skipCheck) {
                    this.setState({ joined: true });
                  }
                }
                else {
                  // Jika sudah ada, join
                  let joinUrl = api.administration.join(
                    this.state.user.name,
                    this.state.webinar.id,
                    //this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ? 'moderator' : 'peserta',
                    (
                      this.state.moderatorId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == Storage.get("user").data.user_id).length >= 1)
                      ? 'moderator' : 'peserta',
                    { userID: this.state.user.user_id }
                  )

                  let zoomUrl = await API.get(`${API_SERVER}v2/webinar/zoom/${this.state.webinar.id}`);
                  let zoomRoom = zoomUrl.data.result.length ? zoomUrl.data.result[0].zoom_id : 0;
                  let zoomJoinUrl = `${ZOOM_URL}/?room=${zoomRoom}&name=${this.state.user.name}&email=${''}&role=0}`

                  this.setState({ joinUrl: joinUrl, zoomUrl: zoomJoinUrl, isLoadingPage: false })

                  this.postLog(this.state.webinar.id, this.state.user.user_id, 'tamu', 'join')
                }
              }
            })
            // BBB JOIN END
          }
          this.setState({ isLoadingPage: false })
        })
      }
    })
  }
  acakDoorprize() {
    let penerima = [];
    for (var i = 0; i < this.state.jawabKuesioner.length; i++) {
      let names = this.state.jawabKuesioner[i].toLowerCase();
      if (
        this.state.moderatorId.filter((item) => item.name.toLowerCase() === names).length >= 1 ||
        this.state.pembicaraId.filter((item) => item.name.toLowerCase() === names).length >= 1 ||
        this.state.sekretarisId.filter((item) => item.name.toLowerCase() === names).length >= 1
      ) {
        console.log(this.state.jawabKuesioner[i], "TEST DOORPRIZE POP")
      } else {
        let idx = penerima.findIndex((str) => { return str === this.state.jawabKuesioner[i] });
        if (idx < 0) {
          penerima.push(this.state.jawabKuesioner[i]);
        }
      }
    }

    this.state.jawabKuesioner = penerima;
    //console.log(this.state.jawabKuesioner, this.state.moderatorId, this.state.pembicaraId, "TEST DOORPRIZE")
    const random = Math.floor(Math.random() * this.state.jawabKuesioner.length);
    socket.emit('send', {
      socketAction: 'pemenangDoorprize',
      webinar_id: this.state.webinarId,
      name: this.state.jawabKuesioner[random]
    })
  }
  fetchResultPretest() {
    this.setState({ loadingTest: true })
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}/0/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.getResultPostPreTest("pretest");
          this.setState({ resultPretest: res.data.result }, () => {
            this.setState({ loadingTest: false })
          })
        }
      }
    })
  }
  openModalPretest() {
    this.setState({ modalResultPretest: true })
  }
  fetchResultEssay() {
    this.setState({ loadingTest: true })
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}/essay/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ resultEssay: res.data.result }, () => {
            this.setState({ loadingTest: false })
          })
        }
      }
    })
  }
  fetchResultPosttest() {
    this.setState({ loadingTest: true })
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}/1/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.getResultPostPreTest("posttest");
          this.setState({ resultPosttest: res.data.result }, () => {

            this.setState({ loadingTest: false })
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
  fetchEssay() {
    API.get(`${API_SERVER}v2/webinar-test-peserta/${this.state.webinarId}/essay/${this.state.user.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ essayTerjawab: res.data.terjawab, essayResult: res.data.result, jawabanEssayKu: res.data.result.length ? res.data.result[0].answer : '' })
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
  fetchPolling() {
    API.get(`${API_SERVER}v2/webinar-test-polling/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          this.setState({ polling: res.data.result })
        }
      }
    })
  }
  getResultPostPreTest(arg) {
    API.get(`${API_SERVER}v2/webinar-test/result/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error fetch data')
        } else {
          //console.log(res.data.result, "TEST BRO")
          let keys = Object.keys(res.data.result);
          for (var i = 0; i < keys.length; i++) {

            //console.log(keys[i], res.data.result[keys[i]], "TEST BRO 1")
            let str = res.data.result[keys[i]];

            if (arg === 'posttest') {

              let idx = this.state.resultPostPreTest_AllUser.posttest.findIndex((chk) => { return chk.user_id === str.user_id });
              if (idx < 0) {

                if (str.posttest && (str.posttest.benar > 0 || str.posttest.salah > 0)) {
                  this.state.resultPostPreTest_AllUser.posttest.push({
                    user_id: str.user_id,
                    name: str.name,
                    selisih: str.selisih,
                    value: str.posttest
                  })
                }
              }
            }
            else if (arg === 'pretest') {
              let idx = this.state.resultPostPreTest_AllUser.pretest.findIndex((chk) => { return chk.user_id === str.user_id });
              if (idx < 0) {
                if (str.pretest && (str.pretest.benar > 0 || str.pretest.salah > 0)) {

                  this.state.resultPostPreTest_AllUser.pretest.push({
                    user_id: str.user_id,
                    name: str.name,
                    selisih: str.selisih,
                    value: str.pretest
                  })
                }
              }
            }

          }
          // console.log(" FETCH DATA API :  ", res.data);
          // console.log("FETCH RESULT TEST : ", this.state.resultPostPreTest_AllUser)

          // if (arg === 'pretest') {
          //   this.SetState({ showModalResultPreTest: true });
          // } else {
          //   this.SetState({ showModalResultPostTest: true });
          // }
        }
      }
    })
  }
  componentDidMount() {
    // if (isMobile) {
    //   if (this.props.webinarId && this.props.voucher){
    //     window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'webinar-guest/' + this.props.webinarId + '/' + this.props.voucher))
    //   }
    //   else{
    //     window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'webinar/live/' + this.state.webinarId))
    //   }
    // }
    this.fetchKuesionerSender()
    socket.on("broadcast", data => {
      if (data.webinar_id == this.state.webinarId) {
        if (this.props.webinarId && this.props.voucher) {
          this.fetchWebinarPublic(true)
        }
        else {
          this.fetchWebinar(true)
        }
      }
      if (data.description && data.webinar_id == this.state.webinarId) {
        this.setState({ qna: [data, ...this.state.qna] })
      }
      if (data.socketAction === 'pemenangDoorprize' && data.webinar_id === this.state.webinarId) {
        this.state.pemenangDoorprize.push(data.name)
        this.setState({ modalDoorprize: true })
        this.closeModalKuesioner()
      }
      if (data.socketAction === 'sendKuesioner' && data.webinar_id === this.state.webinarId) {
        this.setState({ startKuesioner: true, modalKuesionerPeserta: true })
        this.fetchKuesioner()
      }
      if (data.socketAction === 'sendPretest' && data.webinar_id === this.state.webinarId) {
        this.setState({ startPretest: true });
        this.fetchPreTest();

        try {
          if (
            !(
              (
                this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 ||
                this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 ||
                this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length >= 1
              ) &&
              this.state.status == 2
            ) &&
            !this.state.pretestTerjawab
          ) {
            toast.success(`Please fill in the following pre-test questions.`)
            this.actionPreTest.scrollIntoView({ behavior: 'smooth' });
          } // end if
        }// end try 
        catch (e) {
          console.error(e, "SEND_POST_TEST")
        }// end catch
      }
      if (data.socketAction === 'sendPosttest' && data.webinar_id === this.state.webinarId) {
        this.setState({ startPosttest: true });
        this.fetchPostTest();

        try {
          if (
            !(
              (
                this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 ||
                this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 ||
                this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length >= 1
              ) &&
              this.state.status == 2
            ) &&
            !this.state.posttestTerjawab
          ) {
            toast.success(`Please fill in the following post test questions.`)
            this.actionPostTest.scrollIntoView({ behavior: 'smooth' });
          } // end if
        }// end try 
        catch (e) {
          console.error(e, "SEND_POST_TEST")
        }// end catch

      } // end if

      if (data.socketAction === 'sendEssay' && data.webinar_id === this.state.webinarId) {
        try {
          if (

            !(
              (
                this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 ||
                this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length >= 1 ||
                this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length >= 1
              ) &&
              this.state.status == 2
            ) &&
            !this.state.jawabanEssayKu
          ) {
            toast.success(`Please fill in the following essay questions.`)
            this.actionEssay.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (e) {

        }
        this.setState({ startEssay: true });
        if (this.props.webinarId && this.props.voucher) {
          this.fetchWebinarPublic(true)
        }
        else {
          this.fetchWebinar(true)
        }
      }
      if (data.socketAction === 'jawabKuesioner' && data.webinar_id === this.state.webinarId) {
        this.fetchKuesionerSender()
        this.forceUpdate()
      }
      if (data.socketAction === 'fetchPostTest' && data.webinar_id === this.state.webinarId) {
        if (this.props.webinarId && this.props.voucher) {
          this.fetchWebinarPublic(true)
        }
        else {
          this.fetchWebinar(true)
        }
        this.fetchPostTest()
      }
      if (data.socketAction === 'kirimJawabanPostTest' && data.webinar_id === this.state.webinarId) {
        console.log("SOCKET IN : ", data);
        this.getResultPostPreTest('posttest')
      }
      if (data.socketAction === 'kirimJawabanPreTest' && data.webinar_id === this.state.webinarId) {
        console.log("SOCKET IN :", data);
        this.getResultPostPreTest('pretest')
      }
      if (data.socketAction === 'publishPoll' && data.webinar_id === this.state.webinarId && data.userId !== this.state.user.user_id && data.recipient.filter(x => x.id === this.state.user.user_id).length) {
        this.setState({ pollResult: data.data, modalResultPoll: true });
      }
      if (data.socketAction === 'startPoll' && data.webinar_id === this.state.webinarId && data.userId !== this.state.user.user_id && data.recipient.filter(x => x.id === this.state.user.user_id).length) {
        this.setState({ answerPoll: data.data, modalAnswerPoll: true });
        this.state.answerPoll.poll_id = data.poll_id;
        this.forceUpdate();
      }
      if (data.socketAction === 'newPollSubmit' && data.webinar_id === this.state.webinarId && data.userId !== this.state.user.user_id && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length >= 1) {
        this.fetchPolling();
      }
    });
    if (this.props.webinarId && this.props.voucher) {
      this.fetchWebinarPublic()
    }
    else {
      this.fetchWebinar()
    }
    this.fetchQNA()

    //semua link open new tab
    var links = document.getElementsByTagName('a');
    var len = links.length;

    for (var i = 0; i < len; i++) {
      links[i].target = "_blank";
    }
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
    this.timer = setInterval(
      () => this.fetchDataParticipants(),
      5000,
    );
  }
  checkAll(e) {
    this.state.usersPoll.map((item) => {
      item.checked = e.target.checked;
    })
    this.setState({ checkAllUsersPoll: e.target.checked })
  }
  handleChangeChecked(e, i) {
    this.state.usersPoll[i].checked = e.target.checked;
    this.forceUpdate()
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
      else {
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
  startPoll() {
    if (this.state.idPoll) {
      let form = {
        webinar_id: this.state.webinarId,
        id: this.state.idPoll,
        webinar_test: [this.state.createPoll]
      };

      API.put(`${API_SERVER}v2/webinar-test-polling/${form.id}`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Error post data')
          } else {
            API.put(`${API_SERVER}v2/webinar-test-polling-status/${form.id}`, { status: 'On going' }).then(res => {
              if (res.status === 200) {
                if (res.data.error) {
                  toast.error('Error post data')
                } else {
                  toast.success(`Sending poll to participants`)
                  this.fetchPolling();
                  socket.emit('send', {
                    socketAction: 'startPoll',
                    userId: this.state.user.user_id,
                    poll_id: this.state.idPoll,
                    webinar_id: this.state.webinarId,
                    data: this.state.createPoll,
                    recipient: this.state.usersPoll.filter(x => x.checked === true)
                  })
                  this.setState({
                    newPoll: false, idPoll: '', createPoll: {
                      tanya: '',
                      jenis: null,
                      a: '',
                      b: '',
                      c: '',
                      d: '',
                      e: '',
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
    else {
      let form = {
        id: this.state.webinarId,
        webinar_test: [this.state.createPoll]
      };

      API.post(`${API_SERVER}v2/webinar-test-polling-single`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Error post data')
          } else {
            API.put(`${API_SERVER}v2/webinar-test-polling-status/${res.data.result.insertId}`, { status: 'On going' }).then(res2 => {
              if (res2.status === 200) {
                if (res2.data.error) {
                  toast.error('Error post data')
                } else {
                  toast.success(`Sending poll to participants`)
                  this.fetchPolling();
                  socket.emit('send', {
                    socketAction: 'startPoll',
                    userId: this.state.user.user_id,
                    poll_id: res.data.result.insertId,
                    webinar_id: this.state.webinarId,
                    data: this.state.createPoll,
                    recipient: this.state.usersPoll.filter(x => x.checked === true)
                  })
                  this.setState({
                    newPoll: false, createPoll: {
                      tanya: '',
                      jenis: null,
                      a: '',
                      b: '',
                      c: '',
                      d: '',
                      e: '',
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  }
  publishPoll(data) {
    if (data.status === 'Finish') {
      toast.success(`Sending poll result to participants`)
      socket.emit('send', {
        socketAction: 'publishPoll',
        userId: this.state.user.user_id,
        webinar_id: this.state.webinarId,
        data: data,
        recipient: this.state.usersPoll.filter(x => x.checked === true)
      })
    }
    else {
      API.put(`${API_SERVER}v2/webinar-test-polling-status/${data.id}`, { status: 'Finish' }).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Error post data')
          } else {
            toast.success(`Sending poll result to participants`)
            this.fetchPolling();
            socket.emit('send', {
              socketAction: 'publishPoll',
              userId: this.state.user.user_id,
              webinar_id: this.state.webinarId,
              data: data,
              recipient: this.state.usersPoll.filter(x => x.checked === true)
            })
          }
        }
      })
    }
  }

  submitPoll(value) {
    let form = {
      user_id: this.state.user.user_id,
      pengguna: this.state.user.type ? 0 : 1,
      poll_id: this.state.answerPoll.poll_id,
      answer: value
    };
    this.setState({ submitPoll: true });
    API.post(`${API_SERVER}v2/webinar-test-polling-submit`, form).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error post data')
        } else {
          socket.emit('send', {
            socketAction: 'newPollSubmit',
            userId: this.state.user.user_id,
            webinar_id: this.state.webinarId
          })
          this.setState({ submitPoll: false, modalAnswerPoll: false });
          toast.success('Poll submited');
        }
      }
    })
  }

  selectType(type) {
    this.state.createPoll.jenis = type;
    if (type === 0) {
      this.state.createPoll.a = 'True';
      this.state.createPoll.b = 'False';
      this.state.createPoll.c = '';
      this.state.createPoll.d = '';
      this.state.createPoll.e = '';
    }
    else if (type === 1) {
      this.state.createPoll.a = 'A';
      this.state.createPoll.b = 'B';
      this.state.createPoll.c = 'C';
      this.state.createPoll.d = 'D';
      this.state.createPoll.e = '';
    }
    else if (type === 2) {
      this.state.createPoll.a = 'Yes';
      this.state.createPoll.b = 'No';
      this.state.createPoll.c = 'Abstention';
      this.state.createPoll.d = '';
      this.state.createPoll.e = '';
    }

    this.state.hideInputPollDefault = 'visible';
    this.forceUpdate();
  }

  closeSendPoll() {
    this.setState({ modalSendPoll: false, newPoll: false, createPoll: {} })
  }
  closeAnswerPoll() {
    this.setState({ modalAnswerPoll: false })
  }
  closeResultPoll() {
    this.setState({ modalResultPoll: false })
  }
  closeResultPostTest() {
    this.setState({ showModalResultPostTest: false });
  }
  closeResultPreTest() {
    this.setState({ showModalResultPreTest: false });
  }
  backPoll() {
    this.setState({ newPoll: false, createPoll: {}, idPoll: '', setting: false })
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

  sendPretest() {
    API.put(`${API_SERVER}v2/webinar/send-pretest/${this.state.webinarId}`).then(res => {
      if (res.status === 200) {
        socket.emit('send', {
          socketAction: 'sendPretest',
          webinar_id: this.state.webinarId
        })
        toast.success('Pre test sent');
        this.closeModalSendPretest();
      }
    })
  }

  handleDynamicInput = (e) => {
    this.setState({ webinar: { ...this.state.webinar, essay: e } });
  }
  handleDynamicInputPoll = (e) => {
    let newObj = this.state.createPoll;
    if (e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      newObj[name] = value;
      this.setState({ createPoll: newObj });
    } else {
      newObj.tanya = e;
      this.setState({ createPoll: newObj });
    }
    // const { value, name } = e.target;
    // let newObj = [...this.state.pertanyaan];

    // newObj[i][name] = value;
    // this.setState({ pertanyaan: newObj });
  }

  handleDynamicInputEssay = (e) => {
    this.setState({ jawabanEssayKu: e });
  }

  sendEssay() {
    let form = {
      essay: this.state.webinar.essay
    }
    API.put(`${API_SERVER}v2/webinar/send-essay/${this.state.webinarId}`, form).then(res => {
      if (res.status === 200) {
        socket.emit('send', {
          socketAction: 'sendEssay',
          webinar_id: this.state.webinarId
        })
        toast.success('Essay sent');
        this.setState({ modalSendEssay: false })
      }
    })
  }

  render() {
    let plainURL = this.props.voucher ? `${APPS_SERVER}webinar-guest/${this.state.webinarId}/${this.props.voucher}` : `${APPS_SERVER}webinar/live/${this.state.webinarId}`;
    let lengthURL = plainURL.length;
    let iosURL = 'icademy' + plainURL.slice(5, lengthURL)
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
      <div className="row" style={{ margin: '8px 0px' }}>
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-4">
                  <h3 className="f-w-900 f-18 fc-blue">
                    {/* <Link to={`/detail-project/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
                  		border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                  	}}>
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link> */}
                    {this.state.webinar.judul}
                    <p>{this.state.pembicara.toString() !== '' ? 'Speaker : ' : ''}{this.state.pembicara.toString()}</p>
                  </h3>
                  {
                    (this.state.status == 2 || (this.state.isWebinarStartDate && this.state.status == 2)) && !this.state.joined && this.state.isJoin ?
                      <span className="f-w-bold f-12 fc-black" style={{ position: 'absolute', left: 21, bottom: -10 }}>
                        <Tooltip title="Listening" arrow placement="top">
                          <span>
                            <i className="fa fa-headphones" /> {this.state.dataParticipants.audio}
                          </span>
                        </Tooltip>
                        <Tooltip title="Camera On" arrow placement="top" style={{ marginLeft: 8 }}>
                          <span>
                            <i className="fa fa-camera" /> {this.state.dataParticipants.camera}
                          </span>
                        </Tooltip>
                      </span>
                      : null
                  }
                </div>
                <div className="col-sm-8 text-right">
                  {
                    this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 && this.state.status == 2 ?
                      <button onClick={() => this.setState({ modalEnd: true })} className="float-right btn btn-icademy-primary btn-icademy-red">
                        <i className="fa fa-stop-circle"></i>End Webinar
                      </button>
                      : null
                  }
                  {
                    !this.state.isJoin && this.state.status === 2 ?
                      <button className="float-right btn btn-icademy-primary btn-icademy-warning mr-2" onClick={() => this.setState({ isJoin: true })}>
                        <i className="fa fa-video"></i>
                        Join the webinar
                      </button>
                      : null
                  }
                  {
                    (
                      this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == user.user_id).length >= 1
                    )
                      && this.state.peserta.filter((item) => item.user_id == user.user_id).length == 0
                      && this.state.isFeedback
                      && this.state.isJoin ?
                      <button onClick={() => this.setState({ modalKuesioner: true })} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Feedback Form & Doorprize
                      </button>
                      : null
                  }
                  {
                    (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1) && this.state.startKuesioner && this.state.pertanyaan.length > 0 ?
                      <button onClick={() => this.setState({ modalKuesionerPeserta: true })} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-clipboard-list"></i>Feedback Form
                      </button>
                      :
                      null
                  }
                  {
                    (
                      this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == user.user_id).length >= 1
                    ) ?
                      this.state.startEssay && this.state.resultEssay.length > 0 ?
                        <button onClick={() => this.actionResultEssay.scrollIntoView({ behavior: 'smooth' })} className="float-right btn btn-icademy-primary mr-2" style={{ backgroundColor: 'grey' }}>
                          <i className="fa fa-clipboard-list"></i>Essay Result
                        </button>
                        :
                        <button onClick={() => this.setState({ modalSendEssay: true })} className="float-right btn btn-icademy-primary mr-2">
                          <i className="fa fa-paper-plane"></i>Send Essay
                        </button>
                      :
                      null
                  }
                  {
                    //this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 && this.state.posttest.length > 0 ?
                    (
                      this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == user.user_id).length >= 1
                    ) && this.state.posttest.length > 0 ?
                      this.state.resultPostPreTest_AllUser.posttest.length > 0 ||
                        (this.state.resultPosttest.nilai != null && this.state.resultPosttest.nilai != 'NaN' && this.state.posttest.length >= 1) ?
                        <button onClick={() => this.setState({ showModalResultPostTest: true, showModalResultPreTest: false })} className="float-right btn btn-icademy-primary mr-2" style={{ backgroundColor: 'grey' }}>
                          <i className="fa fa-clipboard-list"></i>Post Test Result ({this.state.resultPostPreTest_AllUser.posttest.length})
                        </button>
                        :
                        <button onClick={() => this.setState({ modalSendPosttest: true })} className="float-right btn btn-icademy-primary mr-2">
                          <i className="fa fa-paper-plane"></i>Send Post Test
                        </button>
                      :
                      null
                  }
                  {
                    //this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 && this.state.pretest.length > 0 ?

                    (
                      this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == user.user_id).length >= 1
                    ) && this.state.pretest.length > 0 ?

                      this.state.resultPostPreTest_AllUser.pretest.length > 0 ||
                        (this.state.resultPretest.nilai != null && this.state.resultPretest.nilai != 'NaN' && this.state.pretest.length >= 1) ?
                        <button onClick={() => this.setState({ showModalResultPreTest: true, showModalResultPostTest: false })} className="float-right btn btn-icademy-primary mr-2" style={{ backgroundColor: 'grey' }}>
                          <i className="fa fa-clipboard-list"></i>Pre-Test Result ({this.state.resultPostPreTest_AllUser.pretest.length})
                        </button>
                        :
                        <button onClick={() => this.setState({ modalSendPretest: true })} className="float-right btn btn-icademy-primary mr-2">
                          <i className="fa fa-paper-plane"></i>Send Pre Test
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
                        <i className="fa fa-clipboard-list"></i>Post Test Result
                      </button>
                      :
                      null
                  }
                  {
                    //this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ?
                    (
                      this.state.sekretarisId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.moderatorId.filter((item) => item.user_id == user.user_id).length >= 1 ||
                      this.state.pembicaraId.filter((item) => item.user_id == user.user_id).length >= 1
                    ) ?
                      <button onClick={() => { this.fetchPolling(); this.setState({ modalSendPoll: true }) }} className="float-right btn btn-icademy-primary mr-2">
                        <i className="fa fa-paper-plane"></i>Polling
                      </button>
                      :
                      null
                  }
                  {
                    // (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1) ?
                    //   <button onClick={() => this.setState({ modalAnswerPoll: true })} className="float-right btn btn-icademy-primary mr-2">
                    //     <i className="fa fa-paper-plane"></i>Answer Poll
                    //   </button>
                    //   :
                    //   null
                  }
                  {
                    // (this.state.peserta.filter((item) => item.user_id == user.user_id).length >= 1 || this.state.tamu.filter((item) => item.voucher == user.user_id).length >= 1) ?
                    //   <button onClick={() => this.setState({ modalResultPoll: true })} className="float-right btn btn-icademy-primary mr-2">
                    //     <i className="fa fa-paper-plane"></i>Poll Result
                    //   </button>
                    //   :
                    //   null
                  }

                </div>
              </div>
              {
                this.state.isLoadingPage ?
                  <div>Loading...</div>
                  :
                  <div style={{ marginTop: '10px' }}>
                    <div className="row">
                      <div className="col-sm-12">
                        {
                          (this.state.status == 2 || (this.state.isWebinarStartDate && this.state.status == 2)) && !this.state.joined ?
                            this.state.isJoin ?
                              <div style={{ background: `url('newasset/loading.gif') center center no-repeat` }}>
                                <Iframe url={this.state.engine === 'zoom' ? this.state.zoomUrl : this.state.joinUrl}
                                  width="100%"
                                  height="600px"
                                  display="initial"
                                  frameBorder="0"
                                  allow="fullscreen *;geolocation *; microphone *; camera *; display-capture"
                                  position="relative" />
                              </div>
                              : null
                            :
                            this.state.status == 3 ?
                              <h3>The webinar has ended</h3>
                              :
                              <h3>Webinars start on {moment(this.state.tanggal).local().format('DD MMMM YYYY HH:mm')} until {moment(this.state.tanggalEnd).local().format('DD MMMM YYYY HH:mm')} ({moment.tz.guess()} Timezone)</h3>
                        }
                        {
                          this.state.joined ?
                            <h4 style={{ marginTop: '20px' }}>You are currently a participant of this webinar on another device or browser tab.<br />If you want to access webinar from this page, exit from the other device and refresh this page afterwards.</h4>
                            : null
                        }
                        {
                          this.state.status !== 3 &&
                          <div className="dekripsi" style={{ marginTop: '20px', color: '#000', lineHeight: '24px', position: 'relative' }}>
                            <h4>Description</h4>
                            <div className={(this.state.isJoin && !this.state.showDescription) ? 'webinar-description' : 'webibar-description-full'} dangerouslySetInnerHTML={{ __html: this.state.webinar.isi }} />
                            {
                              (this.state.isJoin && !this.state.showDescription) ?
                                <div className='webinar-description-overlay' />
                                : null
                            }
                          </div>
                        }
                        <center>
                          {
                            this.state.isJoin && this.state.status !== 3 ?
                              this.state.showDescription ?
                                <span className="webinar-description-button" onClick={() => { this.setState({ showDescription: false }); this.forceUpdate(); }}>Hide description</span>
                                :
                                <span className="webinar-description-button" onClick={() => { this.setState({ showDescription: true }); this.forceUpdate(); }}>See full description</span>
                              : null
                          }
                        </center>

                        {
                          this.state.isJoin && this.state.startPretest && this.state.enablePretest && this.state.pretestTerjawab === false && (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length === 0) ?
                            <div className="mt-4">
                              <div style={{ float: "left", clear: "both" }}
                                ref={(el) => { this.actionPreTest = el; }}>
                              </div>
                              <h4>Answer the Pre-test</h4>
                              <div className="alert alert-danger mt-2">
                                <b>Please answer the questions below (in {this.state.waktuPretest} minutes). If you have finished answering the questions, please click "Send Pre-Test Answers".<br />
                                  Please complete the answers for not over than allotted time, orherwise the result in the pre-test will be automatically closed.</b>
                              </div>
                              <div className="fc-blue mb-4" style={{ fontSize: '18px', fontWeight: 'bold' }}>
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
                                    <span className='f-w-900 fc-blue'>Question {index + 1}</span><div style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: item.tanya }}></div>
                                    {item.a && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawabPretest} /> <label for='a'> {item.a[1]}</label></div>}
                                    {item.b && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawabPretest} /> <label for='b'> {item.b[1]}</label></div>}
                                    {item.c && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawabPretest} /> <label for='c'> {item.c[1]}</label></div>}
                                    {item.d && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawabPretest} /> <label for='d'> {item.d[1]}</label></div>}
                                    {item.e && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawabPretest} /> <label for='e'> {item.e[1]}</label></div>}
                                  </div>
                                ))
                              }
                              <button
                                disabled={this.state.isLoading}
                                className="btn btn-icademy-primary"
                                onClick={this.kirimJawabanPretest.bind(this)}
                              >
                                <i className="fa fa-paper-plane"></i>
                                {this.state.isLoading ? 'Submitting...' : 'Send Pre-Test Answers'}
                              </button>
                            </div>
                            : null
                        }

                        {
                          this.state.isJoin && this.state.startEssay && (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length === 0) ?
                            <div className="mt-4">
                              <div style={{ float: "left", clear: "both" }}
                                ref={(el) => { this.actionEssay = el; }}>
                              </div>
                              <h4>Answer the Essay</h4>
                              <div style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: this.state.webinar.essay }}></div>

                              {
                                this.state.essayTerjawab === false ?
                                  <Fragment>
                                    <Editor
                                      apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                      initialValue={this.state.jawabanEssayKu}
                                      value={this.state.jawabanEssayKu}
                                      init={{
                                        height: 400,
                                        width: "100%",
                                        menubar: false,
                                        convert_urls: false,
                                        image_class_list: [
                                          { title: 'None', value: '' },
                                          { title: 'Responsive', value: 'img-responsive' },
                                          { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                                        ],
                                        file_browser_callback_types: 'image media',
                                        file_picker_callback: function (callback, value, meta) {
                                          if (meta.filetype == 'image' || meta.filetype == 'media' || meta.filetype == 'file') {
                                            var input = document.getElementById(`myFile`);
                                            input.click();
                                            input.onchange = function () {

                                              var dataForm = new FormData();
                                              dataForm.append('file', this.files[0]);

                                              window.$.ajax({
                                                url: `${API_SERVER}v2/media/upload`,
                                                type: 'POST',
                                                data: dataForm,
                                                processData: false,
                                                contentType: false,
                                                success: (data) => {
                                                  callback(data.result.url);
                                                  this.value = '';
                                                }
                                              })

                                            };
                                          }
                                        },
                                        plugins: [
                                          "advlist autolink lists link image charmap print preview anchor",
                                          "searchreplace visualblocks code fullscreen",
                                          "insertdatetime media table paste code help wordcount"
                                        ],
                                        media_live_embeds: true,
                                        toolbar:
                                          // eslint-disable-next-line no-multi-str
                                          "undo redo | fontsizeselect bold italic backcolor forecolor | \
                                      alignleft aligncenter alignright alignjustify | image | media | \
                                          bullist numlist outdent indent | removeformat | help"
                                      }}
                                      onEditorChange={e => this.handleDynamicInputEssay(e)}
                                    />

                                    <button
                                      disabled={this.state.isLoading}
                                      className="btn btn-icademy-primary mt-3"
                                      onClick={this.kirimJawabanEssay.bind(this)}
                                    >
                                      <i className="fa fa-paper-plane"></i>
                                      {this.state.isLoading ? 'Submitting...' : 'Send Essay Answers'}
                                    </button>
                                  </Fragment>
                                  :
                                  <div style={{ color: 'grey' }} dangerouslySetInnerHTML={{ __html: this.state.jawabanEssayKu }}></div>
                              }
                            </div>
                            : null
                        }

                        {
                          this.state.isJoin && this.state.startEssay && (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length || this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length || this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length || this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length) ?
                            <div className="mt-4">
                              <div style={{ float: "left", clear: "both" }}
                                ref={(el) => { this.actionResultEssay = el; }}>
                              </div>
                              <h4>Result Answer the Essay</h4>
                              <div style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: this.state.webinar.essay }}></div>

                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Answer</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    this.state.resultEssay.map((item, i) => (
                                      <tr>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                          <div style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </div>
                            : null
                        }

                        {
                          this.state.isJoin && this.state.startPosttest && (!this.state.startPretest || (this.state.startPretest && this.state.pretestTerjawab === true)) && this.state.posttestTerjawab === false && (this.state.pembicaraId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.moderatorId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.sekretarisId.filter((item) => item.user_id == this.state.user.user_id).length === 0 && this.state.ownerId.filter((item) => item.user_id == this.state.user.user_id).length === 0) &&
                          <div style={{ marginTop: 20 }}>
                            <div style={{ float: "left", clear: "both" }}
                              ref={(el) => { this.actionPostTest = el; }}>
                            </div>
                            <h4>Answer the post-test</h4>
                            <div className="alert alert-danger mt-2">
                              <b>Please answer the questions below (in {this.state.waktuPosttest} minutes). If you have finished answering the questions, please click "Send Post-Test Answers".<br />
                                Please complete the answers for not over than allotted time, orherwise the result in the pre-test will be automatically closed.</b>
                            </div>
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
                                    Time limit <Timer.Hours />:
                                    <Timer.Minutes />:
                                    <Timer.Seconds />
                                  </React.Fragment>
                                )}
                              </Timer>
                            </div>
                            {
                              this.state.posttest.map((item, index) => (
                                <div className="mb-3">
                                  <span className='f-w-900 fc-blue'>Question {index + 1}</span><div style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: item.tanya }}></div>
                                  {item.a && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawabPosttest} /> <label for='a'> {item.a[1]}</label></div>}
                                  {item.b && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawabPosttest} /> <label for='b'> {item.b[1]}</label></div>}
                                  {item.c && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawabPosttest} /> <label for='c'> {item.c[1]}</label></div>}
                                  {item.d && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawabPosttest} /> <label for='d'> {item.d[1]}</label></div>}
                                  {item.e && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawabPosttest} /> <label for='e'> {item.e[1]}</label></div>}
                                </div>
                              ))
                            }
                            <button
                              disabled={this.state.isLoading}
                              className="btn btn-icademy-primary"
                              onClick={this.kirimJawabanPosttest.bind(this)}
                            >
                              <i className="fa fa-paper-plane"></i>
                              {this.state.isLoading ? 'Submitting...' : 'Send Post-Test Answers'}
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
          (this.state.projectId !== 0 && (this.state.status === 2 || this.state.status === 1)) &&
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
                          disabled={this.state.isSavingQuestion}
                          className="btn btn-icademy-primary float-right"
                          onClick={this.sendQNA.bind(this)}
                        >
                          <i className="fa fa-paper-plane"></i>
                          {this.state.isSavingQuestion ? 'Sending...' : 'Send'}
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
          show={this.state.modalSendEssay}
          onHide={() => this.setState({ modalSendEssay: false })}
          dialogClassName="modal-lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Send Essay
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input id={`myFile`} type="file" name={`myFile`} style={{ display: "none" }} onChange="" />
            <Editor
              apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
              initialValue={this.state.webinar.essay}
              value={this.state.webinar.essay}
              init={{
                height: 400,
                width: "100%",
                menubar: false,
                convert_urls: false,
                image_class_list: [
                  { title: 'None', value: '' },
                  { title: 'Responsive', value: 'img-responsive' },
                  { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                ],
                file_browser_callback_types: 'image media',
                file_picker_callback: function (callback, value, meta) {
                  if (meta.filetype == 'image' || meta.filetype == 'media' || meta.filetype == 'file') {
                    var input = document.getElementById(`myFile`);
                    input.click();
                    input.onchange = function () {

                      var dataForm = new FormData();
                      dataForm.append('file', this.files[0]);

                      window.$.ajax({
                        url: `${API_SERVER}v2/media/upload`,
                        type: 'POST',
                        data: dataForm,
                        processData: false,
                        contentType: false,
                        success: (data) => {
                          callback(data.result.url);
                          this.value = '';
                        }
                      })

                    };
                  }
                },
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount"
                ],
                media_live_embeds: true,
                toolbar:
                  // eslint-disable-next-line no-multi-str
                  "undo redo | fontsizeselect bold italic backcolor forecolor | \
              alignleft aligncenter alignright alignjustify | image | media | \
                  bullist numlist outdent indent | removeformat | help"
              }}
              onEditorChange={e => this.handleDynamicInput(e)}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-icademy-primary"
              onClick={this.sendEssay.bind(this)}
            >
              <i className="fa fa-paper-plane"></i>
              Send to participant
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.modalSendPretest}
          onHide={this.closeModalSendPretest}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Send Pre Test
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>There are <b>{this.state.pretest.length}</b> question with <b>{this.state.waktuPretest} minutes</b> time limit.</div>
            <div>Are you sure want to send pre test to attendences ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-icademy-primary"
              onClick={this.sendPretest.bind(this)}
            >
              <i className="fa fa-paper-plane"></i>
              Send Pre Test
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
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              Are you sure want to close Feedback Form ?
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
                  {item.a && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.a[0]} onChange={this.handleJawab} /> <label for='a'> {item.a[1]}</label></div>}
                  {item.b && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.b[0]} onChange={this.handleJawab} /> <label for='b'> {item.b[1]}</label></div>}
                  {item.c && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.c[0]} onChange={this.handleJawab} /> <label for='c'> {item.c[1]}</label></div>}
                  {item.d && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.d[0]} onChange={this.handleJawab} /> <label for='d'> {item.d[1]}</label></div>}
                  {item.e && <div style={{ margin: '0px 10px' }}><input name={item.question_id} type="radio" value={item.e[0]} onChange={this.handleJawab} /> <label for='e'> {item.e[1]}</label></div>}
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
                        <span>Question {index + 1}</span><div dangerouslySetInnerHTML={{ __html: item.pertanyaan }}></div>
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
                        <span>Question {index + 1}</span><div dangerouslySetInnerHTML={{ __html: item.pertanyaan }}></div>
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
        {
          this.state.showModalResultPostTest ?
            <div className="poll-modal" style={{ width: '240px' }}>
              <div className="poll-header">
                Post Test Result
                <i className="fa fa-times" style={{ float: 'right', cursor: 'pointer' }} onClick={this.closeResultPostTest.bind(this)}></i>
              </div>
              <div className="poll-body">
                {
                  //<label style={{ color: 'rgba(0,0,0,0.85)', wordBreak: 'break-word' }}>
                  //<div style={{ float: 'left' }} dangerouslySetInnerHTML={{ __html: this.state.pollResult.tanya }} />
                  //</label>
                }
                <div className="option-box" style={{ border: 'none', padding: '0px', width: '100%', margin: '0px', marginBottom: '10px' }}>
                  {
                    <table id="table-test" className="table table-striped" style={{ marginLeft: '-10px' }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.resultPostPreTest_AllUser.posttest.map((key) => {
                            return (
                              <tr>
                                <td>{key.name}</td>
                                <td>{key.value.nilai.toFixed(2)}</td>
                              </tr>)
                          })
                        }
                      </tbody>
                    </table>
                    //this.state.resultPostPreTest_AllUser.posttest.map((x) =>
                    // <>
                    //  <label style={{ textAlign: 'left' }}>Name: {x.name}</label>
                    // <label style={{ textAlign: 'left' }}>Score: {x.value.nilai.toFixed(2)}</label>
                    //<label style={{ textAlign: 'left' }}>Deviation: {x.selisih.toFixed(2)}</label>
                    //</>
                    //)
                  }
                </div>
              </div>
            </div>
            : null
        }
        {
          this.state.showModalResultPreTest ?
            <div className="poll-modal" style={{ width: '240px' }}>
              <div className="poll-header">
                Pre Test Result
                <i className="fa fa-times" style={{ float: 'right', cursor: 'pointer' }} onClick={this.closeResultPreTest.bind(this)}></i>
              </div>
              <div className="poll-body">
                {
                  //<label style={{ color: 'rgba(0,0,0,0.85)', wordBreak: 'break-word' }}>
                  //<div style={{ float: 'left' }} dangerouslySetInnerHTML={{ __html: this.state.pollResult.tanya }} />
                  //</label>
                }
                <div className="option-box" style={{ border: 'none', padding: '0px', width: '100%', margin: '0px', marginBottom: '10px' }}>
                  {
                    <table id="table-test" className="table table-striped" style={{ marginLeft: '-10px' }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.resultPostPreTest_AllUser.pretest.map((key) => {
                            return (
                              <tr>
                                <td>{key.name}</td>
                                <td>{key.value.nilai.toFixed(2)}</td>
                              </tr>)
                          })
                        }
                      </tbody>
                    </table>
                    // this.state.resultPostPreTest_AllUser.pretest.map((x) =>
                    //   <>
                    //     <label style={{ textAlign: 'left' }}>{x.name}</label>
                    //     <label style={{ textAlign: 'left' }}>{x.value.nilai.toFixed(2)}</label>
                    //     <label style={{ textAlign: 'left' }}>{x.selisih.toFixed(2)}</label>
                    //   </>
                    // )
                  }
                </div>
              </div>
            </div>
            : null
        }
        {
          this.state.modalSendPoll ?
            <div className="poll-modal">
              <div className="poll-header">
                {
                  this.state.newPoll || this.state.setting ?
                    <i className="fa fa-chevron-left" style={{ float: 'left', cursor: 'pointer', lineHeight: '18px', fontSize: '16px', marginRight: '10px' }} onClick={this.backPoll.bind(this)}></i>
                    : null
                }
                Polling
                <i className="fa fa-times" style={{ float: 'right', cursor: 'pointer' }} onClick={this.closeSendPoll.bind(this)}></i>
              </div>
              <div className="poll-body">
                {
                  this.state.newPoll ? null :
                    <label>{this.state.setting ? 'Tick users who will receive the poll.' : this.state.polling.length ? 'Click the poll to broadcast the question.' : 'You have no poll, click Add Poll to create a new one.'}</label>
                }
                {
                  this.state.newPoll || this.state.setting ? null :
                    <i className="fa fa-cog" style={{ float: 'right', cursor: 'pointer' }} onClick={this.setting.bind(this)}></i>
                }
                <div className="row">
                  {
                    this.state.newPoll || this.state.setting ? null :
                      this.state.polling.map((item) =>
                        <span className={`option-box ${item.status === 'Finish' ? 'selected' : ''}`} style={{ width: '100%', textAlign: 'left' }}
                          onClick={() => {
                            if (item.status !== 'Draft') {
                              item.show = item.show ? !item.show : true; this.forceUpdate()
                            }
                            else {
                              if (this.state.polling.filter(x => x.status === 'On going').length) {
                                toast.warning('You should finish the on going poll before start another poll')
                              }
                              else {
                                this.setState({
                                  idPoll: item.id,
                                  newPoll: true,
                                  hideInputPollDefault: 'visible',
                                  createPoll: {
                                    tanya: item.tanya,
                                    jenis: item.jenis,
                                    a: item.a ? item.a : '',
                                    b: item.b ? item.b : '',
                                    c: item.c ? item.c : '',
                                    d: item.d ? item.d : '',
                                    e: item.e ? item.e : '',
                                  }
                                })
                              }
                            }
                          }}>
                          <span style={{ float: 'left', fontSize: '11px', fontWeight: 'normal' }}><b>No. {item.no}</b></span>
                          <span style={{ float: 'right', fontSize: '11px', fontWeight: 'normal' }}>{`(${item.answer.length} / ${this.state.peserta_count.length}) `}<b>{item.status}</b></span>
                          <br />
                          <div style={{ float: 'left', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: item.tanya.length > 30 ? `${item.tanya.substring(0, 255)}` : item.tanya }} />
                          {
                            (item.status === 'On going' || item.show) ?
                              <>
                                {
                                  item.answer.map((x) =>
                                    <>
                                      <label>{x.value}</label>
                                      <div className="progress-container">
                                        <div className="progress-poll">
                                          <div className="bar" style={{ width: `${x.percent}%` }} />
                                        </div>
                                        <div className="percent">
                                          {x.percent}%
                                        </div>
                                      </div>
                                    </>
                                  )
                                }
                                <span className={`option-box option-full`} style={{ float: 'left', marginTop: '10px' }} onClick={this.publishPoll.bind(this, item)}>
                                  Publish Poll
                                </span>
                              </>
                              : null
                          }
                        </span>
                      )
                  }
                </div>
                {
                  this.state.setting ? <>
                    <input type="checkbox" id="checkall" checked={this.state.checkAllUsersPoll} onChange={(e) => this.checkAll(e)} />&nbsp;
                    <label for="checkall" style={{ marginBottom: 14 }}>Check all</label>
                    {
                      this.state.usersPoll.map((item, i) =>
                        <div>
                          <input type="checkbox" id={item.id} value={item.id} checked={item.checked} onChange={(e) => this.handleChangeChecked(e, i)} />&nbsp;
                          <label for={item.id}>{item.name}</label>
                        </div>
                      )
                    }</>
                    : null
                }
                {
                  this.state.newPoll ?
                    <div className="form-group icademy-rounded">
                      <label className="icademy-label icademy-label-small">Ask a Question</label>
                      <input id={`myFile`} type="file" name={`myFile`} style={{ display: "none" }} onChange="" />
                      <Editor
                        apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                        initialValue={this.state.createPoll.tanya}
                        value={this.state.createPoll.tanya}
                        style={{ borderRadius: 10 }}
                        init={{
                          height: 200,
                          menubar: false,
                          convert_urls: false,
                          image_class_list: [
                            { title: 'None', value: '' },
                            { title: 'Responsive', value: 'img-responsive' },
                            { title: 'Thumbnail', value: 'img-responsive img-thumbnail' }
                          ],
                          file_browser_callback_types: 'image media',
                          file_picker_callback: function (callback, value, meta) {
                            if (meta.filetype == 'image' || meta.filetype == 'media' || meta.filetype == 'file') {
                              var input = document.getElementById(`myFile`);
                              input.click();
                              input.onchange = function () {

                                var dataForm = new FormData();
                                dataForm.append('file', this.files[0]);

                                window.$.ajax({
                                  url: `${API_SERVER}v2/media/upload`,
                                  type: 'POST',
                                  data: dataForm,
                                  processData: false,
                                  contentType: false,
                                  success: (data) => {
                                    callback(data.result.url);
                                    this.value = '';
                                  }
                                })

                              };
                            }
                          },
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount"
                          ],
                          toolbar:
                            // eslint-disable-next-line no-multi-str
                            "undo redo | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | image media | \
                          bullist numlist outdent indent | removeformat | help"
                        }}
                        onEditorChange={e => this.handleDynamicInputPoll(e)}
                      />

                      <div className="jawaban mt-3">
                        <label className="icademy-label icademy-label-small">Response Type</label>
                        <div className="row" style={{ marginLeft: '0px' }}>
                          <span className={`option-box option-small ${this.state.createPoll.jenis === 0 && 'selected'}`} onClick={this.selectType.bind(this, 0)}>
                            True / False
                          </span>
                          <span className={`option-box option-small ${this.state.createPoll.jenis === 1 && 'selected'}`} onClick={this.selectType.bind(this, 1)}>
                            A / B / C / D
                          </span>
                        </div>
                        <div className="row" style={{ marginLeft: '0px' }}>
                          <span className={`option-box option-small ${this.state.createPoll.jenis === 2 && 'selected'}`} onClick={this.selectType.bind(this, 2)} style={{ clear: 'both' }}>
                            Yes / No / Abstention
                          </span>
                          <span className={`option-box option-small ${this.state.createPoll.jenis === 3 && 'selected'}`} onClick={this.selectType.bind(this, 3)}>
                            User Response
                          </span>
                        </div>
                      </div>
                      <div className="jawaban mt-3">
                        <label className="icademy-label icademy-label-small">
                          {
                            this.state.createPoll.jenis === 0 ? 'True / False' :
                              this.state.createPoll.jenis === 1 ? 'A / B / C / D' :
                                this.state.createPoll.jenis === 2 ? 'Yes / No / Abstention' :
                                  this.state.createPoll.jenis === 3 ? 'User Response' :
                                    ''
                          }
                        </label>
                        {
                          this.state.createPoll.jenis === null ? '' :
                            this.state.createPoll.jenis === 3 ?
                              <div>
                                <div style={{ width: '100%' }}>
                                  <label>Users will be presented with a text box to fill in their response.</label>
                                </div>
                                <div style={{ width: '100%' }}>
                                  <img src="newasset/freetext.png" />
                                </div>
                              </div>
                              :
                              <>
                                <tr>
                                  <td>
                                    <input type="text" onChange={e => this.handleDynamicInputPoll(e)} name="a" value={this.state.createPoll.a} className="form-control icademy-field" style={{ width: '320px', fontSize: '9.8px', height: 'auto', padding: '11px 14px', visibility: this.state.hideInputPollDefault }} />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <input type="text" onChange={e => this.handleDynamicInputPoll(e)} name="b" value={this.state.createPoll.b} className="form-control icademy-field" style={{ width: '320px', fontSize: '9.8px', height: 'auto', padding: '11px 14px', visibility: this.state.hideInputPollDefault }} />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <input type="text" onChange={e => this.handleDynamicInputPoll(e)} name="c" value={this.state.createPoll.c} className="form-control icademy-field" style={{ width: '320px', fontSize: '9.8px', height: 'auto', padding: '11px 14px', visibility: this.state.hideInputPollDefault }} />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <input type="text" onChange={e => this.handleDynamicInputPoll(e)} name="d" value={this.state.createPoll.d} className="form-control icademy-field" style={{ width: '320px', fontSize: '9.8px', height: 'auto', padding: '11px 14px', visibility: this.state.hideInputPollDefault }} />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <input type="text" onChange={e => this.handleDynamicInputPoll(e)} name="e" value={this.state.createPoll.e} className="form-control icademy-field" style={{ width: '320px', fontSize: '9.8px', height: 'auto', padding: '11px 14px', visibility: this.state.hideInputPollDefault }} />
                                  </td>
                                </tr>
                              </>
                        }
                      </div>
                    </div>
                    :
                    this.state.setting ? null :
                      <div className="col-sm-12" style={{ textAlign: 'center', marginTop: 10 }}>
                        <span className="icademy-label label-small" style={{ cursor: 'pointer' }} onClick={() => {
                          if (this.state.polling.filter(x => x.status === 'On going').length) {
                            toast.warning('You should finish the on going poll before start another poll')
                          }
                          else {
                            this.setState({ newPoll: true })
                          }
                        }
                        }><i className="fa fa-plus"></i> Add Poll</span>
                      </div>
                }
                {
                  this.state.newPoll ?
                    <button className={`icademy-button-full ${(!this.state.createPoll.tanya || this.state.createPoll.jenis === null) && 'disabled'}`} disabled={!this.state.createPoll.tanya || this.state.createPoll.jenis === null} onClick={this.startPoll.bind(this)}>Start Poll</button>
                    : null
                }
              </div>
            </div>
            : null
        }
        {
          this.state.modalAnswerPoll ?
            <div className="poll-modal">
              <div className="poll-header">
                Answer Poll
                <i className="fa fa-times" style={{ float: 'right', cursor: 'pointer' }} onClick={this.closeAnswerPoll.bind(this)}></i>
              </div>
              <div className="poll-body">
                <label style={{ color: 'rgba(0,0,0,0.85)', float: 'left', wordBreak: 'break-word' }}>
                  <div dangerouslySetInnerHTML={{ __html: this.state.answerPoll.tanya }} />
                </label>
                <label className="icademy-label icademy-label-small" style={{ float: 'left', clear: 'both' }}>{this.state.answerPoll.jenis === 3 ? 'Fill your answer' : 'Choose your answer'}</label>
                <div className="row" style={{ marginLeft: '0px', float: 'left', clear: 'both' }}>
                  {
                    this.state.answerPoll.jenis === 3 ?
                      <textarea className="poll-freetext" placeholder="Fill your answer..." value={this.state.pollFreetext} onChange={(e) => this.setState({ pollFreetext: e.target.value })}></textarea>
                      :
                      <>
                        {
                          this.state.answerPoll.a &&
                          <span className={`option-box option-full ${this.state.createPoll.jenis === 0 && 'selected'}`} onClick={this.submitPoll.bind(this, this.state.answerPoll.a)}>
                            {this.state.answerPoll.a}
                          </span>
                        }
                        {
                          this.state.answerPoll.b &&
                          <span className={`option-box option-full ${this.state.createPoll.jenis === 0 && 'selected'}`} onClick={this.submitPoll.bind(this, this.state.answerPoll.b)}>
                            {this.state.answerPoll.b}
                          </span>
                        }
                        {
                          this.state.answerPoll.c &&
                          <span className={`option-box option-full ${this.state.createPoll.jenis === 0 && 'selected'}`} onClick={this.submitPoll.bind(this, this.state.answerPoll.c)}>
                            {this.state.answerPoll.c}
                          </span>
                        }
                        {
                          this.state.answerPoll.d &&
                          <span className={`option-box option-full ${this.state.createPoll.jenis === 0 && 'selected'}`} onClick={this.submitPoll.bind(this, this.state.answerPoll.d)}>
                            {this.state.answerPoll.d}
                          </span>
                        }
                        {
                          this.state.answerPoll.e &&
                          <span className={`option-box option-full ${this.state.createPoll.jenis === 0 && 'selected'}`} onClick={this.submitPoll.bind(this, this.state.answerPoll.e)}>
                            {this.state.answerPoll.e}
                          </span>
                        }
                      </>
                  }
                </div>
                {
                  this.state.answerPoll.jenis === 3 ?
                    <button style={{ marginTop: 10 }} className={`icademy-button-full ${(!this.state.pollFreetext.length || this.state.submitPoll) && 'disabled'}`} disabled={!this.state.pollFreetext.length || this.state.submitPoll} onClick={this.submitPoll.bind(this, this.state.pollFreetext)}>{this.state.submitPoll ? 'Submitting...' : 'Submit'}</button>
                    : null
                }
              </div>
            </div>
            : null
        }
        {
          this.state.modalResultPoll ?
            <div className="poll-modal" style={{ width: '240px' }}>
              <div className="poll-header">
                Poll Result
                <i className="fa fa-times" style={{ float: 'right', cursor: 'pointer' }} onClick={this.closeResultPoll.bind(this)}></i>
              </div>
              <div className="poll-body">
                <label style={{ color: 'rgba(0,0,0,0.85)', wordBreak: 'break-word' }}>
                  <div style={{ float: 'left' }} dangerouslySetInnerHTML={{ __html: this.state.pollResult.tanya }} />
                </label>
                <div className="option-box" style={{ border: 'none', padding: '0px', width: '100%', margin: '0px', marginBottom: '10px' }}>
                  {
                    this.state.pollResult.answer.map((x) =>
                      <>
                        <label style={{ textAlign: 'left' }}>{x.value}</label>
                        <div className="progress-container">
                          <div className="progress-poll">
                            <div className="bar" style={{ width: `${x.percent}%` }} />
                          </div>
                          <div className="percent">
                            {x.percent}%
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            : null
        }
        {
          isMobile && this.state.showOpenApps ?
            <div className="floating-message">
              <button className="floating-close" onClick={() => this.setState({ showOpenApps: false })}><i className="fa fa-times"></i></button>
              <p style={{ marginTop: 8 }}>Want to use mobile apps ?</p>
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
    );
  }
}
