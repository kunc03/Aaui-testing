import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { Modal } from 'react-bootstrap';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

class RuanganMengajar extends React.Component {

  state = {
    idRuangan: "",
    namaRuangan: "",
    folder: "",
    pengajar: "",

    isModalTambah: false,

    dataRuangan: [],

    dataPengajar: [],
    dataFolder: [],
  }

  saveRuangan = e => {
    e.preventDefault();

    if (this.state.idRuangan) {

      let form = {
        nama_ruangan: this.state.namaRuangan,
        folder: this.state.folder,
        pengajar: this.state.pengajar,
      };

      API.put(`${API_SERVER}v2/ruangan-mengajar/${this.state.idRuangan}`, form).then(res => {
        if (res.data.error) toast.warning("Error create ruangan")

        toast.success("Ruangan berhasil diupdate")
        this.fetchRuangan();
      })

    } else {

      let form = {
        nama_ruangan: this.state.namaRuangan,
        folder: this.state.folder,
        pengajar: this.state.pengajar,
        created_by: Storage.get('user').data.user_id,
        company_id: Storage.get('user').data.company_id,
      };

      API.post(`${API_SERVER}v2/ruangan-mengajar`, form).then(res => {
        if (res.data.error) toast.warning("Error create ruangan")

        toast.success("Ruangan berhasil disimpan")
        this.fetchRuangan();
      })

    }

    this.clearForm();
  }

  deleteRuangan = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/ruangan-mengajar/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning("Error hapus ruangan");
      this.fetchRuangan();
    })
  }

  selectRuangan = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id')
    API.get(`${API_SERVER}v2/ruangan-mengajar/${id}`).then(res => {
      if (res.data.error) toast.warning("Error get ruangan")

      this.setState({
        idRuangan: id,
        namaRuangan: res.data.result[0].nama_ruangan,
        folder: res.data.result[0].folder,
        pengajar: res.data.result[0].pengajar,

        isModalTambah: true
      })
    })
  }

  clearForm() {
    this.setState({
      idRuangan: "",
      namaRuangan: "",
      folder: "",
      pengajar: "",

      isModalTambah: false
    })
  }

  componentDidMount() {
    this.fetchRuangan();
    this.fetchPengajar();
    this.fetchFolder();
  }

  fetchRuangan() {
    API.get(`${API_SERVER}v2/ruangan-mengajar/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch ruangan")

      this.setState({ dataRuangan: res.data.result })
    })
  }

  fetchPengajar() {
    API.get(`${API_SERVER}v2/guru/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch pengajar");

      this.setState({ dataPengajar: res.data.result })
    })
  }

  fetchFolder() {
    API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.result.length) {
        let role = {
          aSekretaris: 1,
          aModerator: 1,
          aPembicara: 1,
          aOwner: 1,
          aPeserta: 1
        }
        API.get(`${API_SERVER}v1/folder/${Storage.get('user').data.company_id}/${res.data.result[0].id}`, role).then(res => {
          if (res.data.error) toast.warning("Error fetch folder")

          this.setState({ dataFolder: res.data.result })
        })
      } else {
        toast.warning("Buat project terlebih dahulu")
      }
    })
  }

  render() {
    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Teaching Room
              <button onClick={() => this.setState({ isModalTambah: true })} className="btn btn-v2 btn-primary float-right">
                <i className="fa fa-plus"></i>
                Add Teaching Room
              </button>
              <Link to={`/learning/folder`} className="btn btn-v2 btn-primary float-right mr-3">
                <i className="fa fa-cogs"></i>
                Manage Folder
              </Link>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Ruangan</th>
                    <th>Folder</th>
                    <th>Pengajar</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.dataRuangan.map((item, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{item.nama_ruangan}</td>
                        <td>{item.folder}</td>
                        <td>{item.pengajar}</td>
                        <td className="text-center">
                          <i style={{ cursor: 'pointer' }} onClick={this.selectRuangan} data-id={item.id} className="fa fa-edit"></i>
                          <i style={{ cursor: 'pointer' }} onClick={this.deleteRuangan} data-id={item.id} className="fa fa-trash ml-2"></i>
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
          show={this.state.isModalTambah}
          onHide={() => this.clearForm()}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Add Teaching Room
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Nama Ruangan</label>
                <input value={this.state.namaRuangan} onChange={e => this.setState({ namaRuangan: e.target.value })} required type="text" className="form-control" placeholder="Enter nama ruangan" />
              </div>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Pengajar</label>
                  <select value={this.state.pengajar} onChange={e => this.setState({ pengajar: e.target.value })} required className="form-control">
                    <option value="">Pilih</option>
                    {
                      this.state.dataPengajar.map(item => (
                        <option value={item.id}>{item.nama}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-sm-6">
                  <label>Folder</label>
                  <select value={this.state.folder} onChange={e => this.setState({ folder: e.target.value })} required className="form-control">
                    <option value="">Pilih folder</option>
                    {
                      this.state.dataFolder.map(item => (
                        <option value={item.id}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btm-icademy-primary btn-icademy-grey"
              onClick={() => this.clearForm()}
            >
              Batal
            </button>
            <button
              className="btn btn-icademy-primary btn-icademy-blue"
              onClick={this.saveRuangan}
            >
              <i className="fa fa-save"></i>
              Simpan
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}

export default RuanganMengajar;
