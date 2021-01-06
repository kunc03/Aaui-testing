import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';
import { toast } from "react-toastify";

import InfoSilabus from './info';
import { Link } from 'react-router-dom'
import TableSilabus from "./table";

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
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}`).then(res => {
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
    let filter = unique.filter(item => item.semester_id === parseInt(semesterId));
    this.setState({ semesterId: semesterId, listKelas: filter })
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

    this.fetchNilaiMurid(this.state.kelasId, pelajaranId);
  }

  fetchNilaiMurid(kelasId, pelajaranId) {
    console.log(`Query: ${kelasId} ${pelajaranId}`);

    API.get(`${API_SERVER}v2/guru/nilai-rata/${kelasId}/${pelajaranId}`).then(res => {
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
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2"> KELAS </td>
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2"> PELAJARAN </td>
                    <td colSpan="3">NILAI RATA-RATA</td>
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2">NILAI RATA KELAS</td>
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
                        <td>{item.kelas_nama}</td>
                        <td>{item.pelajaran_nama}</td>
                        <td>{item.task}</td>
                        <td>{item.quiz}</td>
                        <td>{item.exam}</td>
                        <td>{((item.task+item.quiz+item.exam)/3).toFixed(2)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default DetailMurid;
