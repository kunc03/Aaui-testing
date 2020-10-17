import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

class DaftarPelajaran extends React.Component {

  state = {
    idPelajaran: '',
    namaPelajaran: '',
    kategori: '',
    kodePelajaran: '',
    kelas: '',

    listPelajaran: []
  }

  savePelajaran = e => {
    e.preventDefault();
    let form = {
      namaPelajaran: this.state.namaPelajaran,
      kategori: this.state.kategori,
      kodePelajaran: this.state.kodePelajaran,
      kelas: this.state.kelas
    };

    if(this.state.idPelajaran) {
      // action for update
      console.log('update')

    } else {
      // action for insert
      console.log('insert')
      let copy = [...this.state.listPelajaran];
      copy.push({id: copy.length+1, nama_pelajaran: form.namaPelajaran, kategori: form.kategori, kode_pelajaran: form.kodePelajaran, kelas: form.kelas})
      this.setState({ listPelajaran: copy })
    }

    this.clearForm();

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
    let listKelas = [
      {id: 1, nama_pelajaran: "Pelajaran 1", kategori: "Wajib", kode_pelajaran: "PLJ", kelas: "II IPA 1"},
      {id: 2, nama_pelajaran: "Pelajaran 1", kategori: "Wajib", kode_pelajaran: "PLJ", kelas: "II IPA 2"},
    ];
    this.setState({ listPelajaran: listKelas })
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
                        <td className="text-center"><i className="fa fa-ellipsis-v"></i></td>
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
                  <input required value={this.state.kelas} onChange={e => this.setState({ kelas: e.target.value })} type="text" className="form-control" placeholder="Enter tahun ajaran" name="tahunAjaran" />
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
