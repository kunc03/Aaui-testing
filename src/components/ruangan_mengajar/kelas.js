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

  state = {
    kelasId: this.props.match.params.kelasId,
    kelasInfo: {},

    role: this.props.role.toString().toLowerCase(),
    joinUrl: '',

    jenis: '',

    jadwalId: '',
    infoJadwal: {},
    infoFiles: [],

    sesiId: '',
    infoChapter: {},

    contentSesi: 'materi',
    isModalDetail: false,
    examId: '',
    tipeJawab: '',
    examTitle: '',
    examSoal: [],

    scoreTugas: 0,

    openKehadiran: false,

    keyFile: Math.random().toString(25),
    file: '',
    deskripsi: '',

    jawaban: '',
    submitted: false,

    isSubmit: false,

    isModalTugas: false,

    waktuPengerjaan: 0,
  }

  fetchKelas(kelasId) {
    API.get(`${API_SERVER}v2/kelas/one/${kelasId}`).then(res => {
      this.setState({ kelasInfo: res.data.result })
    })
  }

  fetchBBB(kelasId) {
    // BBB JOIN START
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
    // let meetingID = `${this.state.jadwalId}-${this.state.jenis}-${this.state.sesiId}`;
    let meetingID = `${kelasId}`;
    let meetingInfo = api.monitoring.getMeetingInfo(meetingID)

    http(meetingInfo).then((result) => {
      if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
        // Jika belum ada, create room nya.
        let meetingCreateUrl = api.administration.create(this.state.kelasInfo.kelas_nama, meetingID, {
          attendeePW: 'peserta',
          moderatorPW: 'moderator',
          allowModsToUnmuteUsers: true,
          record: true
        })

        http(meetingCreateUrl).then((result) => {
          if (result.returncode = 'SUCCESS') {
            // Setelah create, join
            let joinUrl = api.administration.join(
              Storage.get('user').data.user,
              meetingID,
              this.state.role === "guru" ? 'moderator' : 'peserta',
              { userID: Storage.get('user').data.user_id }
            )

            this.setState({ joinUrl: joinUrl })

            if (isMobile) {
              window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(this.state.joinUrl))
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

        this.setState({ joinUrl: joinUrl })

        if (isMobile) {
          window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(this.state.joinUrl))
        }
      }
    })
    // BBB JOIN END
  }

  fetchJadwal(jadwalId, jenis) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: ${res.data.result}`)

      this.setState({ jadwalId, jenis, infoJadwal: res.data.result })

      this.fetchFiles(res.data.result.folder)
    })
  }

  fetchFiles(folderId) {
    API.get(`${API_SERVER}v1/files/${folderId}`).then(res => {
      if (res.status === 200) {
        this.setState({ infoFiles: res.data.result })
      }
    })
  }

  fetchChapter(chapterId, userId) {
    API.get(`${API_SERVER}v2/chapter/${chapterId}?userId=${userId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: ${res.data.result}`);

      this.setState({
        sesiId: chapterId,
        infoChapter: res.data.result,
        waktuPengerjaan: localStorage.getItem('waktuPengerjaan') ? parseInt(localStorage.getItem('waktuPengerjaan')) : (res.data.result.durasi * 60)
      })

      if(res.data.result.tatapmuka == 1) {
        this.fetchBBB(this.state.kelasId)
      }
    })
  }

  cekKehadiran(sesiId, userId) {
    API.get(`${API_SERVER}v2/murid/cek-hadir/${userId}/${sesiId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: cek kehadiran Anda`)

      this.setState({ openKehadiran: res.data.result.length ? false : true })
    })
  }

  hadirMurid(jadwalId, event, sesiId, userId) {
    let form = {
      jadwalId: jadwalId,
      event: event,
      sesiId: sesiId,
      userId: Storage.get('user').data.user_id
    }

    API.post(`${API_SERVER}v2/murid/jadwal-absen`, form).then(res => {
      if(res.data.error) {
        toast.warning(`Warning: gagal absen`)
      }
      else {
        toast.success(`Anda mengkonfirmasi kehadiran ${event}.`)
        this.setState({ openKehadiran: false })

        this.props.socket.emit('send', {
          event: 'absen',
          jadwalId: jadwalId,
          companyId: Storage.get('user').data.company_id,
          muridNama: Storage.get('user').data.user,
        })
      }
    })
  }

  fetchPertanyaan(examId) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      this.setState({ examSoal: res.data.result })
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

  kerjakanKuis = (examId) => {
    this.setState({ examId })
  }

  submitTugas = e => {
    e.preventDefault();
    let form = new FormData();
    form.append('file', this.state.file);
    form.append('userId', Storage.get('user').data.user_id);;
    form.append('examId', this.state.examId);
    form.append('deskripsi', this.state.deskripsi);

    API.post(`${API_SERVER}v2/tugas-murid/submit`, form).then(res => {
      if(res.data.error) {
        toast.warning(`Error: submit tugas`)
      }
      else {
        toast.success(`Berhasil mengumpulkan tugas`);
        this.fetchJadwal(this.state.jadwalId, this.state.jenis);
        this.fetchChapter(Storage.get('ruangan-kelas').sesiId, Storage.get('user').data.user_id)

        this.props.socket.emit('send', {
          event: 'submit-tugas-file',
          jadwalId: this.state.jadwalId,
          sesiId: this.state.sesiId,
          companyId: Storage.get('user').data.company_id,
          examId: this.state.examId,
          muridNama: Storage.get('user').data.user,
        })

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
        this.fetchJadwal(this.state.jadwalId, this.state.jenis);
        this.fetchChapter(Storage.get('ruangan-kelas').sesiId, Storage.get('user').data.user_id)

        this.props.socket.emit('send', {
          event: 'submit-tugas-file',
          jadwalId: this.state.jadwalId,
          sesiId: this.state.sesiId,
          companyId: Storage.get('user').data.company_id,
          examId: this.state.examId,
          muridNama: Storage.get('user').data.user,
        })

        this.clearForm();
      }
    })
  }

  componentDidMount() {

    this.fetchKelas(this.state.kelasId);
    // this.fetchBBB(this.state.kelasId);

    if(Storage.get('ruangan-kelas').jadwalId && Storage.get('ruangan-kelas').sesiId && Storage.get('ruangan-kelas').jenis) {
      this.fetchJadwal(Storage.get('ruangan-kelas').jadwalId, Storage.get('ruangan-kelas').jenis)
      this.fetchChapter(Storage.get('ruangan-kelas').sesiId, Storage.get('user').data.user_id)
      this.cekKehadiran(Storage.get('ruangan-kelas').sesiId, Storage.get('user').data.user_id)
    }

    this.props.socket.on('broadcast', data => {
      if(data.event == 'mulai-kelas' && data.companyId == Storage.get('user').data.company_id) {
        toast.info(`${data.guruNama} memasuki ruangan.`)
        Storage.set('ruangan-kelas', {
          jadwalId: data.jadwalId, sesiId: data.chapterId, jenis: data.jenis
        })
        this.fetchJadwal(data.jadwalId, data.jenis)
        this.fetchChapter(data.chapterId, Storage.get('user').data.user_id)
        this.cekKehadiran(data.chapterId, Storage.get('user').data.user_id)
      }

      if (data.event == 'mengajar' && data.jadwalId == this.state.jadwalId && data.companyId == Storage.get('user').data.company_id) {
        this.fetchFiles(this.state.infoJadwal.folder);
      }

      if(data.event == 'akhiri-kelas' && data.jadwalId == this.state.jadwalId && data.jenis == this.state.jenis && data.chapterId == this.state.sesiId) {
        toast.info(`${data.guruNama} telah meninggalkan ruangan.`)
        this.clearKonten()
        localStorage.removeItem('ruangan-kelas');
      }

    })
  }

  clearKonten() {
    this.setState({
      jenis: '',

      jadwalId: '',
      infoJadwal: {},
      infoFiles: [],

      sesiId: '',
      infoChapter: {},

      contentSesi: 'materi',
      isModalDetail: false,
      examId: '',
      tipeJawab: '',
      examTitle: '',
      examSoal: [],

      scoreTugas: 0,

      openKehadiran: false,

      isSubmit: false,

      isModalTugas: false,

      joinUrl: ''

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

  cekNilai = (value) => {
    this.setState({ isSubmit: value });
  }

  render() {

    console.log('state: ', this.state);

    return (
      <ReactFullScreenElement fullScreen={this.state.fullscreen} allowScrollbar={false}>
        <div className="page-wrapper">
          <div className="row">

            <Modal
              show={this.state.openKehadiran}
              onHide={() => this.setState({ openKehadiran: false })}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                  Konfirmasi Kehadiran
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <button onClick={e => this.hadirMurid(this.state.jadwalId, this.state.jenis, this.state.sesiId, Storage.get('user').data.user_id)} className="btn btn-v2 btn-primary mr-2">
                  Ya, Hadir
                </button>
                <button onClick={() => this.setState({ openKehadiran: false })} className="btn btn-v2 btn-default">
                  Tutup
                </button>
              </Modal.Body>
            </Modal>

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

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="header-kartu">
                    {
                      this.state.kelasInfo ? this.state.kelasInfo.kelas_nama : 'Kelas tidak ditemukan'
                    }

                    <button onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'float-right btn btn-icademy-warning mr-2 mt-2' : 'float-right btn btn-icademy-primary mr-2 mt-2'}>
                      <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                    </button>

                  </h4>
                  <span>{this.state.infoJadwal ? this.state.kelasInfo.tahun_ajaran : null}</span>
                </div>

                {
                    this.state.joinUrl ?
                      <div className="card-body p-1">
                        {
                          <Iframe url={this.state.joinUrl} width="100%" height="600px" display="initial" frameBorder="0" allow="fullscreen *;geolocation *; microphone *; camera *" position="relative" />
                        }
                      </div>
                    :
                      <div className="card-body p-1 text-center">
                        <img className="m-2" src={`/assets/images/component/tes.png`} />
                        <p className="m-2">Saat ini Anda berada dikelas.</p>
                      </div>
                }

              </div>
            </div>

            {
              this.state.infoFiles.length ?
                <div className="col-sm-4">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="header-kartu">Files</h4>
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
              : null
            }

            {
              this.state.infoChapter.hasOwnProperty('chapter_title') ?
              <div className="col-sm-8">
                <div className="card">
                  <div className="card-header">
                    <h4 className="header-kartu">
                      {
                        this.state.infoChapter ? this.state.infoChapter.chapter_title : null
                      }

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

                      <button onClick={e => this.setState({ contentSesi: 'materi', examId: '' })} className="float-right btn btn-icademy-primary mr-2 mt-2" disabled={this.state.contentSesi==='materi'}>Deskripsi</button>

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

                                    {
                                      item.pengumpulan ?
                                      <div style={{padding: '8px 26px'}}>
                                        <span>Score</span>
                                        <h1>{item.score}</h1>
                                      </div>
                                      :
                                        moment(new Date()) >= moment(item.time_start) && moment(new Date()) <= moment(item.time_finish) ?
                                          <button onClick={this.answerTugas} data-id={item.exam_id} data-tipe={item.tipe_jawab} className="btn btn-v2 btn-info mr-2">Kerjakan</button>
                                        :
                                          'Belum Saatnya'
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
                                <tr>
                                  <td colSpan="2">
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
                      <Detail waktuPengerjaan={this.state.waktuPengerjaan} getNilai={this.cekNilai} role={this.state.role} tipe={this.state.contentSesi == 'kuis' ? 'kuis' : 'ujian'} examId={this.state.examId} />
                      : null
                    }
                  </div>
                </div>
              </div>
              : null
            }

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
