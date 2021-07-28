import React from 'react'
import ReactFullScreenElement from "react-fullscreen-element";
import Iframe from 'react-iframe';
import axios from 'axios'

import API, { APPS_SERVER, API_SERVER, USER_ME, API_SOCKET, BBB_KEY, BBB_URL, CHIME_URL } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone'
import { Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify'
import { isMobile } from 'react-device-detect';
import Detail from '../tugas/kuis-new';

import { Link } from 'react-router-dom'

import { PDFReader, MobilePDFReader } from 'reactjs-pdf-view';
// Core viewer
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import SocketContext from '../../socket';

const bbb = require('bigbluebutton-js')

class Mengajar extends React.Component {

  constructor(props, context) {
    super(props, context)
  }

  state = {
    role: this.props.role.toString().toLowerCase(),
    jadwalId: this.props.match.params.jadwalId,
    jenis: this.props.match.params.jenis,
    sesiId: this.props.match.params.sesiId,

    projectAdmin: this.props.role.toString().toLowerCase() === "guru" ? true : false,

    openReportTugas: false,

    fullscreen: false,
    infoJadwal: {},
    infoChapter: {},

    openKelas: false,
    infoKelas: {},
    infoMurid: [],

    openUpload: false,
    attachmentId: [],
    infoFiles: [],
    deleteFileId: '',
    deleteFileName: '',
    modalDeleteFile: false,

    openKehadiran: false,
    isAbsen: false,

    joinUrl: '',
    modalEnd: false,

    startPertemuan: this.props.match.params.jenis === 'kuis' ? true : false,
    isSubmit: false,

    isTatapMuka: 0,

    isStarted: 0,

    attendee: {},

    waktuPengerjaan: 0,

    mengumpulkan: [],
    contentSesi: 'materi',

    isModalDetail: false,
    examId: '',
    tipeJawab: '',
    examTitle: '',
    examSoal: [],

    keyFile: Math.random().toString(25),
    file: '',
    deskripsi: '',

    jawaban: '',
    submitted: false,

    scoreTugas: 0,
  }

  fetchPertanyaan(examId) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      this.setState({ examSoal: res.data.result })
    })
  }

  fetchSilabus() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal one`)

      this.setState({ pelajaranId: res.data.result.pelajaran_id })
      API.get(`${API_SERVER}v2/silabus/pelajaran/${res.data.result.pelajaran_id}`).then(res => {
        if(res.data.error) console.log(`Error: fetch overview`)

        const { result } = res.data;
        const filterKuis = result.filter(item => item.jenis === (this.state.jenis === 'kuis' ? 1 : 2));
        this.setState({ waktuPengerjaan: (filterKuis.length ? filterKuis[0].durasi : 120) * 60 });
      })
    })
  }

  endMeeting() {
    // BBB END
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    let meetingID = `${this.state.jadwalId}-${this.state.jenis}-${this.state.sesiId}`;
    let endMeeting = api.administration.end(meetingID, 'moderator')
    http(endMeeting).then((result) => {
      if (result.returncode == 'SUCCESS') {
        this.closeModalEnd()
        toast.success('Mengakhiri kelas untuk semua murid.')
      }
    })
  }

  closeModalEnd = e => {
    this.setState({ modalEnd: false });
  }

  closeModalDeleteFile = e => {
    this.setState({ modalDeleteFile: false, deleteFileName: '', deleteFileId: '' })
  }

  fetchMurid(jadwalId) {
    API.get(`${API_SERVER}v2/murid/jadwal-absen/${jadwalId}/${this.state.jenis}/${this.state.sesiId}`).then(res => {
      if(res.data.error) toast.warning("Error fetch murid");

      this.setState({ infoMurid: res.data.result })
    })
  }

  fetchKelas(kelasId) {
    API.get(`${API_SERVER}v2/murid/kelas-v1/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning("Error fetch kelas");

      this.setState({ infoKelas: res.data.result })
    })
  }

  fetchJadwal(jadwalId) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: ${res.data.result}`)

      this.setState({ infoJadwal: res.data.result })

      this.fetchFiles(res.data.result.folder)
      this.fetchBBB()
    })
  }

  fetchChapter(chapterId) {
    API.get(`${API_SERVER}v2/chapter/${chapterId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: ${res.data.result}`);

      this.setState({ infoChapter: res.data.result })
    })
  }

  fetchFiles(folderId) {
    API.get(`${API_SERVER}v1/files/${folderId}`).then(res => {
      if (res.status === 200) {
        this.setState({ infoFiles: res.data.result })
      }
    })
  }

  fetchBBB() {
    // BBB JOIN START
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
    let meetingID = `${this.state.jadwalId}-${this.state.jenis}-${this.state.sesiId}`;
    let meetingInfo = api.monitoring.getMeetingInfo(meetingID)
    console.log('meetingInfo: ', meetingInfo)

    http(meetingInfo).then((result) => {
      console.log('result: ', result)
      if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
        // Jika belum ada, create room nya.
        let meetingCreateUrl = api.administration.create(this.state.infoJadwal.nama_pelajaran, meetingID, {
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
              Storage.get('user').data.user,
              meetingID,
              this.state.role === "guru" ? 'moderator' : 'peserta',
              { userID: Storage.get('user').data.user_id }
            )

            console.log('joinUrl: ', joinUrl)
            this.setState({ joinUrl: joinUrl })

            if (isMobile) {
              window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/redirect/' + this.state.classId))
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
          Storage.get('user').data.user,
          meetingID,
          this.state.role === "guru" ? 'moderator' : 'peserta',
          { userID: Storage.get('user').data.user_id }
        )

        console.log('joinUrl: ', joinUrl);
        this.setState({ joinUrl: joinUrl })

        if (isMobile) {
          window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(APPS_SERVER + 'meeting/redirect/' + this.state.classId))
        }
      }
    })
    // BBB JOIN END
  }

  cekKehadiran(userId) {
    API.get(`${API_SERVER}v2/murid/cek-hadir/${userId}/${this.state.sesiId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: cek kehadiran Anda`)

      this.setState({ openKehadiran: res.data.result.length ? false : true })
    })
  }

  componentDidMount() {
    if(localStorage.getItem('waktuPengerjaan')) {
      this.setState({ waktuPengerjaan: parseInt(localStorage.getItem('waktuPengerjaan'))})
    } else {
      this.fetchSilabus();
    }

    if(this.state.role === "murid") {
      this.cekKehadiran(Storage.get('user').data.user_id)
    }

    this.fetchJadwal(this.state.jadwalId)

    if(this.state.jenis === "materi") {
      this.fetchChapter(this.state.sesiId);
    }

    this.props.socket.on('broadcast', data => {
      if (data.event == 'mengajar' && data.jadwalId == this.state.jadwalId && data.companyId == Storage.get('user').data.company_id) {
        this.fetchFiles(this.state.infoJadwal.folder);
      }

      if (data.event == 'absen' && data.jadwalId == this.state.jadwalId && data.companyId == Storage.get('user').data.company_id) {
        this.fetchMurid(this.state.jadwalId);
      }

      if (data.event == 'mulai' && data.jadwalId == this.state.jadwalId && data.companyId == Storage.get('user').data.company_id) {
        this.setState({ startPertemuan: data.isStart })
      }
    })
  }

  openInfoKelas = e => {
    e.preventDefault();
    this.setState({ openKelas: true });
    this.fetchKelas(this.state.infoJadwal.kelas_id);
    this.fetchMurid(this.state.jadwalId);
  }

  onChangeInput = e => {
    // const target = e.target;
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  uploadFile = async e => {
    e.preventDefault();
    for (let i = 0; i <= this.state.attachmentId.length - 1; i++) {
      let form = new FormData();
      form.append('folder', this.state.infoJadwal.folder);
      form.append('created_by', Storage.get('user').data.user_id);
      form.append('file', this.state.attachmentId[i]);
      await API.post(`${API_SERVER}v1/folder/files`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            this.setState({ attachmentId: [] });
            toast.error('Error : ' + res.data.result)
          }
        }
      })
    }

    this.setState({ openUpload: false, attachmentId: [] })

    this.props.socket.emit('send', {
      event: 'mengajar',
      jadwalId: this.state.jadwalId,
      companyId: Storage.get('user').data.company_id
    })
  }

  deleteFile() {
    API.delete(`${API_SERVER}v1/project-file/${this.state.deleteFileId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Failed to delete project`)
        } else {
          toast.success(`File deleted `)
          this.setState({ deleteFileId: '', deleteFileName: '', modalDeleteFile: false })

          this.props.socket.emit('send', {
            event: 'mengajar',
            jadwalId: this.state.jadwalId,
            companyId: Storage.get('user').data.company_id
          })
        }
      }
    })
  }

  dialogDeleteFile(id, name) {
    this.setState({
      deleteFileId: id,
      deleteFileName: name,
      modalDeleteFile: true
    })
  }

  hadirMurid = e => {
    e.preventDefault();
    let form = {
      jadwalId: this.state.jadwalId,
      event: this.state.jenis,
      sesiId: this.state.sesiId,
      userId: Storage.get('user').data.user_id
    }

    API.post(`${API_SERVER}v2/murid/jadwal-absen`, form).then(res => {
      if(res.data.error) toast.warning(`Warning: gagal absen`)

      toast.success(`Anda mengkonfirmasi kehadiran ${this.state.jenis}.`)
      this.setState({ openKehadiran: false })

      this.props.socket.emit('send', {
        event: 'absen',
        jadwalId: this.state.jadwalId,
        companyId: Storage.get('user').data.company_id
      })
    })
  }

  startPertemuan = e => {
    e.preventDefault()
    this.setState({ startPertemuan: !this.state.startPertemuan })
    this.props.socket.emit('send', {
      event: 'mulai',
      isStart: !this.state.startPertemuan,
      jadwalId: this.state.jadwalId,
      companyId: Storage.get('user').data.company_id
    })
  }

  cekNilai = (nilai) => {
    this.setState({ isSubmit: nilai });
  }

  cekTatapMuka = (nilai) => {
    this.setState({ isTatapMuka: nilai })
  }

  getStarted = (nilai) => {
    this.setState({ isStarted: nilai, startPertemuan: nilai })
  }

  fetchMengumpulkan(examId) {
    API.get(`${API_SERVER}v2/guru/tugas/${examId}?kelas=${this.state.infoJadwal.kelas_id}`).then(res => {
      if(res.data.error) {
        toast.warning(`Warning: fetch mengumpulkan tugas`)
      }
      else {
        this.setState({ mengumpulkan: res.data.result })
      }
    })
  }

  fetchScore(examId) {
    API.get(`${API_SERVER}v2/guru/score-murid/${examId}?kelas=${this.state.infoJadwal.kelas_id}`).then(res => {
      if(res.data.error) {
        toast.warning(`Warning: fetch mengumpulkan tugas`)
      }
      else {
        this.setState({ mengumpulkan: res.data.result })
      }
    })
  }

  answerTugas = e => {
    e.preventDefault()
    let examId = e.target.getAttribute('data-id')
    let tipeJawab = e.target.getAttribute('data-tipe')
    API.get(`${API_SERVER}v2/guru/tugas/${examId}?kelas=${this.state.infoJadwal.kelas_id}`).then(res => {
      if(res.data.error) {
        toast.warning(`Warning: fetch mengumpulkan tugas`)
      }
      else {
        let { result } = res.data;
        let find = result.filter(item => item.user_id == Storage.get('user').data.user_id);
        if(find.length == 1 && find[0].score) {
          toast.success(`Kamu sudah mengerjakan tugas ini.`)
          this.setState({ scoreTugas: find[0].score })
        }
        else {
          this.fetchPertanyaan(examId)
          this.setState({ isModalTugas: true, examId, tipeJawab })
        }
      }
    })
  }

  submitTugas = e => {
    e.preventDefault();
    let form = new FormData();
    form.append('file', this.state.file);
    form.append('userId', Storage.get('user').data.user_id);;
    form.append('examId', this.state.examId);
    form.append('deskripsi', this.state.deskripsi);

    console.log('state: ', this.state)
    API.post(`${API_SERVER}v2/tugas-murid/submit`, form).then(res => {
      if(res.data.error) {
        toast.warning(`Error: submit tugas`)
      }
      else {
        toast.success(`Berhasil mengumpulkan tugas`);
        this.fetchJadwal();
        this.clearForm();
      }
    })
  }

  submitTugasLangsung = e => {
    e.preventDefault()
    let form = {
      jawaban: this.state.jawaban,
      userId: Storage.get('user').data.user_id,
      examId: this.state.examId
    }
    API.post(`${API_SERVER}v2/tugas-murid/submit-langsung`, form).then(res => {
      if(res.data.error) {
        toast.warning(`Error: submit tugas`)
      }
      else {
        toast.success(`Berhasil mengumpulkan tugas`);
        this.fetchJadwal();
        this.clearForm();
      }
    })
  }


  clearForm() {
    this.setState({
      isModalTugas: false,
      isModalDetail: false,

      examId: '',
      examTitle: '',
      examSoal: [],

      keyFile: Math.random().toString(25),
      file: '',
      deskripsi: '',
      jawaban: '',
      tipeJawab: '',

      submitted: false
    })
  }

  openReportTugas = e => {
    e.preventDefault()
    let examId = e.target.getAttribute('data-id')
    this.setState({ openReportTugas: true })
    this.fetchMengumpulkan(examId)
  }

  openReportKuis = e => {
    e.preventDefault()
    let examId = e.target.getAttribute('data-id')
    this.setState({ openReportTugas: true })
    this.fetchScore(examId)
  }

  handleDynamicInput = (e, i) => {
    let newObj = [...this.state.mengumpulkan];
    if(e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      newObj[i][name] = value;
      this.setState({ pertanyaan: newObj });
    } else {
      newObj[i].penjelasan = e;
      this.setState({ pertanyaan: newObj });
    }
  }

  setNilaiTugas = (e, answerId) => {
    let score = e.target.value;
    API.put(`${API_SERVER}v2/guru/detail-tugas/${answerId}`, {score}).then(res => {
      if(res.data.error){
        toast.warning(`Warning: update score`)
      } else {
        toast.success(`Success update score`)
      }
    })
  }

  kerjakanKuis = (examId) => {
    this.setState({ examId })
  }

  render() {

    console.log('state: ', this.state);

    return (
      <ReactFullScreenElement fullScreen={this.state.fullscreen} allowScrollbar={false}>
        <div className="page-wrapper">
          <div className="row">

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="header-kartu">
                    {this.state.infoJadwal.nama_pelajaran}

                    <button onClick={() => window.close()} className="float-right btn btn-icademy-danger mr-2 mt-2">
                      <i className="fa fa-sign-out-alt"></i> Keluar
                    </button>

                    {
                      this.state.jenis === "materi" && this.state.role === "guru" &&
                      <button onClick={() => this.setState({ modalEnd: true })} className="float-right btn btn-icademy-danger mr-2 mt-2">
                        <i className="fa fa-stop-circle"></i> Akhiri
                      </button>
                    }

                    <button onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'float-right btn btn-icademy-warning mr-2 mt-2' : 'float-right btn btn-icademy-primary mr-2 mt-2'}>
                      <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                    </button>

                    {
                      this.state.role === "guru" &&
                      <button onClick={this.openInfoKelas} className={'float-right btn btn-icademy-primary mr-2 mt-2'}>
                        <i className={'fa fa-list-alt'}></i> Info
                      </button>
                    }

                  </h4>
                  <span>Pengajar : {this.state.infoJadwal.pengajar}</span>
                </div>

                {
                  (this.state.infoChapter.tatapmuka == 1 || this.state.isTatapMuka == 1) ?
                    <div className="card-body p-1">
                      {
                        this.state.infoChapter.tatapmuka == 1 &&

                        <Iframe url={this.state.joinUrl} width="100%" height="600px" display="initial" frameBorder="0" allow="fullscreen *;geolocation *; microphone *; camera *" position="relative" />

                      }

                      {
                        this.state.isTatapMuka == 1 &&

                        <Iframe url={this.state.joinUrl} width="100%" height="600px" display="initial" frameBorder="0" allow="fullscreen *;geolocation *; microphone *; camera *" position="relative" />

                      }

                      {
                        this.state.infoJadwal.deskripsi ?
                        <div className="p-3" dangerouslySetInnerHTML={{ __html: this.state.infoJadwal.deskripsi }} />
                        :
                        null
                      }
                    </div>
                  :
                  null
                }
              </div>
            </div>

            {
              this.state.jenis === "materi" &&
              <div className="col-sm-4">
                <div className="card">
                  <div className="card-header">
                    <h4 className="header-kartu">
                      Files

                      {
                        this.state.role === "guru" &&
                        <button onClick={e => this.setState({ openUpload: true })} class="float-right btn btn-success btn-circle btn-circle-sm"><i style={{margin: 0}} class="fa fa-plus"></i></button>
                      }
                    </h4>
                  </div>
                  <div className="card-body">

                    <div className="table-responsive" style={{ overflowX: 'hidden', overflowY: this.props.scrollHeight ? 'scroll' : 'auto', height: this.props.scrollHeight ? this.props.scrollHeight : 'auto' }}>
                      <table className="table table-hover">

                      {
                        this.state.infoFiles.map(item =>
                          <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                            <td className="fc-muted f-14 f-w-300 p-t-20">
                              <img src={
                                item.type == 'png' || item.type == 'pdf' || item.type == 'doc' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg' || item.type == 'csv'
                                  ? `assets/images/files/${item.type}.svg`
                                  : 'assets/images/files/file.svg'
                              } width="32" /> &nbsp;{item.name}
                            </td>
                            <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                              <span class="btn-group dropleft col-sm-1">
                                <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i
                                    className="fa fa-ellipsis-v"
                                    style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                                  />
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>

                                  <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button"
                                    onClick={e => {window.open(item.location, 'Downloading files')}}>
                                    Download
                                  </button>

                                  {
                                    this.state.role === "guru" &&
                                    <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.dialogDeleteFile.bind(this, item.id, item.name)}> Delete </button>
                                  }

                                </div>
                              </span>
                            </td>
                          </tr>
                        )
                      }

                      </table>
                    </div>

                  </div>
                </div>
              </div>
            }

            {
              this.state.jenis === "materi" &&
              <div className="col-sm-8">
                <div className="card">
                  <div className="card-header">
                    <h4 className="header-kartu">
                      Content

                      {
                        (this.state.infoChapter.hasOwnProperty('ujian') && this.state.infoChapter.ujian.length) ?
                        <button onClick={e => this.setState({ contentSesi: 'ujian', examId: '' })} className="float-right btn btn-icademy-primary mr-2 mt-2" disabled={this.state.contentSesi==='ujian'}>Ujian</button>
                        : null
                      }

                      {
                        (this.state.infoChapter.hasOwnProperty('kuis') && this.state.infoChapter.kuis.length) ?
                        <button onClick={e => this.setState({ contentSesi: 'kuis', examId: '' })} className="float-right btn btn-icademy-primary mr-2 mt-2" disabled={this.state.contentSesi==='kuis'}>Kuis</button>
                        : null
                      }

                      {
                        (this.state.infoChapter.hasOwnProperty('tugas') && this.state.infoChapter.tugas.length) ?
                        <button onClick={e => this.setState({ contentSesi: 'tugas', examId: '' })} className="float-right btn btn-icademy-primary mr-2 mt-2" disabled={this.state.contentSesi==='tugas'}>Tugas</button>
                        : null
                      }

                      <button onClick={e => this.setState({ contentSesi: 'materi', examId: '' })} className="float-right btn btn-icademy-primary mr-2 mt-2" disabled={this.state.contentSesi==='materi'}>Materi</button>

                    </h4>
                    <span>Pengajar : {this.state.infoJadwal.pengajar}</span>
                  </div>

                  <div className="card-body">

                    {
                      this.state.contentSesi == 'materi' ?
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: this.state.infoChapter.chapter_body }} />

                          {
                            this.state.infoChapter.hasOwnProperty('attachment_id') && this.state.infoChapter.attachment_id !== null &&
                              <ul className="list-group f-12 mb-3">
                              {
                                this.state.infoChapter.hasOwnProperty('attachment_id') && this.state.infoChapter.attachment_id.split(',').map(item => (
                                  <li className="list-group-item p-0">
                                    <div className="wrap" style={{ height: '800px', overflowY: 'scroll', overflowX: 'hidden' }}>
                                      {
                                        item.split('.')[item.split('.').length-1] == 'pdf' ?
                                          <PDFReader width={800} url={item} scale={1} showAllPage={true} />
                                        :
                                          <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${item}`} height="600px" width="100%"></iframe>
                                      }
                                    </div>
                                  </li>
                                ))
                              }
                              </ul>
                          }
                        </div>
                      :
                        null
                    }

                    {
                      this.state.contentSesi == 'tugas' ?
                        <div>
                          {
                            this.state.infoChapter.tugas.map((item,i) => (
                              <table className="table table-bordered">
                                <tr>
                                  <td width="140px">Title</td>
                                  <td><b>{item.exam_title}</b></td>
                                </tr>
                                <tr>
                                  <td>Start Date</td>
                                  <td><b>{moment(item.time_start).format('DD/MM/YYYY')}</b></td>
                                </tr>
                                <tr>
                                  <td>Finish Date</td>
                                  <td><b>{moment(item.time_finish).format('DD/MM/YYYY')}</b></td>
                                </tr>
                                <tr>
                                  <td>Type</td>
                                  <td><b>{item.tipe_jawab == '1' ? 'Upload File' : 'Jawab Langsung'}</b></td>
                                </tr>
                                <tr>
                                  <td colSpan="2">
                                    {/* <button className="btn btn-v2 btn-info mr-2">More</button> */}

                                    {
                                      this.state.role == 'murid' && this.state.scoreTugas ?
                                      <div className="text-center" style={{padding: '8px 26px'}}>
                                        <span>Score</span>
                                        <h1>{this.state.scoreTugas}</h1>
                                      </div>
                                      : null
                                    }

                                    {
                                      this.state.role == 'guru' ?
                                      <button onClick={this.openReportTugas} data-id={item.exam_id} className="btn btn-v2 btn-info mr-2">Report</button>
                                      : null
                                    }

                                    {
                                      this.state.role == 'murid' ?
                                        moment(new Date()) >= moment(item.time_start) && moment(new Date()) <= moment(item.time_finish) ?
                                          <button onClick={this.answerTugas} data-id={item.exam_id} data-tipe={item.tipe_jawab} className="btn btn-v2 btn-info mr-2">Kerjakan</button>
                                        :
                                          'Belum Saatnya'
                                      : null
                                    }

                                  </td>
                                </tr>
                              </table>
                            ))
                          }
                        </div>
                      :
                      null
                    }

                    {
                      this.state.contentSesi == 'kuis' ?
                        <div>
                          {
                            this.state.infoChapter.kuis.map((item,i) => (
                              <table className="table table-bordered">
                                <tr>
                                  <td width="140px">Title</td>
                                  <td><b>{item.exam_title}</b></td>
                                </tr>
                                <tr>
                                  <td>Start Date</td>
                                  <td><b>{moment(item.time_start).format('DD/MM/YYYY')}</b></td>
                                </tr>
                                <tr>
                                  <td>Finish Date</td>
                                  <td><b>{moment(item.time_finish).format('DD/MM/YYYY')}</b></td>
                                </tr>
                                {
                                  item.quiz == '2' ?
                                  <tr>
                                    <td>Type</td>
                                    <td><b>{item.tipe_jawab == '1' ? 'Upload File' : 'Jawab Langsung'}</b></td>
                                  </tr>
                                  : null
                                }
                                <tr>
                                  <td colSpan="2">
                                    {
                                      this.state.role == 'guru' ?
                                      <button onClick={this.openReportKuis} data-id={item.exam_id} className="btn btn-v2 btn-info mr-2">Report</button>
                                      : null
                                    }

                                    {
                                      this.state.role == 'murid' ?
                                      <button onClick={e => this.kerjakanKuis(item.exam_id)} data-id={item.exam_id} data-tipe={item.tipe_jawab} className="btn btn-v2 btn-info mr-2">Kerjakan</button>
                                      : null
                                    }
                                  </td>
                                </tr>
                              </table>
                            ))
                          }
                        </div>
                      :
                      null
                    }

                    {
                      this.state.contentSesi == 'ujian' ?
                        <div>
                          {
                            this.state.infoChapter.ujian.map((item,i) => (
                              <table className="table table-bordered">
                                <tr>
                                  <td width="140px">Title</td>
                                  <td><b>{item.exam_title}</b></td>
                                </tr>
                                <tr>
                                  <td>Start Date</td>
                                  <td><b>{moment(item.time_start).format('DD/MM/YYYY')}</b></td>
                                </tr>
                                <tr>
                                  <td>Finish Date</td>
                                  <td><b>{moment(item.time_finish).format('DD/MM/YYYY')}</b></td>
                                </tr>
                                {
                                  item.quiz == '2' ?
                                  <tr>
                                    <td>Type</td>
                                    <td><b>{item.tipe_jawab == '1' ? 'Upload File' : 'Jawab Langsung'}</b></td>
                                  </tr>
                                  : null
                                }
                                <tr>
                                  <td colSpan="2">
                                    {
                                      this.state.role == 'guru' ?
                                      <button onClick={this.openReportKuis} data-id={item.exam_id} className="btn btn-v2 btn-info mr-2">Report</button>
                                      : null
                                    }

                                    {
                                      this.state.role == 'murid' ?
                                      <button onClick={e => this.kerjakanKuis(item.exam_id)} data-id={item.exam_id} data-tipe={item.tipe_jawab} className="btn btn-v2 btn-info mr-2">Kerjakan</button>
                                      : null
                                    }
                                  </td>
                                </tr>
                              </table>
                            ))
                          }
                        </div>
                      :
                      null
                    }

                    {
                      (this.state.contentSesi == 'kuis' || this.state.contentSesi == 'ujian') && this.state.examId ?
                      <Detail getNilai={this.cekNilai} role={this.state.role} tipe={this.state.contentSesi == 'kuis' ? 'kuis' : 'ujian'} examId={this.state.examId} />
                      : null
                    }
                  </div>
                </div>
              </div>
            }

            {
              (this.state.jenis === "kuis" || this.state.jenis === "ujian") &&
              <>
                {
                  this.state.role === "murid" && !this.state.isSubmit === true && this.state.startPertemuan === true &&
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="header-kartu">
                        Waktu Pengerjaan
                        </h4>
                        {
                          this.state.role === "murid" && this.state.waktuPengerjaan !== 0 &&
                            <CountdownCircleTimer
                              isPlaying
                              duration={this.state.waktuPengerjaan}
                              colors={[
                                ['#004777', 0.33],
                                ['#F7B801', 0.33],
                                ['#A30000', 0.33],
                              ]}
                              renderAriaTime={(remainingTime, elapsedTime) => {
                                localStorage.setItem('waktuPengerjaan', remainingTime.remainingTime)
                              }}
                              children={({ remainingTime }) => {
                                const hours = Math.floor(remainingTime / 3600)
                                const minutes = Math.floor((remainingTime % 3600) / 60)
                                const seconds = remainingTime % 60

                                return `${hours}:${minutes}:${seconds}`
                              }}
                              size={80}
                              strokeWidth={4}
                              onComplete={() => {
                                localStorage.removeItem('waktuPengerjaan')
                                this.props.socket.emit('send', {
                                  event: 'selesai',
                                  isStart: !this.state.startPertemuan,
                                  jadwalId: this.state.jadwalId,
                                  companyId: Storage.get('user').data.company_id
                                })
                              }}
                            />
                        }
                      </div>
                    </div>
                  </div>
                }

                {
                  this.state.role === "guru" && this.state.startPertemuan === true &&
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="header-kartu">
                        Waktu Pengerjaan
                        </h4>
                        {
                          this.state.waktuPengerjaan !== 0 &&
                            <CountdownCircleTimer
                              isPlaying
                              duration={this.state.waktuPengerjaan}
                              colors={[
                                ['#004777', 0.33],
                                ['#F7B801', 0.33],
                                ['#A30000', 0.33],
                              ]}
                              renderAriaTime={(remainingTime, elapsedTime) => {
                                localStorage.setItem('waktuPengerjaan', remainingTime.remainingTime)
                              }}
                              children={({ remainingTime }) => {
                                const hours = Math.floor(remainingTime / 3600)
                                const minutes = Math.floor((remainingTime % 3600) / 60)
                                const seconds = remainingTime % 60

                                return `${hours}:${minutes}:${seconds}`
                              }}
                              size={80}
                              strokeWidth={4}
                              onComplete={() => {
                                console.log('selesai')
                              }}
                            />
                        }
                      </div>
                    </div>
                  </div>
                }

                <Detail getStarted={this.getStarted} getTatapMuka={this.cekTatapMuka} getNilai={this.cekNilai} role={this.state.role} tipe={this.state.jenis} match={{params: {examId: this.state.sesiId}}} />
              </>
            }

            <Modal
              show={this.state.isModalTugas}
              onHide={() => this.clearForm()}
            >
              <Modal.Header className="card-header header-kartu" closeButton>
                { this.state.submitted ? 'Informasi Tugas' : 'Kumpulkan Tugas'}
              </Modal.Header>
              <Modal.Body>
                {
                  this.state.tipeJawab == '1' &&
                  <form onSubmit={this.submitTugas}>

                    {
                      this.state.examSoal.map((item,i) => (
                        <div className="mb-2">
                          <label>Pertanyaan <b>{i+1}</b></label>
                          <div className="soal" dangerouslySetInnerHTML={{ __html: item.tanya }} />
                        </div>
                      ))
                    }

                    <div className="form-group">
                      <label>Upload File</label>
                      <input key={this.state.keyFile} onChange={e => this.setState({ file: e.target.files[0] })} type="file" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Catatan</label>
                      <textarea onChange={e => this.setState({ deskripsi: e.target.value })} rows='3' className="form-control" />
                    </div>


                    <div className="form-group">
                      <button type="submit" className="btn btn-v2 btn-success mt-3">Submit</button>
                    </div>
                  </form>
                }

                {
                  this.state.tipeJawab == '2' &&
                  <form onSubmit={this.submitTugasLangsung}>
                    {
                      this.state.examSoal.map((item,i) => (
                        <div className="mb-2">
                          <label>Pertanyaan <b>{i+1}</b></label>
                          <div className="soal" dangerouslySetInnerHTML={{ __html: item.tanya }} />
                        </div>
                      ))
                    }

                    <div className="form-group">
                      <label>Jawaban</label>
                      <textarea disabled={this.state.submitted} rows="10" className="form-control" onChange={e => this.setState({ jawaban: e.target.value })} value={this.state.jawaban} />
                    </div>

                    {
                      !this.state.submitted &&
                      <div className="form-group mt-2">
                        <button type="submit" className="btn btn-v2 btn-success mt-3">Submit</button>
                      </div>
                    }
                  </form>
                }
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.openKelas}
              onHide={() => this.setState({ openKelas: false })}
              dialogClassName="modal-lg">
              <Modal.Body>
                <h4 className="f-w-900 f-18 fc-blue">Informasi Kelas</h4>
                <table>
                  <tr>
                    <td style={{width: '180px'}}>Nama Kelas</td>
                    <td><b>{this.state.infoKelas.kelas_nama}</b></td>
                  </tr>
                  <tr>
                    <td>Semester</td>
                    <td><b>{this.state.infoKelas.semester}</b></td>
                  </tr>
                  <tr>
                    <td>Kurikulum</td>
                    <td><b>{this.state.infoKelas.kurikulum}</b></td>
                  </tr>
                  <tr>
                    <td>Tahun Ajaran</td>
                    <td><b>{this.state.infoKelas.tahun_ajaran}</b></td>
                  </tr>
                  <tr>
                    <td>Kapasitas Murid</td>
                    <td><b>{this.state.infoKelas.kapasitas} Murid</b></td>
                  </tr>
                </table>

                <br/>
                <br/>

                <h4 className="f-w-900 f-18 fc-blue">Informasi Murid</h4>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>No. Induk</th>
                      <th>Jenis Kelamin</th>
                      <th>Kehadiran</th>
                      <th>Jam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.infoMurid.map((item, i) => (
                        <tr>
                          <td>{i+1}</td>
                          <td>{item.nama}</td>
                          <td>{item.no_induk}</td>
                          <td>{item.jenis_kelamin}</td>
                          <td>{item.absen_jam ? <span class="badge badge-pill badge-success">Hadir</span> : <span class="badge badge-pill badge-info">Belum</span>}</td>
                          <td>{item.absen_jam ? moment(item.absen_jam).format('DD/MM/YYYY HH:mm') : '-'}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.openReportTugas}
              onHide={() => this.setState({ openReportTugas: false })}
              dialogClassName="modal-lg">
              <Modal.Body>
                <h4 className="f-w-900 f-18 fc-blue">Report</h4>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Tanggal</th>
                      <th>Jam</th>
                      {
                        this.state.contentSesi == 'tugas' ?
                          <>
                            <th>Catatan</th>
                            <th>Jawaban</th>
                          </>
                        : null
                      }
                      <th>Status</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.contentSesi == 'tugas' && this.state.mengumpulkan.map((item, i) => (
                        <tr>
                          <td>{i+1}</td>
                          <td>{item.nama}</td>
                          <td>{item.pengumpulan ? moment(item.pengumpulan).format('DD/MM/YYYY') : '-'}</td>
                          <td>{item.pengumpulan ? moment(item.pengumpulan).format('HH:mm') : '-'}</td>
                          <td>{item.answer_deskripsi ? item.answer_deskripsi : '-'}</td>
                          <td>
                            {
                              item.tipe_jawab == '1' ?
                                item.pengumpulan ? <a href={item.answer_file} target="_blank" className="silabus">Open</a> : '-'
                              :
                                <div dangerouslySetInnerHTML={{ __html: item.answer_file }} />
                            }
                          </td>
                          <td>
                            <span className={`label label-${item.pengumpulan ? 'success' : 'danger'}`}>{item.pengumpulan ? 'Sudah' : 'Belum'}</span>
                          </td>
                          <td><input style={{padding: '2px', width: '50px'}} onChange={e => this.handleDynamicInput(e,i)} onBlur={e => this.setNilaiTugas(e, item.answer_id)} name="score" type="number" value={item.pengumpulan ? item.score : 0} /></td>
                        </tr>
                      ))
                    }

                    {
                      (this.state.contentSesi == 'kuis' || this.state.contentSesi == 'ujian') && this.state.mengumpulkan.map((item, i) => (
                        <tr>
                          <td>{i+1}</td>
                          <td>{item.nama}</td>
                          <td>{item.pengumpulan ? moment(item.pengumpulan).format('DD/MM/YYYY') : '-'}</td>
                          <td>{item.pengumpulan ? moment(item.pengumpulan).format('HH:mm') : '-'}</td>
                          <td>
                            <span className={`label label-${item.pengumpulan ? 'success' : 'danger'}`}>{item.pengumpulan ? 'Sudah' : 'Belum'}</span>
                          </td>
                          <td>{item.score ? item.score : '-'}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.openUpload}
              onHide={e => this.setState({ openUpload: false })}
              centered
            >
              <Modal.Header closeButton>
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
                            onChange={this.onChangeInput}
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
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btm-icademy-primary btn-icademy-grey"
                  onClick={e => this.setState({ openUpload: false })}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-icademy-primary"
                  onClick={this.uploadFile.bind(this)}
                >
                  <i className="fa fa-save"></i>
                    {'Upload'}
                </button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={this.state.modalDeleteFile}
              onHide={this.closeModalDeleteFile}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                  Konfirmasi
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>Are you sure you want to delete the file <b>{this.state.deleteFileName}</b> ?</div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btm-icademy-primary btn-icademy-grey"
                  onClick={this.closeModalDeleteFile.bind(this)}
                >
                  Cancel
                          </button>
                <button
                  className="btn btn-icademy-primary btn-icademy-red"
                  onClick={this.deleteFile.bind(this)}
                >
                  <i className="fa fa-trash"></i>
                            Hapus
                          </button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={this.state.openKehadiran}
              onHide={() => this.setState({ openKehadiran: false })}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                  Attendance Confirmation
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <button onClick={this.hadirMurid} className="btn btn-v2 btn-primary mr-2">
                  Ya, Hadir
                </button>
                <button onClick={() => this.setState({ openKehadiran: false })} className="btn btn-v2 btn-default">
                  Tutup
                </button>
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.modalEnd}
              onHide={this.closeModalEnd}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                  Konfirmasi
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>Anda yakin akan mengakhiri kelas untuk semua murid ?</div>
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
                Akhiri Meeting
              </button>
              </Modal.Footer>
            </Modal>

          </div>
        </div>
      </ReactFullScreenElement>
    )
  }

}

const MengajarSocket = props => (
  <SocketContext.Consumer>
    {socket => <Mengajar {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default MengajarSocket;
