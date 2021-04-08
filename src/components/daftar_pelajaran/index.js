import React from 'react';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { Modal } from 'react-bootstrap'

class DaftarPelajaran extends React.Component {

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
    periode: '',
    durasi: 0,
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

    fileSilabus: '',
    keyFileSilabus: Math.random().toString(36),
  }

  importSilabus = e => {
    let form = new FormData();
    form.append('pelajaranId', this.state.pelajaranId)
    form.append('files', this.state.fileSilabus)

    API.post(`${API_SERVER}v2/silabus/import`, form).then(res => {
      if (res.status === 200) {
        this.fetchSilabus(this.state.pelajaranId)
        this.setState({ keyFileSilabus: Math.random().toString(36) })
      }
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

  saveProsentase = e => {
    e.preventDefault()
    let form = {
      tugas: this.state.nilaiTugas,
      kuis: this.state.nilaiKuis,
      ujian: this.state.nilaiUjian
    };
    API.put(`${API_SERVER}v2/nilai-pelajaran/${this.state.pelajaranId}`, form).then(res => {
      if (res.data.error) toast.warning(`Warning: update prosentase`)

      toast.success('Set prosentase nilai berhasil disimpan');
      this.fetchProsentase(this.state.pelajaranId)
    })
  }

  fetchProsentase(pelajaranId) {
    API.get(`${API_SERVER}v2/nilai-pelajaran/${pelajaranId}`).then(res => {
      if (res.data.error) toast.warning(`Warning: fetch prosentase`);

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
      periode: '',
      durasi: 0,
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
      periode: '',
      durasi: 0,
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
      periode: this.state.periode,
      durasi: this.state.durasi,
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
        periode: res.data.result.periode,
        durasi: res.data.result.durasi,
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

    //console.log('state: ', this.state)

    return (
      <div className="row mt-3">
        <div className="col-sm-8">
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
                    <th>In Curriculum</th>
                    <th>Scheduled</th>
                    <th className="text-center">Action</th>
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
                          <span onClick={this.openSilabus} data-id={item.pelajaran_id} data-title={item.nama_pelajaran} className="silabus">{item.silabus > 0 ? 'Open' : 'Setup'}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span onClick={this.openProsentase} data-id={item.pelajaran_id} data-title={item.nama_pelajaran} className="silabus">Set</span>
                        </td>
                        <td>{item.kurikulum ? 'Yes' : 'No'}</td>
                        <td>{item.jadwal ? 'Yes' : 'No'}</td>
                        <td className="text-center">
                          <i style={{ cursor: 'pointer' }} onClick={this.selectPelajaran} data-id={item.pelajaran_id} className="fa fa-edit mr-2"></i>
                          <i style={{ cursor: 'pointer' }} onClick={this.deletePelajaran} data-id={item.pelajaran_id} className="fa fa-trash"></i>
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
                        <input className="form-control" required type="number" value={this.state.nilaiKuis} onChange={e => this.setState({ nilaiKuis: e.target.value })} />
                      </div>
                      <div className="col-sm-4">
                        <label>Ujian</label>
                        <input className="form-control" required type="number" value={this.state.nilaiUjian} onChange={e => this.setState({ nilaiUjian: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-v2 btn-success">
                        <i className="fa fa-save"></i> Save
                      </button>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>

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
                  <div class="row">
                    <div class="col-sm-8">
                      <div class="form-group">
                        <label>Import</label>
                        <input key={this.state.keyFileSilabus} onChange={e => this.setState({ fileSilabus: e.target.files[0] })} type="file" class="form-control" />
                      </div>
                    </div>
                    <div class="col-sm-2">
                      <div class="form-group">
                        <label>Action</label><br />
                        <button onClick={this.importSilabus} class="btn btn-v2 btn-primary">Import</button>
                      </div>
                    </div>
                    <div class="col-sm-2">
                      <div class="form-group">
                        <label>Template</label><br />
                        <a target="_blank" href={`${API_SERVER}attachment/silabus-template.xlsx`} class="btn btn-v2 btn-primary">Download</a>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <form onSubmit={this.saveSilabus}>
                    <div className="form-group row">
                      <div className="col-sm-2">
                        <label>Sesi</label>
                        <input required name="sesi" value={this.state.sesi} onChange={e => this.setState({ [e.target.name]: e.target.value })} type="number" placeholder="Enter" className="form-control" />
                      </div>
                      <div className="col-sm-2">
                        <label>Jenis</label>
                        <select onChange={e => this.setState({ jenis: e.target.value })} value={this.state.jenis} required className="form-control">
                          <option value="0">Materi</option>
                          <option value="1">Kuis</option>
                          <option value="2">Ujian</option>
                        </select>
                      </div>
                      <div className="col-sm-2">
                        <label>Periode</label>
                        <input required name="periode" value={this.state.periode} onChange={e => this.setState({ [e.target.name]: e.target.value })} type="text" placeholder="Enter" className="form-control" />
                      </div>
                      <div className="col-sm-2">
                        <label>Durasi</label>
                        <input required name="durasi" value={this.state.durasi} onChange={e => this.setState({ [e.target.name]: e.target.value })} type="number" placeholder="10, 20, 30, ..." className="form-control" />
                      </div>
                    </div>

                    {
                      this.state.jenis <= 0 &&
                      <>
                        <div className="form-group row">
                          <div className="col-sm-6">
                            <label>Topik</label>
                            <input name="topik" value={this.state.topik} onChange={e => this.setState({ [e.target.name]: e.target.value })} type="text" placeholder="Enter" className="form-control" />
                          </div>
                          <div className="col-sm-6">
                            <label>Tujuan</label>
                            <textarea name="tujuan" rows="3" value={this.state.tujuan} onChange={e => this.setState({ [e.target.name]: e.target.value })} placeholder="Enter" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Files</label>
                          <input name="files" key={this.state.tempFiles} onChange={e => this.setState({ [e.target.name]: e.target.files })} type="file" placeholder="Enter" className="form-control" />
                        </div>
                      </>
                    }

                    <div className="form-group">
                      <label>Deskripsi</label>
                      <textarea name="deskripsi" rows="3" value={this.state.deskripsi} onChange={e => this.setState({ [e.target.name]: e.target.value })} placeholder="Enter" className="form-control" />
                    </div>

                    <div className="form-group">
                      <button type="submit" className="btn btn-v2 btn-success mr-2">
                        <i className="fa fa-plus"></i> {this.state.silabusId ? 'Edit' : 'Tambah'}
                      </button>
                      <button onClick={() => this.clearFormSilabus()} type="button" className="btn btn-v2 btn-primary mr-2">
                        <i className="fa fa-history"></i> Reset
                      </button>
                    </div>
                  </form>
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
                        <th className="text-center">Aksi</th>
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
                                <td className="text-center">
                                  <i style={{ cursor: 'pointer' }} onClick={this.selectSilabus} data-id={item.id} className="fa fa-edit mr-2"></i>
                                  <i style={{ cursor: 'pointer' }} onClick={this.deleteSilabus} data-id={item.id} className="fa fa-trash"></i>
                                </td>
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
                                <td className="text-center">
                                  <i style={{ cursor: 'pointer' }} onClick={this.selectSilabus} data-id={item.id} className="fa fa-edit mr-2"></i>
                                  <i style={{ cursor: 'pointer' }} onClick={this.deleteSilabus} data-id={item.id} className="fa fa-trash"></i>
                                </td>
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

        <div className="col-sm-4">
          <div className="card">
            <div className="card-header">Pelajaran</div>
            <div className="card-body">
              <form onSubmit={this.savePelajaran}>
                <div className="form-group">
                  <label>Nama Pelajaran</label>
                  <input required value={this.state.namaPelajaran} onChange={e => this.setState({ namaPelajaran: e.target.value })} type="text" className="form-control" placeholder="Enter" name="namaKelas" />
                </div>
                <div className="form-group">
                  <label> Category </label>
                  <select required className="form-control" value={this.state.kategori} onChange={e => this.setState({ kategori: e.target.value })}>
                    <option value="" disabled selected>Pilih</option>
                    <option value="Wajib">Wajib</option>
                    <option value="Tidak Wajib">Tidak Wajib</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kode Pelajaran</label>
                  <input required value={this.state.kodePelajaran} onChange={e => this.setState({ kodePelajaran: e.target.value })} type="text" className="form-control" placeholder="Enter" name="kurikulum" />
                </div>
                {
                  /**

                <div className="form-group">
                  <label>Kelas</label>
                  <select required value={this.state.kelas} onChange={e => this.setState({ kelas: e.target.value })} className="form-control" name="semester">
                    <option value="" disabled selected>Pilih kelas</option>
                    {
                      this.state.listKelas.map((item, i) => (
                        <option value={item.kelas_id}>{item.kelas_nama}</option>
                      ))
                    }
                  </select>
                </div>

                  */
                }
                <div className="form-group">
                  <button type="submit" className="btn btn-v2 btn-success">
                    <i className="fa fa-save"></i> Simpan
                  </button>
                  <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary ml-2">
                    <i className="fa fa-history"></i> Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default DaftarPelajaran;
