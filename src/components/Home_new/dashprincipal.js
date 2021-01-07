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
                                  { this.state.role.toLowerCase() !== "parents" && <th className="text-center"> Participants </th> }
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
                      <CalenderNew lists={this.state.calendar} />
                    </div>

                    <div class="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">To Do List</h4>
                          <ListToDoNew lists={this.state.toDo} />
                        </Card.Body>
                      </Card>
                    </div>

                    <div class="col-sm-6">
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
