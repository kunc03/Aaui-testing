import React, { Component } from "react";
import { Doughnut, Bar } from 'react-chartjs-2';

import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap';

class Evaluasi extends Component {

  state = {
    guru: [],
    guruId: '',
    guruName: '',

    semester: [],
    semesterId: '',
    semesterName: '',

    kelas: [],
    kelasId: '',
    kelasName: '',

    pelajaran: [],
    pelajaranId: '',
    pelajaranName: '',

    isModal: false,
    gId: '',
    jId: '',
    sId: '',
    kId: '',
    pId: '',

    fileName: '',
    tempFile: Math.random().toString(36),

    isPreview: false,
    detailKinerja: {},

    formatKpi: '',

    menguasai: 0,
    tidak: 0,

    nilaiMurid: [],
  }

  changeGuru = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.pengajar == e.target.value)
    let semester = this.findUnique(filter, d => d.semester_id)
    let getGuru = [...this.state.guru].filter(item => item.pengajar == e.target.value)
    this.setState({ guruId: e.target.value, kinerja: filter, guruName: getGuru[0].nama, semester })
  }

  changeSemester = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.semester_id == e.target.value)
    let kelas = this.findUnique(filter, d => d.kelas_id)
    let getSemester = [...this.state.semester].filter(item => item.semester_id == e.target.value)
    this.setState({ semesterId: e.target.value, kinerja: filter, semesterName: getSemester[0].semester, kelas })
  }

  changeKelas = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.kelas_id == e.target.value)
    let pelajaran = this.findUnique(filter, d => d.pelajaran_id)
    let getKelas = [...this.state.kelas].filter(item => item.kelas_id == e.target.value)
    this.setState({ kelasId: e.target.value, kinerja: filter, kelasName: getKelas[0].kelas, pelajaran })
  }

  changePelajaran = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.pelajaran_id == e.target.value)
    let getPelajaran = [...this.state.pelajaran].filter(item => item.pelajaran_id == e.target.value)
    this.setState({ pelajaranId: e.target.value, kinerja: filter, pelajaranName: getPelajaran[0].pelajaran })

    this.fetchNilaiMurid(this.state.kelasId, e.target.value);
  }

  openModal = e => {
    this.setState({
      isModal: true,
      jId: e.target.getAttribute('data-jadwal'),
      gId: e.target.getAttribute('data-guru'),
      sId: e.target.getAttribute('data-semester'),
      kId: e.target.getAttribute('data-kelas'),
      pId: e.target.getAttribute('data-pelajaran'),
    })
  }

  submitKPI = e => {
    e.preventDefault();
    let form = new FormData();
    form.append('file', this.state.fileName);
    form.append('jadwalId', this.state.jId);
    form.append('guruId', this.state.gId);
    form.append('semesterId', this.state.sId);
    form.append('kelasId', this.state.kId);
    form.append('pelajaranId', this.state.pId);

    console.log('state: ', this.state)
    API.post(`${API_SERVER}v2/principal/upload`, form).then(res => {
      console.log('res: ', res.data);
      if (res.data.error) toast.warning(`Error: upload KPI`)

      toast.success(`Berhasil upload KPI Guru`);
      this.clearFilter();
    })
  }

  openPreview = e => {
    let cc = [...this.state.kinerja];
    let detail = cc[e.target.getAttribute('data-index')];
    this.setState({ isPreview: true, detailKinerja: detail })
  }

  componentDidMount() {
    this.fetchKinerja()
    this.fetchNewestFormat()
  }

  clearPreview() {
    this.setState({
      isPreview: false,
      detailKinerja: {}
    })
  }

  clearFilter() {
    API.get(`${API_SERVER}v2/principal/kpi-guru/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({
        tempFile: Math.random().toString(36),
        jId: '', sId: '', gId: '', kId: '', pId: '', fileName: '', isModal: false,
        semesterId: '', guruId: '', kelasId: '', pelajaranId: '', kinerja: res.data.result,
        guruName: '', semesterName:'', kelasName: '', pelajaranName: '', menguasai: '', tidak: '', nilaiMurid:[]
      })
    })
  }

  fetchKinerja() {
    API.get(`${API_SERVER}v2/principal/kpi-guru/${Storage.get('user').data.company_id}`).then(res => {

      let guru = this.findUnique(res.data.result, d => d.pengajar)
      // let semester = this.findUnique(res.data.result, d => d.semester_id)
      // let kelas = this.findUnique(res.data.result, d => d.kelas_id)
      // let pelajaran = this.findUnique(res.data.result, d => d.pelajaran_id)

      this.setState({ kinerja: res.data.result, guru })
    })
  }

  fetchNilaiMurid(kelasId, pelajaranId) {
    console.log(`Query: ${kelasId} ${pelajaranId}`);

    API.get(`${API_SERVER}v2/guru/nilai-kelas/${kelasId}/${pelajaranId}`).then(res => {

      let lulus = res.data.result.filter(item => (item.quiz + item.exam + item.task) >= 50).length;
      let belum = res.data.result.filter(item => (item.quiz + item.exam + item.task) < 50).length;

      this.setState({ nilaiMurid: res.data.result, menguasai: lulus, tidak: belum })
    })
  }

  fetchNewestFormat() {
    API.get(`${API_SERVER}v2/learning-kpi/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.result.length) {
        this.setState({ formatKpi: res.data.result[res.data.result.length - 1].file })
      } else {
        toast.info(`Format KPI belum di upload oleh Admin.`)
      }
    })
  }

  findUnique(arr, predicate) {
    var found = {};
    arr.forEach(d => {
      found[predicate(d)] = d;
    });
    return Object.keys(found).map(key => found[key]);
  }

  render() {

    console.log('state: ', this.state)

    const dataEvaluasi = {
      labels: ['Responden'],
      datasets: [
        {
          label: 'Menguasai',
          backgroundColor: '#28a745',
          borderColor: '#0b2e13',
          borderWidth: 1,
          hoverBackgroundColor: '#1a692c',
          hoverBorderColor: '#0b2e13',
          data: [this.state.menguasai]
        },
        {
          label: 'Tidak Menguasai',
          backgroundColor: '#fa3e3e',
          borderColor: '#b12e2e',
          borderWidth: 1,
          hoverBackgroundColor: '#7c2323',
          hoverBorderColor: '#b12e2e',
          data: [this.state.tidak]
        }
      ]
    }

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0
          }
        }]
      }
    };

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card" style={{ paddingBottom: 10 }}>
            <div className="row">

              <div className="col-xl-12 pl-5 mb-4">
                <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3">
                  Laporan Evaluasi
                  </h3>
                <div className="form-group row">
                  <div className="col-sm-3">
                    <label>Guru</label>
                    <select onChange={this.changeGuru} disabled={this.state.guruId} value={this.state.guruId} className="form-control">
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.guru.map(item => (
                          <option value={item.pengajar}>{item.nama}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <label>Semester</label>
                    <select onChange={this.changeSemester} disabled={this.state.semesterId} value={this.state.semesterId} className="form-control">
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.semester.map(item => (
                          <option value={item.semester_id}>{item.semester}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <label>Kelas</label>
                    <select onChange={this.changeKelas} disabled={this.state.kelasId} value={this.state.kelasId} className="form-control" >
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.kelas.map(item => (
                          <option value={item.kelas_id}>{item.kelas}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <label>Pelajaran</label>
                    <select onChange={this.changePelajaran} disabled={this.state.pelajaranId} value={this.state.pelajaranId} className="form-control" >
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.pelajaran.map(item => (
                          <option value={item.pelajaran_id}>{item.pelajaran}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="col-sm-2">
                    <button className="btn btn-v2 btn-success mt-4" onClick={() => this.clearFilter()}>
                      Reset Filter
                      </button>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 p-5">
                <Bar data={dataEvaluasi} options={options} />
              </div>

              <div className="col-xl-6 p-5">
                <div style={{ overflowX: "auto" }}>
                  <table className="table">
                    <tr>
                      <td style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Nama Guru</span></td>
                      <td style={{ background: '#F5F5F5', border: '4px solid white' }}>
                        <b className="fc-skyblue">{this.state.guruName}</b>
                      </td>
                    </tr>
                    <tr>
                      <td width="200px" style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Semester</span></td>
                      <td style={{ background: '#F5F5F5', border: '4px solid white' }}>
                        <b className="fc-skyblue">{this.state.semesterName}</b></td>
                    </tr>
                    <tr>
                      <td width="200px" style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Nama Kelas</span></td>
                      <td style={{ background: '#F5F5F5', border: '4px solid white' }}>
                        <b className="fc-skyblue">{this.state.kelasName}</b></td>
                    </tr>
                    <tr>
                      <td width="200px" style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Mata Pelajaran</span></td>
                      <td style={{ background: '#F5F5F5', border: '4px solid white' }}>
                        <b className="fc-skyblue">{this.state.pelajaranName}</b></td>
                    </tr>

                  </table>
                </div>
              </div>

              <div className="col-xl-12 p-5">

                <table className="table table-striped table-bordered">
                  <thead>
                    <tr className="text-center">
                      <td style={{ verticalAlign: 'middle' }} rowSpan="2"> NO </td>
                      <td style={{ verticalAlign: 'middle' }} rowSpan="2"> NIK </td>
                      <td style={{ verticalAlign: 'middle' }} rowSpan="2"> NAMA </td>
                      <td colSpan="3">NILAI HASIL BELAJAR</td>
                      <td style={{ verticalAlign: 'middle' }} rowSpan="2">NILAI AKHIR</td>
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
                          <td>{item.task}</td>
                          <td>{item.quiz}</td>
                          <td>{item.exam}</td>
                          <td>{item.task + item.quiz + item.exam}</td>
                          <td>{(item.task + item.quiz + item.exam) >= 50 ? <span class="label label-success">Lulus</span> : <span class="label label-danger">Mengulang</span>}</td>
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


    );
  }
}

export default Evaluasi;
