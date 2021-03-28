import React, { Component } from "react";
import Storage from '../../repository/storage';

import PembelajaranMurid from './pembelajaranMurid';
import { Link } from 'react-router-dom'

import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'

class GuruUjian extends Component {
  state = {
    muridId: '',
    infoMurid: {},
    kurikulum: [],

    openSilabus: false,
    pelajaranId: '',
    pelajaranNama: '',
    silabus: [],

    nilaiTugas: 0,
    nilaiKuis: 0,
    nilaiUjian: 0,

    tahunAjaran: '',
    listTahunAjaran: []
  }

  closeProsentase() {
    this.setState({
      nilaiTugas: 0,
      nilaiKuis: 0,
      nilaiUjian: 0,
      openProsentase: false,
    })
  }

  fetchProsentase(pelajaranId) {
    API.get(`${API_SERVER}v2/nilai-pelajaran/${pelajaranId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch prosentase`);

      this.setState({
        nilaiTugas: res.data.result.tugas,
        nilaiKuis: res.data.result.kuis,
        nilaiUjian: res.data.result.ujian,
      })
    })
  }

  openProsentase = e => {
    e.preventDefault();
    this.setState({
      pelajaranId: e.target.getAttribute('data-id'),
      pelajaranNama: e.target.getAttribute('data-title'),
      openProsentase: true
    })
    this.fetchProsentase(e.target.getAttribute('data-id'))
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if (res.data.error) toast.info(`Error: fetch silabus`)

      this.setState({ silabus: res.data.result })
    })
  }

  closeModal() {
    this.setState({
      openSilabus: false,
      silabus: [],
      pelajaranId: '',
      pelajaranNama: '',
    })
  }

  openSilabus = e => {
    e.preventDefault()
    this.setState({
      pelajaranId: e.target.getAttribute('data-id'),
      pelajaranNama: e.target.getAttribute('data-title'),
      openSilabus: true
    })
    this.fetchSilabus(e.target.getAttribute('data-id'));
  }

  fetchKurikulum(id) {
    API.get(`${API_SERVER}v2/kurikulum/id/${id}`).then(res => {
      this.setState({ kurikulum: res.data.result })
    })
  }

  fetchAnakSaya(userId, tahunAjaran) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}?tahunAjaran=${tahunAjaran}`).then(res => {
      let { result } = res.data;
      this.setState({ infoMurid: result })
      this.fetchKurikulum(result.kurikulum)
    })
  }

  componentDidMount() {
    let d = new Date();
    // bulan diawali dengan 0 = januari, 11 = desember
    let month = d.getMonth();
    let tahunAjaran = month < 6 ? (d.getFullYear()-1)+'/'+d.getFullYear() : d.getFullYear()+'/'+(d.getFullYear()+1);

    let temp = [];
    for(var i=0; i<6; i++) {
      temp.push(`${d.getFullYear()-i}/${d.getFullYear()-i+1}`)
    }
    this.setState({ tahunAjaran, listTahunAjaran: temp })

    this.fetchAnakSaya(Storage.get('user').data.user_id, tahunAjaran);
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value, pelajaran: [] })
    this.fetchAnakSaya(Storage.get('user').data.user_id, value);

  }

  render() {
    console.log('state: ', this.state)

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
                      />
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">Informasi Murid</h4>

                          <table>
                            <tr>
                              <td width="120px">Nama Murid</td>
                              <td><b>{this.state.infoMurid.nama_murid}</b></td>
                            </tr>
                            <tr>
                              <td>NIK Murid</td>
                              <td><b>{this.state.infoMurid.nik_murid}</b></td>
                            </tr>
                            <tr>
                              <td>Kelas</td>
                              <td><b>{this.state.infoMurid.kelas_nama}</b></td>
                            </tr>
                            <tr>
                              <td>Semester</td>
                              <td><b>{this.state.infoMurid.semester_name}</b></td>
                            </tr>
                            <tr>
                              <td>Tahun Ajaran</td>
                              <td>
                                <select style={{padding: '2px'}} className="mr-2" onChange={this.selectTahunAjaran} value={this.state.tahunAjaran} >
                                  <option value="" selected disabled>Select</option>
                                  {
                                    this.state.listTahunAjaran.map(item => (
                                      <option value={item}>{item}</option>
                                    ))
                                  }
                                </select>
                              </td>
                            </tr>
                            <tr>
                              <td>Kurikulum</td>
                              <td><b>{this.state.infoMurid.kurikulum_name}</b></td>
                            </tr>
                          </table>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>

                  <div className="row">

                    <div class="col-sm-12">
                      <Card>
                        <Card.Body>
                          <h4 className="f-w-900 f-18 fc-blue">{this.state.infoMurid.kurikulum_name}</h4>

                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th style={{color: 'black'}}>No</th>
                                <th style={{color: 'black'}}>Kode</th>
                                <th style={{color: 'black'}}>Mata Pelajaran</th>
                                <th style={{color: 'black'}}>Silabus</th>
                                <th style={{color: 'black'}}>Bobot</th>
                                <th style={{color: 'black'}}>Created At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.kurikulum.map((item,i) => (
                                  <tr key={item.title+'-'+item.start}>
                                    <td style={{textTransform: 'capitalize'}}>{i+1}</td>
                                    <td>{item.kode_pelajaran}</td>
                                    <td>{item.nama_pelajaran}</td>
                                    <td style={{ padding: '12px' }}>
                                      <span onClick={this.openSilabus} data-id={item.mapel_id} data-title={item.nama_pelajaran} className="silabus">Lihat</span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      <span onClick={this.openProsentase} data-id={item.mapel_id} data-title={item.nama_pelajaran} className="silabus">Lihat</span>
                                    </td>
                                    <td>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>

                      <Modal
                        show={this.state.openSilabus}
                        onHide={this.closeModal.bind(this)}
                        dialogClassName="modal-xlg"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            Silabus {this.state.pelajaranNama}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Sesi</th>
                                <th>Topik</th>
                                <th>Tujuan</th>
                                <th>Files</th>
                                <th>Periode</th>
                                <th>Durasi</th>
                                <th>Deskripsi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.silabus.map((item, i) => {
                                  if (item.jenis === 0) {
                                    return (
                                      <tr key={i}>
                                        <td>{item.sesi}</td>
                                        <td>{item.topik}</td>
                                        <td>{item.tujuan}</td>
                                        <td style={{ padding: '12px' }}>
                                          {
                                            item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : 'No files'
                                          }
                                        </td>
                                        <td>{item.periode}</td>
                                        <td>{item.durasi} menit</td>
                                        <td>{item.deskripsi}</td>
                                      </tr>
                                    )
                                  } else {
                                    return (
                                      <tr key={i}>
                                        <td>{item.sesi}</td>
                                        <td colSpan="3" className="text-center">{item.jenis == 1 ? 'Kuis' : 'Ujian'}</td>
                                        <td>{item.periode}</td>
                                        <td>{item.durasi} menit</td>
                                        <td>{item.deskripsi}</td>
                                      </tr>
                                    )
                                  }
                                })
                              }
                            </tbody>
                          </table>
                        </Modal.Body>
                      </Modal>

                      <Modal
                        show={this.state.openProsentase}
                        onHide={this.closeProsentase.bind(this)}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                            {this.state.pelajaranNama}
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form>
                            <div className="form-group row">
                              <div className="col-sm-4">
                                <label>Tugas (%)</label>
                                <input className="form-control" required type="number" value={this.state.nilaiTugas} onChange={e => this.setState({ nilaiTugas: e.target.value })} />
                              </div>
                              <div className="col-sm-4">
                                <label>Kuis (%)</label>
                                <input  className="form-control" required type="number" value={this.state.nilaiKuis} onChange={e => this.setState({ nilaiKuis: e.target.value })} />
                              </div>
                              <div className="col-sm-4">
                                <label>Ujian (%)</label>
                                <input  className="form-control" required type="number" value={this.state.nilaiUjian} onChange={e => this.setState({ nilaiUjian: e.target.value })} />
                              </div>
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
      </div>
    )
  }
}

export default GuruUjian;
