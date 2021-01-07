import React from 'react';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { Modal } from 'react-bootstrap'

class PembelajaranPrincipal extends React.Component {
  state = {
    idPelajaran: '',
    namaPelajaran: '',
    kategori: '',
    kodePelajaran: '',
    kelas: '',

    listKelas: [],
    listPelajaran: [],

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

  saveProsentase = e => {
    e.preventDefault()
    let form = {
      tugas: this.state.nilaiTugas,
      kuis: this.state.nilaiKuis,
      ujian: this.state.nilaiUjian
    };
    API.put(`${API_SERVER}v2/nilai-pelajaran/${this.state.pelajaranId}`, form).then(res => {
      if(res.data.error) toast.warning(`Warning: update prosentase`)

      toast.success('Set prosentase nilai berhasil disimpan');
      this.fetchProsentase(this.state.pelajaranId)
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

  closeProsentase() {
    this.setState({
      nilaiTugas: 0,
      nilaiKuis: 0,
      nilaiUjian: 0,
      openProsentase: false,
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

  clearFormSilabus() {
    this.setState({
      silabusId: '',
      sesi: '',
      topik: '',
      tujuan: '',
      deskripsi: '',
      jenis: 0,
      files: null,
      tempFiles: Math.random().toString(36),
    })
  }

  savePelajaran = e => {
    e.preventDefault();

    if (this.state.idPelajaran) {
      // action for update
      console.log('update')
      let form = {
        namaPelajaran: this.state.namaPelajaran,
        kategori: this.state.kategori,
        kodePelajaran: this.state.kodePelajaran
      }
      API.put(`${API_SERVER}v2/pelajaran/update/${this.state.idPelajaran}`, form).then(res => {
        if (res.data.error) toast.warning("Error create pelajaran")

        this.fetchPelajaran();
      })

    } else {
      // action for insert
      console.log('insert')
      let form = {
        companyId: Storage.get('user').data.company_id,
        namaPelajaran: this.state.namaPelajaran,
        kategori: this.state.kategori,
        kodePelajaran: this.state.kodePelajaran
      }
      API.post(`${API_SERVER}v2/pelajaran/create`, form).then(res => {
        if (res.data.error) toast.warning("Error create pelajaran")

        this.fetchPelajaran();
      })
    }

    this.clearForm();

  }

  selectPelajaran = e => {
    e.preventDefault();
    let idKelas = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v2/pelajaran/one/${idKelas}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");
      let getKelas = res.data.result;

      this.setState({
        idPelajaran: idKelas,
        namaPelajaran: getKelas.nama_pelajaran,
        kategori: getKelas.kategori,
        kodePelajaran: getKelas.kode_pelajaran,
      })
    })
  }

  deletePelajaran = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/pelajaran/delete/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning(`Error: delete pelajaran`)

      this.fetchPelajaran();
    })
  }

  clearForm() {
    this.setState({
      idPelajaran: '',
      namaPelajaran: '',
      kategori: '',
      kodePelajaran: '',
      kelas: ''
    })
  }

  componentDidMount() {
    this.fetchPelajaran();
    this.fetchKelas();
  }

  fetchKelas() {
    API.get(`${API_SERVER}v2/kelas/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");

      this.setState({ listKelas: res.data.result })
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");

      this.setState({ listPelajaran: res.data.result })
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

  addKuisSilabus(jenis) {
    let form = {
      pelajaranId: this.state.pelajaranId,
      sesi: this.state.sesi,
      topik: this.state.topik,
      tujuan: this.state.tujuan,
      deskripsi: this.state.deskripsi,
      jenis: jenis,
    }

    if (this.state.silabusId) {
      API.put(`${API_SERVER}v2/silabus/update/${this.state.silabusId}`, form).then(res => {
        if (res.data.error) toast.warning(`Error: edit silabus`)

        if (this.state.files) {
          this.uploadFile(this.state.silabusId)
        }

        this.fetchSilabus(this.state.pelajaranId);
        this.clearFormSilabus()
      })
    } else {
      API.post(`${API_SERVER}v2/silabus/create`, form).then(res => {
        if (res.data.error) toast.warning(`Error: create silabus`)

        if (this.state.files) {
          this.uploadFile(res.data.result.id)
        }

        this.fetchSilabus(this.state.pelajaranId);
        this.clearFormSilabus()
      })
    }

  }

  saveSilabus = e => {
    e.preventDefault();
    this.addKuisSilabus(this.state.jenis);
  }

  uploadFile(silabusId) {
    let form = new FormData();
    for (var i = 0; i < this.state.files.length; i++) {
      form.append('files', this.state.files[i]);
    }

    API.put(`${API_SERVER}v2/silabus/files/${silabusId}`, form).then(res => {
      if (res.data.error) toast.warning(`Error: upload file`)

      this.fetchSilabus(this.state.pelajaranId);
    })
  }

  selectSilabus = e => {
    API.get(`${API_SERVER}v2/silabus/id/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning(`Error: get one silabus`)

      this.setState({
        silabusId: res.data.result.id,
        sesi: res.data.result.sesi,
        topik: res.data.result.topik,
        tujuan: res.data.result.tujuan,
        deskripsi: res.data.result.deskripsi,
        jenis: parseInt(res.data.result.jenis),
      })
    })
  }

  deleteSilabus = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/silabus/delete/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning(`Error: delete silabus`)

      this.fetchSilabus(this.state.pelajaranId);
    })
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  {/* <div className="floating-back">
                    <Link to='' >
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                        onClick={this.goBack()}
                      ></img>
                    </Link>
                  </div> */}

                  <div className="row mt-3">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-header">Pelajaran</div>
                        <div className="card-body" style={{ padding: '5px' }}>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Kode</th>
                                <th>Pelajaran</th>
                                <th>Category</th>
                                <th>Silabus</th>
                                <th>Bobot %</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.listPelajaran.map((item, i) => (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.kode_pelajaran}</td>
                                    <td>{item.nama_pelajaran}</td>
                                    <td>{item.kategori}</td>
                                    <td style={{ padding: '12px' }}>
                                      <span onClick={this.openSilabus} data-id={item.pelajaran_id} data-title={item.nama_pelajaran} className="silabus"><i className={`fa fa-${item.silabus > 0 ? 'share' : 'plus'}`}></i> {item.silabus > 0 ? 'Open' : 'Setup'}</span>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                      <span onClick={this.openProsentase} data-id={item.pelajaran_id} data-title={item.nama_pelajaran} className="silabus"><i className={`fa fa-cog`}></i> Open</span>
                                    </td>

                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>

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
                            dialogClassName="modal-lg"
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
        </div>
      </div>
    )
  }
}

export default PembelajaranPrincipal;
