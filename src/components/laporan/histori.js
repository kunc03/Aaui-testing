import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import jsPDF from "jspdf";
import "jspdf-autotable";

class Laporan extends React.Component {

  state = {
    isLoading: false,
    murid: [],

    muridOptions: [],
    muridId: [],
    muridInfo: {},

    kelasMurid: [],
  }

  componentDidMount() {
    this.fetchMurid()
  }

  fetchKelasMurid(userId) {
    this.setState({ isLoading: true })
    API.get(`${API_SERVER}v2/kelas/murid/${userId}`).then(async res => {
      if(res.data.error) {
        toast.warning(`Error fetch kelas murid`)
      }
      else {
        for(var i=0; i<res.data.result.length; i++) {
          let nilai = await API.get(`${API_SERVER}v2/guru/nilai-murid/${res.data.result[i].semester_id}/${res.data.result[i].kelas_id}/${userId}?tahunAjaran=${res.data.result[i].tahun_ajaran}`);
          res.data.result[i].nilai = nilai.data.result;
        }

        this.setState({ kelasMurid: res.data.result, isLoading: false })
      }
    })
  }

  fetchMurid() {
    API.get(`${API_SERVER}v2/murid/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch murid");

      let createOptions = [];
      res.data.result.map((item) => {
        createOptions.push({
          value: item.user_id,
          label: `${item.no_induk} - ${item.nama}`
        });
      })

      this.setState({ murid: res.data.result, muridOptions: createOptions })
    })
  }

  fetchNilaiMurid(semesterId, kelasId, userId, tahunAjaran) {
    console.log(`Query: ${semesterId} ${kelasId} ${userId}`);
    API.get(`${API_SERVER}v2/guru/nilai-murid/${semesterId}/${kelasId}/${userId}?tahunAjaran=${tahunAjaran}`).then(res => {
      this.setState({ nilaiMurid: res.data.result, isLoading: false })
    })
  }

  selectMurid = e => {
    this.setState({ isLoading: true })
    API.get(`${API_SERVER}v2/murid/user-id/${e[0]}`).then(res => {
      this.setState({ muridId: e, muridInfo: res.data.result })
      this.fetchKelasMurid(e[0])
    })
  }

  render() {
    console.log('state: ', this.state)

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Laporan Pembelajaran Murid</div>

            <div className="card-body row">

              <div className="col-sm-6 mb-3">
                <label>Murid</label>
                <MultiSelect
                  id={`userId`}
                  options={this.state.muridOptions}
                  value={this.state.muridId}
                  onChange={this.selectMurid}
                  mode="single"
                  enableSearch={true}
                  resetable={true}
                  valuePlaceholder="Pilih"
                  allSelectedLabel="Semua"
                />
              </div>

              <div className="col-sm-12">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Semester</th>
                      <th>Nama Kelas</th>
                      <th>Tahun Ajaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.isLoading ?
                      <tr>
                        <td className="text-center" colSpan="4">fetching data...</td>
                      </tr>
                      :
                      <>
                      {
                        this.state.kelasMurid.map((row,i) => (
                          <>
                            <tr>
                              <td className="text-center collapsed"
                                data-toggle="collapse"
                                data-target={`#collapse${i}`}
                                aria-expanded="false"
                                aria-controls={`collapse${i}`}>
                                <i class="fa" aria-hidden="true"></i>
                              </td>
                              <td>{row.semester_name}</td>
                              <td>{row.kelas_nama}</td>
                              <td>{row.tahun_ajaran}</td>
                            </tr>
                            <tr className="collapse" id={`collapse${i}`}>
                              <td colSpan="4">
                                <table className="table table-striped table-bordered">
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
                                      row.nilai.map((item, i) => (
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
                              </td>
                            </tr>
                          </>
                        ))
                      }
                      </>
                    }

                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

      </div>
    )
  }

}

export default Laporan;
