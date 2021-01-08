import React, { Component } from "react";
import Storage from '../../repository/storage';

import InfoSilabus from './info';
import { Link } from 'react-router-dom'
import TableSilabus from "./table";
import API, {USER_ME, API_SERVER} from '../../repository/api';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify'

class GuruUjian extends Component {

  state = {
    mataPelajaran: [],
    jadwalPelajaran: [],
    dataSilabus: [],
    myMurid: {},
  }

  // fetchPelajaran() {
  //   API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
  //     if (res.data.error) toast.warning("Error fetch data kelas");
  //
  //     this.setState({ listPelajaran: res.data.result })
  //   })
  // }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");

      this.setState({ jadwalPelajaran: res.data.result })
    })
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch overview`)

      this.setState({ dataSilabus: res.data.result });
    })
  }

  componentDidMount() {
    this.fetchPelajaran();
    this.fetchJadwal();
    this.fetchMyMurid(Storage.get('user').data.user_id);
  }

  clearForm() {
    this.setState({
      isModalSilabus: false,
      isModalBuka: false,
      pelajaranId: '',
      dataSilabus: [],
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/jadwal-murid/${Storage.get('user').data.user_id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal murid`)

      this.setState({
        mataPelajaran: res.data.result
      })
    })
  }

  selectPelajaran = e => {
    e.preventDefault();
    let pelajaranId = e.target.value;
    this.setState({ isModalSilabus: true, pelajaranId })
    this.fetchSilabus(pelajaranId);
  }

  fetchMyMurid(userId) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch murid`)

      this.setState({ myMurid: res.data.result })

      this.fetchJadwal(res.data.result.user_id_murid)
    })
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  {/* <div className="floating-back">
                      <Link to={`/kursus-new`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                      </Link>
                    </div> */}

                  <div className="row">

                    <div className="col-xl-12">
                      <div class="card">
                        <div class="card-body">
                          <h3>Syllabus</h3>
                          <form className="form-inline">
                            <label>Subject</label>
                            <select onChange={this.selectPelajaran} className="form-control ml-2 col-sm-6">
                              <option value="" disabled selected>Choose subject</option>
                              {
                                this.state.jadwalPelajaran.map((item,i) => (
                                  <option key={i} value={item.pelajaran_id}>{item.nama_pelajaran}</option>
                                ))
                              }
                            </select>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <div class="card">
                        <div class="card-body">
                          <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Session</th>
                              <th>Topic</th>
                              <th>Goal</th>
                              <th>Description</th>
                              <th>Files</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.dataSilabus.map((item, i) => {
                                if(item.jenis === 0) {
                                  return (
                                      <tr key={i}>
                                        <td>{item.sesi}</td>
                                        <td>{item.topik}</td>
                                        <td>{item.tujuan}</td>
                                        <td>{item.deskripsi}</td>
                                        <td style={{padding: '12px'}}>
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
                                      <td colSpan="4" className="text-center">{item.jenis == 1 ? 'Kuis':'Ujian'}</td>
                                    </tr>
                                  )
                                }
                              })
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
    )
  }
}

export default GuruUjian;
