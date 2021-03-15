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
import Detail from '../tugas/detail';

import { PDFReader, MobilePDFReader } from 'reactjs-pdf-view';
// Core viewer
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import SocketContext from '../../socket';

import ChimeMeeting from '../meeting/chime'
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

    waktuPengerjaan: 0
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

  joinChime = async (e) => {
    const title     = this.state.infoJadwal.nama_pelajaran.replace(/ /g, '')+'-'+moment(new Date).format('YYYY-MM-DD-HH') + '-' + (new Date()).getMinutes().toString().charAt(0);
    const name      = Storage.get('user').data.user;
    const region    = `ap-southeast-1`;

    axios.post(`${CHIME_URL}/join?title=${title}&name=${name}&region=${region}`).then(res => {
      this.setState({ attendee: res.data.JoinInfo })
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

      this.joinChime()
    })
  }

  fetchChapter(chapterId) {
    API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
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

        console.log('joinUrl: ', joinUrl);
        this.setState({ joinUrl: joinUrl })

        if (isMobile) {
          window.location.replace(APPS_SERVER + 'mobile-meeting/' + encodeURIComponent(this.state.joinUrl))
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
          toast.error(`Gagal menghapus project`)
        } else {
          toast.success(`Berhasil menghapus file `)
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

                    {
                      this.state.role === "guru" && (this.state.jenis === "ujian") &&
                      <button onClick={this.startPertemuan} className={'float-right btn btn-icademy-primary mr-2 mt-2'}>
                        <i className={`fa fa-${this.state.startPertemuan ? 'stop':'play'}`}></i> {this.state.startPertemuan ? 'Stop' : 'Start'}
                      </button>
                    }
                  </h4>
                  <span>Pengajar : {this.state.infoJadwal.pengajar}</span>
                </div>

                {
                  // this.state.jenis === "materi" &&
                    <div className="card-body p-1">
                      {
                        this.state.infoChapter.tatapmuka == 1 &&

                        <Iframe url={this.state.joinUrl} width="100%" height="600px" display="initial" frameBorder="0" allow="fullscreen *;geolocation *; microphone *; camera *" position="relative" />

                      }

                      {
                        this.state.isTatapMuka == 1 &&

                        <Iframe url={this.state.joinUrl} width="100%" height="600px" display="initial" frameBorder="0" allow="fullscreen *;geolocation *; microphone *; camera *" position="relative" />

                      }

                      <div className="p-3" dangerouslySetInnerHTML={{ __html: this.state.infoJadwal.deskripsi }} />
                    </div>
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
                    <h4 className="header-kartu">Content</h4>
                  </div>
                  <div className="card-body">
                    <div dangerouslySetInnerHTML={{ __html: this.state.infoChapter.chapter_body }} />

                    {
                      this.state.infoChapter.hasOwnProperty('attachment_id') && this.state.infoChapter.attachment_id !== null &&
                        <ul className="list-group f-12 mb-3">
                        {
                          this.state.infoChapter.hasOwnProperty('attachment_id') && this.state.infoChapter.attachment_id.split(',').map(item => (
                            <li className="list-group-item p-0">
                              <PDFReader url={item} scale={1} showAllPage={true} />
                            </li>
                          ))
                        }
                        </ul>
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
                          <label>Lampiran</label>
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
                            Bisa banyak file, pastikan file tidak melebihi 500MB
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
                <div>Anda yakin akan menghapus file <b>{this.state.deleteFileName}</b> ?</div>
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
                  Konfirmasi Kehadiran
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
