import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

class Registasi extends React.Component {

  state = {
    idKelas: "",
    namaKelas: "",
    semester: "",
    kurikulum: "",
    tahunAjaran: "",

    listSemester: [],
    listKelas: []
  }

  saveKelas = e => {
    e.preventDefault();

    if (this.state.idKelas) {
      // action for update
      console.log('update')
      let form = {
        kelasNama: this.state.namaKelas,
        semesterId: this.state.semester,
        kurikulum: this.state.kurikulum,
        tahunAjaran: this.state.tahunAjaran
      }

      API.put(`${API_SERVER}v2/kelas/update/${this.state.idKelas}`, form).then(res => {
        if (res.data.error) toast.warning("Error create kelas");

        toast.success("Update data kelas");
        this.fetchKelas();
      })

    } else {
      // action for insert
      console.log('insert')
      let form = {
        companyId: Storage.get('user').data.company_id,
        kelasNama: this.state.namaKelas,
        semesterId: this.state.semester,
        kurikulum: this.state.kurikulum,
        tahunAjaran: this.state.tahunAjaran
      }

      API.post(`${API_SERVER}v2/kelas/create`, form).then(res => {
        if (res.data.error) toast.warning("Error create kelas");

        toast.success("Create data kelas");
        this.fetchKelas();
      })
    }

    this.clearForm();

  }

  selectKelas = e => {
    e.preventDefault();
    let idKelas = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v2/kelas/one/${idKelas}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kelas");
      let getKelas = res.data.result;

      this.setState({
        idKelas: idKelas,
        namaKelas: getKelas.kelas_nama,
        semester: getKelas.semester_id,
        kurikulum: getKelas.kurikulum,
        tahunAjaran: getKelas.tahun_ajaran
      })
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
    this.fetchKelas();
    this.fetchSemester();
  }

  fetchSemester() {
    API.get(`${API_SERVER}v1/semester/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data semester");

      this.setState({ listSemester: res.data.result })
    })
  }

  fetchKelas() {
    API.get(`${API_SERVER}v2/kelas/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data semester");

      this.setState({ listKelas: res.data.result })
    })
  }

  render() {
    return (
      <div className="row mt-3">
        <div className="col-sm-3">
          <div className="card">
            <div className="card-header">Kelas</div>
            <div className="card-body" style={{ padding: '5px' }}>
              <div className="list-group list-group-flush">
                {
                  this.state.listKelas.map((item, i) => (
                    <Link onClick={this.selectKelas} data-id={item.kelas_id} key={i} className="list-group-item list-group-item-action">{item.kelas_nama}</Link>
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
                    <label>Class Name</label>
                    <input required value={this.state.namaKelas} onChange={e => this.setState({ namaKelas: e.target.value })} type="text" className="form-control" placeholder="Enter Class Name" name="namaKelas" />
                  </div>
                  <div className="col">
                    <label>Semester</label>
                    <select required value={this.state.semester} onChange={e => this.setState({ semester: e.target.value })} className="form-control" name="semester">
                      <option value="" disabled selected>Pilih semester</option>
                      {
                        this.state.listSemester.map((item, i) => (
                          <option value={item.semester_id}>{item.semester_name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label>Kurikulum</label>
                    <input required value={this.state.kurikulum} onChange={e => this.setState({ kurikulum: e.target.value })} type="text" className="form-control" placeholder="Enter kurikulum" name="kurikulum" />
                  </div>
                  <div className="col">
                    <label>Academic Year</label>
                    <input required value={this.state.tahunAjaran} onChange={e => this.setState({ tahunAjaran: e.target.value })} type="text" className="form-control" placeholder="Enter Enter Academic Year" name="tahunAjaran" />
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
