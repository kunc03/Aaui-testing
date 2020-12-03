import React from 'react';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

class PersonaliaDetail extends React.Component {

  state = {
    tipe: this.props.match.params.id.split('|')[0],

    id: '',
    noInduk: this.props.match.params.id.split('|')[1],
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    telepon: '',
    email: '',

    parents: [],
    parentsId: '',
    muridId: '',
    noKtp: '',
    namaOrtu: '',
    tempatLahirOrtu: '',
    tanggalLahirOrtu: '',
    jenisKelaminOrtu: '',
    alamatOrtu: '',
    teleponOrtu: '',
    emailOrtu: '',
  }

  simpanData = e => {
    e.preventDefault();
    let form = {
      noInduk: this.props.match.params.id.split('|')[1],
      nama: this.state.nama,
      tempatLahir: this.state.tempatLahir,
      tanggalLahir: this.state.tanggalLahir,
      jenisKelamin: this.state.jenisKelamin,
      alamat: this.state.alamat,
      telepon: this.state.telepon,
      email: this.state.email,
    }

    API.put(`${API_SERVER}v2/${this.state.tipe}/update/${this.state.id}`, form).then(res => {
      if (res.data.error) toast.warning("Error update data");

      toast.success("Update data berhasil")
      this.fetchDetail();
      this.clearFormOrtu();
    })
  }

  simpanDataOrtu = e => {
    e.preventDefault();
    if (this.state.parentsId) {
      let form = {
        companyId: Storage.get('user').data.company_id,
        muridId: this.state.id,
        noInduk: this.state.noKtp,
        nama: this.state.namaOrtu,
        tempatLahir: this.state.tempatLahirOrtu,
        tanggalLahir: this.state.tanggalLahirOrtu,
        jenisKelamin: this.state.jenisKelaminOrtu,
        alamat: this.state.alamatOrtu,
        telepon: this.state.teleponOrtu,
        email: this.state.emailOrtu,
      }

      API.put(`${API_SERVER}v2/parents/update/${this.state.parentsId}`, form).then(res => {
        if (res.data.error) toast.warning("Error update data");

        toast.success("Data berhasil diupdate")
        this.fetchDetail();
        this.clearFormOrtu();
      })
    } else {
      let form = {
        companyId: Storage.get('user').data.company_id,
        muridId: this.state.id,
        noInduk: this.state.noKtp,
        nama: this.state.namaOrtu,
        tempatLahir: this.state.tempatLahirOrtu,
        tanggalLahir: this.state.tanggalLahirOrtu,
        jenisKelamin: this.state.jenisKelaminOrtu,
        alamat: this.state.alamatOrtu,
        telepon: this.state.teleponOrtu,
        email: this.state.emailOrtu,
      }

      API.post(`${API_SERVER}v2/parents/create`, form).then(res => {
        if (res.data.error) toast.warning("Error update data");

        toast.success("Data berhasil ditambahkan")
        this.fetchDetail();
        this.clearFormOrtu();
      })
    }
  }

  updateMuridParents = e => {
    this.setState({
      parentsId: e.target.getAttribute('data-id'),
      muridId: e.target.getAttribute('data-muridId'),
      noKtp: e.target.getAttribute('data-noKtp'),
      namaOrtu: e.target.getAttribute('data-namaOrtu'),
      tempatLahirOrtu: e.target.getAttribute('data-tempatLahirOrtu'),
      tanggalLahirOrtu: e.target.getAttribute('data-tanggalLahirOrtu'),
      jenisKelaminOrtu: e.target.getAttribute('data-jenisKelaminOrtu'),
      alamatOrtu: e.target.getAttribute('data-alamatOrtu'),
      teleponOrtu: e.target.getAttribute('data-teleponOrtu'),
      emailOrtu: e.target.getAttribute('data-emailOrtu'),
    })
  }

  deleteMuridParents = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/parents/one/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning("Error: hapus data");

      this.fetchDetail();
    })
  }

  clearFormOrtu() {
    this.setState({
      parentsId: '',
      noKtp: '',
      namaOrtu: '',
      tempatLahirOrtu: '',
      tanggalLahirOrtu: '',
      jenisKelaminOrtu: '',
      alamatOrtu: '',
      teleponOrtu: '',
      emailOrtu: '',
    })
  }

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail() {
    API.get(`${API_SERVER}v2/${this.state.tipe}/no-induk/${this.state.noInduk}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data")

      this.setState({
        id: res.data.result.id,
        nama: res.data.result.nama,
        tempatLahir: res.data.result.tempat_lahir,
        tanggalLahir: res.data.result.tanggal_lahir,
        jenisKelamin: res.data.result.jenis_kelamin,
        alamat: res.data.result.alamat,
        telepon: res.data.result.telepon,
        email: res.data.result.email,
      })

      API.get(`${API_SERVER}v2/parents/murid/${res.data.result.id}`).then(res => {
        if (res.data.error) toast.warning("Error fetch data")

        this.setState({
          parents: res.data.result
        })
      })
    })

  }

  render() {

    console.log('STATE: ', this.state)

    return (
      <div className="row mt-3">
        <div className="col-sm-12">

          <div className="card">
            <div className="card-header">Student Detail Information</div>
            <div className="card-body" style={{ padding: '5px' }}>
              <h5 style={{ color: '#004887', fontSize: '15px', margin: '20px' }}>Personal Info</h5>
              <form onSubmit={this.simpanData}>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Parent No.</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.noInduk} disabled className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Name</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.nama} onChange={e => this.setState({ nama: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Place of birth</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.tempatLahir} onChange={e => this.setState({ tempatLahir: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Date of birth</label>
                  <div className="col-sm-4">
                    <input type="date" value={this.state.tanggalLahir} onChange={e => this.setState({ tanggalLahir: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Gender</label>
                  <div className="col-sm-2">
                    <select value={this.state.jenisKelamin} onChange={e => this.setState({ jenisKelamin: e.target.value })} required className="form-control" placeholder="Enter">
                      <option value="" disabled selected>Select</option>
                      <option value="Laki-laki">Male</option>
                      <option value="Perempuan">Female</option>
                    </select>
                  </div>
                </div>

                <h5 style={{ color: '#004887', fontSize: '15px', margin: '20px' }}>Address</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Complete address</label>
                  <div className="col-sm-4">
                    <textarea rows="4" value={this.state.alamat} onChange={e => this.setState({ alamat: e.target.value })} className="form-control" />
                  </div>
                </div>

                <h5 style={{ color: '#004887', fontSize: '15px', margin: '20px' }}>Contact</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Phone</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.telepon} onChange={e => this.setState({ telepon: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Email</label>
                  <div className="col-sm-4">
                    <input type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="form-control" />
                  </div>
                </div>

                <div className="form-group row mt-4">
                  <label className="col-sm-2 col-form-label text-right"></label>
                  <div className="col-sm-3">
                    <button type="submit" className="btn btn-v2 btn-success">
                      <i className="fa fa-save"></i> Save
                    </button>
                    <Link to={`/learning/personalia`} className="btn btn-v2 btn-default ml-2" style={{ border: '1px solid #e9e9e9' }}>
                      <i className="fa fa-chevron-left"></i> Back
                    </Link>
                  </div>
                </div>

              </form>
            </div>
          </div>

        </div>

        <div className="col-sm-12">

          <div className="card">
            <div className="card-header">Parental Information</div>
            <div className="card-body" style={{ padding: '5px' }}>
              <h5 style={{ color: '#004887', fontSize: '15px', margin: '20px' }}>Personal Info</h5>
              <form onSubmit={this.simpanDataOrtu}>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">ID card number</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.noKtp} onChange={e => this.setState({ noKtp: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Name</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.namaOrtu} onChange={e => this.setState({ namaOrtu: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Place of birth</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.tempatLahirOrtu} onChange={e => this.setState({ tempatLahirOrtu: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Date of birth</label>
                  <div className="col-sm-4">
                    <input type="date" value={this.state.tanggalLahirOrtu} onChange={e => this.setState({ tanggalLahirOrtu: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Gender</label>
                  <div className="col-sm-2">
                    <select value={this.state.jenisKelaminOrtu} onChange={e => this.setState({ jenisKelaminOrtu: e.target.value })} required className="form-control" placeholder="Enter">
                      <option value="" disabled selected>Select</option>
                      <option value="Laki-laki">Male</option>
                      <option value="Perempuan">Female</option>
                    </select>
                  </div>
                </div>

                <h5 style={{ color: '#004887', fontSize: '15px', margin: '20px' }}>Address</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Complete Address</label>
                  <div className="col-sm-4">
                    <textarea rows="4" value={this.state.alamatOrtu} onChange={e => this.setState({ alamatOrtu: e.target.value })} className="form-control" />
                  </div>
                </div>

                <h5 style={{ color: '#004887', fontSize: '15px', margin: '20px' }}>Contact</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Phone</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.teleponOrtu} onChange={e => this.setState({ teleponOrtu: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Email</label>
                  <div className="col-sm-4">
                    <input type="email" value={this.state.emailOrtu} onChange={e => this.setState({ emailOrtu: e.target.value })} className="form-control" />
                  </div>
                </div>

                <div className="form-group row mt-4">
                  <label className="col-sm-2 col-form-label text-right"></label>
                  <div className="col-sm-3">
                    <button type="submit" className="btn btn-v2 btn-success">
                      <i className="fa fa-save"></i> Add
                    </button>
                    <Link to={`/learning/personalia`} className="btn btn-v2 btn-default ml-2" style={{ border: '1px solid #e9e9e9' }}>
                      <i className="fa fa-chevron-left"></i> Back
                    </Link>
                  </div>
                </div>

              </form>

              <table className="table table-striped mt-4">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>ID card</th>
                    <th>Place of birth</th>
                    <th>Date of birth</th>
                    <th>Gender</th>
                    <th> Phone </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.parents.map((item, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.email}</td>
                        <td>{item.no_induk}</td>
                        <td>{item.tempat_lahir}</td>
                        <td>{item.tanggal_lahir}</td>
                        <td>{item.jenis_kelamin}</td>
                        <td>{item.telepon}</td>
                        <td>
                          <i style={{ cursor: 'pointer' }} onClick={this.updateMuridParents} className="fa fa-search"
                            data-id={item.id}
                            data-muridId={item.murid_id}
                            data-noKtp={item.no_induk}
                            data-namaOrtu={item.nama}
                            data-tempatLahirOrtu={item.tempat_lahir}
                            data-tanggalLahirOrtu={item.tanggal_lahir}
                            data-jenisKelaminOrtu={item.jenis_kelamin}
                            data-alamatOrtu={item.alamat}
                            data-teleponOrtu={item.telepon}
                            data-emailOrtu={item.email}
                          ></i>
                          <i style={{ cursor: 'pointer' }} onClick={this.deleteMuridParents} data-id={item.id} className="fa fa-trash ml-2"></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default PersonaliaDetail;
