import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, {API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

import { Card, Modal, Col, Row, InputGroup, Form } from 'react-bootstrap';

class Tugas extends React.Component {

  state = {
    mataPelajaran: [],

    isModalTugas: false,
    isModalDetail: false,
  }

  componentDidMount() {
    let mataPelajaran = [
      {mapel: 'Pendidikan Agama', deskripsi: 'Buat essay minimal 500 kata terkait deskripsi pahala dalam format ms word', waktu_pengumpulan: '4 Oktober 2020', status: 'Perlu Dikirim'},
      {mapel: 'Pendidikan Pancasila', deskripsi: 'Buat essay minimal 500 kata terkait deskripsi pahala dalam format ms word', waktu_pengumpulan: '3 Oktober 2020', status: 'Perlu Dikirim'},
    ];
    this.setState({ mataPelajaran })
  }

  clearForm() {
    this.setState({
      isModalTugas: false,
      isModalDetail: false,
    })
  }

  render() {

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-body" style={{padding: '12px'}}>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Mata Pelajaran</th>
                    <th>Deskripsi</th>
                    <th>Waktu Pengumpulan</th>
                    <th>Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.mataPelajaran.map((item,i) => (
                      <tr>
                        <td>{item.mapel}</td>
                        <td><i style={{cursor: 'pointer'}} onClick={() => this.setState({ isModalDetail: true})} className="fa fa-search"></i> {item.deskripsi}</td>
                        <td>{item.waktu_pengumpulan}</td>
                        <td>{item.status}</td>
                        <td>
                          <button onClick={() => this.setState({ isModalTugas: true })} className="btn btn-v2 btn-primary">
                            <i className="fa fa-paper-plane"></i> Kirim Tugas
                          </button>
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
          show={this.state.isModalDetail}
          onHide={() => this.clearForm()}
        >
          <Modal.Body>
            <h4>Tugas</h4>
            <b>Judul Essay</b>
            <p>Konten EssayLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.isModalTugas}
          onHide={() => this.clearForm()}
        >
          <Modal.Header closeButton>
            Kumpulkan Tugas
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Mata Pelajaran</label>
                <input type="file" className="form-control" />
              </div>
            </form>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default Tugas;
