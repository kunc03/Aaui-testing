import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

import TableMeetings from '../meeting/meeting';
import CalenderNew from '../kalender/kalenderlearning';
import ListToDoNew from './listToDo';
const widgetNew = [
  { idWidget: '1', name: 'Tugas', checked: false },
  { idWidget: '2', name: 'Pertemuan Yang Akan Datang', checked: false },
  { idWidget: '3', name: 'Pengumuman Terbaru', checked: false },
  // { idWidget: '4', name: 'Laporan Yang Harus Diselesaikan', checked: false },
  { idWidget: '5', name: 'Materi Pelajaran', checked: false },
  { idWidget: '6', name: 'Meeting', checked: false }
]
class DashGuru extends Component {

  state = {
    companyId: Storage.get('user').data.company_id,
    toDo: [],
    calendar: [],

    pelajaran: [],
    openSilabus: false,
    pelajaranId: '',
    pelajaranNama: '',
    silabus: [],

    pengumuman: [],
    openPengumuman: false,
    pengumumanId: '',
    pengumumanNama: '',
    pengumumanIsi: '',
    pengumumanFile: [],

    ptc: [],

    tugas: [
      { id: 1, mapel: 'Matematika', batas: '24 Des 2020', terkumpul: '20/30' },
      { id: 2, mapel: 'Fisika', batas: '25 Des 2020', terkumpul: '29/30' },
    ],

    ujian: [
      { id: 1, tanggal: '24 Des 2020', waktu: '07:00', mapel: 'Matematika', durasi: '40 Menit' },
      { id: 2, tanggal: '25 Des 2020', waktu: '08:00', mapel: 'Fisika', durasi: '45 Menit' },
      { id: 3, tanggal: '29 Des 2020', waktu: '09:00', mapel: 'Biologi', durasi: '60 Menit' },
    ],

    jadwal: [],

    jadwalBesok: [],

    event: [],

    dataWidget: widgetNew,
    openWidget: false
  }

  checkedWidget = e => {
    const dataWidgetCopy = [...this.state.dataWidget];
    const itemToUpdate = dataWidgetCopy.find(item => item.name === e.target.value);

    itemToUpdate.checked = !itemToUpdate.checked;

    this.setState({
      dataWidget: dataWidgetCopy
    });
  };

  tambahWidget(data) {
    this.setState({
      openWidget: false,
      dataWidget: data
    })
    // console.log(data, 'data tambahhh');
  }

  openSilabus = e => {
    e.preventDefault();
    let target = e.target;
    this.setState({ pelajaranNama: target.getAttribute('data-title'), pelajaranId: target.getAttribute('data-id'), openSilabus: true })
    this.fetchSilabus(target.getAttribute('data-id'))
  }

  closeSilabus() {
    this.setState({
      openSilabus: false,
      pelajaranId: '',
      pelajaranNama: '',
      silabus: [],
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

  openWidgets = e => {
    e.preventDefault();
    this.setState({ openWidget: true })
  }

  closeWidget() {
    this.setState({
      openWidget: false,
    })
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if (res.data.error) toast.info(`Error: fetch silabus`)

      this.setState({ silabus: res.data.result })
    })
  }

  componentDidMount() {
    this.fetchPelajaran();
    this.fetchPengumuman();
    this.fetchJadwal();
    this.fetchPtc();
    this.fetchTugas();
    this.fetchEvents()
  }

  fetchEvents() {
    API.get(`${API_SERVER}v2/events/guru/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) console.log(`Error: fetch events`)

      // console.log('mengajar: ', res.data.result.mengajar);
      let mengajar = res.data.result.mengajar.map(item => {
        let stTgl = moment(item.start_date).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.chapter_title}`,
          start: tglSt,
          end: tglSt,
          event: 'materi',
          kelas: item.kelas_nama,
          mapel: item.nama_pelajaran,
          jadwal: item.jadwal_id,
          sesi: item.chapter_id
        }
      })

      // console.log('mengajar: ', res.data.result.tugas);
      let tugas = res.data.result.tugas.map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'tugas',
          kelas: item.kelas_nama,
          mapel: item.nama_pelajaran,
          jadwal: item.jadwal_id,
          sesi: item.exam_id
        }
      })

      let quiz = res.data.result.quiz.map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'kuis',
          kelas: item.kelas_nama,
          mapel: item.nama_pelajaran,
          jadwal: item.jadwal_id,
          sesi: item.exam_id
        }
      })

      let ujian = res.data.result.ujian.map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'ujian',
          kelas: item.kelas_nama,
          mapel: item.nama_pelajaran,
          jadwal: item.jadwal_id,
          sesi: item.exam_id
        }
      })

      let events = mengajar.concat(tugas.concat(quiz.concat(ujian)));

      this.setState({ event: events })
    })
  }

  fetchTugas() {
    API.get(`${API_SERVER}v2/guru/semua-tugas/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) toast.warning(`Warning: fetch tugas`);

      this.setState({ tugas: res.data.result })
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/pelajaran/company/${this.state.companyId}`).then(res => {
      this.setState({ pelajaran: res.data.result })
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

  fetchJadwal() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) console.log(`Error: fetch pelajaran`)

      let hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      let tglIni = new Date();
      let hariIni = res.data.result.filter(item => item.hari === hari[tglIni.getDay()]);
      let jadwalBesok = res.data.result.filter(item => item.hari === hari[tglIni.getDay() + 1]);

      this.setState({ jadwal: hariIni, jadwalBesok: jadwalBesok })
    })
  }

  fetchPtc() {
    let url = ``;

    if (Storage.get('user').data.grup_name.toLowerCase() === "guru") {
      if (Storage.get('user').data.level !== "client") {
        url = `${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`;
      } else {
        url = `${API_SERVER}v1/ptc-room/moderator/${Storage.get('user').data.user_id}`;
      }
    } else if (Storage.get('user').data.grup_name.toLowerCase() === "parents") {
      url = `${API_SERVER}v1/ptc-room/parents/${Storage.get('user').data.user_id}`;
    } else {
      url = `${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`;
    }

    API.get(url).then(res => {
      if (res.data.error) console.log('Error: ', res.data.result);

      this.setState({ ptc: res.data.result.reverse() })
    });
  }

  render() {
    // console.log(`event1: `, this.state.event)
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    let sort = this.state.event.sort((a, b) => a.start - b.start);

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">

                    <div className="col-sm-6">
                      <CalenderNew />
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">
                            Aktivitas Mengajar
                            <Link to='/jadwal-mengajar' className="float-right f-12">See all</Link>
                          </h4>
                          <div className="wrap" style={{ height: '400px', overflowY: 'scroll', overflowX: 'hidden' }}>
                            <table class="table">
                              <thead>
                                <tr>
                                  <th>Kelas</th>
                                  <th>Kegiatan</th>
                                  <th>Mapel</th>
                                  <th>Topik</th>
                                  <th>Jadwal</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  sort.map(item => (
                                    <tr>
                                      <td>{item.kelas}</td>
                                      <td style={{ textTransform: 'capitalize' }}>{item.event}</td>
                                      <td>{item.mapel}</td>
                                      <td>{item.title}</td>
                                      <td>{moment(item.start).format('DD/MM/YYYY HH:mm')}</td>
                                      <td>
                                        {
                                          item.event === 'materi' &&
                                          <Link style={{ padding: '2px 8px' }} class={`btn btn-${item.start >= new Date() ? 'success' : 'info'}`} to={`/ruangan/mengajar/${item.jadwal}/materi/${item.sesi}`}>{item.start >= new Date() ? 'Start' : 'Done'}</Link>
                                        }
                                        {
                                          item.event === 'tugas' &&
                                          <Link style={{ padding: '2px 8px' }} class={`btn btn-${item.start >= new Date() ? 'success' : 'danger'}`} to={`/guru/detail-tugas/${item.jadwal}/${item.sesi}`}>{item.start >= new Date() ? 'Open' : 'Done'}</Link>
                                        }
                                        {
                                          item.event === 'kuis' &&
                                          <Link style={{ padding: '2px 8px' }} class={`btn btn-${item.start >= new Date() ? 'success' : 'danger'}`} to={`/guru/detail-kuis/${item.jadwal}/${item.sesi}`}>{item.start >= new Date() ? 'Start' : 'Done'}</Link>
                                        }
                                        {
                                          item.event === 'ujian' &&
                                          <Link style={{ padding: '2px 8px' }} class={`btn btn-${item.start >= new Date() ? 'success' : 'danger'}`} to={`/guru/detail-ujian/${item.jadwal}/${item.sesi}`}>{item.start >= new Date() ? 'Start' : 'Done'}</Link>
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
                          <h4 className="f-w-900 f-18 fc-blue">
                            Jadwal Mengajar Hari Ini
                            <Link to='/jadwal-mengajar' className="float-right f-12">See all</Link>
                          </h4>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Mata Pelajaran</th><th>Hari</th><th>Jadwal</th><th>Kelas</th><th>Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.jadwal.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #e9e9e9' }}>
                                      <td>{item.nama_pelajaran}</td>
                                      <td>{item.hari}</td>
                                      <td>{item.jam_mulai} - {item.jam_selesai}</td>
                                      <td>{item.kelas_nama}</td>
                                      <td>
                                        <Link to={`/guru/pelajaran/${item.jadwal_id}`}>
                                          <i className="fa fa-search"></i>
                                        </Link>
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

                    <div className={this.state.dataWidget[0].checked ? "col-sm-6" : "hidden"}>
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Tugas</h4>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Mata Pelajaran</th><th>Judul</th><th>Timeline</th><th>Kelas</th><th>Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.tugas.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #e9e9e9' }}>
                                      <td>{item.nama_pelajaran}</td>
                                      <td>{item.exam_title}</td>
                                      <td>{moment(item.time_finish).format('DD/MM/YYYY')}</td>
                                      <td>{item.kelas_nama}</td>
                                      <td>
                                        <Link to={`/guru/detail-tugas/${item.jadwal_id}/${item.exam_id}`}>
                                          <i className="fa fa-search"></i>
                                        </Link>
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

                    <div className={this.state.dataWidget[1].checked ? "col-sm-6" : "hidden"}>
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Pertemuan Yang Akan Datang</h4>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Judul</th><th>Moderator</th><th>Tanggal</th><th>Jam</th><th>Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.ptc.map((item, i) => (
                                    <tr key={i}>
                                      <td>{item.nama_ruangan}</td>
                                      <td>{item.name}</td>
                                      <td>{moment(item.tanggal_mulai).format('DD/MM/YYYY')}</td>
                                      <td>{item.waktu_mulai}</td>
                                      <td>
                                        {
                                          Date.parse(item.tanggal_mulai) >= new Date() &&
                                          <a target="_blank" href={`/ptc/masuk/ptc/${item.ptc_id}`}>
                                            <i className="fa fa-video"></i>
                                          </a>
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

                    <div className={this.state.dataWidget[2].checked ? "col-sm-6" : "hidden"}>
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Pengumuman Terbaru</h4>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

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

                    <div className={this.state.dataWidget[3].checked ? "col-sm-6" : "hidden"}>
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Laporan Yang Harus Diselesaikan</h4>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Tanggal</th><th>Waktu</th><th>Mata Pelajaran</th><th>Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  this.state.ujian.map((item, i) => (
                                    <tr key={i}>
                                      <td>{item.tanggal}</td>
                                      <td>{item.waktu}</td>
                                      <td>{item.mapel}</td>
                                      <td><i style={{ cursor: 'pointer' }} className="fa fa-search"></i></td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>

                        </Card.Body>
                      </Card>
                    </div>

                    <div className={this.state.dataWidget[4].checked ? "col-sm-6" : "hidden"}>
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Materi Pelajaran</h4>

                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

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

                          </div>

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

                    <div className={this.state.dataWidget[5].checked ? "col-sm-6" : "hidden"}>


                      <TableMeetings allMeeting={true} access_project_admin={access_project_admin} projectId='0' />



                    </div>

                    <div className="col-sm-6">
                      <Card style={{ backgroundColor: '#F3F3F3', cursor: 'pointer' }} onClick={this.openWidgets}>
                        <div style={{ height: '394px', alignSelf: 'center' }}>
                          <img src='newasset/Combined Shape.svg' style={{ position: 'absolute', top: '10pc', marginLeft: '-26px' }}></img>
                          <p style={{ position: 'absolute', top: '16pc', marginLeft: '-46px' }}><b>Tambah Widget</b></p>
                        </div>
                      </Card>

                      <Modal
                        show={this.state.openWidget}
                        onHide={this.closeWidget.bind(this)}
                        dialogClassName="modal-lg"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            Tambah Widget
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="row">
                            {this.state.dataWidget.map((item, i) => {
                              return (
                                <div className="col-sm-4 text-center">
                                  <label className={item.checked ? "image-checkbox image-checkbox-checked" : "image-checkbox"} onChange={this.checkedWidget}>
                                    <img className="img-responsive" src={item.checked ? "/newasset/tugason.svg" : "/newasset/tugasoff.svg"} style={{ width: '235px', padding: '50px' }} />
                                    <input name="image[]" type="checkbox" checked={item.cek} value={item.name} />
                                    <h6 className={item.checked ? "fc-skyblue" : ""}> {item.name}</h6>
                                    <i className={item.checked ? "fa fa-check " : "fa fa-check hidden"}></i>
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <button className="btn btn-primary float-right" onClick={this.tambahWidget.bind(this, this.state.dataWidget)} >Tambah</button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }

}

export default DashGuru;
