import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

class Registasi extends React.Component {

  state = {
    idKelas: "",
    namaKelas: "",
    semester: "",
    kurikulum: "",
    tahunAjaran: "",

    listKelas: []
  }

  saveKelas = e => {
    e.preventDefault();
    let form = {
      namaKelas: this.state.namaKelas,
      semester: this.state.semester,
      kurikulum: this.state.kurikulum,
      tahunAjaran: this.state.tahunAjaran
    };

    if(this.state.idKelas) {
      // action for update
      console.log('update')

    } else {
      // action for insert
      console.log('insert')
      let copy = [...this.state.listKelas];
      copy.push({id: copy.length+1, nama_kelas: form.namaKelas, semester: form.semester, kurikulum: form.kurikulum, tahun_ajaran: form.tahunAjaran})
      this.setState({ listKelas: copy })
    }

    this.clearForm();

  }

  selectKelas = e => {
    e.preventDefault();
    let idKelas = e.target.getAttribute('data-id');
    let getKelas = this.state.listKelas.filter(item => item.id == parseInt(idKelas));
    this.setState({
      idKelas: idKelas,
      namaKelas: getKelas[0].nama_kelas,
      semester: getKelas[0].semester,
      kurikulum: getKelas[0].kurikulum,
      tahunAjaran: getKelas[0].tahun_ajaran
    })
  }

  clearForm() {
    this.setState({
      idKelas: '',
      namaKelas: '',
      semester: '',
      kurikulum: '',
      tahunAjaran: ''
    })
  }

  componentDidMount() {
    let listKelas = [
      {id: 1, nama_kelas: "Nama 1", semester: "Semester 1", kurikulum: "Kurikulum 1", tahun_ajaran: "2015/2016"},
      {id: 2, nama_kelas: "Nama 2", semester: "Semester 2", kurikulum: "Kurikulum 2", tahun_ajaran: "2015/2016"},
      {id: 3, nama_kelas: "Nama 3", semester: "Semester 3", kurikulum: "Kurikulum 3", tahun_ajaran: "2016/2017"},
    ];
    this.setState({ listKelas })
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-sm-3">
          <div className="card">
            <div className="card-header">Kelas</div>
            <div className="card-body" style={{padding: '5px'}}>
              <div className="list-group list-group-flush">
                {
                  this.state.listKelas.map((item, i) => (
                    <Link onClick={this.selectKelas} data-id={item.id} key={i} className="list-group-item list-group-item-action">{item.nama_kelas}</Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-9">
          <div className="card">
            <div className="card-header">Kelas</div>
            <div className="card-body">
              <form onSubmit={this.saveKelas}>
                <div className="row mb-3">
                  <div className="col">
                    <label>Nama Kelas</label>
                    <input required value={this.state.namaKelas} onChange={e => this.setState({ namaKelas: e.target.value })} type="text" className="form-control" placeholder="Enter nama kelas" name="namaKelas" />
                  </div>
                  <div className="col">
                    <label>Semester</label>
                    <input required value={this.state.semester} onChange={e => this.setState({ semester: e.target.value })} type="text" className="form-control" placeholder="Enter semester" name="semester" />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label>Kurikulum</label>
                    <input required value={this.state.kurikulum} onChange={e => this.setState({ kurikulum: e.target.value })} type="text" className="form-control" placeholder="Enter kurikulum" name="kurikulum" />
                  </div>
                  <div className="col">
                    <label>Tahun Ajaran</label>
                    <input required value={this.state.tahunAjaran} onChange={e => this.setState({ tahunAjaran: e.target.value })} type="text" className="form-control" placeholder="Enter tahun ajaran" name="tahunAjaran" />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button type="submit" className="btn btn-v2 btn-success">
                      <i className="fa fa-save"></i> Simpan
                    </button>
                    <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary ml-2">
                      <i className="fa fa-history"></i> Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Registasi;
