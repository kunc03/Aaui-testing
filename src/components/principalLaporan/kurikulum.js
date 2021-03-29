import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import { Accordion, Card, ListGroup, Modal } from 'react-bootstrap'

class Registasi extends React.Component {

  state = {
    kurikulum: [],

    id: '',
    name: '',

    formAdd: false,

    formLesson: false,
    optionLessons: [],
    lessonIds: [],

    listPelajaran: [],

    idPelajaran: '',
    namaPelajaran: '',
    kategori: '',
    kodePelajaran: '',
    kelas: '',

    listKelas: [],

    openSilabus: false,
    pelajaranId: '',
    silabusId: '',
    pelajaranNama: '',
    sesi: '',
    topik: '',
    tujuan: '',
    deskripsi: '',
    jenis: 0,
    files: null,
    tempFiles: Math.random().toString(36),

    silabus: [],

    nilaiTugas: 0,
    nilaiKuis: 0,
    nilaiUjian: 0,
    openProsentase: false,
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

  closeProsentase() {
    this.setState({
      nilaiTugas: 0,
      nilaiKuis: 0,
      nilaiUjian: 0,
      openProsentase: false,
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

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if (res.data.error) toast.info(`Error: fetch silabus`)

      this.setState({ silabus: res.data.result })
    })
  }

  closeModal() {
    this.fetchPelajaran();
    this.setState({
      openSilabus: false,
      silabus: [],
      pelajaranId: '',
      pelajaranNama: '',
      sesi: '',
      topik: '',
      tujuan: '',
      deskripsi: '',
      jenis: 0,
    })
  }

  componentDidMount() {
    this.fetchPelajaran()
    this.fetchKurikulum()
  }

  saveKurikulum = e => {
    let { value } = e.target;
    let form = {
      company_id: Storage.get('user').data.company_id,
      name: this.state.name
    }

    if(this.state.id) {
      API.put(`${API_SERVER}v2/kurikulum/${this.state.id}`, form).then(res => {
        if(res.data.error) toast.warning(`Error update kurikulum`)

        this.fetchKurikulum();
      })
    } else {
      API.post(`${API_SERVER}v2/kurikulum`, form).then(res => {
        if(res.data.error) toast.warning(`Error save kurikulum`)

        this.fetchKurikulum();
      })
    }
    this.setState({ formAdd: false, name: '', id: '' })
  }

  fetchKurikulum() {
    API.get(`${API_SERVER}v2/kurikulum/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kurikulum");

      this.setState({ kurikulum: res.data.result })
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");

      let reformat = res.data.result.map((item) => {
        return {
          value: item.pelajaran_id,
          label: item.kode_pelajaran + ' - ' + item.nama_pelajaran
        }
      })

      this.setState({ optionLessons: reformat })
    })
  }

  selectKurikulum = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    let name = e.target.getAttribute('data-name')
    this.setState({ id, name, formAdd: true })
  }

  deleteKurikulum = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    API.delete(`${API_SERVER}v2/kurikulum/${id}`).then(res => {
      if (res.data.error) toast.warning("Error delete data kurikulum");
      this.fetchKurikulum()
    })
  }

  addMapel = e => {
    e.preventDefault()
    let form = {
      mapel: this.state.lessonIds
    }

    API.post(`${API_SERVER}v2/kurikulum/${this.state.id}/mapel`, form).then(res => {
      if (res.data.error) toast.warning("Error add data pelajaran");
      this.fetchKurikulum()
      this.setState({ formLesson: false, id: '', lessonIds: [] })
    })
  }

  formAddMapel = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    let filter = this.state.kurikulum.filter(item => item.id == parseInt(id))[0];
    let temp = [];
    if(filter.mapel.length) {
      for(var i=0; i<filter.mapel.length; i++) {
        temp.push(filter.mapel[i].pelajaran_id)
      }
    }
    this.setState({ id, formLesson: true, lessonIds: temp })
  }

  deleteMapel = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-kurikulum')
    let mapel = e.target.getAttribute('data-mapel')
    API.delete(`${API_SERVER}v2/kurikulum/${id}/mapel/${mapel}`).then(res => {
      this.fetchKurikulum()
    })
  }

  render() {
    const { kurikulum, listPelajaran } = this.state;

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

                  <div className="row mt-3">
                    <div className="col-sm-12">

                      <Card>
                        <Card.Header>
                          <h4>Kurikulum
                          </h4>
                        </Card.Header>
                        <Card.Body>

                          <Accordion defaultActiveKey="0">
                            {
                              kurikulum.map((item,i) => (
                                <Card>
                                  <Card.Header>
                                    <h5 className="collapsed" data-toggle="collapse" data-target={`#colp${i}`} style={{cursor: 'pointer'}}>
                                      <i className="fa"></i> {' '}
                                      {item.name}
                                    </h5>
                                    <button onClick={this.formAddMapel} data-id={item.id} className="btn btn-v2 btn-primary float-right">Lesson</button>
                                    <i onClick={this.selectKurikulum} data-id={item.id} data-name={item.name} style={{cursor: 'pointer'}} className="fa fa-edit mr-2"></i>
                                    <i onClick={this.deleteKurikulum} data-id={item.id} style={{cursor: 'pointer'}} className="fa fa-trash"></i>
                                  </Card.Header>
                                  <Card.Body className="collapse p-2" id={`colp${i}`}>
                                    <table className="table table-bordered">
                                      <thead>
                                        <tr>
                                          <th>No</th>
                                          <th>Pelajaran</th>
                                          <th>Kode</th>
                                          <th>Silabus</th>
                                          <th>Bobot</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {
                                          item.mapel.map((row,j) => (
                                            <tr>
                                              <td>{j+1}</td>
                                              <td>{row.nama_pelajaran}</td>
                                              <td>{row.kode_pelajaran}</td>
                                              <td style={{ padding: '12px' }}>
                                                <span onClick={this.openSilabus} data-id={row.pelajaran_id} data-title={row.nama_pelajaran} className="silabus">Open</span>
                                              </td>
                                              <td style={{ padding: '12px' }}>
                                                <span onClick={this.openProsentase} data-id={row.pelajaran_id} data-title={row.nama_pelajaran} className="silabus">Open</span>
                                              </td>
                                            </tr>
                                          ))
                                        }
                                      </tbody>
                                    </table>
                                  </Card.Body>
                                </Card>
                              ))
                            }
                          </Accordion>

                        </Card.Body>
                      </Card>

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
                          <form onSubmit={this.saveProsentase}>
                            <div className="form-group row">
                              <div className="col-sm-4">
                                <label>Tugas</label>
                                <input className="form-control" required type="number" value={this.state.nilaiTugas} onChange={e => this.setState({ nilaiTugas: e.target.value })} />
                              </div>
                              <div className="col-sm-4">
                                <label>Kuis</label>
                                <input  className="form-control" required type="number" value={this.state.nilaiKuis} onChange={e => this.setState({ nilaiKuis: e.target.value })} />
                              </div>
                              <div className="col-sm-4">
                                <label>Ujian</label>
                                <input  className="form-control" required type="number" value={this.state.nilaiUjian} onChange={e => this.setState({ nilaiUjian: e.target.value })} />
                              </div>
                            </div>
                          </form>
                        </Modal.Body>
                      </Modal>

                      <Modal
                        show={this.state.openSilabus}
                        onHide={this.closeModal.bind(this)}
                        dialogClassName="modal-lg modal-1000-large"
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
                                <th>Deskripsi</th>
                                <th>Files</th>
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
                                        <td>{item.deskripsi}</td>
                                        <td style={{ padding: '12px' }}>
                                          {
                                            item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : 'No files'
                                          }
                                        </td>

                                      </tr>
                                    )
                                  } else {
                                    return (
                                      <tr key={i}>
                                        <td>{item.sesi}</td>
                                        <td colSpan="4" className="text-center">{item.jenis == 1 ? 'Kuis' : 'Ujian'}</td>

                                      </tr>
                                    )
                                  }
                                })
                              }
                            </tbody>
                          </table>
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


    );
  }

}

export default Registasi;
