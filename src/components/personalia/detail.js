import React from 'react';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { toast } from "react-toastify";
import { Card, Modal, Col, Row, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class PersonaliaDetail extends React.Component {

  state = {
    tipe: this.props.match.params.id.split('-')[0],

    id: '',
    noInduk: this.props.match.params.id.split('-')[1],
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    telepon: '',
    email: '',
  }

  simpanData = e => {
    e.preventDefault();
    let form = {
      noInduk: this.props.match.params.id.split('-')[1],
      nama: this.state.nama,
      tempatLahir: this.state.tempatLahir,
      tanggalLahir: this.state.tanggalLahir,
      jenisKelamin: this.state.jenisKelamin,
      alamat: this.state.alamat,
      telepon: this.state.telepon,
      email: this.state.email,
    }

    API.put(`${API_SERVER}v2/${this.state.tipe}/update/${this.state.id}`, form).then(res => {
      if(res.data.error) toast.warning("Error update data");

      toast.success("Update data berhasil")
      this.fetchDetail();
    })
  }

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail() {
    API.get(`${API_SERVER}v2/${this.state.tipe}/no-induk/${this.state.noInduk}`).then(res => {
      if(res.data.error) toast.warning("Error fetch data")

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
    })
  }

  render() {
    console.log('STATE: ',this.state)
    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Detail Informasi Murid</div>
            <div className="card-body" style={{padding: '5px'}}>
              <h5 style={{color: '#004887', fontSize: '15px', margin: '20px'}}>Personal Info</h5>
              <form onSubmit={this.simpanData}>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">No Induk</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.noInduk} disabled className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Nama</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.nama} onChange={e => this.setState({ nama: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Tempat Lahir</label>
                  <div className="col-sm-4">
                    <input type="text" value={this.state.tempatLahir} onChange={e => this.setState({ tempatLahir: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Tanggal Lahir</label>
                  <div className="col-sm-4">
                    <input type="date" value={this.state.tanggalLahir} onChange={e => this.setState({ tanggalLahir: e.target.value })} className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Jenis Kelamin</label>
                  <div className="col-sm-2">
                  <select value={this.state.jenisKelamin} onChange={e => this.setState({ jenisKelamin: e.target.value })} required className="form-control" placeholder="Enter">
                    <option value="" disabled selected>Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  </div>
                </div>

              <h5 style={{color: '#004887', fontSize: '15px', margin: '20px'}}>Alamat</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Alamat Lengkap</label>
                  <div className="col-sm-4">
                    <textarea rows="4" value={this.state.alamat} onChange={e => this.setState({ alamat: e.target.value })} className="form-control" />
                  </div>
                </div>

              <h5 style={{color: '#004887', fontSize: '15px', margin: '20px'}}>Kontak</h5>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label text-right">Telepon</label>
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
                      <i className="fa fa-save"></i> Simpan
                    </button>
                    <Link to={`/learning/personalia`} className="btn btn-v2 btn-default ml-2" style={{border: '1px solid #e9e9e9'}}>
                      <i className="fa fa-chevron-left"></i> Kembali
                    </Link>
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

export default PersonaliaDetail;
