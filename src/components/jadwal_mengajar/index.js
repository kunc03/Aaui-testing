import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { Card, Modal, Col, Row, InputGroup, Form } from 'react-bootstrap';

const hari = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
const jam = ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

class JadwalMengajar extends React.Component {

  state = {
    idJadwal: "",
    namaPelajaran: "",
    kelasJadwal: "",
    hariJadwal: "",
    jamMulai: "",
    jamSelesai: "",
    namaPengajar: "",
    ruanganJadwal: "",
    jumlahPertemuan: "",
    kapasitasMurid: "",

    isModalTambah: false,

    dataJadwal: []
  }

  saveRuangan = e => {
    e.preventDefault();

    if(this.state.idRuangan) {

    } else {

      let cp = [...this.state.dataJadwal];
      cp.push({
        id: this.state.dataJadwal.length+1,
        nama_pelajaran: this.state.namaPelajaran,
        kelas_jadwal: this.state.kelasJadwal,
        hari_jadwal: this.state.hariJadwal,
        jam_mulai: this.state.jamMulai,
        jam_selesai: this.state.jamSelesai,
        nama_pengajar: this.state.namaPengajar,
        ruangan_jadwal: this.state.ruanganJadwal,
        jumlah_pertemuan: this.state.jumlahPertemuan,
        kapasitas_murid: this.state.kapasitasMurid,
      });
      this.setState({ dataJadwal: cp });
      this.clearForm();
    }
  }

  clearForm() {
    this.setState({
      idJadwal: "",
      namaPelajaran: "",
      kelasJadwal: "",
      hariJadwal: "",
      jamMulai: "",
      jamSelesai: "",
      namaPengajar: "",
      ruanganJadwal: "",
      jumlahPertemuan: "",
      kapasitasMurid: "",

      isModalTambah: false
    })
  }

  componentDidMount() {
    let listKelas = [
      {
        id: 1,
        nama_pelajaran: "Pendidikan Agama",
        kelas_jadwal: "Kelas II IPA 2",
        hari_jadwal: "Senin",
        jam_mulai: "08:00",
        jam_selesai: "10:00",
        nama_pengajar: "Ahmad",
        ruangan_jadwal: "Ruangan 1",
        jumlah_pertemuan: "10",
        kapasitas_murid: "30",
      },
      {
        id: 2,
        nama_pelajaran: "Matematika",
        kelas_jadwal: "Kelas II IPA 1",
        hari_jadwal: "Selasa",
        jam_mulai: "09:00",
        jam_selesai: "11:00",
        nama_pengajar: "Ardi",
        ruangan_jadwal: "Ruangan 2",
        jumlah_pertemuan: "12",
        kapasitas_murid: "30",
      },
    ];
    this.setState({ dataJadwal: listKelas })
  }

  render() {
    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Jadwal Mengajar
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
                    <th>Nama Pelajaran</th>
                    <th>Kelas</th>
                    <th>Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.dataJadwal.map((item, i) => (
                      <tr>
                        <td>{i+1}</td>
                        <td>{item.nama_pelajaran}</td>
                        <td>{item.kelas_jadwal}</td>
                        <td>{item.hari_jadwal}</td>
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
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
              Tambah Jadwal Mengajar
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Nama Pelajaran</label>
                <input value={this.state.namaRuangan} onChange={e => this.setState({ namaRuangan: e.target.value })} required type="text" className="form-control" placeholder="Enter nama ruangan" />
              </div>
              <div className="form-group row">
                <div className="col-sm-3">
                  <label>Kelas</label>
                  <select value={this.state.kelasJadwal} onChange={e => this.setState({ kelasJadwal: e.target.value })} required className="form-control">
                    <option value="">Pilih pengajar</option>
                    <option value="Ahmad">Ahmad</option>
                    <option value="Ardi">Ardi</option>
                    <option value="Ansyah">Ansyah</option>
                  </select>
                </div>
                <div className="col-sm-3">
                  <label>Hari</label>
                  <select value={this.state.hariJadwal} onChange={e => this.setState({ hariJadwal: e.target.value })} required className="form-control">
                    <option value="">Pilih folder</option>
                    {
                      hari.map((item,i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-sm-3">
                  <label>Jam Mulai</label>
                  <select value={this.state.jamMulai} onChange={e => this.setState({ jamMulai: e.target.value })} required className="form-control">
                    <option value="">Pilih pengajar</option>
                    {
                      jam.map((item,i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-sm-3">
                  <label>Jam Selesai</label>
                  <select value={this.state.jamSelesai} onChange={e => this.setState({ jamSelesai: e.target.value })} required className="form-control">
                    <option value="">Pilih folder</option>
                    {
                      jam.map((item,i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Nama Pengajar</label>
                  <select value={this.state.kelasJadwal} onChange={e => this.setState({ kelasJadwal: e.target.value })} required className="form-control">
                    <option value="">Pilih pengajar</option>
                    <option value="Ahmad">Ahmad</option>
                    <option value="Ardi">Ardi</option>
                    <option value="Ansyah">Ansyah</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label>Ruangan</label>
                  <select value={this.state.hariJadwal} onChange={e => this.setState({ hariJadwal: e.target.value })} required className="form-control">
                    <option value="">Pilih folder</option>
                    {
                      hari.map((item,i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Jumlah Pertemuan</label>
                  <input required className="form-control" type="number" value={this.state.jumlahPertemuan} onChange={e => this.setState({ jumlahPertemuan: e.target.value })} placeholder="Enter jumlah pertemuan" />
                </div>
                <div className="col-sm-6">
                  <label>Kapasitas Murid</label>
                  <input required className="form-control" type="number" value={this.state.kapasitasMurid} onChange={e => this.setState({ kapasitasMurid: e.target.value })} placeholder="Enter kapasitas murid" />
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

export default JadwalMengajar;
