import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

class Registasi extends React.Component {

  state = {
    idKelas: "",
    namaKelas: "",
    semester: "",
    kurikulum: "",
    tahunAjaran: "",
    kapasitas: "",

    listSemester: [],
    listKelas: [],

    dataMurid: [],

    optionsName: [],
    muridId: [],
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
        tahunAjaran: this.state.tahunAjaran,
        kapasitas: this.state.kapasitas
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
        tahunAjaran: this.state.tahunAjaran,
        kapasitas: this.state.kapasitas
      }

      API.post(`${API_SERVER}v2/kelas/create`, form).then(res => {
        if (res.data.error) toast.warning("Error create kelas");

        toast.success("Create data kelas");
        this.fetchKelas();
      })
    }

    this.clearForm();

  }

  fetchOptionMurid() {
    API.get(`${API_SERVER}v2/murid/company/${Storage.get('user').data.company_id}`).then(response => {
      response.data.result.map(item => {
        this.state.optionsName.push({
          value: item.id,
          label: `${item.no_induk} - ${item.nama}`
        });
      });
    })
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
        tahunAjaran: getKelas.tahun_ajaran,
        kapasitas: getKelas.kapasitas
      })

      this.fetchMurid(idKelas);
    })
  }

  deleteKelas = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/kelas/delete/${this.state.idKelas}`).then(res => {
      if (res.data.error) toast.warning(`Error: delete kelas`);

      this.fetchKelas();
      this.clearForm()
    })
  }

  clearForm() {
    this.setState({
      idKelas: '',
      namaKelas: '',
      semester: '',
      kurikulum: '',
      tahunAjaran: '',
      kapasitas: '',
      dataMurid: [],
      muridId: []
    })
  }

  fetchMurid(kelasId) {
    API.get(`${API_SERVER}v2/murid/kelas/${kelasId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch murid");

      this.setState({ dataMurid: res.data.result })
    })
  }

  componentDidMount() {
    this.fetchKelas();
    this.fetchSemester();
    this.fetchOptionMurid();
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

  addParticipant = e => {
    e.preventDefault();
    let form = { muridId: this.state.muridId, kelasId: this.state.idKelas };

    API.post(`${API_SERVER}v2/murid/assign/kelas`, form).then(res => {
      if (res.data.error) toast.warning(`Error: add murid`)

      this.fetchMurid(this.state.idKelas);
      this.setState({ muridId: [] })
    })
  }

  deleteMurid = e => {
    e.preventDefault();
    let form = { muridId: e.target.getAttribute('data-id'), kelasId: this.state.idKelas };
    API.post(`${API_SERVER}v2/murid/assign/delete`, form).then(res => {
      if (res.data.error) toast.warning(`Error: delete murid`)

      this.fetchMurid(this.state.idKelas);
    })
  }

  render() {
    // console.log('state: ', this.state)
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

              <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary m-3" style={{ width: '88%' }}>
                <i className="fa fa-plus"></i> Tambahkan
              </button>
            </div>
          </div>
        </div>

        <div className="col-sm-9">
          <div className="row">

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">Class</div>
                <div className="card-body">
                  <form onSubmit={this.saveKelas}>
                    <div className="row mb-3">
                      <div className="col">
                        <label>Class Name</label>
                        <input required value={this.state.namaKelas} onChange={e => this.setState({ namaKelas: e.target.value })} type="text" className="form-control" placeholder="Enter" name="namaKelas" />
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
                        <input required value={this.state.kurikulum} onChange={e => this.setState({ kurikulum: e.target.value })} type="text" className="form-control" placeholder="Enter" name="kurikulum" />
                      </div>
                      <div className="col">
                        <label>Academic Year</label>
                        <input required value={this.state.tahunAjaran} onChange={e => this.setState({ tahunAjaran: e.target.value })} type="text" className="form-control" placeholder="Enter" name="tahunAjaran" />
                      </div>
                      <div className="col">
                        <label>Capacity</label>
                        <input required value={this.state.kapasitas} onChange={e => this.setState({ kapasitas: e.target.value })} type="number" className="form-control" placeholder="Enter" name="kapasitas" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <button type="submit" className="btn btn-v2 btn-success">
                          <i className="fa fa-save"></i> Save
                        </button>
                        <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary ml-2">
                          <i className="fa fa-history"></i> Reset
                        </button>

                        {
                          this.state.idKelas &&
                          <button onClick={this.deleteKelas} type="button" className="btn btn-v2 btn-danger float-right">
                            <i className="fa fa-trash"></i> Delete
                          </button>
                        }
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {
              this.state.idKelas &&
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header">Data Murid</div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Cari Murid</label>
                      <div className="input-group" style={{ background: 'transparent' }}>
                        <MultiSelect
                          id={`userId`}
                          options={this.state.optionsName}
                          value={this.state.muridId}
                          onChange={muridId => this.setState({ muridId })}
                          mode="list"
                          enableSearch={true}
                          resetable={true}
                          valuePlaceholder="Pilih"
                          allSelectedLabel="Semua"
                        />
                        <span className="input-group-btn">
                          <button onClick={this.addParticipant} className="btn btn-default">
                            <i className="fa fa-plus"></i> Tambah
                          </button>
                        </span>
                      </div>
                    </div>

                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>No. Induk</th>
                          <th>Tempat Lahir</th>
                          <th>Tanggal Lahir</th>
                          <th>Jenis Kelamin</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.dataMurid.map((item, i) => (
                            <tr>
                              <td>{i + 1}</td>
                              <td>{item.nama}</td>
                              <td>{item.no_induk}</td>
                              <td>{item.tempat_lahir}</td>
                              <td>{item.tanggal_lahir}</td>
                              <td>{item.jenis_kelamin}</td>
                              <td>
                                <i style={{ cursor: 'pointer' }} onClick={this.deleteMurid} data-id={item.murid_id} className="fa fa-trash ml-2"></i>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>

      </div>
    );
  }

}

export default Registasi;
