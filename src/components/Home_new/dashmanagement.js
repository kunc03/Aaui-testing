import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify'
import TableMeetings from '../meeting/meeting';

import CalenderNew from '../kalender/kalender';
import ListToDoNew from './listToDo';
import moment from 'moment-timezone';

const widgetNew = [
  { idWidget: '1', imgOn: '@0,5xMeeting on.svg', imgOff: '@0,5xMeeting off.svg', name: 'Meeting', checked: false }
]
class DashGuru extends Component {

  state = {
    role: '',
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

    ptc: [],
    openParticipants: false,
    ptcId: '',
    participants: [],
    getPtc: {},
    optionsName: [],
    pesertaId: [],

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
    Storage.set('widgetManagement', {
      dataWidget: data
    });
    this.setState({
      openWidget: false,
      dataWidget: data
    })
    // console.log(data, 'data tambahhh');
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

      this.setState({ ptc: res.data.result.reverse().slice(0, 5) })
    });
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

  openParticipants = e => {
    e.preventDefault()
    let dataId = e.target.getAttribute('data-id');
    console.log('ptcId: ', dataId)
    let getPtc = this.state.ptc.filter(item => item.ptc_id === parseInt(dataId));
    this.fetchParticipants(dataId);
    this.setState({ openParticipants: true, ptcId: dataId })
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

  closePengumuman() {
    this.setState({
      openPengumuman: false,
      pengumumanId: '',
      pengumumanNama: '',
      pengumumanIsi: '',
      pengumumanFile: [],
    })
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if (res.data.error) toast.info(`Error: fetch silabus`)

      this.setState({ silabus: res.data.result })
    })
  }

  componentDidMount() {
    this.getDashGuru();

    this.fetchPelajaran();
    this.fetchPengumuman();
    this.fetchJadwal();
    this.fetchPtc();
  }

  getDashGuru() {
    // console.log(Storage.get('widgetManagement'), 'gasss');
    if (Storage.get('widgetManagement')) {
      this.setState({
        dataWidget: Storage.get('widgetManagement').dataWidget
      })
    }
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

      this.setState({ jadwal: res.data.result })
    })
  }

  render() {

    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">

                    <div className="col-sm-6">
                      <TableMeetings allMeeting={true} access_project_admin={access_project_admin} projectId='0' />
                    </div>

                    <div class="col-sm-6">
                      <div className="card">
                        <div className="card-header header-kartu">
                          Parent Teacher Conference (PTC)
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>

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


                    <div className="col-sm-6">
                      <CalenderNew lists={this.state.calendar} />
                    </div>

                    <div className={this.state.dataWidget[0].checked ? "col-sm-6" : "hidden"}>


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
                                    <img className="img-responsive" src={item.checked ? "/newasset/widget/" + `${item.imgOn}` : "/newasset/widget/" + `${item.imgOff}`} style={{ width: '235px', padding: '50px' }} />
                                    <input name="image[]" type="checkbox" checked={item.cek} value={item.name} />
                                    <h6 className={item.checked ? "fc-skyblue" : ""}> {item.name} </h6>
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

                    {/* <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">To Do List</h4>
                          <ListToDoNew lists={this.state.toDo} />
                        </Card.Body>
                      </Card>
                    </div> */}

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

export default DashGuru;
