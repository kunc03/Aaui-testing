import React from 'react';
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { Editor } from '@tinymce/tinymce-react';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Tugas extends React.Component {

  state = {
    tipe: this.props.tipe,
    jadwalId: this.props.match.params.id,
    examId: this.props.match.params.examId,
    infoExam: {},

    pertanyaan: [],

    mengumpulkan: [],
    belum: [],

    openDetail: false,
    detail: {},

    // for kuis & ujian
    infoExam: {},
    examSoal: [],

    openScore: false,
    benar: 0,
    salah: 0,
    score: 0,
    nama: "",

    nilaiTugas: 0,
  };

  clearScore() {
    this.setState({
      openScore: false,
      infoExam: {},
      benar: 0,
      salah: 0,
      score: 0,
      nama: "",
    })
  }

  fetchMengumpulkan(id) {
    API.get(`${API_SERVER}v2/guru/mengumpulkan-${this.state.tipe}/${this.state.jadwalId}/${id}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch mengumpulkan tugas`)

      this.setState({
        mengumpulkan: res.data.result.sudahMengumpulkan,
        belum: res.data.result.belumMengumpulkan
      })
    })
  }

  fetchExam(id) {
    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/one/${this.state.examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)

      this.setState({ infoExam: res.data.result })
    })
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      console.log('state: ', res.data.result)

      this.setState({ pertanyaan: res.data.result })
    })
  }

  fetchSoal(examId, userId) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/murid-user/${examId}/${userId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch exam`);

      this.setState({ examSoal: res.data.result })
    })
  }

  componentDidMount() {
    this.fetchExam(this.state.examId);
    this.fetchPertanyaan(this.state.examId);
    this.fetchMengumpulkan(this.state.examId);
  }

  detailMengumpulkan = e => {
    e.preventDefault();
    let answerId = e.target.getAttribute('data-id');
    let tugasId = e.target.getAttribute('data-tugas');
    let userId = e.target.getAttribute('data-user');

    API.get(`${API_SERVER}v2/guru/detail-tugas/${answerId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch detail`);

      this.setState({ openDetail: true, detail: res.data.result, nilaiTugas: res.data.result.score })
    })

  }

  detailMengumpulkanKuis = e => {
    e.preventDefault();
    let answerId = e.target.getAttribute('data-id');
    let examId = e.target.getAttribute('data-tugas');
    let userId = e.target.getAttribute('data-user');
    let nama = e.target.getAttribute('data-nama');

    this.fetchSoal(examId, userId);
    API.get(`${API_SERVER}v2/murid/kuis-ujian/result/${userId}/${examId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch hasil`);

      this.setState({
        openScore: true,
        nama: nama,
        benar: res.data.result.length ? res.data.result[0].total_correct : 0,
        salah: res.data.result.length ? res.data.result[0].total_uncorrect : 0,
        score: res.data.result.length ? res.data.result[0].score : 0,
      })
    })
  }

  setNilaiTugas = e => {
    e.preventDefault();
    let score = this.state.nilaiTugas;
    API.put(`${API_SERVER}v2/guru/detail-tugas/${this.state.detail.answer_id}`, {score}).then(res => {
      if(res.data.error) toast.warning(`Warning: update score`)

      toast.success(`Berasil memberi nilai`)
      this.setState({ nilaiTugas: res.data.result.score })
      this.fetchMengumpulkan(this.state.examId);
    })
  }

  handleDynamicInput = (e, i) => {
    let newObj = [...this.state.pertanyaan];
    if(e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      newObj[i][name] = value;
      this.setState({ pertanyaan: newObj });
    } else {
      newObj[i].penjelasan = e;
      this.setState({ pertanyaan: newObj });
    }
  }

  simpanPenjelasan(e, i) {
    let newObj = [...this.state.pertanyaan];
    let getOne = newObj[i];

    API.put(`${API_SERVER}v1/question/penjelasan/${getOne.id}`, {penjelasan: getOne.penjelasan}).then(res => {
      if(res.data.error) toast.warning(`Warning: update penjelasan`)

      toast.success(`Pembahasan soal nomor ${i+1} berhasil disimpan.`)
      this.fetchPertanyaan(this.state.examId);
    })
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header header-kartu" data-toggle="collapse" data-target={`#collapseInformasi`}>
              Informasi Penugasan
            </div>
            <div className="card-body collapse p-1" id={`collapseInformasi`}>
              <table className="table table-bordered">
                <tr>
                  <td style={{width: '180px'}}>Tugas</td>
                  <td><b>{this.state.infoExam.title}</b></td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td><b>{moment(this.state.infoExam.time_start).format('DD-MM-YYYY')}</b></td>
                </tr>
                <tr>
                  <td>Deadline</td>
                  <td><b>{moment(this.state.infoExam.time_finish).format('DD-MM-YYYY')}</b></td>
                </tr>
                <tr>
                  <td>Pertanyaan</td>
                  <td>
                    {
                      this.state.pertanyaan.map((item,i) => (
                        <div className="form-group">
                          <label>Pertanyaan <b>{i+1}</b></label>
                          <div className="soal" dangerouslySetInnerHTML={{ __html: item.tanya }} />

                          <div className="jawaban mt-3 ml-4">
                            {
                              item.a &&
                              <tr>
                                <td style={{width: '24px'}}>A.</td>
                                <td>{item.a}</td>
                              </tr>
                            }
                            {
                              item.b &&
                              <tr>
                                <td style={{width: '24px'}}>B.</td>
                                <td>{item.b}</td>
                              </tr>
                            }
                            {
                              item.c &&
                              <tr>
                                <td style={{width: '24px'}}>C.</td>
                                <td>{item.c}</td>
                              </tr>
                            }
                            {
                              item.d &&
                              <tr>
                                <td style={{width: '24px'}}>D.</td>
                                <td>{item.d}</td>
                              </tr>
                            }
                            {
                              item.e &&
                              <tr>
                                <td style={{width: '24px'}}>E.</td>
                                <td>{item.e}</td>
                              </tr>
                            }

                          </div>

                          {
                            item.jawaban &&
                              <div className="jawaban mt-3 ml-4">
                                Jawaban : <b>{item.jawaban}</b>
                              </div>
                          }


                        </div>
                      ))
                    }
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header header-kartu">
              Murid yang Sudah Mengumpulkan / Belum Mengumpulkan
            </div>
            <div className="card-body" style={{padding: '5px'}}>
              <table className="table table-bordered">
                <tr>
                  <th>Status</th>
                  <th>Nama</th>
                  <th>Deskripsi</th>
                  <th>Tanggal Submit</th>
                  <th>File</th>
                  <th>Score</th>
                </tr>
                {
                  this.state.mengumpulkan.map((item,i) => (
                    <tr>
                      <td><span className="label label-success">Sudah</span></td>
                      <td>
                        <Link onClick={this.state.tipe === "tugas" ? this.detailMengumpulkan : this.detailMengumpulkanKuis} data-nama={item.nama} data-tugas={item.exam_id} data-user={item.user_id} data-id={item.answer_id} key={i}>
                          {item.nama}
                        </Link>
                      </td>
                      <td>{item.answer_deskripsi}</td>
                      <td>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</td>
                      <td><a href={item.answer_file} target="_blank" className="silabus">Open</a></td>
                      <td>{item.score}</td>
                    </tr>
                  ))
                }

                {
                  this.state.belum.map((item,i) => (
                    <tr>
                      <td><span className="label label-danger">Belum</span></td>
                      <td>{item.nama}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  ))
                }
              </table>

              {
                this.state.mengumpulkan > 0 &&
                <div style={{padding: '12px'}}>
                  <button type="button" className="btn btn-v2 btn-primary btn-block mt-2">
                    <i className="fa fa-download"></i> Unduh Semua
                  </button>
                </div>
              }
            </div>
          </div>
        </div>

        <Modal
          show={this.state.openDetail}
          onHide={() => this.setState({ openDetail: false, detail: {} })}
        >
          <Modal.Body>
            <h4 className="mb-3">{this.state.detail.name}</h4>

            <p style={{marginLef: '160px'}}>{this.state.detail.answer_deskripsi}</p>

            <div className="score-exam text-center">
              <span>Score</span>
              <h1>{this.state.nilaiTugas}</h1>
            </div>

            <a href={this.state.detail.answer_file} target="_blank" className="btn btn-v2 btn-default btn-info">
              <i className="fa fa-download"></i> Download
            </a>

            <div className="form-group mt-4">
              <label>Nilai</label>
              <div class="input-group mb-3">
                <input value={this.state.nilaiTugas} pattern="[0-9]*" onChange={e => this.setState({ nilaiTugas: e.target.value > 100 ? 0 : e.target.value })} type="number" class="form-control" placeholder="0-100" aria-label="0-100" aria-describedby="basic-addon2" />
                <div class="input-group-append">
                  <button onClick={this.setNilaiTugas} class="btn btn-outline-secondary" type="button">Beri Nilai</button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.openScore}
          onHide={() => this.setState({
            openScore: false,
            examSoal: [],
            benar: 0,
            salah: 0,
            score: 0,
            nama: "",
          })}
          dialogClassName="modal-lg"
        >
          <Modal.Body>
            <h4 className="mb-3">{this.state.infoExam.title}</h4>

            <table>
              <tr>
                <td style={{width: '180px'}}>Nama</td>
                <td><b>{this.state.nama}</b></td>
              </tr>
              <tr>
                <td>Benar</td>
                <td><b>{this.state.benar}</b></td>
              </tr>
              <tr>
                <td>Salah</td>
                <td><b>{this.state.salah}</b></td>
              </tr>
            </table>

            <div className="score-exam text-center">
              <span>Score</span>
              <h1>{this.state.score}</h1>
            </div>

            {
              this.state.examSoal.map((item,i) => (
                <div className="mb-2 mt-3">
                  <label>Pertanyaan <b>{i+1}</b></label>
                  <div className="soal" dangerouslySetInnerHTML={{ __html: item.tanya }} />

                  <ul class="list-group mt-2">
                    { item.a && <li class={`list-group-item list-group-item-${item.jawaban === "A" ? 'success': item.myJawaban[0].answer_option === "A" ? 'danger' : ''}`}><b>A.</b> {item.a}</li> }
                    { item.b && <li class={`list-group-item list-group-item-${item.jawaban === "B" ? 'success': item.myJawaban[0].answer_option === "B" ? 'danger' : ''}`}><b>B.</b> {item.b}</li> }
                    { item.c && <li class={`list-group-item list-group-item-${item.jawaban === "C" ? 'success': item.myJawaban[0].answer_option === "C" ? 'danger' : ''}`}><b>C.</b> {item.c}</li> }
                    { item.d && <li class={`list-group-item list-group-item-${item.jawaban === "D" ? 'success': item.myJawaban[0].answer_option === "D" ? 'danger' : ''}`}><b>D.</b> {item.d}</li> }
                    { item.e && <li class={`list-group-item list-group-item-${item.jawaban === "E" ? 'success': item.myJawaban[0].answer_option === "E" ? 'danger' : ''}`}><b>E.</b> {item.e}</li> }
                  </ul>
                </div>
              ))
            }
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default Tugas;
