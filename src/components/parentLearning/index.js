import React, { Component } from "react";
import Storage from '../../repository/storage';

import PembelajaranMurid from './pembelajaranMurid';
import { Link } from 'react-router-dom'

import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'

class GuruUjian extends Component {
  state = {
    toDo: [],
    calendar: [],

    muridId: '',

    pengumuman: [],
    openPengumuman: false,
    pengumumanId: '',
    pengumumanNama: '',
    pengumumanIsi: '',
    pengumumanFile: [],
    tugas: [],
    ujian: [],
    jadwal: [],
    event: [],
  }

  fetchJadwal(userIdMurid) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/murid/${userIdMurid}`).then(res => {
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

  fetchEvents(muridId) {
    API.get(`${API_SERVER}v2/events/murid/${muridId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch events`)

      let mengajar = res.data.result.mengajar
      .map(item => {
        let stTgl = moment(item.start_date).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.chapter_title}`,
          start: tglSt,
          end: tglSt,
          event: 'materi',
          absen: item.absen_jam
        }
      })

      // console.log('events: ', res.data.result.mengajar)

      let ptc = res.data.result.ptc
      .map(item => {
        let stTgl = moment(item.tanggal_mulai).format('YYYY-MM-DD') + ' ' + item.waktu_mulai;
        let tglSt = new Date(stTgl)

        return {
          title: `${item.nama_ruangan}`,
          start: tglSt,
          end: tglSt,
          event: 'ptc'
        }
      })
      // console.log('events: ', ptc)


      let tugas = res.data.result.tugas
      .map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'tugas',
          submitted: item.submitted
        }
      })
      console.log('events: ', res.data.result.tugas)


      let quiz = res.data.result.quiz
      .map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'kuis',
          absen: item.absen_jam,
          score: item.score
        }
      })
      console.log('events: ', res.data.result.quiz)


      let ujian = res.data.result.ujian
      .map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'ujian',
          absen: item.absen_jam,
          score: item.score
        }
      })
      // console.log('events: ', ujian)


      let events = mengajar.concat(ptc.concat(tugas.concat(quiz.concat(ujian))));

      this.setState({ event: events })
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

  fetchAnakSaya(userId) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}`).then(res => {
      this.fetchJadwal(res.data.result.user_id_murid)
      this.setState({ muridId: res.data.result.user_id_murid })
      this.fetchEvents(res.data.result.user_id_murid)
    })
  }

  componentDidMount() {
    this.fetchPengumuman();
    this.fetchAnakSaya(Storage.get('user').data.user_id);
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

  filterKegiatan = e => {
    let {value} = e.target;
    if(value === 'all') {
      this.fetchEvents(this.state.muridId)
    }
    else {

      let event = [...this.state.event].filter(item => item.event === value);
      this.setState({ event })
    }
  }

  filterClear = e => {
    this.fetchEvents(this.state.muridId)
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;

    console.log('this', this.state.event);

    let sort = this.state.event.sort((a, b) => a.start - b.start);
    console.log('sort', sort);

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="floating-back">
                    <Link to={`/`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      />
                    </Link>
                  </div>

                  <div className="row">

                    <div class="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Timeline</h4>
                          <select style={{padding: '2px'}} onChange={this.filterKegiatan}>
                            <option value="all">All</option>
                            <option value="materi">Materi</option>
                            <option value="tugas">Tugas</option>
                            <option value="kuis">Kuis</option>
                            <option value="ujian">Ujian</option>
                          </select>
                          <button class="ml-2" onClick={this.filterClear}>clear</button>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Kegiatan</th>
                                <th>Judul</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Nilai</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                sort.map(item => (
                                  <tr key={item.title+'-'+item.start}>
                                    <td style={{textTransform: 'capitalize'}}>{item.event}</td>
                                    <td>{item.title}</td>
                                    <td>{moment(item.start).format('DD/MM/YYYY HH:mm')}</td>
                                    <td>
                                      {
                                        item.hasOwnProperty('absen') ?
                                        (item.absen ? <span class="label label-success">Selesai</span> : <span class="label label-danger">Belum</span>)
                                        :
                                        ((item.hasOwnProperty('submitted') && item.submitted.length === 1) ? <span class="label label-success">Selesai</span> : <span class="label label-danger">Belum</span>)
                                      }
                                    </td>
                                    {
                                      item.hasOwnProperty('submitted') &&
                                      <td>{item.submitted.length === 1 ? item.submitted[0].score : '-'}</td>
                                    }
                                    {
                                      item.hasOwnProperty('score') &&
                                      <td>{item.score ? item.score : '-'}</td>
                                    }
                                    {
                                      item.event === 'materi' &&
                                      <td>-</td>
                                    }
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>
                    </div>

                    <div class="col-sm-6">
                      <div className="row">

                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <h4 className="f-w-900 f-18 fc-blue">Jadwal Hari Ini</h4>
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>Mata Pelajaran</th><th>Hari</th><th>Waktu</th><th>Sesi</th><th>Aksi</th>
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
                                        <td>
                                          <Link to={`/murid/detail-mapel/${item.jadwal_id}`}>
                                            <i style={{ cursor: 'pointer' }} className="fa fa-search"></i>
                                          </Link>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>
                        </div>

                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <h4 className="f-w-900 f-18 fc-blue">Tugas Yang Harus Dikerjakan</h4>
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>Tugas</th><th>Batas Waktu</th><th>Mata Pelajaran</th><th>Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    this.state.tugas.map((item, i) => (
                                      <tr key={i} style={{ borderBottom: '1px solid #e9e9e9' }}>
                                        <td>{item.title}</td>
                                        <td>{moment(item.time_finish).format('DD-MM-YYYY')}</td>
                                        <td>{item.nama_pelajaran}</td>
                                        <td>
                                          <Link to={`/murid/tugas`}>
                                            <i style={{ cursor: 'pointer' }} className="fa fa-search"></i>
                                          </Link>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>
                        </div>

                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
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

                        <div className="col-sm-12">
                          <Card>
                            <Card.Body>
                              <h4 className="f-w-900 f-18 fc-blue">Ujian Yang Akan Datang</h4>
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th>Tanggal</th><th>Ujian</th><th>Mata Pelajaran</th><th>Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    this.state.ujian.map((item, i) => (
                                      <tr key={i}>
                                        <td>{moment(item.time_finish).format('DD-MM-YYYY')}</td>
                                        <td>{item.title}</td>
                                        <td>{item.nama_pelajaran}</td>
                                        <td>
                                          <Link to={`/murid/ujian`}>
                                            <i style={{ cursor: 'pointer' }} className="fa fa-search"></i>
                                          </Link>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
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
        </div>
      </div>
    )
  }
}

export default GuruUjian;
