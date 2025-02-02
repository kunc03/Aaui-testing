import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';
import { toast } from "react-toastify";

import InfoSilabus from './info';
import { Link } from 'react-router-dom'
import TableSilabus from "./table";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import jsPDF from "jspdf";
import "jspdf-autotable";

class DetailMurid extends Component {

  state = {
    mataPelajaran: [],
    jadwalPelajaran: [],

    listSemester: [],
    semesterId: '',
    semesterInfo: {},

    jadwalKu: [],

    listKelas: [],
    kelasId: '',
    kelasInfo: {},

    listMurid: [],
    muridId: [],
    muridInfo: {},

    isLoading: false,
    nilaiMurid: [],

    tahunAjaran: '',
    listTahunAjaran: [],
  }

  fetchJadwalKu(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if (res.data.error) console.log(`Error: fetch pelajaran`)

      let dd = res.data.result;
      let unique = [...new Map(dd.map(item => [item['pelajaran_id'], item])).values()];

      this.setState({ mataPelajaran: dd, jadwalPelajaran: unique, jadwalKu: res.data.result })
    })
  }

  fetchJadwal(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if (res.data.error) console.log(`Error: fetch pelajaran`)

      this.setState({ jadwalKu: res.data.result })
    })
  }

  exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Report ";
    const headers = [["NO", "SUBJECT", "NILAI", "TASK", "QUIZ", "EXAM", "PRESENSI"]];

    const data = this.state.nilaiMurid.map((item, i) =>
      [
        i + 1,
        item.nama_pelajaran,
        (item.totalAkhirScoreTugas + item.totalAkhirScoreKuis + item.totalAkhirScoreUjian).toFixed(2),
        item.totalAkhirScoreTugas,
        item.totalAkhirScoreKuis,
        item.totalAkhirScoreUjian,
        0
      ]
    );

    let content = {
      startY: 100,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);

    doc.setFontSize(9);

    doc.text(`NIK`, 40, 60);
    doc.text(`: ${this.state.muridId[0]}`, 120, 60);

    doc.text(`NAME`, 40, 75);
    doc.text(`: ${this.state.muridInfo.nama}`, 120, 75);

    doc.text(`CLASS`, 40, 90);
    doc.text(`: ${this.state.kelasInfo.kelas_nama}`, 120, 90);

    doc.text(`SEMESTER`, 220, 60)
    doc.text(`: ${this.state.semesterInfo.semester_name}`, 300, 60);

    doc.text(`YEAR`, 220, 75)
    doc.text(`: ${this.state.kelasInfo.tahun_ajaran}`, 300, 75);

    doc.setFontSize(15);
    doc.autoTable(content);

    doc.save("report.pdf")
  }

  fetchSemester() {
    API.get(`${API_SERVER}v1/semester/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data semester");

      this.setState({ listSemester: res.data.result })
    })
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchJadwal(value);
  }

  selectSemester = e => {
    e.preventDefault();
    let semesterId = e.target.value;

    let dd = [...this.state.jadwalKu];
    let unique = [...new Map(dd.map(item => [item['kelas_id'], item])).values()];
    let filter = unique.filter(item => item.semester_id === parseInt(semesterId));
    this.setState({ semesterId: semesterId, listKelas: filter })

    API.get(`${API_SERVER}v1/semester/${semesterId}`).then(res => {
      this.setState({ semesterId, semesterInfo: res.data.result, listKelas: filter })
    })
  }

  fetchKelas(semesterId) {
    API.get(`${API_SERVER}v2/kelas/semester/${Storage.get('user').data.company_id}/${semesterId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data semester");

      this.setState({ listKelas: res.data.result })
    })
  }

  selectKelas = e => {
    e.preventDefault();
    let kelasId = e.target.value;
    API.get(`${API_SERVER}v2/kelas/one/${kelasId}`).then(res => {
      this.setState({ kelasId, kelasInfo: res.data.result })
    })
    this.fetchMurid(kelasId);
  }

  fetchMurid(kelasId) {
    API.get(`${API_SERVER}v2/murid/kelas/${kelasId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch murid");

      let createOptions = [];
      res.data.result.map((item) => {
        createOptions.push({
          value: item.no_induk,
          label: `${item.no_induk} - ${item.nama}`
        });
      })

      this.setState({ listMurid: createOptions })

    })
  }

  selectMurid = e => {
    console.log('state:', e)
    this.setState({ isLoading: true, nilaiMurid: [] })
    API.get(`${API_SERVER}v2/murid/no-induk/${e[0]}`).then(res => {
      this.setState({ muridId: e, muridInfo: res.data.result })
      this.fetchNilaiMurid(this.state.semesterId, this.state.kelasId, res.data.result.user_id, this.state.tahunAjaran)
    })
  }

  fetchNilaiMurid(semesterId, kelasId, userId, tahunAjaran) {
    console.log(`Query: ${semesterId} ${kelasId} ${userId}`);
    API.get(`${API_SERVER}v2/guru/nilai-murid/${semesterId}/${kelasId}/${userId}?tahunAjaran=${tahunAjaran}`).then(res => {
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
    this.fetchJadwalKu(tahunAjaran)
    this.fetchSemester()
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

      muridId: [],

      isLoading: false,
      nilaiMurid: [],
    })
  }

  render() {

    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;

    //console.log('state: ', this.state)

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
                    <label>Kelas</label>
                    <select onChange={this.selectKelas} value={this.state.kelasId} className="form-control" required>
                      <option value="" selected disabled>Select</option>
                      {
                        this.state.jadwalKu.map((item, i) => (
                          <option key={i} value={item.kelas_id}>{item.kelas_nama}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <label>Nama Murid</label>
                    <MultiSelect
                      id={`userId`}
                      options={this.state.listMurid}
                      value={this.state.muridId}
                      onChange={this.selectMurid}
                      mode="single"
                      enableSearch={true}
                      resetable={true}
                      valuePlaceholder="Pilih"
                      allSelectedLabel="Semua"
                    />
                  </div>

                  <div className="col-sm-3">
                    <button className="btn btn-v2 btn-success mt-4 mr-2" onClick={() => this.exportPDF()}>
                      <i className="fa fa-download"></i> Report
                    </button>
                    <button className="btn btn-v2 btn-info mt-4" type="reset" onClick={this.resetFilter}>Reset</button>
                  </div>

                </div>
              </form>

            </div>
          </div>
        </div>

        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2">
                  <img
                    style={{
                      marginTop: '36px',
                      marginLeft: '64px'
                    }}
                    src="/assets/images/user/avatar-1.png"
                    className="rounded-circle img-profile mb-4"
                  />
                </div>

                <div className="col-sm-10">
                  <form className="mt-4">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label text-right">NO INDUK</label>
                      <div className="col-sm-4">
                        <input type="text" value={this.state.muridId[0]} disabled className="form-control" />
                      </div>

                      <label className="col-sm-2 col-form-label text-right">KELAS</label>
                      <div className="col-sm-4">
                        <input type="text" value={this.state.kelasInfo.kelas_nama} className="form-control" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label text-right"> NAMA LENGKAP </label>
                      <div className="col-sm-4">
                        <input type="text" value={this.state.muridInfo.nama} className="form-control" />
                      </div>

                      <label className="col-sm-2 col-form-label text-right"> TAHUN AJARAN </label>
                      <div className="col-sm-4">
                        <input type="text" value={this.state.kelasInfo.tahun_ajaran} className="form-control" />
                      </div>
                    </div>

                  </form>
                </div>

              </div>

              <div className="row">
                <div className="col-sm-12">
                  <table className="table table-striped mt-4 table-bordered">
                    <thead>
                      <tr className="text-center">
                        <td style={{ verticalAlign: 'middle' }} rowSpan="2">NO</td>
                        <td style={{ verticalAlign: 'middle' }} rowSpan="2"> SUBJECT </td>
                        <td style={{ verticalAlign: 'middle' }} rowSpan="2"> TOTAL</td>
                        <td colSpan="3">NILAI HASIL BELAJAR</td>
                        <td style={{ verticalAlign: 'middle' }} rowSpan="2">PERSENSI</td>
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
                            <td>{item.nama_pelajaran}</td>
                            <td>{(item.totalAkhirScoreTugas + item.totalAkhirScoreKuis + item.totalAkhirScoreUjian).toFixed(2)}</td>
                            <td>
                              {Number.parseFloat(item.totalAkhirScoreTugas).toFixed(2)}
                              <br />
                              {item.kumpulTugas.length}/{item.totalTugas.length}
                            </td>
                            <td>
                              {Number.parseFloat(item.totalAkhirScoreKuis).toFixed(2)}
                              <br />
                              {item.kumpulKuis.length}/{item.totalKuis.length}
                            </td>
                            <td>
                              {Number.parseFloat(item.totalAkhirScoreUjian).toFixed(2)}
                              <br />
                              {item.kumpulUjian.length}/{item.totalUjian.length}
                            </td>
                            <td>{item.persensi ? item.persensi + '%' : '0%'}</td>
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
    )
  }
}

export default DetailMurid;
