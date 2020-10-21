import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { Card, Modal, Col, Row, InputGroup, Form } from 'react-bootstrap';


class RuanganMengajar extends React.Component {

  state = {
    idRuangan: "",
    namaRuangan: "",
    folder: "",
    pengajar: "",

    isModalTambah: false,

    dataRuangan: []
  }

  saveRuangan = e => {
    e.preventDefault();

    if(this.state.idRuangan) {

    } else {

      let form = {
        idRuangan: this.state.dataRuangan.length+1,
        namaRuangan: this.state.namaRuangan,
        folder: this.state.folder,
        pengajar: this.state.pengajar
      };

      let cp = [...this.state.dataRuangan];
      cp.push({id: form.idRuangan, nama_ruangan: form.namaRuangan, folder: form.folder, pengajar: form.pengajar});
      this.setState({ dataRuangan: cp });
      this.clearForm();
    }
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
    let listKelas = [
      {id: 1, nama_ruangan: "Nama 1", folder: "Semester 1", pengajar: "Pengajar 1"},
      {id: 1, nama_ruangan: "Nama 2", folder: "Semester 1", pengajar: "Pengajar 2"},
      {id: 1, nama_ruangan: "Nama 3", folder: "Semester 1", pengajar: "Pengajar 3"},
    ];
    this.setState({ dataRuangan: listKelas })
  }

  render() {
    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Ruangan Mengajar
              <button onClick={() => this.setState({ isModalTambah: true})} className="btn btn-v2 btn-primary float-right">
                <i className="fa fa-plus"></i>
                Tambah Ruangan Mengajar
              </button>
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
                        <td>{i+1}</td>
                        <td>{item.nama_ruangan}</td>
                        <td>{item.folder}</td>
                        <td>{item.pengajar}</td>
                        <td className="text-center"><i className="fa fa-ellipsis-v"></i></td>
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
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
              Tambah Ruangan Mengajar
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
                    <option value="">Pilih pengajar</option>
                    <option value="Ahmad">Ahmad</option>
                    <option value="Ardi">Ardi</option>
                    <option value="Ansyah">Ansyah</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label>Folder</label>
                  <select value={this.state.folder} onChange={e => this.setState({ folder: e.target.value })} required className="form-control">
                    <option value="">Pilih folder</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
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
