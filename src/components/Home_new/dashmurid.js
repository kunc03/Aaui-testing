import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from 'react-bootstrap';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

import CalenderNew from '../kalender/kalender';
import ListToDoNew from './listToDo';

import Pengumuman from '../Pengumuman/pengumuman';

class DashMurid extends Component {

  state = {
    toDo: [],
    calendar: [],

    pengumuman: [
      {id: 1, isi: 'Pengumuman 1'},
      {id: 2, isi: 'Pengumuman 2'},
      {id: 3, isi: 'Pengumuman 3'},
      {id: 4, isi: 'Pengumuman 4'},
    ],

    tugas: [
      {id: 1, mapel: 'Matematika', batas: '24 Des 2020', terkumpul: '20/30'},
      {id: 2, mapel: 'Fisika', batas: '25 Des 2020', terkumpul: '29/30'},
    ],

    ujian: [
      {id: 1, tanggal: '24 Des 2020', waktu: '07:00', mapel: 'Matematika', durasi: '40 Menit'},
      {id: 2, tanggal: '25 Des 2020', waktu: '08:00', mapel: 'Fisika', durasi: '45 Menit'},
      {id: 3, tanggal: '29 Des 2020', waktu: '09:00', mapel: 'Biologi', durasi: '60 Menit'},
    ],

    jadwal: [
      {id: 1, mapel: 'Matematika', topik: 'Aljabar', waktu: '07:00 - 09:00', sesi: '2'},
      {id: 2, mapel: 'Ilmu Pengetahuan Sosial', topik: 'Pancasila', waktu: '07:00 - 09:00', sesi: '3'},
    ],
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
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Mata Pelajaran</th><th>Topik</th><th>Waktu</th><th>Sesi</th><th>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.jadwal.map((item,i) => (
                                  <tr key={i} style={{borderBottom: '1px solid #e9e9e9'}}>
                                    <td>{item.mapel}</td>
                                    <td>{item.topik}</td>
                                    <td>{item.waktu}</td>
                                    <td>{item.sesi}</td>
                                    <td><i style={{cursor: 'pointer'}} className="fa fa-search"></i></td>
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
                          <h4 className="f-w-900 f-18 fc-blue">Tugas Yang Harus Dikerjakan</h4>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Mata Pelajaran</th><th>Batas Waktu</th><th>Terkumpul</th><th>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.tugas.map((item,i) => (
                                  <tr key={i} style={{borderBottom: '1px solid #e9e9e9'}}>
                                    <td>{item.mapel}</td>
                                    <td>{item.batas}</td>
                                    <td>{item.terkumpul}</td>
                                    <td><i style={{cursor: 'pointer'}} className="fa fa-search"></i></td>
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
                          <h4 className="f-w-900 f-18 fc-blue">Pengumuman Terbaru</h4>
                          <table className="table">
                            <tbody>
                              {
                                this.state.pengumuman.map((item,i) => (
                                  <tr key={i} style={{borderBottom: '1px solid #e9e9e9'}}>
                                    <td>{item.isi}</td>
                                    <td style={{width: '40px'}}>
                                      <a href="#">Lihat</a>
                                    </td>
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
                          <h4 className="f-w-900 f-18 fc-blue">Ujian Yang Akan Datang</h4>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Tanggal</th><th>Waktu</th><th>Mata Pelajaran</th><th>Durasi</th><th>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.ujian.map((item,i) => (
                                  <tr key={i}>
                                    <td>{item.tanggal}</td>
                                    <td>{item.waktu}</td>
                                    <td>{item.mapel}</td>
                                    <td>{item.durasi}</td>
                                    <td><i style={{cursor: 'pointer'}} className="fa fa-search"></i></td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <CalenderNew lists={this.state.calendar} />
                    </div>

                    <div className="col-sm-6">
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

export default DashMurid;
