import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';
import { toast } from "react-toastify";

import { Link } from 'react-router-dom'

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

class DetailMurid extends Component {

  state = {
    listSemester: [],
    semesterId: '',
    semesterInfo: {},

    jadwalKu: [],

    listKelas: [],
    kelasId: '',
    kelasInfo: {},

    listPelajaran: [],
    pelajaranId: '',
    pelajaranInfo: {},

    isLoading: false,
    nilaiMurid: []
  }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/company/${Storage.get('user').data.company_id}`).then(res => {
      if(res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ jadwalKu: res.data.result })
    })
  }

  fetchSemester() {
    API.get(`${API_SERVER}v1/semester/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data semester");

      this.setState({ listSemester: res.data.result })
    })
  }

  selectSemester = e => {
    e.preventDefault();
    let semesterId = e.target.value;

    let dd = [...this.state.jadwalKu];
    let unique = [...new Map(dd.map(item => [item['kelas_id'], item])).values()];
    this.setState({ semesterId: semesterId, listKelas: unique })
  }

  selectKelas = e => {
    e.preventDefault();
    let kelasId = e.target.value;

    let dd = [...this.state.jadwalKu];
    let filter = dd.filter(item => item.kelas_id === parseInt(kelasId));
    this.setState({ kelasId: kelasId, listPelajaran: filter })
  }

  selectPelajaran = e => {
    e.preventDefault()
    let pelajaranId = e.target.value;
    this.setState({ isLoading: true, pelajaranId: pelajaranId, nilaiMurid: [] })

    // let nilaiMurid = [
    //   {nik: 1, name: 'Ahmad', task: 10, quiz: 20, exam: 30, total: 20},
    //   {nik: 2, name: 'Ardi', task: 10, quiz: 20, exam: 30, total: 20},
    //   {nik: 3, name: 'Ansyah', task: 10, quiz: 20, exam: 30, total: 20},
    // ];
    // this.setState({ nilaiMurid: nilaiMurid, isLoading: false })

    this.fetchNilaiMurid(this.state.kelasId, pelajaranId);
  }

  fetchNilaiMurid(kelasId, pelajaranId) {
    console.log(`Query: ${kelasId} ${pelajaranId}`);

    API.get(`${API_SERVER}v2/guru/nilai-kelas/${kelasId}/${pelajaranId}`).then(res => {
      this.setState({ nilaiMurid: res.data.result, isLoading: false })
    })
  }

  componentDidMount() {
    this.fetchJadwal()
    this.fetchSemester()
  }

  render() {
    console.log('state: ', this.state)

    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row mt-3">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body">
                          <form>
                            <div className="form-group row">
                              <div className="col-sm-2">
                                <label>Semester</label>
                                <select onChange={this.selectSemester} value={this.state.semesterId} className="form-control" required>
                                  <option value="" selected disabled>Select</option>
                                  {
                                    this.state.listSemester.map((item,i) => (
                                      <option key={i} value={item.semester_id}>{item.semester_name}</option>
                                    ))
                                  }
                                </select>
                              </div>
                              <div className="col-sm-2">
                                <label>Kelas</label>
                                <select onChange={this.selectKelas} value={this.state.kelasId} className="form-control" required>
                                  <option value="" selected disabled>Select</option>
                                  {
                                    this.state.listKelas.map((item,i) => (
                                      <option key={i} value={item.kelas_id}>{item.kelas_nama}</option>
                                    ))
                                  }
                                </select>
                              </div>
                              <div className="col-sm-3">
                                <label>Mata Pelajaran</label>
                                <select onChange={this.selectPelajaran} value={this.state.pelajaranId} className="form-control" required>
                                  <option value="" selected disabled>Select</option>
                                  {
                                    this.state.listPelajaran.map((item,i) => (
                                      <option key={i} value={item.pelajaran_id}>{item.nama_pelajaran}</option>
                                    ))
                                  }
                                </select>
                              </div>

                            </div>
                          </form>

                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body">
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr className="text-center">
                                <td style={{ verticalAlign: 'middle' }} rowSpan="2"> NO </td>
                                <td style={{ verticalAlign: 'middle' }} rowSpan="2"> NIK </td>
                                <td style={{ verticalAlign: 'middle' }} rowSpan="2"> NAMA </td>
                                <td colSpan="3">NILAI HASIL BELAJAR</td>
                                <td style={{ verticalAlign: 'middle' }} rowSpan="2">NILAI AKHIR</td>
                              </tr>
                              <tr className="text-center">
                                <td>TASK</td>
                                <td>QUIZ</td>
                                <td>EXAM</td>
                              </tr>
                            </thead>

                            <tbody>
                              {
                                this.state.isLoading &&
                                <tr>
                                  <td className="text-center" colSpan='7'>
                                    <span>Loading...</span>
                                  </td>
                                </tr>
                              }
                              {
                                this.state.nilaiMurid.map((item, i) => (
                                  <tr className="text-center">
                                    <td>{i + 1}</td>
                                    <td>{item.no_induk}</td>
                                    <td>{item.nama}</td>
                                    <td>{item.task}</td>
                                    <td>{item.quiz}</td>
                                    <td>{item.exam}</td>
                                    <td>{item.task+item.quiz+item.exam}</td>
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
    )
  }
}

export default DetailMurid;
