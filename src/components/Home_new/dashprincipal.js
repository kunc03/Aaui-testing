import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import CalenderNew from '../kalender/kalender';
import ProjekNew from './projek';
import LaporanPembelajaranMurid from './laporanPembelajaranMurid';
import ListToDoNew from './listToDo';

import moment from 'moment-timezone';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import ListToDoNew from './listToDo';
import RecentDocs from './recentDocs';

import { toast } from 'react-toastify'

class DashParent extends Component {

  state = {
    role: '',
    toDo: [],
    calendar: [],

    pengumuman: [],
    openPengumuman: false,
    pengumumanId: '',
    pengumumanNama: '',
    pengumumanIsi: '',
    pengumumanFile: [],

    tugas: [],
    ptc: [],

    ujian: [],

    jadwal: [],

    project: [],

    openParticipants: false,
    ptcId: '',
    participants: [],
    getPtc: {},
    optionsName: [],
    pesertaId: [],

    pelajaran: [],
    openSilabus: false,
    pelajaranId: '',
    pelajaranNama: '',
    silabus: [],
  }

  openParticipants = e => {
    e.preventDefault()
    let dataId = e.target.getAttribute('data-id');
    console.log('ptcId: ', dataId)
    let getPtc = this.state.ptc.filter(item => item.ptc_id === parseInt(dataId));
    this.fetchParticipants(dataId);
    this.setState({ openParticipants: true, ptcId: dataId })
  }

  deletePtc = e => {
    e.preventDefault()
    let idPtc = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v1/ptc-room/delete/${idPtc}`).then(res => {
      if (res.data.error) console.log('Error: ', res.data.result);

      this.fetchNotif();
    })
  }

  deleteParticipants = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/ptc-room/peserta/delete/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) console.log('Error: delete data')

      this.fetchParticipants(this.state.ptcId);
      this.fetchNotif();
    })
  }

  addParticipant = e => {
    e.preventDefault();
    let form = {
      room_id: this.state.ptcId,
      group_id: Storage.get('user').data.grup_id,
      user_id: this.state.pesertaId[0],
      peserta: 0
    };

    console.log('form: ', form)

    API.post(`${API_SERVER}v1/add/ptc-room/peserta`, form).then(res => {
      if (res.data.error) console.log('Error: cannot add participants');

      this.fetchPtc();
      this.fetchParticipants(this.state.ptcId);
      this.setState({ pesertaId: [] })
      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
    })
  }

  fetchParticipants(id) {
    API.get(`${API_SERVER}v1/ptc-room/peserta/${id}`).then(res => {
      if (res.data.error) console.log('Error: fetch peserta')

      this.setState({ participants: res.data.result })
    })
  }

  closeModal() {
    this.setState({
      openParticipants: false,
      ptcId: '',
    })
  }

  fetchPtc() {
    let url = ``;

    if (this.state.role.toLowerCase() === "guru") {
      if (Storage.get('user').data.level !== "client") {
        url = `${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`;
      } else {
        url = `${API_SERVER}v1/ptc-room/moderator/${Storage.get('user').data.user_id}`;
      }
    } else if (this.state.role.toLowerCase() === "parents") {
      url = `${API_SERVER}v1/ptc-room/parents/${Storage.get('user').data.user_id}`;
    } else {
      url = `${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`;
    }

    API.get(url).then(res => {
      if (res.data.error) console.log('Error: ', res.data.result);

      this.setState({ ptc: res.data.result })
    });
  }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/murid/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch jadwal`)

      this.setState({
        jadwal: res.data.result.jadwal,
        tugas: res.data.result.tugas,
        ujian: res.data.result.ujian,
      })
    })
  }

  openPengumuman = e => {
    e.preventDefault();
    this.setState({
      openPengumuman: true,
      pengumumanId: e.target.getAttribute('data-id'),
      pengumumanNama: e.target.getAttribute('data-title'),
      pengumumanIsi: e.target.getAttribute('data-isi'),
      pengumumanFile: e.target.getAttribute('data-file') ? e.target.getAttribute('data-file').split(',') : []
    })
  }

  closePengumuman() {
    this.setState({
      openPengumuman: false,
      pengumumanId: '',
      pengumumanNama: '',
      pengumumanIsi: '',
      pengumumanFile: [],
    })
  }

  componentDidMount() {
    this.fetchPengumuman();
    this.fetchJadwal();
    this.fetchPtc()
    this.fetchPelajaran()
  }

  fetchPengumuman() {
    let url = null;
    if (this.state.level === "admin" || this.state.level === "superadmin") {
      url = `${API_SERVER}v1/pengumuman/company/${this.state.companyId}`;
    } else {
      url = `${API_SERVER}v1/pengumuman/role/${Storage.get('user').data.grup_id}`;
    }

    API.get(url).then(response => {
      this.setState({ pengumuman: response.data.result.reverse() });
    }).catch(function (error) {
      console.log(error);
    });
  }

  openSilabus = e => {
    e.preventDefault();
    let target = e.target;
    this.setState({ pelajaranNama: target.getAttribute('data-title'), pelajaranId: target.getAttribute('data-id'), openSilabus: true })
    this.fetchSilabus(target.getAttribute('data-id'))
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if (res.data.error) toast.info(`Error: fetch silabus`)

      this.setState({ silabus: res.data.result })
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({ pelajaran: res.data.result })
    })
  }

  closeSilabus() {
    this.setState({
      openSilabus: false,
      pelajaranId: '',
      pelajaranNama: '',
      silabus: [],
    })
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">

                    <div class="col-sm-6">
                      <div className="card">
                        <div className="card-header header-kartu">
                          Parent Teacher Conference (PTC)
                          </div>
                        <div className="card-body" style={{ padding: 0 }}>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Room Name</th>
                                <th>Moderator</th>
                                <th>Time </th>
                                <th> Date </th>
                                {this.state.role.toLowerCase() !== "parents" && <th className="text-center"> Participants </th>}
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.ptc.map((item, i) => (
                                  <tr>
                                    <td>{item.nama_ruangan}</td>
                                    <td>{item.name}</td>
                                    <td>{item.waktu_mulai}</td>
                                    <td>{moment(item.tanggal_mulai).format('DD/MM/YYYY')}</td>
                                    {
                                      this.state.role.toLowerCase() !== "parents" &&
                                      <td className="text-center">
                                        <button data-id={item.ptc_id} onClick={this.openParticipants} className="btn btn-v2 btn-default ml-2">{item.peserta.length} Participants</button>
                                      </td>
                                    }

                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <Modal show={this.state.openParticipants} onHide={() => this.closeModal()} dialogClassName="modal-lg">
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            All Participants
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>
                                  No
                                </th>
                                <th> Name </th>
                                <th>Email</th>
                                <th> Attendance</th>
                                <th> Date </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.participants.map((item, i) => (
                                  <tr key={i}>
                                    <td>
                                      {i + 1}
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.is_confirm ? "Sudah Konfirmasi" : "Belum Konfirmasi"}</td>
                                    <td>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</td>

                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Modal.Body>
                      </Modal>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Materi Pelajaran</h4>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Mata Pelajaran</th><th style={{ width: '40px' }}>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.pelajaran.map((item, i) => (
                                  <tr key={i}>
                                    <td>{item.nama_pelajaran}</td>
                                    <td style={{ width: '40px' }}>
                                      <a href="#" onClick={this.openSilabus} data-title={item.nama_pelajaran} data-id={item.pelajaran_id}>Lihat</a>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>

                      <Modal
                        show={this.state.openSilabus}
                        onHide={this.closeSilabus.bind(this)}
                        dialogClassName="modal-lg"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            Silabus {this.state.pelajaranNama}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Sesi</th>
                                <th>Topik</th>
                                <th>Tujuan</th>
                                <th>Deskripsi</th>
                                <th>Files</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.silabus.map((item, i) => {
                                  if (item.jenis === 0) {
                                    return (
                                      <tr key={i}>
                                        <td>{item.sesi}</td>
                                        <td>{item.topik}</td>
                                        <td>{item.tujuan}</td>
                                        <td>{item.deskripsi}</td>
                                        <td style={{ padding: '12px' }}>
                                          {
                                            item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : 'No files'
                                          }
                                        </td>
                                      </tr>
                                    )
                                  } else {
                                    return (
                                      <tr key={i}>
                                        <td>{item.sesi}</td>
                                        <td colSpan="4" className="text-center">{item.jenis == 1 ? 'Kuis' : 'Ujian'}</td>
                                      </tr>
                                    )
                                  }
                                })
                              }
                            </tbody>
                          </table>
                        </Modal.Body>
                      </Modal>
                    </div>

                    <div className="col-sm-6">
                      <CalenderNew lists={this.state.calendar} />
                    </div>

                    <div className="col-sm-6">
                      <CalenderNew lists={this.state.calendar} />
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          {/* <h4 className="f-w-900 f-18 fc-blue">Dokumen Terakhir Akses</h4>
                          <RecentDocs lists={this.state.toDo} /> */}
                          <h4 className="f-w-900 f-18 fc-blue">Pengumuman Terbaru</h4>
                          <table className="table">
                            <tbody>
                              {
                                this.state.pengumuman.map((item, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid #e9e9e9' }}>
                                    <td>{item.isi}</td>
                                    <td style={{ width: '40px' }}>
                                      <a href="#"
                                        onClick={this.openPengumuman}
                                        data-title={item.title}
                                        data-file={item.attachments}
                                        data-id={item.id_pengumuman}
                                        data-isi={item.isi}>Lihat</a>
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>

                      <Modal
                        show={this.state.openPengumuman}
                        onHide={this.closePengumuman.bind(this)}
                        dialogClassName="modal-lg"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            Pengumuman
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group controlId="formJudul">
                              <FormControl
                                type="text"
                                name="judul"
                                value={this.state.pengumumanNama}
                                disabled
                              />
                            </Form.Group>

                            <Form.Group controlId="formisi">
                              <textarea
                                className="form-control" id="exampleFormControlTextarea1" rows="8"
                                name="isi"
                                value={this.state.pengumumanIsi}
                                disabled
                              />
                            </Form.Group>

                            {
                              this.state.pengumumanFile.length > 0 &&
                              <Form.Group>
                                <Form.Label>Attachments</Form.Label>
                                <ul className="list-group">
                                  {
                                    this.state.pengumumanFile.map(item => (
                                      <li className="list-group-item">
                                        <a href={item} target="_blank">{item}</a>
                                      </li>
                                    ))
                                  }
                                </ul>
                              </Form.Group>
                            }

                          </Form>

                        </Modal.Body>
                      </Modal>
                    </div>

<<<<<<< HEAD
                  <div className="col-sm-6">
=======
                    <div class="col-sm-6">
>>>>>>> production
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">To Do List</h4>
                          <ListToDoNew lists={this.state.toDo} />
                        </Card.Body>
                      </Card>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default DashParent;
