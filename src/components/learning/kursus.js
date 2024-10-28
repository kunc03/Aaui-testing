import React, { Component } from 'react';

import API, { API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';

import { NavLink, Switch, Route, Link } from 'react-router-dom';

export default class KursusNew extends Component {

  state = {
    pelajaran: []
  }

  componentDidMount() {
    this.fetchPelajaran();
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ pelajaran: res.data.result })
    })
  }

  render() {
    console.log(`state: `, this.state)
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="floating-back">
                    <Link to={`/`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                        onClick={this.goBack}
                      ></img>
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-xl-12">

                      <div className="card">
                        <div className="card-header">
                          Learning
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Pelajaran</th>
                                <th>Kelas</th>
                                <th>Hari</th>
                                <th>Waktu</th>
                                <th>Total Sesi</th>
                                <th>Materi</th>
                                <th>Kuis</th>
                                <th>Tugas</th>
                                <th>Ujian</th>
                                <th>Created At</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.pelajaran.map((item, i) => (
                                  <tr>
                                    <td>{item.nama_pelajaran}</td>
                                    <td>{item.kelas_nama}</td>
                                    <td>{item.hari}</td>
                                    <td>{moment(item.jam_mulai, 'HH:mm').local().format('HH:mm')} - {moment(item.jam_selesai, 'HH:mm').local().format('HH:mm')}</td>
                                    <td>{item.jumlah_pertemuan}</td>
                                    <td>{item.materi}</td>
                                    <td>{item.kuis}</td>
                                    <td>{item.tugas}</td>
                                    <td>{item.ujian}</td>
                                    <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                                    <td className="text-center">
                                      {
                                        // item.materi > 0 && Date.parse(item.tanggal) >= new Date() &&
                                        <Link to={`/guru/masuk/${item.pelajaran_id}`} className="btn btn-v2 btn-primary ml-2">Masuk</Link>
                                      }
                                      {
                                        // item.materi <= 0 &&
                                        <Link to={`/guru/pelajaran/${item.pelajaran_id}`} className="btn btn-v2 btn-warning ml-2">Lengkapi</Link>
                                      }
                                      {
                                        // Date.parse(item.tanggal) <= new Date() &&
                                        <Link to={`/guru/riwayat/${item.pelajaran_id}`} className="btn btn-v2 btn-default ml-2">Riwayat</Link>
                                      }
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div >
      </div >
    );
  }

}
