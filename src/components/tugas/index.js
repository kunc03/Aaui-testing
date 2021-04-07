import React from 'react';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom'

class Tugas extends React.Component {

  state = {
    semuaTugas: [],

    isModalTugas: false,

    isModalDetail: false,
    examId: '',
    tipeJawab: '',
    examTitle: '',
    examSoal: [],

    keyFile: Math.random().toString(25),
    file: '',
    deskripsi: '',

    jawaban: '',
    submitted: false,

    tahunAjaran: '',
    listTahunAjaran: []
  }

  fetchJadwal(tahunAjaran) {
    API.get(`${API_SERVER}v2/tugas-murid/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch jadwal`)

      this.setState({
        semuaTugas: res.data.result.tugas.filter(item => item.quiz == 2),
      })
    })
  }

  componentDidMount() {
    let d = new Date();
    // bulan diawali dengan 0 = januari, 11 = desember
    let month = d.getMonth();
    let tahunAjaran = month < 6 ? (d.getFullYear() - 1) + '/' + d.getFullYear() : d.getFullYear() + '/' + (d.getFullYear() + 1);

    let temp = [];
    for (var i = 0; i < 6; i++) {
      temp.push(`${d.getFullYear() - i}/${d.getFullYear() - i + 1}`)
    }
    this.setState({ tahunAjaran, listTahunAjaran: temp })

    this.fetchJadwal(tahunAjaran)
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
      jawaban: '',
      tipeJawab: '',

      submitted: false
    })
  }

  openDetail = e => {
    e.preventDefault();
    let examId = e.target.getAttribute('data-id');
    let examTitle = e.target.getAttribute('data-title');
    this.setState({ isModalDetail: true, examId, examTitle })
    this.fetchPertanyaan(examId);
  }

  answerTugas = e => {
    e.preventDefault()
    let examId = e.target.getAttribute('data-id')
    let tipeJawab = e.target.getAttribute('data-tipe')
    this.fetchPertanyaan(examId)
    this.setState({ isModalTugas: true, examId, tipeJawab })
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch pertanyaan`)

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

    //console.log('state: ', this.state)
    API.post(`${API_SERVER}v2/tugas-murid/submit`, form).then(res => {
      if (res.data.error) {
        toast.warning(`Error: submit tugas`)
      }
      else {
        toast.success(`Berhasil mengumpulkan tugas`);
        this.fetchJadwal(this.state.tahunAjaran);
        this.clearForm();
      }
    })
  }

  submitTugasLangsung = e => {
    e.preventDefault()
    let form = {
      jawaban: this.state.jawaban,
      userId: Storage.get('user').data.user_id,
      examId: this.state.examId
    }
    API.post(`${API_SERVER}v2/tugas-murid/submit-langsung`, form).then(res => {
      if (res.data.error) {
        toast.warning(`Error: submit tugas`)
      }
      else {
        toast.success(`Berhasil mengumpulkan tugas`);
        this.fetchJadwal(this.state.tahunAjaran);
        this.clearForm();
      }
    })
  }

  openJawabanLangsung = e => {
    e.preventDefault()
    let examId = e.target.getAttribute('data-id')
    let tipeJawab = e.target.getAttribute('data-tipe')
    let cc = [...this.state.semuaTugas].filter(item => item.exam_id == examId);
    if (cc.length) {
      this.setState({ examId, tipeJawab, jawaban: cc[0].submitted[0].answer_file, isModalTugas: true, submitted: true })
      this.fetchPertanyaan(examId)
    }
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchJadwal(value);
  }

  render() {

    console.log(`state: `, this.state)

    return (
      <>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-body" style={{ padding: '12px' }}>

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

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Subject </th>
                    <th>Description </th>
                    <th>Time of Collection</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Date Submit </th>
                    <th className="text-center">Score </th>
                    <th className="text-center"> Action </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.semuaTugas.map((item, i) => {
                      return (
                        <tr>
                          <td>{item.nama_pelajaran}</td>
                          <td><a href="#" data-id={item.exam_id} data-title={item.title} onClick={this.openDetail}>{item.title}</a></td>
                          <td>{moment(item.time_start).format('DD/MM/YYYY')} sampai {moment(item.time_finish).format('DD/MM/YYYY')}</td>
                          <td className="text-center">{item.submitted.length === 1 ? <span className="label label-success">Sudah Mengumpulkan</span> : <span className="label label-warning">Belum Mengumpulkan</span>}</td>
                          <td className="text-center">{item.submitted.length === 1 ? moment(item.submitted[0].created_at).format('DD/MM/YYYY HH:mm') : '-'}</td>
                          <td className="text-center">
                            {item.submitted.length ? item.submitted[0].score : '-'}
                          </td>
                          <td className="text-center">
                            {
                              item.submitted.length === 1 && item.submitted[0].answer_file ?
                                <>
                                  {
                                    item.tipe_jawab == '2' ?
                                      <span onClick={this.openJawabanLangsung} data-tipe={item.tipe_jawab} data-id={item.exam_id} className="silabus" style={{ cursor: 'pointer' }}>Open</span>
                                      :
                                      <a href={item.submitted[0].answer_file} target="_blank" className="silabus">Open</a>
                                  }
                                </>
                                :
                                <>
                                  {
                                    moment(item.time_finish) <= moment(new Date()) ?
                                      'Expired'
                                      :
                                      moment(new Date()) >= moment(item.time_start) && moment(new Date()) <= moment(item.time_finish) ?
                                        <button onClick={this.answerTugas} data-id={item.exam_id} data-tipe={item.tipe_jawab} className="btn btn-v2 btn-primary">
                                          Kirim Tugas
                                      </button>
                                        :
                                        'Belum Saatnya'
                                  }
                                </>
                            }

                          </td>
                        </tr>
                      )
                    })
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
              this.state.examSoal.map((item, i) => (
                <div className="mb-2">
                  <label>Pertanyaan <b>{i + 1}</b></label>
                  <div className="soal" dangerouslySetInnerHTML={{ __html: item.tanya }} />
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
            {this.state.submitted ? 'Informasi Tugas' : 'Kumpulkan Tugas'}
          </Modal.Header>
          <Modal.Body>
            {
              this.state.tipeJawab == '1' &&
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
                  <button type="submit" className="btn btn-v2 btn-success mt-3">Submit</button>
                </div>
              </form>
            }

            {
              this.state.tipeJawab == '2' &&
              <form onSubmit={this.submitTugasLangsung}>
                {
                  this.state.examSoal.map((item, i) => (
                    <div className="mb-2">
                      <label>Pertanyaan <b>{i + 1}</b></label>
                      <div className="soal" dangerouslySetInnerHTML={{ __html: item.tanya }} />
                    </div>
                  ))
                }

                <div className="form-group">
                  <label>Jawaban</label>
                  <textarea disabled={this.state.submitted} rows="10" className="form-control" onChange={e => this.setState({ jawaban: e.target.value })} value={this.state.jawaban} />
                </div>

                {
                  !this.state.submitted &&
                  <div className="form-group mt-2">
                    <button type="submit" className="btn btn-v2 btn-success mt-3">Submit</button>
                  </div>
                }
              </form>
            }
          </Modal.Body>
        </Modal>

      </>
    );
  }

}

export default Tugas;
