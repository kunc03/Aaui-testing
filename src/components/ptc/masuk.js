import React from 'react'
import ReactFullScreenElement from "react-fullscreen-element";
import Iframe from 'react-iframe';

import API, { APPS_SERVER, API_SERVER, USER_ME, API_SOCKET, BBB_KEY, BBB_URL, CHIME_URL } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone'
import { Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify'
import { isMobile } from 'react-device-detect';
import Detail from '../tugas/detail';
// Core viewer
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

import { Timer } from 'react-countdown-clock-timer';
import SocketContext from '../../socket';
import axios from 'axios';

import ChimeMeeting from '../meeting/chime'
const bbb = require('bigbluebutton-js')

class Mengajar extends React.Component {

  state = {
    role: this.props.role.toString().toLowerCase(),
    jenis: this.props.match.params.jenis,
    ptcId: this.props.match.params.id,
    infoPtc: {},

    openParticipants: false,
    peserta: [],

    joinUrl: '',
    modalEnd: false,

    fullscreen: false,
    openUpload: false,

    openUpload: false,
    attachmentId: [],
    infoFiles: [],
    deleteFileId: '',
    deleteFileName: '',
    modalDeleteFile: false,

    openKehadiran: false,

    attendee: {},
  }

  hadirMurid = e => {
    e.preventDefault();
    let form = {
      ptcId: this.state.ptcId,
      userId: Storage.get('user').data.user_id,
    }

    API.put(`${API_SERVER}v1/ptc-room/hadir/${form.ptcId}/${form.userId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: gagal absen`)

      toast.success(`Terimakasih Anda sudah mengkonfirmasi kehadiran.`)
      this.setState({ openKehadiran: false })

      this.props.socket.emit('send', {
        event: 'absen',
        ptcId: this.state.ptcId,
        companyId: Storage.get('user').data.company_id
      })
    })
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

  endMeeting() {
    // BBB END
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    let meetingID = `${this.state.jenis}-${this.state.jenis}-${this.state.ptcId}`;
    let endMeeting = api.administration.end(meetingID, 'moderator')
    http(endMeeting).then((result) => {
      if (result.returncode == 'SUCCESS') {
        this.closeModalEnd()
        toast.success('Mengakhiri PTC untuk semua participants.')
      }
    })
  }

  closeModalEnd = e => {
    this.setState({ modalEnd: false });
  }

  closeModalDeleteFile = e => {
    this.setState({ modalDeleteFile: false, deleteFileName: '', deleteFileId: '' })
  }

  fetchBBB() {
    // BBB JOIN START
    let api = bbb.api(BBB_URL, BBB_KEY)
    let http = bbb.http

    // Check meeting info, apakah room sudah ada atau belum (keperluan migrasi)
    let meetingID = `${this.state.jenis}-${this.state.jenis}-${this.state.ptcId}`;
    let meetingInfo = api.monitoring.getMeetingInfo(meetingID)
    console.log('meetingInfo: ', meetingInfo)

    http(meetingInfo).then((result) => {
      console.log('result: ', result)
      if (result.returncode == 'FAILED' && result.messageKey == 'notFound') {
        // Jika belum ada, create room nya.
        let meetingCreateUrl = api.administration.create(this.state.infoPtc.nama_ruangan, meetingID, {
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

  fetchFiles(folderId) {
    API.get(`${API_SERVER}v1/files/${folderId}`).then(res => {
      if (res.status === 200) {
        this.setState({ infoFiles: res.data.result })
      }
    })
  }

  deleteFile() {
    API.delete(`${API_SERVER}v1/project-file/${this.state.deleteFileId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Gagal menghapus file`)
        } else {
          toast.success(`Berhasil menghapus file `)
          this.setState({ deleteFileId: '', deleteFileName: '', modalDeleteFile: false })
          this.props.socket.emit('send', {
            event: 'ptc',
            ptcId: this.state.ptcId,
            companyId: Storage.get('user').data.company_id
          })
        }
      }
    })
  }

  componentDidMount() {
    if(this.state.role === "murid") {
      API.get(`${API_SERVER}v1/ptc-room/cek-hadir/${this.state.ptcId}/${Storage.get('user').data.user_id}`).then(res => {
        if(res.data.error) toast.warning(`Warning: cek kehadiran`)

        this.setState({ openKehadiran: res.data.result.join_at ? false : true })
      })
    }

    this.fetchPtcInfo(this.state.ptcId)

    this.props.socket.on('broadcast', data => {
      if (data.event == 'ptc' && data.ptcId == this.state.ptcId && data.companyId == Storage.get('user').data.company_id) {
        this.fetchFiles(this.state.infoPtc.folder_id);
      }

      if (data.event == 'absen' && data.ptcId == this.state.ptcId && data.companyId == Storage.get('user').data.company_id) {
        this.fetchParticipants(this.state.ptcId);
      }
    })
  }

  fetchPtcInfo(ptcId) {
    API.get(`${API_SERVER}v1/ptc-room/${ptcId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch ptc detail`)

      this.setState({ infoPtc: res.data.result })

      this.fetchFiles(res.data.result.folder_id)
      this.fetchBBB()
      this.joinChime()
    })
  }

  dialogDeleteFile(id, name) {
    this.setState({
      deleteFileId: id,
      deleteFileName: name,
      modalDeleteFile: true
    })
  }

  uploadFile = async e => {
    e.preventDefault();
    for (let i = 0; i <= this.state.attachmentId.length - 1; i++) {
      let form = new FormData();
      form.append('folder', this.state.infoPtc.folder_id);
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
      event: 'ptc',
      ptcId: this.state.ptcId,
      companyId: Storage.get('user').data.company_id
    })
  }

  infoParticipants = e => {
    e.preventDefault()
    this.setState({ openParticipants: true })
    this.fetchParticipants(this.state.ptcId);
  }

  fetchParticipants(ptcId) {
    API.get(`${API_SERVER}v1/ptc-room/peserta/${ptcId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch peserta PTC`)

      this.setState({ peserta: res.data.result })
    })
  }

  joinChime = e => {
    const title     = this.state.infoPtc.nama_ruangan.replace(/ /g, '')+'-'+moment(new Date).format('YYYY-MM-DD-HH');
    const name      = Storage.get('user').data.user;
    const region    = `ap-southeast-1`;

    axios.post(`${CHIME_URL}/join?title=${title}&name=${name}&region=${region}`).then(res => {
      this.setState({ attendee: res.data.JoinInfo })
    })
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
                    {this.state.infoPtc.nama_ruangan}

                    <button onClick={() => window.close()} className="float-right btn btn-icademy-danger mr-2 mt-2">
                      <i className="fa fa-sign-out-alt"></i> Keluar
                    </button>

                    {
                      this.state.role === "guru" &&
                      <button onClick={() => this.setState({ modalEnd: true })} className="float-right btn btn-icademy-danger mr-2 mt-2">
                        <i className="fa fa-stop-circle"></i> Akhiri
                      </button>
                    }

                    <button onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'float-right btn btn-icademy-warning mr-2 mt-2' : 'float-right btn btn-icademy-primary mr-2 mt-2'}>
                      <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                    </button>

                    {
                      this.state.role === "guru" &&
                      <button onClick={this.infoParticipants} className={'float-right btn btn-icademy-primary mr-2 mt-2'}>
                        <i className={'fa fa-list-alt'}></i> Info
                      </button>
                    }


                  </h4>
                  <span>Moderator : {this.state.infoPtc.name}</span>
                </div>

                <ChimeMeeting attendee={this.state.attendee} />

                {
                  /**
                  <div className="card-body p-1">
                    <Iframe url={this.state.joinUrl}
                    width="100%"
                    height="600px"
                    display="initial"
                    frameBorder="0"
                    allow="fullscreen *; geolocation *; microphone *; camera *"
                    position="relative" />
                  </div>
                  */
                }
              </div>
            </div>

            {
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h4 className="header-kartu">
                      File Sharing

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
                            <li className="list-group-item">
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
                                <div style={{ height: '750px' }}>
                                    <Viewer fileUrl={item} />
                                </div>
                              </Worker>
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
                  this.state.role === "murid" &&
                  <div className="col-sm-12">
                  <div className="card">
                  <div className="card-header">
                  <h4 className="header-kartu">
                  Waktu Pengerjaan

                  {
                    this.state.role === "murid" &&
                    <Timer
                    durationInSeconds={7200}
                    formatted={true}

                    onStart = {()=> {
                      console.log('Triggered when the timer starts')
                    }}

                    onFinish = {()=> {
                      console.log('Triggered when the timer finishes')
                    }}

                    />
                  }

                  </h4>
                  </div>
                  </div>
                  </div>
                }

                <Detail role={this.state.role} tipe={this.state.jenis} match={{params: {examId: this.state.sesiId}}} />
              </>
            }

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
              show={this.state.openParticipants}
              onHide={() => this.setState({ openParticipants: false })}
              dialogClassName="modal-lg">
              <Modal.Body>
                <h4 className="f-w-900 f-18 fc-blue">Informasi Participants</h4>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Identity</th>
                      <th>Kehadiran</th>
                      <th>Jam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.peserta.map((item, i) => (
                        <tr>
                          <td>{i+1}</td>
                          <td>{item.name}</td>
                          <td>{item.identity}</td>
                          <td>{item.join_at ? <span class="badge badge-pill badge-success">Hadir</span> : <span class="badge badge-pill badge-info">Belum</span>}</td>
                          <td>{item.join_at ? moment(item.join_at).format('DD/MM/YYYY HH:mm') : '-'}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </Modal.Body>
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

          </div>
        </div>
      </ReactFullScreenElement>
    )
  }

}

const PtcMasukSocket = props => (
  <SocketContext.Consumer>
    {socket => <Mengajar {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default PtcMasukSocket;
