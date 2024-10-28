import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';
import { toast } from "react-toastify";

import InfoSilabus from './info';
import { Link } from 'react-router-dom'
import TableSilabus from "./table";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import { Modal } from 'react-bootstrap'

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
    nilaiMurid: [],

    isKeteranganNilai: false,

    rangeNilai: [],

    isDetailTugas: false,
    detailTask: [],

    tahunAjaran: '',
    listTahunAjaran: []
  }

  fetchRangeNilai() {
    API.get(`${API_SERVER}v2/range-nilai/company/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({ rangeNilai: res.data.result })
    })
  }

  fetchJadwal(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if (res.data.error) console.log(`Error: fetch pelajaran`)

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

    // let nilaiMurid = [
    //   {nik: 1, name: 'Ahmad', task: 10, quiz: 20, exam: 30, total: 20},
    //   {nik: 2, name: 'Ardi', task: 10, quiz: 20, exam: 30, total: 20},
    //   {nik: 3, name: 'Ansyah', task: 10, quiz: 20, exam: 30, total: 20},
    // ];
    // this.setState({ nilaiMurid: nilaiMurid, isLoading: false })

    this.fetchNilaiMurid(this.state.kelasId, pelajaranId, this.state.tahunAjaran);
  }

  fetchNilaiMurid(kelasId, pelajaranId, tahunAjaran) {
    console.log(`Query: ${kelasId} ${pelajaranId}`);

    API.get(`${API_SERVER}v2/guru/nilai-kelas/${kelasId}/${pelajaranId}?tahunAjaran=${tahunAjaran}`).then(res => {
      this.setState({ nilaiMurid: res.data.result, isLoading: false })
    })
  }

  componentDidMount() {
    let d = new Date();
    // bulan diawali dengan 0 = januari, 11 = desember
    let month = d.getMonth();
    let tahunAjaran = month < 6 ? (d.getFullYear() - 1) + '/' + d.getFullYear() : d.getFullYear() + '/' + (d.getFullYear() + 1);

    let temp = [];
    for (var i = 0; i < 6; i++) {
      temp.push(`${d.getFullYear() - i}/${d.getFullYear() - i + 1}`)
    }
    this.setState({ tahunAjaran, listTahunAjaran: temp })

    this.fetchJadwal(tahunAjaran)

    this.fetchSemester()
    this.fetchRangeNilai()
  }

  convertNilaiToAbjad(value) {
    let hr = "-";
    this.state.rangeNilai.map(item => {
      if (this.checkRangeNilai(value, item.min, item.max)) {
        hr = item.huruf;
      }
    })

    return hr;
  }

  checkRangeNilai(x, min, max) {
    return x >= min && x <= max;
  }

  openKeteranganNilai = e => {
    this.setState({ isKeteranganNilai: true })
  }

  openDetail(item) {
    this.setState({ detailTask: item, isDetailTugas: true })
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchJadwal(value);
  }

  resetFilter = e => {
    e.preventDefault()
    this.setState({
      semesterId: '',
      semesterInfo: {},

      listKelas: [],
      kelasId: '',
      kelasInfo: {},

      listPelajaran: [],
      pelajaranId: '',
      pelajaranInfo: {},

      isLoading: false,
      nilaiMurid: [],
    })
  }


  render() {
    //console.log('state: ', this.state)

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
                    <label>Tahun Ajaran</label>
                    <select onChange={this.selectTahunAjaran} value={this.state.tahunAjaran} className="form-control" required>
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.listTahunAjaran.map(item => (
                          <option value={item}>{item}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <label>Semester</label>
                    <select onChange={this.selectSemester} value={this.state.semesterId} className="form-control" required>
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.listSemester.map((item, i) => (
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
                        this.state.listKelas.map((item, i) => (
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
                        this.state.listPelajaran.map((item, i) => (
                          <option key={i} value={item.pelajaran_id}>{item.nama_pelajaran}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <label>Action</label><br />
                    <button className="btn btn-v2 btn-info" type="reset" onClick={this.resetFilter}>Reset</button>
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
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2">NILAI</td>
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2">STATUS</td>
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
                      <td className="text-center" colSpan='8'>
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
                        <td>
                          {item.task ? item.task.toFixed(2) : '-'}
                          <p title="More detail" style={{ cursor: 'pointer' }} onClick={() => this.openDetail(item.dTask)}>{item.dTask.length}</p>
                        </td>
                        <td>
                          {item.quiz ? item.quiz.toFixed(2) : '-'}
                          <p title="More detail" style={{ cursor: 'pointer' }} onClick={() => this.openDetail(item.dQuiz)}>{item.dQuiz.length}</p>
                        </td>
                        <td>
                          {item.exam ? item.exam.toFixed(2) : '-'}
                          <p title="More detail" style={{ cursor: 'pointer' }} onClick={() => this.openDetail(item.dExam)}>{item.dExam.length}</p>
                        </td>
                        <td>{(item.exam + item.quiz + item.task).toFixed(2)}<p title="More detail" style={{ cursor: 'pointer' }} onClick={this.openKeteranganNilai}>{this.convertNilaiToAbjad(item.task + item.quiz + item.exam)}</p></td>
                        <td>{(item.task + item.quiz + item.exam) >= 50 ? <span class="label label-success">Lulus</span> : <span class="label label-danger">Mengulang</span>}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <Modal show={this.state.isKeteranganNilai} onHide={() => this.setState({ isKeteranganNilai: false })} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Keterangan Nilai
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <table class="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <td width="40px"><b>Nilai</b></td>
                        <td><b>Range</b></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.rangeNilai.map(item => (
                          <tr>
                            <td><b>{item.huruf}</b></td>
                            <td>{item.min} - {item.max}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </Modal.Body>
              </Modal>

              <Modal show={this.state.isDetailTugas} onHide={() => this.setState({ isDetailTugas: false })} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Detail
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <table class="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <td><b>INFORMASI</b></td>
                        <td><b>STATUS</b></td>
                        <td><b>SCORE</b></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.detailTask.map(item => (
                          <tr>
                            <td>{item.exam_title}</td>
                            <td>{item.user_id ? <span class="label label-success">Sudah mengerjakan</span> : <span class="label label-danger">Belum mengerjakan</span>}</td>
                            <td>{item.score}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </Modal.Body>
              </Modal>

            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default DetailMurid;
