import React from 'react';
import { toast } from "react-toastify";

import { Modal } from 'react-bootstrap';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const jam = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

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

    dataJadwal: [],
    dataRuangan: [],
    dataPelajaran: [],
    dataKelas: [],
    dataGuru: [],

    kurikulums: [],
  }

  selectPelajaran = e => {
    e.preventDefault()
    this.setState({ namaPelajaran: e.target.value, jumlahPertemuan: e.target.value.split('_')[1] })
  }

  selectRuangan = e => {
    e.preventDefault()
    let split = e.target.value.split('_');
    this.setState({ ruanganJadwal: e.target.value, namaPengajar: split[1] })
  }

  saveJadwal = e => {
    e.preventDefault();
    let companyId = Storage.get('user').data.company_id;

    if (this.state.idJadwal) {

      let form = {
        ruangan_id: this.state.ruanganJadwal.split('_')[0],
        pelajaran_id: this.state.namaPelajaran.split('_')[0],
        kelas_id: this.state.kelasJadwal.split('_')[0],
        hari: this.state.hariJadwal,
        jam_mulai: this.state.jamMulai,
        jam_selesai: this.state.jamSelesai,
        jumlah_pertemuan: this.state.jumlahPertemuan,
        kapasitas: this.state.kapasitasMurid,
      }

      API.put(`${API_SERVER}v2/jadwal-mengajar/${this.state.idJadwal}`, form).then(res => {
        if (res.data.error) toast.warning("Error update jadwal")

        this.fetchJadwal(companyId)
      })

    } else {
      let form = {
        company_id: Storage.get('user').data.company_id,
        ruangan_id: this.state.ruanganJadwal.split('_')[0],
        pelajaran_id: this.state.namaPelajaran.split('_')[0],
        kelas_id: this.state.kelasJadwal.split('_')[0],
        hari: this.state.hariJadwal,
        jam_mulai: this.state.jamMulai,
        jam_selesai: this.state.jamSelesai,
        jumlah_pertemuan: this.state.jumlahPertemuan,
        kapasitas: this.state.kapasitasMurid,
      }

      API.post(`${API_SERVER}v2/jadwal-mengajar`, form).then(res => {
        if (res.data.error) toast.warning("Error menyimpan jadwal")

        this.fetchJadwal(companyId)
      })
    }

    this.clearForm();
  }

  deleteJadwal = e => {
    e.preventDefault()
    API.delete(`${API_SERVER}v2/jadwal-mengajar/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning("Error hapus jadwal")

      this.fetchJadwal(Storage.get('user').data.company_id)
    })
  }

  selectJadwal = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v2/jadwal-mengajar/${id}`).then(res => {
      if (res.data.error) toast.warning("Error get one jadwal")

      this.setState({
        idJadwal: id,
        namaPelajaran: res.data.result.pelajaran_id + '_' + res.data.result.silabus,
        kelasJadwal: res.data.result.kelas_id + '_' + res.data.result.kapasitas + '_' + res.data.result.kurikulum,

        ruanganJadwal: `${res.data.result.ruangan_id}_${res.data.result.pengajar_id}`,
        namaPengajar: res.data.result.pengajar_id,

        hariJadwal: res.data.result.hari,
        jamMulai: res.data.result.jam_mulai,
        jamSelesai: res.data.result.jam_selesai,
        jumlahPertemuan: res.data.result.jumlah_pertemuan,
        kapasitasMurid: res.data.result.kapasitas,

        isModalTambah: true
      })
    })
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

      isModalTambah: false,
    })
  }

  componentDidMount() {
    let companyId = Storage.get('user').data.company_id;
    this.fetchPelajaran(companyId)
    this.fetchRuangan(companyId)
    this.fetchJadwal(companyId)
    this.fetchKurikulum()
  }

  fetchJadwal(companyId) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/company/${companyId}`).then(res => {
      if (res.data.error) toast.warning("Error get jadwal")

      this.setState({ dataJadwal: res.data.result })
    })
  }

  fetchPelajaran(companyId) {
    API.get(`${API_SERVER}v2/pelajaran/company/${companyId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch pelajaran")
      this.setState({ dataPelajaran: res.data.result })
    })
    API.get(`${API_SERVER}v2/kelas/company/${companyId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch kelas")
      this.setState({ dataKelas: res.data.result })
    })
  }

  fetchRuangan(companyId) {
    API.get(`${API_SERVER}v2/ruangan-mengajar/company/${companyId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch ruangan")
      this.setState({ dataRuangan: res.data.result })
    })
    API.get(`${API_SERVER}v2/guru/company/${companyId}`).then(res => {
      if (res.data.error) toast.warning("Error fetch guru")
      this.setState({ dataGuru: res.data.result })
    })
  }

  fetchKurikulum() {
    API.get(`${API_SERVER}v2/kurikulum/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch data kurikulum");

      this.setState({ kurikulums: res.data.result })
    })
  }

  selectKelasJadwal = e => {
    let { value } = e.target;
    let kId = value.split('_')[2];

    let filter = this.state.kurikulums.filter(item => item.id == parseInt(kId));
    API.get(`${API_SERVER}v2/pelajaran/company/${Storage.get('user').data.company_id}`).then(res => {
      let mapelFromClass = [];
      if (filter.length) {
        for (var i = 0; i < filter[0].mapel.length; i++) {
          let ff = res.data.result.filter(item => item.pelajaran_id == filter[0].mapel[i].pelajaran_id)
          mapelFromClass.push(ff[0])
        }
      }

      this.setState({
        kelasJadwal: value,
        kapasitasMurid: value.split('_')[1],
        dataPelajaran: mapelFromClass
      })
    })
  }

  render() {

    //console.log('state: ', this.state)

    const StatusJadwal = ({ item }) => {
      if (
        (typeof item.hari === "string") &&
        (typeof item.jam_mulai === "string") &&
        (typeof item.jam_selesai === "string")
      ) {
        return (
          <span style={{ padding: '8px' }} class="badge badge-pill badge-success">Sudah Diatur</span>
        )
      }
      else {
        return (
          <span style={{ padding: '8px' }} class="badge badge-pill badge-warning">Belum Diatur</span>
        )
      }
      // else {
      //   return (<span style={{padding: '8px'}} class="badge badge-pill badge-danger">Jadwal Bentrok</span>)
      // }
    }

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Teaching Schedule
              <button onClick={() => this.setState({ isModalTambah: true })} className="btn btn-v2 btn-primary float-right">
                <i className="fa fa-plus"></i>
                Add Teaching Schedule
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Pelajaran</th>
                    <th>Hari</th>
                    <th>Jam</th>
                    <th>Kelas</th>
                    <th>Pengajar</th>
                    <th>Ruangan</th>
                    <th>Sesi</th>
                    <th>Kapasitas</th>
                    <th>Status</th>
                    <th className="text-center"> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.dataJadwal.map((item, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{item.nama_pelajaran}</td>
                        <td>{item.hari}</td>
                        <td>{item.jam_mulai}-{item.jam_selesai}</td>
                        <td>{item.kelas_nama}</td>
                        <td>{item.pengajar}</td>
                        <td>{item.nama_ruangan}</td>
                        <td>{item.jumlah_pertemuan}x</td>
                        <td>{item.kapasitas} Murid</td>
                        <td><StatusJadwal item={item} /></td>
                        <td className="text-center">
                          <i style={{ cursor: 'pointer' }} onClick={this.selectJadwal} data-id={item.jadwal_id} className="fa fa-edit"></i>
                          <i style={{ cursor: 'pointer' }} onClick={this.deleteJadwal} data-id={item.jadwal_id} className="fa fa-trash ml-2"></i>
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
          show={this.state.isModalTambah}
          onHide={() => this.clearForm()}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Add Teaching Schedule
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.saveJadwal}>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Class</label>
                  <select value={this.state.kelasJadwal} onChange={this.selectKelasJadwal} className="form-control">
                    <option value="">Pilih</option>
                    {
                      this.state.dataKelas.map((item, i) => (
                        <option value={`${item.kelas_id}_${item.kapasitas}_${item.kurikulum}`}>{item.kelas_nama}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="col-sm-6">
                  <label>Nama Pelajaran</label>
                  <select value={this.state.namaPelajaran} onChange={this.selectPelajaran} required className="form-control">
                    <option value="">Pilih</option>
                    {
                      this.state.dataPelajaran.map((item, i) => (
                        <option value={item.pelajaran_id + '_' + item.silabus}>{item.nama_pelajaran}</option>
                      ))
                    }
                  </select>
                </div>

              </div>

              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Ruangan</label>
                  <select value={this.state.ruanganJadwal} onChange={this.selectRuangan} required className="form-control">
                    <option value="">Pilih</option>
                    {
                      this.state.dataRuangan.map((item, i) => (
                        <option value={`${item.id}_${item.pengajar_id}`}>{item.nama_ruangan}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-sm-6">
                  <label>Teacher Name</label>
                  <select value={this.state.namaPengajar} onChange={e => this.setState({ namaPengajar: e.target.value })} disabled className="form-control">
                    <option value="">Pilih</option>
                    {
                      this.state.dataGuru.map((item, i) => (
                        <option value={item.id}>{item.nama}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-4">
                  <label>Hari</label>
                  <select value={this.state.hariJadwal} onChange={e => this.setState({ hariJadwal: e.target.value })} required className="form-control">
                    <option value="">Pilih</option>
                    {
                      hari.map((item, i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-sm-4">
                  <label> Starting Hours </label>
                  <select value={this.state.jamMulai} onChange={e => this.setState({ jamMulai: e.target.value })} required className="form-control">
                    <option value="">Pilih</option>
                    {
                      jam.map((item, i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
                <div className="col-sm-4">
                  <label> End Hours </label>
                  <select value={this.state.jamSelesai} onChange={e => this.setState({ jamSelesai: e.target.value })} required className="form-control">
                    <option value="">Pilih</option>
                    {
                      jam.map((item, i) => (
                        <option value={item}>{item}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-6">
                  <label>Jumlah Pertemuan</label>
                  <input required className="form-control" type="number" min="0" value={this.state.jumlahPertemuan} onChange={e => this.setState({ jumlahPertemuan: e.target.value < 0 ? 0 : e.target.value })} placeholder="Enter jumlah pertemuan" />
                </div>
                <div className="col-sm-6">
                  <label>Kapasitas Murid</label>
                  <input required className="form-control" type="number" value={this.state.kapasitasMurid} onChange={e => this.setState({ kapasitasMurid: e.target.value })} placeholder="Enter kapasitas murid" />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-12">
                  <button
                    type="submit"
                    className="btn btn-icademy-primary btn-icademy-blue"
                  >
                    <i className="fa fa-save"></i>
                    Simpan
                  </button>
                  <button
                    className="btn btm-icademy-primary btn-icademy-grey ml-2"
                    onClick={() => this.clearForm()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

}

export default JadwalMengajar;
