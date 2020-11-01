import React from 'react';
import { toast } from "react-toastify";

import API, {API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class DaftarPelajaran extends React.Component {

  state = {
    idPelajaran: '',
    namaPelajaran: '',
    kategori: '',
    kodePelajaran: '',
    kelas: '',

    listKelas: [],
    listPelajaran: []
  }

  savePelajaran = e => {
    e.preventDefault();

    if(this.state.idPelajaran) {
      // action for update
      console.log('update')
      let form = {
        kelasId: this.state.kelas,
        namaPelajaran: this.state.namaPelajaran,
        kategori: this.state.kategori,
        kodePelajaran: this.state.kodePelajaran
      }
      API.put(`${API_SERVER}v2/pelajaran/update/${this.state.idPelajaran}`, form).then(res => {
        if(res.data.error) toast.warning("Error create pelajaran")

        this.fetchPelajaran();
      })

    } else {
      // action for insert
      console.log('insert')
      let form = {
        companyId: Storage.get('user').data.company_id,
        kelasId: this.state.kelas,
        namaPelajaran: this.state.namaPelajaran,
        kategori: this.state.kategori,
        kodePelajaran: this.state.kodePelajaran
      }
      API.post(`${API_SERVER}v2/pelajaran/create`, form).then(res => {
        if(res.data.error) toast.warning("Error create pelajaran")

        this.fetchPelajaran();
      })
    }

    this.clearForm();

  }

  selectPelajaran = e => {
    e.preventDefault();
    let idKelas = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v2/pelajaran/one/${idKelas}`).then(res => {
      if(res.data.error) toast.warning("Error fetch data kelas");
      let getKelas = res.data.result;

      this.setState({
        idPelajaran: idKelas,
        namaPelajaran: getKelas.nama_pelajaran,
        kategori: getKelas.kategori,
        kodePelajaran: getKelas.kode_pelajaran,
        kelas: getKelas.kelas_id
      })
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
      if(res.data.error) toast.warning("Error fetch data kelas");

      this.setState({ listKelas: res.data.result })
    })
  }

  fetchPelajaran() {
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      if(res.data.error) toast.warning("Error fetch data kelas");

      this.setState({ listPelajaran: res.data.result })
    })
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-header">Pelajaran</div>
            <div className="card-body" style={{padding: '5px'}}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Pelajaran</th>
                    <th>Kategori</th>
                    <th>Kode Pelajaran</th>
                    <th>Kelas</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.listPelajaran.map((item, i) => (
                      <tr key={i}>
                        <td>{i+1}</td>
                        <td>{item.nama_pelajaran}</td>
                        <td>{item.kategori}</td>
                        <td>{item.kode_pelajaran}</td>
                        <td>{item.kelas}</td>
                        <td className="text-center"><i style={{cursor: 'pointer'}} onClick={this.selectPelajaran} data-id={item.pelajaran_id} className="fa fa-edit"></i></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
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
                  <input required value={this.state.namaPelajaran} onChange={e => this.setState({ namaPelajaran: e.target.value })} type="text" className="form-control" placeholder="Enter nama kelas" name="namaKelas" />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select required className="form-control" value={this.state.kategori} onChange={e => this.setState({ kategori: e.target.value })}>
                    <option value="" disabled selected>Pilih kelas</option>
                    <option value="Wajib">Wajib</option>
                    <option value="Tidak Wajib">Tidak Wajib</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kode Pelajaran</label>
                  <input required value={this.state.kodePelajaran} onChange={e => this.setState({ kodePelajaran: e.target.value })} type="text" className="form-control" placeholder="Enter kurikulum" name="kurikulum" />
                </div>
                <div className="form-group">
                  <label>Kelas</label>
                  <select required value={this.state.kelas} onChange={e => this.setState({ kelas: e.target.value })} className="form-control" name="semester">
                    <option value="" disabled selected>Pilih kelas</option>
                    {
                      this.state.listKelas.map((item,i) => (
                        <option value={item.kelas_id}>{item.kelas_nama}</option>
                      ))
                    }
                  </select>
                </div>
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
