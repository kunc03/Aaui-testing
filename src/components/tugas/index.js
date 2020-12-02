import React from 'react';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom'

class Tugas extends React.Component {

  state = {
    mataPelajaran: [],

    isModalTugas: false,
    isModalDetail: false,

    examId: '',
    examTitle: '',
    examSoal: [],

    keyFile: Math.random().toString(25),
    file: '',
    deskripsi: '',
  }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/tugas-murid/${Storage.get('user').data.user_id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal`)

      this.setState({
        mataPelajaran: res.data.result.tugas,
      })
    })
  }

  componentDidMount() {
    this.fetchJadwal()
  }

  clearForm() {
    this.setState({
      isModalTugas: false,
      isModalDetail: false,

      examId: '',
      examTitle: '',
      examSoal: [],

      keyFile: Math.random().toString(25),
      file: '',
      deskripsi: '',
    })
  }

  openDetail = e => {
    e.preventDefault();
    let examId = e.target.getAttribute('data-id');
    let examTitle = e.target.getAttribute('data-title');
    this.setState({ isModalDetail: true, examId, examTitle })
    this.fetchPertanyaan(examId);
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      this.setState({ examSoal: res.data.result })
    })
  }

  submitTugas = e => {
    e.preventDefault();
    let form = new FormData();
    form.append('file', this.state.file);
    form.append('userId', Storage.get('user').data.user_id);;
    form.append('examId', this.state.examId);
    form.append('deskripsi', this.state.deskripsi);

    console.log('state: ', this.state)
    API.post(`${API_SERVER}v2/tugas-murid/submit`, form).then(res => {
      if(res.data.error) toast.warning(`Error: submit tugas`)

      toast.success(`Berhasil mengumpulkan tugas`);
      this.fetchJadwal();
      this.clearForm();
    })
  }

  render() {

    console.log(`state: `, this.state)

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
                        <td>{item.nama_pelajaran}</td>
                        <td><a href="#" data-id={item.exam_id} data-title={item.title} onClick={this.openDetail}>{item.title}</a></td>
                        <td>{moment(item.time_start).format('DD-MM-YYYY')} sampai {moment(item.time_finish).format('DD-MM-YYYY')}</td>
                        <td>{item.answer_file ? 'Sudah Mengumpulkan' : 'Belum Mengumpulkan'}</td>
                        <td className="text-center">
                          {
                            item.answer_file ?
                            <a href={item.answer_file} target="_blank" className="silabus">Open</a>
                            :
                            <button onClick={() => this.setState({ isModalTugas: true, examId: item.exam_id })} className="btn btn-v2 btn-primary">
                              <i className="fa fa-paper-plane"></i> Kirim Tugas
                            </button>
                          }
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
            <h4 className="mb-3">{this.state.examTitle}</h4>

            {
              this.state.examSoal.map((item,i) => (
                <div className="mb-2">
                  <b>Pertanyaan {i+1}</b>
                  <textarea rows='4' className="form-control">{item.tanya}</textarea>
                </div>
              ))
            }

            <button onClick={() => this.clearForm()} className="btn btn-v2 btn-primary mt-3">Close</button>

          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.isModalTugas}
          onHide={() => this.clearForm()}
        >
          <Modal.Header className="card-header header-kartu" closeButton>
            Kumpulkan Tugas
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.submitTugas}>
              <div className="form-group">
                <label>Upload File</label>
                <input key={this.state.keyFile} onChange={e => this.setState({ file: e.target.files[0] })} type="file" className="form-control" />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea onChange={e => this.setState({ deskripsi: e.target.value })} rows='3' className="form-control" />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-v2 btn-success">Submit</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default Tugas;
