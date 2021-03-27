import React, { Component } from "react";
import TableWebinar from '../webinar';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { headerTabble, bodyTabble } from '../../modul/data';

import { Link } from 'react-router-dom'
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap';

import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

class LaporanKpi extends Component {

  state = {
    grupName: Storage.get('user').data.grup_name ? Storage.get('user').data.grup_name.toLowerCase() : '',
    kinerja: [],

    guru: [],
    guruId: '',

    semester: [],
    semesterId: '',

    kelas: [],
    kelasId: '',

    pelajaran: [],
    pelajaranId: '',

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
  }

  changeGuru = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.pengajar == e.target.value)
    this.setState({ guruId: e.target.value, kinerja: filter })
  }

  changeSemester = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.semester_id == e.target.value)
    this.setState({ semesterId: e.target.value, kinerja: filter })
  }

  changeKelas = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.kelas_id == e.target.value)
    this.setState({ kelasId: e.target.value, kinerja: filter })
  }

  changePelajaran = e => {
    let cc = [...this.state.kinerja];
    let filter = cc.filter(item => item.pelajaran_id == e.target.value)
    this.setState({ pelajaranId: e.target.value, kinerja: filter })
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
      if(res.data.error) toast.warning(`Error: upload KPI`)

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
        semesterId: '', guruId: '', kelasId: '', pelajaranId: '', kinerja: res.data.result
      })
    })
  }

  fetchKinerja() {
    API.get(`${API_SERVER}v2/principal/kpi-guru/${Storage.get('user').data.company_id}`).then(res => {

      let guru = this.findUnique(res.data.result, d => d.pengajar)
      let semester = this.findUnique(res.data.result, d => d.semester_id)
      let kelas = this.findUnique(res.data.result, d => d.kelas_id)
      let pelajaran = this.findUnique(res.data.result, d => d.pelajaran_id)

      this.setState({ kinerja: res.data.result, guru, semester, kelas, pelajaran })
    })
  }

  fetchNewestFormat() {
    API.get(`${API_SERVER}v2/learning-kpi/company/${Storage.get('user').data.company_id}`).then(res => {
      if(res.data.result.length) {
        this.setState({ formatKpi: res.data.result[res.data.result.length-1].file })
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
    console.log('state: ', this.state);
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">

                <div className="page-wrapper">

                  <div className="floating-back">
                    <Link to={`/`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                    </Link>
                  </div>

                  <div class="row">

                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body">
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
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body">

                          {
                            this.state.formatKpi !== "" &&
                            <a href={this.state.formatKpi} target="_blank" class="btn btn-v2 btn-primary">Download Format KPI</a>
                          }

                          <table className="table table-striped mt-4 table-bordered">
                            <thead>
                              <tr className="text-center">
                                <td style={{ verticalAlign: 'middle' }}>NO</td>
                                <td style={{ verticalAlign: 'middle' }}>NAMA GURU</td>
                                <td style={{ verticalAlign: 'middle' }}>NO INDUK</td>
                                <td style={{ verticalAlign: 'middle' }}>SEMESTER</td>
                                <td style={{ verticalAlign: 'middle' }}>KELAS</td>
                                <td style={{ verticalAlign: 'middle' }}>PELAJARAN</td>
                                <td style={{ verticalAlign: 'middle' }}>STATUS</td>
                                <td style={{ verticalAlign: 'middle' }}>ACTION</td>
                              </tr>
                            </thead>

                            <tbody>
                              {
                                this.state.kinerja.map((item,i) => (
                                  <tr>
                                    <td>{i+1}</td>
                                    <td>{item.nama}</td>
                                    <td>{item.noinduk}</td>
                                    <td>{item.semester}</td>
                                    <td>{item.kelas}</td>
                                    <td>{item.pelajaran}</td>
                                    <td class="text-center">{item.file ? <span class="label label-success">KPI terkumpul</span> : <span class="label label-danger">Belum ada KPI</span>}</td>
                                    <td class="text-center">
                                      {
                                        item.file ?
                                        <button onClick={this.openPreview} data-index={i} class="btn btn-sm btn-v2 btn-primary">Selengkapnya</button>
                                        :
                                        this.state.grupName === "principal" ?
                                          <button
                                            onClick={this.openModal}
                                            data-guru={item.pengajar}
                                            data-jadwal={item.jadwal_id}
                                            data-semester={item.semester_id}
                                            data-kelas={item.kelas_id}
                                            data-pelajaran={item.pelajaran_id}
                                            class="btn btn-sm btn-v2 btn-warning">Upload KPI</button>
                                          :
                                          ""
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

                    <Modal
                      show={this.state.isPreview}
                      onHide={() => this.clearPreview()}
                      dialogClassName="modal-xlg"
                    >
                      <Modal.Header className="card-header header-kartu" closeButton>
                        Detail KPI
                      </Modal.Header>
                      <Modal.Body>
                        <div class="row">
                          <div class="col-sm-3">
                            <table>
                              <tr>
                                <td style={{width: '180px'}}>Nama Guru</td>
                                <td><b>{this.state.detailKinerja.nama}</b></td>
                              </tr>
                              <tr>
                                <td>Semester</td>
                                <td><b>{this.state.detailKinerja.semester}</b></td>
                              </tr>
                              <tr>
                                <td>Kurikulum</td>
                                <td><b>{this.state.detailKinerja.kurikulum}</b></td>
                              </tr>
                              <tr>
                                <td>Tahun Ajaran</td>
                                <td><b>{this.state.detailKinerja.tahun_ajaran}</b></td>
                              </tr>
                              <tr>
                                <td>Pelajaran</td>
                                <td><b>{this.state.detailKinerja.pelajaran}</b></td>
                              </tr>
                            </table>
                          </div>

                          <div class="col-sm-9">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
                              <div style={{ height: '750px' }}>
                                  <Viewer fileUrl={this.state.detailKinerja.file} />
                              </div>
                            </Worker>
                          </div>

                        </div>

                      </Modal.Body>
                    </Modal>

                    <Modal
                      show={this.state.isModal}
                      onHide={() => this.setState({ isModal: false, fileName: '', tempFile: Math.random().toString(36) })}
                    >
                      <Modal.Header className="card-header header-kartu" closeButton>
                        Unggah KPI Guru
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={this.submitKPI}>
                          <div className="form-group">
                            <label>Upload File</label>
                            <input key={this.state.tempFile} onChange={e => this.setState({ fileName: e.target.files[0] })} type="file" className="form-control" />
                          </div>
                          <div className="form-group">
                            <button type="submit" className="btn btn-v2 btn-success">Submit</button>
                          </div>
                        </form>
                      </Modal.Body>
                    </Modal>

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

export default LaporanKpi;
