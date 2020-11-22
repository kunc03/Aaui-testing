import React, { Component } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';

export default class KursusNew extends Component {

  state = {
    pelajaran: []
  }

  componentDidMount() {
    this.fetchPelajaran();
  }

  fetchPelajaran() {
    let pelajaran = [
      { id: 1, pelajaran: "Matematika", tanggal: "16 Nov 2020", status: "Selesai", sesi: 5, kelas: "1 RPL", waktu: "08:00", materi: 2, kuis: 1, tugas: 1, ujian: 1 },
      { id: 2, pelajaran: "Fisika", tanggal: "21 Nov 2020", status: "Belum Selesai", sesi: 11, kelas: "2 RPL", waktu: "08:00", materi: 3, kuis: 2, tugas: 12, ujian: 12 },
      { id: 3, pelajaran: "Biologi", tanggal: "22 Nov 2020", status: "Belum Selesai", sesi: 0, kelas: "3 RPL", waktu: "08:00", materi: 0, kuis: 0, tugas: 0, ujian: 0 },
    ];

    this.setState({ pelajaran })
  }

  render() {
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
                                <th>Tanggal Dibuat</th>
                                <th>Status</th>
                                <th>Total Sesi</th>
                                <th>Kelas</th>
                                <th>Time </th>
                                <th>Materi</th>
                                <th>Kuis</th>
                                <th>Tugas</th>
                                <th> Exams</th>
                                <th className="text-center"> Action </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.pelajaran.map((item, i) => (
                                  <tr>
                                    <td>{item.pelajaran}</td>
                                    <td>{item.tanggal}</td>
                                    <td>{item.status}</td>
                                    <td>{item.sesi}</td>
                                    <td>{item.kelas}</td>
                                    <td>{item.waktu}</td>
                                    <td>{item.materi}</td>
                                    <td>{item.kuis}</td>
                                    <td>{item.tugas}</td>
                                    <td>{item.ujian}</td>
                                    <td className="text-center">
                                      {
                                        item.materi > 0 && Date.parse(item.tanggal) >= new Date() &&
                                        <Link to={`/guru/masuk/${item.id}`} className="btn btn-v2 btn-primary ml-2">Masuk</Link>
                                      }
                                      {
                                        item.materi <= 0 &&
                                        <Link to={`/guru/pelajaran/${item.id}`} className="btn btn-v2 btn-warning ml-2">Lengkapi</Link>
                                      }
                                      {
                                        Date.parse(item.tanggal) <= new Date() &&
                                        <Link to={`/guru/riwayat/${item.id}`} className="btn btn-v2 btn-default ml-2">Riwayat</Link>
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
        </div>
      </div>
    );
  }

}
