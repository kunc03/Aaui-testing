import React from 'react';
import { Link } from 'react-router-dom';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify'

class MataPelajaran extends React.Component {

  state = {
    mataPelajaran: [],

    isModalBuka: false,

    isModalSilabus: false,
    jadwalPelajaran: [],
    pelajaranId: '',
    dataSilabus: [],

    jadwalKu: [],

    tahunAjaran: '',
    listTahunAjaran: []
  }

  fetchJadwalKu(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if(res.data.error) console.log(`Error: fetch pelajaran`)

      let dd = res.data.result;
      let unique = [...new Map(dd.map(item => [item['pelajaran_id'], item])).values()];

      let senin = dd.filter(item => item.hari === "Senin");
      let selasa = dd.filter(item => item.hari === "Selasa");
      let rabu = dd.filter(item => item.hari === "Rabu");
      let kamis = dd.filter(item => item.hari === "Kamis");
      let jumat = dd.filter(item => item.hari === "Jumat");
      let sabtu = dd.filter(item => item.hari === "Sabtu");
      let minggu = dd.filter(item => item.hari === "Minggu");

      let mataPelajaran = [
        { tanggal: "Senin", data: senin },
        { tanggal: "Selasa", data: selasa },
        { tanggal: "Rabu", data: rabu },
        { tanggal: "Kamis", data: kamis },
        { tanggal: "Jumat", data: jumat },
        { tanggal: "Sabtu", data: sabtu },
        { tanggal: "Minggu", data: minggu },
      ];

      this.setState({ mataPelajaran: mataPelajaran, jadwalPelajaran: unique, jadwalKu: res.data.result })
    })
  }

  fetchJadwal(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal`)

      this.setState({
        jadwalPelajaran: res.data.result,
      })
    })
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch overview`)

      this.setState({ dataSilabus: res.data.result });
    })
  }

  componentDidMount() {
    let d = new Date();
    // bulan diawali dengan 0 = januari, 11 = desember
    let month = d.getMonth();
    let tahunAjaran = month < 6 ? (d.getFullYear()-1)+'/'+d.getFullYear() : d.getFullYear()+'/'+(d.getFullYear()+1);

    let temp = [];
    for(var i=0; i<6; i++) {
      temp.push(`${d.getFullYear()-i}/${d.getFullYear()-i+1}`)
    }
    this.setState({ tahunAjaran, listTahunAjaran: temp })

    this.fetchJadwal(tahunAjaran);
    this.fetchJadwalKu(tahunAjaran);
  }

  clearForm() {
    this.setState({
      isModalSilabus: false,
      isModalBuka: false,
      pelajaranId: '',
      dataSilabus: [],
    })
  }

  selectPelajaran = e => {
    e.preventDefault();
    let pelajaranId = e.target.value;
    this.setState({ isModalSilabus: true, pelajaranId })
    this.fetchSilabus(pelajaranId);
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchJadwal(value);
    this.fetchJadwalKu(value);
  }

  render() {

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <h3 className="f-24 fc-skyblue f-w-800 mb-3">
                    Jadwal Mengajar
                  </h3>

                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">

                        <div className="card-header row">
                          <div className="col-sm-2">
                            <label>Tahun Ajaran</label>
                            <select onChange={this.selectTahunAjaran} value={this.state.tahunAjaran} className="form-control" required>
                              <option value="" selected disabled>Select</option>
                              {
                                this.state.listTahunAjaran.map(item => (
                                  <option value={item}>{item}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="col-sm-4">
                            <button onClick={() => this.setState({ isModalSilabus: true })} className="btn btn-v2 btn-primary mt-4">
                              <i className="fa fa-list"></i>
                              See Syllabus
                            </button>
                          </div>
                        </div>

                        <div className="card-body" style={{ padding: '12px' }}>

                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th className="text-center">Date</th>
                                <th className="text-center">Class</th>
                                <th className="text-center">Room</th>
                                <th className="text-center">Subject</th>
                                <th className="text-center">Time</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {
                                this.state.mataPelajaran.map((item, i) => (
                                  <>
                                    <tr>
                                      <td className="text-center" style={{verticalAlign: 'middle'}} rowSpan={item.data.length+1}>{item.tanggal}</td>
                                      {
                                        item.data.length === 0 &&
                                        <td className="text-center" colSpan="5">No schedule</td>
                                      }
                                    </tr>
                                    {
                                      item.data.map(row => (
                                        <tr>
                                          <td className="text-center" style={{verticalAlign: 'middle'}}>{row.kelas_nama}</td>
                                          <td className="text-center" style={{verticalAlign: 'middle'}}>{row.nama_ruangan}</td>
                                          <td className="text-center" style={{verticalAlign: 'middle'}}>{row.nama_pelajaran}</td>
                                          <td className="text-center" style={{verticalAlign: 'middle'}}>{row.jam_mulai}-{row.jam_selesai}</td>
                                          <td className="text-center" style={{verticalAlign: 'middle'}}>
                                            {
                                              /**
                                              <button onClick={e => {e.preventDefault(); this.setState({ isModalBuka: true })}} className="btn btn-v2 btn-primary">
                                              <i className="fa fa-paper-plane"></i> Open
                                              </button>
                                              */
                                            }
                                            <Link to={`/guru/preview/${row.jadwal_id}`} className="btn btn-v2 btn-primary">
                                              <i className="fa fa-paper-plane"></i> Open
                                            </Link>
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
                                <th className="text-center">Date</th>
                                <th className="text-center">Class</th>
                                <th className="text-center">Room</th>
                                <th className="text-center">Subject</th>
                                <th className="text-center">Time</th>
                                <th className="text-center">Action</th>
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
                          <label>Subject</label>
                          <select onChange={this.selectPelajaran} className="form-control ml-2">
                            <option value="" disabled selected>Choose subject</option>
                            {
                              this.state.jadwalPelajaran.map((item,i) => (
                                <option key={i} value={item.pelajaran_id}>{item.nama_pelajaran}</option>
                              ))
                            }
                          </select>
                        </form>
                      </Modal.Header>
                      <Modal.Body>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Session</th>
                            <th>Topic</th>
                            <th>Goal</th>
                            <th>Description</th>
                            <th>Periode</th>
                            <th>Duration</th>
                            <th>Files</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.dataSilabus.map((item, i) => {
                              if(item.jenis === 0) {
                                return (
                                    <tr key={i}>
                                      <td>{item.sesi}</td>
                                      <td>{item.topik}</td>
                                      <td>{item.tujuan}</td>
                                      <td>{item.deskripsi}</td>
                                      <td>{item.periode}</td>
                                      <td>{item.durasi}</td>
                                      <td style={{padding: '12px'}}>
                                        {
                                          item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : 'No files'
                                        }
                                      </td>
                                    </tr>
                                  )
                              } else {
                                return (
                                  <tr key={i}>
                                    <td>{item.sesi}</td>
                                    <td colSpan="4" className="text-center">{item.jenis == 1 ? 'Kuis':'Ujian'}</td>
                                  </tr>
                                )
                              }
                            })
                          }
                          </tbody>
                        </table>
                      </Modal.Body>
                    </Modal>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default MataPelajaran;
