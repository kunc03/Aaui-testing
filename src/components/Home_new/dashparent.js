import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import CalenderNew from '../kalender/kalender';
import ProjekNew from './projek';

import { toast } from 'react-toastify'
import moment from 'moment-timezone'

import Pengumuman from '../Pengumuman/pengumuman';

class DashParent extends Component {

  state = {
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

                    <div className="col-sm-6">
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
                                    <td><i style={{ cursor: 'pointer' }} className="fa fa-search"></i></td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <ProjekNew lists={this.state.project} />
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <CalenderNew lists={this.state.calendar} />
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
