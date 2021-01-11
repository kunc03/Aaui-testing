import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import API, { USER_ME, API_SERVER } from '../../repository/api';
class LaporanPembelajaranMurid extends Component {
  state = {
    myMurid: {},

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
    nilaiMurid: []
  }

  componentDidMount() {
    this.fetchMyMurid(Storage.get('user').data.user_id);
  }

  fetchMyMurid(userId) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch murid`)

      this.setState({ myMurid: res.data.result })

      this.fetchNilaiMurid(res.data.result.semester_id, res.data.result.kelas_id, res.data.result.user_id_murid)
    })
  }

  fetchNilaiMurid(semesterId, kelasId, userId) {
    this.setState({ nilaiMurid: [], isLoading: true })
    API.get(`${API_SERVER}v2/guru/nilai-murid/${semesterId}/${kelasId}/${userId}`).then(res => {
      this.setState({ nilaiMurid: res.data.result, isLoading: false })
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-8">
          <div className="row">
            <div style={{ padding: '10px 20px' }}>
              <h3 className="f-w-900 f-18 fc-blue">
                Student Learning Report
            </h3>
            </div>
          </div>
        </div>
        <div className="col-sm-4 text-right">
          <p className="m-b-0">
            <Link to={"project"}>
              <span className=" f-12 fc-skyblue">See all</span>
            </Link>
          </p>
          <b className="f-24 f-w-800">  . . . </b>
        </div>

        <div className="col-xl-12">

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
                    <input type="text" value={this.state.myMurid.nik_murid} disabled className="form-control" />
                  </div>

                  <label className="col-sm-2 col-form-label text-right">SEMESTER</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.myMurid.semester_name} className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right"> NAME </label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.myMurid.nama_murid} className="form-control" />
                  </div>

                  <label className="col-sm-2 col-form-label text-right">SCHOOL YEAR</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.myMurid.tahun_ajaran} className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">KELAS</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.myMurid.kelas_nama} className="form-control" />
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
                          <br/>
                          {item.kumpulTugas.length}/{item.totalTugas.length}
                        </td>
                        <td>
                          {Number.parseFloat(item.totalAkhirScoreKuis).toFixed(2)}
                          <br/>
                          {item.kumpulKuis.length}/{item.totalKuis.length}
                        </td>
                        <td>
                          {Number.parseFloat(item.totalAkhirScoreUjian).toFixed(2)}
                          <br/>
                          {item.kumpulUjian.length}/{item.totalUjian.length}
                        </td>
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

export default LaporanPembelajaranMurid;
