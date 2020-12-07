import React from 'react';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom'

class Ujian extends React.Component {

  state = {
    tipe: this.props.tipe,
    examId: this.props.match.params.examId,

    infoExam: {},
    examSoal: [],

    openScore: false,
    benar: 0,
    salah: 0,
    score: 0,

    isSubmit: false,
    openConfirm: false,
  }

  clearScore() {
    this.setState({
      openScore: false,
      benar: 0,
      salah: 0,
      score: 0
    })
  }

  fetchExam(id) {
    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/one/${id}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch exam`);

      this.setState({ infoExam: res.data.result })
    })
  }

  fetchSoal(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/murid-user/${id}/${Storage.get('user').data.user_id}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch exam`);

      this.setState({ examSoal: res.data.result })
    })
  }

  fetchSubmit() {
    API.get(`${API_SERVER}v2/murid/kuis-ujian/result/${Storage.get('user').data.user_id}/${this.state.examId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch hasil`);

      this.setState({
        isSubmit: res.data.result.length ? true : false,
        benar: res.data.result.length ? res.data.result[0].total_correct : 0,
        salah: res.data.result.length ? res.data.result[0].total_uncorrect : 0,
        score: res.data.result.length ? res.data.result[0].score : 0,
      })
    })
  }

  componentDidMount() {
    this.fetchSubmit()
    this.fetchExam(this.state.examId)
    this.fetchSoal(this.state.examId)
  }

  selectJawaban = (e, i) => {
    if(this.state.isSubmit) {
      toast.info(`Jawaban sudah tidak bisa diubah`)
    } else {
      let copy = [...this.state.examSoal];
      copy[i].jawaban = e.target.value;

      let form = {
        questionId: copy[i].id,
        userId: Storage.get('user').data.user_id,
        jawaban: e.target.value
      };
      // console.log('state: ', form);
      API.post(`${API_SERVER}v2/murid/kuis-ujian/jawab`, form).then(res => {
        if(res.data.error) toast.warning(`Warning: jawab pertanyaan`)

        this.setState({ examSoal: copy })
      })
    }
  }

  saveJawaban() {
    let form = {
      userId: Storage.get('user').data.user_id,
      examId: this.state.examId,
    }

    API.post(`${API_SERVER}v2/murid/kuis-ujian/submit`, form).then(res => {
      if(res.data.error) toast.warning(`Warning: submit jawaban`);

      this.setState({
        openScore: true,
        openConfirm: false,
        benar: res.data.result.benar,
        salah: res.data.result.salah,
        score: res.data.result.score
      })

      window.location.reload();
    })
  }

  lihatHasil = e => {
    e.preventDefault()
    this.setState({ openScore: true, })
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-body" style={{ padding: '12px' }}>

              <h4 className="mb-3">{this.state.infoExam.title}</h4>

              {
                this.state.examSoal.map((item,i) => (
                  <div className="mb-2 border p-3">
                    <p><b>{i+1}.</b> &nbsp; {item.tanya}</p>

                    {
                      this.state.isSubmit &&
                      <ul class="list-group">
                        { item.a && <li class={`list-group-item list-group-item-${item.jawaban === "A" ? 'success': item.myJawaban[0].answer_option === "A" ? 'danger' : ''}`}><b>A.</b> {item.a}</li> }
                        { item.b && <li class={`list-group-item list-group-item-${item.jawaban === "B" ? 'success': item.myJawaban[0].answer_option === "B" ? 'danger' : ''}`}><b>B.</b> {item.b}</li> }
                        { item.c && <li class={`list-group-item list-group-item-${item.jawaban === "C" ? 'success': item.myJawaban[0].answer_option === "C" ? 'danger' : ''}`}><b>C.</b> {item.c}</li> }
                        { item.d && <li class={`list-group-item list-group-item-${item.jawaban === "D" ? 'success': item.myJawaban[0].answer_option === "D" ? 'danger' : ''}`}><b>D.</b> {item.d}</li> }
                        { item.e && <li class={`list-group-item list-group-item-${item.jawaban === "E" ? 'success': item.myJawaban[0].answer_option === "E" ? 'danger' : ''}`}><b>E.</b> {item.e}</li> }
                      </ul>
                    }

                    {
                      !this.state.isSubmit && item.a &&
                      <tr>
                        <td><input type="radio" value="A" name={`opsi${i}`} onChange={e => this.selectJawaban(e, i)} /></td>
                        <td style={{width: '24px'}}>A.</td>
                        <td>{item.a}</td>
                      </tr>
                    }
                    {
                      !this.state.isSubmit && item.b &&
                      <tr>
                        <td><input type="radio" value="B" name={`opsi${i}`} onChange={e => this.selectJawaban(e, i)} /></td>
                        <td style={{width: '24px'}}>B.</td>
                        <td>{item.b}</td>
                      </tr>
                    }
                    {
                      !this.state.isSubmit && item.c &&
                      <tr>
                      <td><input type="radio" value="C" name={`opsi${i}`} onChange={e => this.selectJawaban(e, i)} /></td>
                        <td style={{width: '24px'}}>C.</td>
                        <td>{item.c}</td>
                      </tr>
                    }
                    {
                      !this.state.isSubmit && item.d &&
                      <tr>
                      <td><input type="radio" value="D" name={`opsi${i}`} onChange={e => this.selectJawaban(e, i)} /></td>
                        <td style={{width: '24px'}}>D.</td>
                        <td>{item.d}</td>
                      </tr>
                    }
                    {
                      !this.state.isSubmit && item.e &&
                      <tr>
                      <td><input type="radio" value="E" name={`opsi${i}`} onChange={e => this.selectJawaban(e, i)} /></td>
                        <td style={{width: '24px'}}>E.</td>
                        <td>{item.e}</td>
                      </tr>
                    }
                  </div>
                ))
              }

              {
                !this.state.isSubmit &&
                <button onClick={e => this.setState({ openConfirm: true })} className="btn btn-v2 btn-primary mt-3">Submit</button>
              }

              {
                this.state.isSubmit &&
                <button onClick={this.lihatHasil} className="btn btn-v2 btn-primary mt-3">Lihat Hasil</button>
              }

            </div>
          </div>
        </div>

        <Modal
          show={this.state.openScore}
          onHide={() => this.setState({ openScore: false })}
        >
          <Modal.Body>
            <h4 className="mb-3">Hasil</h4>

            <tr>
              <td style={{width: '80px'}}>Benar</td>
              <td><b>{this.state.benar}</b></td>
            </tr>
            <tr>
              <td style={{width: '80px'}}>Salah</td>
              <td><b>{this.state.salah}</b></td>
            </tr>
            <tr>
              <td style={{width: '80px'}}>Score</td>
              <td><b>{this.state.score}</b></td>
            </tr>

          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.openConfirm}
          onHide={() => this.setState({ openConfirm: false })}
        >
          <Modal.Body>
            <h4>Perhatian</h4>
            <p>Mohon dicek kembali. Apakah Kamu yakin telah mengerjakan semua dan akan mengumpulkannya ?</p>

            <Link onClick={() => this.saveJawaban()} className="btn btn-v2 btn-primary mr-2">Yakin</Link>
            <Link onClick={() => this.setState({ openConfirm: false })} className="btn btn-v2 btn-default">Tidak</Link>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default Ujian;
