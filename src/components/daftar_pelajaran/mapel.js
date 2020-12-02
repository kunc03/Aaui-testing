import React from 'react';
import { Link } from 'react-router-dom';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify'

class MataPelajaran extends React.Component {

  state = {
    mataPelajaran: [],
    dataSilabus: [],

    isModalSilabus: false,
    isModalBuka: false,
  }

  componentDidMount() {
    API.get(`${API_SERVER}v2/jadwal-murid/${Storage.get('user').data.user_id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal murid`)

      this.setState({
        mataPelajaran: res.data.result
      })
    })
    // let mataPelajaran = [
    //   {
    //     tanggal: "Senin, 10 Maret 2020",
    //     data: [
    //       {mapel: 'Pendidikan Agama', topik: 'Pahala itu apa ?', waktu: '08:00 - 09:00', sesi: 1, nama_pengajar: 'Ian Francis', pembelajaran: 'Tatap Muka Virtual'},
    //       {mapel: 'Pendidikan Pancasila', topik: 'Pahala itu apa ?', waktu: '08:00 - 09:00', sesi: 1, nama_pengajar: 'Ian Francis', pembelajaran: 'Tatap Muka Virtual'},
    //     ]
    //   },
    //   {
    //     tanggal: "Selasa, 11 Maret 2020",
    //     data: [
    //       {mapel: 'Pendidikan Agama', topik: 'Pahala itu apa ?', waktu: '08:00 - 09:00', sesi: 1, nama_pengajar: 'Ian Francis', pembelajaran: 'Tatap Muka Virtual'},
    //       {mapel: 'Pendidikan Pancasila', topik: 'Pahala itu apa ?', waktu: '08:00 - 09:00', sesi: 1, nama_pengajar: 'Ian Francis', pembelajaran: 'Tatap Muka Virtual'},
    //     ]
    //   },
    // ];

    let dataSilabus = [
      {sesi: 1, topik: "Ajektif 1", tujuan: "Murid dapat memahami ajektif 1", penyampaian_materi: "Video 20:00 | Materi Bacaan : 20:00 | Tugas 20:00", files: "https://google.com"},
      {sesi: 2, topik: "Ajektif 2", tujuan: "Murid dapat memahami ajektif 2", penyampaian_materi: "Video 20:00 | Materi Bacaan : 20:00 | Tugas 20:00", files: "https://google.com"},
    ]
    this.setState({ dataSilabus })
  }

  clearForm() {
    this.setState({
      isModalSilabus: false,
      isModalBuka: false
    })
  }

  render() {

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <button onClick={() => this.setState({ isModalSilabus: true})} className="btn btn-v2 btn-primary">
                <i className="fa fa-list"></i>
                Lihat Silabus
              </button>
            </div>

            <div className="card-body" style={{padding: '12px'}}>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Tanggal</th>
                    <th className="text-center">Mata Pelajaran</th>
                    <th className="text-center">Waktu</th>
                    <th className="text-center">Sesi</th>
                    <th className="text-center">Nama Pengajar</th>
                    <th className="text-center">Ruangan</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.mataPelajaran.map((item,i) => (
                      <>
                        <tr>
                          <td className="text-center" style={{verticalAlign: 'middle'}} rowSpan={item.data.length+1}>{item.tanggal}</td>
                        </tr>
                        {
                          item.data.map(row => (
                            <tr>
                              <td className="text-center" style={{verticalAlign: 'middle'}}>{row.mapel}</td>
                              <td className="text-center" style={{verticalAlign: 'middle'}}>{row.jam_mulai}-{row.jam_selesai}</td>
                              <td className="text-center" style={{verticalAlign: 'middle'}}>{row.sesi}</td>
                              <td className="text-center" style={{verticalAlign: 'middle'}}>{row.nama_guru}</td>
                              <td className="text-center" style={{verticalAlign: 'middle'}}>{row.nama_ruangan}</td>
                              <td className="text-center" style={{verticalAlign: 'middle'}}>
                                <button onClick={e => {e.preventDefault(); this.setState({ isModalBuka: true })}} className="btn btn-v2 btn-primary">
                                  <i className="fa fa-paper-plane"></i> Buka
                                </button>
                              </td>
                            </tr>
                          ))
                        }
                      </>
                    ))
                  }
                </tbody>

                <tfoot>
                  <tr>
                    <th className="text-center">Tanggal</th>
                    <th className="text-center">Mata Pelajaran</th>
                    <th className="text-center">Waktu</th>
                    <th className="text-center">Sesi</th>
                    <th className="text-center">Nama Pengajar</th>
                    <th className="text-center">Ruangan</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.isModalBuka}
          onHide={() => this.clearForm()}
        >
          <Modal.Body>
            <h4>Perhatian</h4>
            <p>Apakah Kamu yakin mau masuk pelajaran ... ?</p>

            <Link to={`/`} className="btn btn-v2 btn-primary">Yakin</Link>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.isModalSilabus}
          onHide={() => this.clearForm()}
          dialogClassName="modal-xlg"
        >
          <Modal.Header closeButton>
            <form className="form-inline">
              <label>Mata Pelajaran</label>
              <select className="form-control ml-2">
                <option value="">Pilih mata pelajaran</option>
              </select>
            </form>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sesi</th>
                  <th>Topik</th>
                  <th>Tujuan</th>
                  <th>Penyampaian Materi</th>
                  <th>Files</th>
                </tr>
              </thead>

              <tbody>
                {
                  this.state.dataSilabus.map((item,i) => (
                    <tr>
                      <td>{item.sesi}</td>
                      <td>{item.topik}</td>
                      <td>{item.tujuan}</td>
                      <td>{item.penyampaian_materi}</td>
                      <td>{item.files}</td>
                    </tr>
                  ))
                }
              </tbody>

              <thead>
                <tr>
                  <th>Sesi</th>
                  <th>Topik</th>
                  <th>Tujuan</th>
                  <th>Penyampaian Materi</th>
                  <th>Files</th>
                </tr>
              </thead>
            </table>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default MataPelajaran;
