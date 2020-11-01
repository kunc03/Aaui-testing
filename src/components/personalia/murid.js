import React from 'react';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { toast } from "react-toastify";
import { Card, Modal, Col, Row, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Murid extends React.Component {

  state = {
    noInduk: '',
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    email: '',

    action: "tambah",

    isModalTambah: false,

    dataMurid: []
  }

  saveMurid = e => {
    e.preventDefault()
    if(this.state.action === "tambah") {
      // action for create
      let form = {
        companyId: Storage.get('user').data.company_id,
        nama: this.state.nama, noInduk: this.state.noInduk, tempatLahir: this.state.tempatLahir,
        tanggalLahir: this.state.tanggalLahir, jenisKelamin: this.state.jenisKelamin, email: this.state.email
      };
      API.post(`${API_SERVER}v2/murid/create`, form).then(res => {
        if(res.data.error) toast.warning("Error create murid");

        toast.success("Murid baru berhasil disimpan")
        this.fetchMurid();
      })
    } else {
      // action for update
    }

    this.clearForm();
  }

  deleteMurid = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/murid/one/${e.target.getAttribute('data-id')}`).then(res => {
      if(res.data.error) toast.warning("Error hapus murid")

      this.fetchMurid();
    })
  }

  clearForm() {
    this.setState({
      noInduk: '',
      nama: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: '',
      email: '',

      action: "tambah",
    })
  }

  closeModal() {
    this.setState({
      isModalTambah: false,
    })
  }

  componentDidMount() {
    this.fetchMurid();
  }

  fetchMurid() {
    API.get(`${API_SERVER}v2/murid/company/${Storage.get('user').data.company_id}`).then(res => {
      if(res.data.error) toast.warning("Error fetch murid");

      this.setState({ dataMurid: res.data.result })
    })
  }

  render() {

    return (
      <>
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Import Data Murid</div>
            <div className="card-body" style={{padding: '5px'}}>
              <form>
                <div className="form-group row" style={{padding: '20px'}}>
                  <div className="col-sm-3">
                    <label>Template Excel</label><br/>
                    <a href={`${API_SERVER}attachments/template-upload.xlsx`} className="btn btn-v2 btn-primary">Download File</a>
                  </div>
                  <div className="col-sm-6">
                    <label>Pilih File</label>
                    <input className="form-control" type="file" />
                  </div>
                  <div className="col-sm-3">
                    <button style={{marginTop: '28px'}} className="btn btn-v2 btn-success" type="submit">Upload File</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Daftar Murid Sekolah
              <button onClick={() => this.setState({ isModalTambah: true})} className="btn btn-v2 btn-primary float-right">
                <i className="fa fa-plus"></i>
                Tambah Murid
              </button>
            </div>
            <div className="card-body">

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
                        <td>{i+1}</td>
                        <td>{item.nama}</td>
                        <td>{item.no_induk}</td>
                        <td>{item.tempat_lahir}</td>
                        <td>{item.tanggal_lahir}</td>
                        <td>{item.jenis_kelamin}</td>
                        <td>
                          <Link to={`/learning/personalia-detail/murid-${item.no_induk}`}>
                            <i className="fa fa-search"></i>
                          </Link>
                          <i style={{cursor: 'pointer'}} onClick={this.deleteMurid} data-id={item.id} className="fa fa-trash ml-2"></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <Modal
                show={this.state.isModalTambah}
                onHide={() => this.closeModal()}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                    Tambah Murid
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.saveMurid}>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label>Nama Murid</label>
                        <input value={this.state.nama} onChange={e => this.setState({ nama: e.target.value })} required type="text" className="form-control" placeholder="Enter" />
                      </div>
                      <div className="col-sm-6">
                        <label>No Induk</label>
                        <input value={this.state.noInduk} onChange={e => this.setState({ noInduk: e.target.value })} required type="text" className="form-control" placeholder="Enter" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label>Tempat Lahir</label>
                        <input value={this.state.tempatLahir} onChange={e => this.setState({ tempatLahir: e.target.value })} required type="text" className="form-control" placeholder="Enter" />
                      </div>
                      <div className="col-sm-6">
                        <label>Tanggal Lahir</label>
                        <input value={this.state.tanggalLahir} onChange={e => this.setState({ tanggalLahir: e.target.value })} required type="date" className="form-control" placeholder="Enter" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-3">
                        <label>Jenis Kelamin</label>
                        <select value={this.state.jenisKelamin} onChange={e => this.setState({ jenisKelamin: e.target.value })} required className="form-control" placeholder="Enter">
                          <option value="" disabled selected>Pilih</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label>Email</label>
                        <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} required type="email" className="form-control" placeholder="Enter" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <button type="submit" className="btn btn-v2 btn-success">
                          <i className="fa fa-save"></i> Simpan
                        </button>
                        <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary ml-2">
                          <i className="fa fa-history"></i> Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>

            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Murid;
