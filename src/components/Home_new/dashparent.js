import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import CalenderNew from '../kalender/kalenderlearning';
import ProjekNew from './projek';
import LaporanPembelajaranMurid from './laporanPembelajaranMurid';

import { toast } from 'react-toastify'
import moment from 'moment-timezone'

class DashParent extends Component {

  state = {
    role: this.props.role ? this.props.role : 'parents',

    toDo: [],
    calendar: [],

    pengumuman: [],
    openPengumuman: false,
    pengumumanId: '',
    pengumumanNama: '',
    pengumumanIsi: '',
    pengumumanFile: [],

    tugas: [],
    ujian: [],
    jadwal: [],
    project: [],
    myMurid: {},
    ptc: [],
    event: [],
  }

  fetchJadwal(muridId) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/murid/${muridId}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch jadwal`)

      let hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      let tglIni = new Date();
      let hariIni = res.data.result.jadwal.filter(item => item.hari === hari[tglIni.getDay()]);

      this.setState({
        jadwal: hariIni,
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
    this.fetchPtc()
    this.fetchMyMurid(Storage.get('user').data.user_id);
  }

  fetchMyMurid(userId) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch murid`)

      this.setState({ myMurid: res.data.result })

      this.fetchJadwal(res.data.result.user_id_murid);
    })
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

  fetchPtc() {
    let url = ``;

    if(this.state.role.toLowerCase() === "guru") {
      if(Storage.get('user').data.level !== "client") {
        url = `${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`;
      } else {
        url = `${API_SERVER}v1/ptc-room/moderator/${Storage.get('user').data.user_id}`;
      }
    } else if(this.state.role.toLowerCase() === "parents") {
      url = `${API_SERVER}v1/ptc-room/parents/${Storage.get('user').data.user_id}`;
    } else {
      url = `${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`;
    }

    API.get(url).then(res => {
      if (res.data.error) console.log('Error: ', res.data.result);

      this.setState({ ptc: res.data.result })
    });
  }

  render() {

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Jadwal Hari Ini</h4>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Mata Pelajaran</th><th>Hari</th><th>Waktu</th><th>Sesi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.jadwal.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #e9e9e9' }}>
                                      <td>{item.nama_pelajaran}</td>
                                      <td>{item.hari}</td>
                                      <td>{item.jam_mulai}-{item.jam_selesai}</td>
                                      <td>{item.sesi}</td>

                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Parent - Teacher Conference</h4>

                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Room Name</th><th>Date</th><th>Moderator</th><th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.ptc.map((item, i) => (
                                    <tr>
                                      <td>{item.nama_ruangan}</td>
                                      <td>{moment(item.tanggal_mulai).format('DD/MM/YYYY')} {item.waktu_mulai}</td>
                                      <td>{item.name}</td>
                                      <td className="text-center">
                                        {
                                          Date.parse(item.tanggal_mulai) >= new Date() &&
                                          <a target="_blank" className="btn btn-v2 btn-primary" href={`/ptc/masuk/ptc/${item.ptc_id}`}>
                                            <i className="fa fa-video"></i> Masuk
                                          </a>
                                        }
                                        {
                                          Date.parse(item.tanggal_mulai) <= new Date() &&
                                          <button className="btn btn-v2 btn-default ml-2">Riwayat</button>
                                        }
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>

                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Tugas Yang Harus Dikerjakan</h4>

                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Tugas</th><th>Batas Waktu</th><th>Mata Pelajaran</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.tugas.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #e9e9e9' }}>
                                      <td>{item.title}</td>
                                      <td>{moment(item.time_finish).format('DD-MM-YYYY')}</td>
                                      <td>{item.nama_pelajaran}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>

                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Ujian Yang Akan Datang</h4>

                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Tanggal</th><th>Ujian</th><th>Mata Pelajaran</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.ujian.map((item, i) => (
                                    <tr key={i}>
                                      <td>{moment(item.time_finish).format('DD-MM-YYYY')}</td>
                                      <td>{item.title}</td>
                                      <td>{item.nama_pelajaran}</td>

                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>

                          </div>

                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-12">
                      <Card>
                        <Card.Body>
                          <LaporanPembelajaranMurid lists={this.state.project} />
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                    <Card>
                      <Card.Body>
                        <h4 className="f-w-900 f-18 fc-blue">Pengumuman Terbaru</h4>

                        <div className="wrap" style={{ height: '400px', overflowY: 'scroll', overflowX: 'hidden' }}>
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
                        </div>

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

                    <div className="col-sm-6">
                      {
                        this.state.myMurid.hasOwnProperty('user_id_murid') &&
                        <CalenderNew grupName="murid" muridId={this.state.myMurid.user_id_murid} lists={this.state.event} />
                      }
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
