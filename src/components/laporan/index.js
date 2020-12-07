import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

class Laporan extends React.Component {

  state = {
    listSemester: [],
    semesterId: '',
    semesterInfo: {},

    listKelas: [],
    kelasId: '',
    kelasInfo: {},

    listMurid: [],
    muridId: [],
    muridInfo: {},

    isLoading: false,
    nilaiMurid: []
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
    API.get(`${API_SERVER}v1/semester/${semesterId}`).then(res => {
      this.setState({ semesterId, semesterInfo: res.data.result })
    })
    this.fetchKelas(semesterId);
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
      this.fetchNilaiMurid(this.state.semesterId, this.state.kelasId, res.data.result.user_id)
    })
  }

  fetchNilaiMurid(semesterId, kelasId, userId) {
    console.log(`Query: ${semesterId} ${kelasId} ${userId}`);
    API.get(`${API_SERVER}v2/guru/nilai-murid/${semesterId}/${kelasId}/${userId}`).then(res => {
      this.setState({ nilaiMurid: res.data.result, isLoading: false })
    })
  }

  componentDidMount() {
    this.fetchSemester()
    // this.fetchNilai()
  }

  fetchNilai() {
    let data = [
      { id: 1, mata_pelajaran: "Matematika", nilai_rata: 98.2, nilai_tugas: 88, nilai_uts: 80, nilai_uas: 90, persensi: '95%' },
      { id: 2, mata_pelajaran: "Fisika", nilai_rata: 93.2, nilai_tugas: 89, nilai_uts: 90, nilai_uas: 80, persensi: '98%' },
      { id: 2, mata_pelajaran: "Bahasa Indonesia", nilai_rata: 91.2, nilai_tugas: 90.5, nilai_uts: 95, nilai_uas: 80, persensi: '96%' },
    ];
    this.setState({ nilaiMurid: data })
  }

  render() {
    console.log('state: ', this.state)
    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Laporan / Raport Murid</div>

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
                </div>

                {
                  /**
                  <div className="form-group row">
                    <div className="col-sm-12">
                      <label>Penerima</label><br />
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="checkbox" className="form-check-input" value="" /> Option 1
                        </label>
                      </div>
                      <div className="form-check-inline">
                        <label className="form-check-label">
                          <input type="checkbox" className="form-check-input" value="" /> Option 2
                        </label>
                      </div>
                    </div>
                  </div>
                  */
                }

                {
                  /**
                  <div className="form-group row mt-4">
                    <div className="col-sm-12">
                      <button type="submit" className="btn btn-v2 btn-primary"><i className="fa fa-paper-plane"></i> Kirim</button>
                    </div>
                  </div>
                  */
                }

              </form>

              <form onSubmit={this.simpanData} className="mt-4">
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">NO INDUK</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.muridId[0]} disabled className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right"> NAME </label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.muridInfo.nama} className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">KELAS</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.kelasInfo.kelas_nama} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">SEMESTER</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.semesterInfo.semester_name} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">SCHOOL YEAR</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.kelasInfo.tahun_ajaran} className="form-control" />
                  </div>
                </div>
              </form>

              <table className="table table-striped mt-4 table-bordered">
                <thead>
                  <tr className="text-center">
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2">NO</td>
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2"> SUBJECT </td>
                    <td style={{ verticalAlign: 'middle' }} rowSpan="2"> AVERAGE</td>
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
                        <td>{item.rata}</td>
                        <td>{item.kumpulTugas.length}/{item.totalTugas.length}</td>
                        <td>{item.kumpulKuis.length}/{item.totalKuis.length}</td>
                        <td>{item.kumpulUjian.length}/{item.totalUjian.length}</td>
                        <td>{item.persensi}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Laporan;
