import React from 'react';
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Tugas extends React.Component {

  state = {
    tipe: this.props.tipe,
    pelajaranId: this.props.match.params.id,

    kuis: [],

    examId: '',
    title: '',
    quizAt: '',
    tanggalMulai: new Date(),
    tanggalAkhir: new Date(),

    chapters: [],


  };

  clearForm() {
    this.setState({
      examId: '',
      title: '',
      quizAt: '',
      tanggalMulai: new Date(),
      tanggalAkhir: new Date(),
    })
  }

  selectKuis = e => {
    e.preventDefault();
    let examId = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/one/${examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)

      this.setState({
        examId: examId,
        title: res.data.result.title,
        quizAt: res.data.result.quiz_at,
        tanggalMulai: moment(res.data.result.time_start).format('YYYY-MM-DD'),
        tanggalAkhir: moment(res.data.result.time_finish).format('YYYY-MM-DD'),
      })
    })
  }

  componentDidMount() {
    this.fetchKuis();
    this.fetchChapters();
  }

  fetchChapters() {
    API.get(`${API_SERVER}v2/pelajaran/chapter/all/${this.state.pelajaranId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch chapters`)

      this.setState({ chapters: res.data.result })
    })
  }

  fetchKuis() {
    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/all/${this.state.pelajaranId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)

      this.setState({ kuis: res.data.result })
    })
  }

  saveKuis = e => {
    e.preventDefault();
    let form = {
      companyId: Storage.get('user').data.company_id,
      pelajaranId: this.state.pelajaranId,

      title: this.state.title,
      quizAt: this.state.quizAt,
      tanggalMulai: this.state.tanggalMulai,
      tanggalAkhir: this.state.tanggalAkhir
    }

    API.post(`${API_SERVER}v2/pelajaran/${this.state.tipe}/create`, form).then(res => {
      if(res.data.error) toast.warning(`Error: create ${this.state.tipe}`)

      this.fetchKuis();
      this.clearForm();
    })
  }

  deleteKuis = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/pelajaran/${this.state.tipe}/delete/${this.state.examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: delete ${this.state.tipe}`)

      this.fetchKuis();
      this.clearForm();
    })
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div className="row mt-3">
        <div className="col-sm-4">
          <div className="card">
            <div className="card-header header-kartu">
              Semua {this.state.tipe}
            </div>
            <div className="card-body" style={{padding: '5px'}}>
              <div className="list-group list-group-flush">
                {
                  this.state.kuis.map((item, i) => (
                    <Link onClick={this.selectKuis} data-id={item.id} key={i} className="list-group-item list-group-item-action">
                      {item.title}
                    </Link>
                  ))
                }
              </div>

              <div style={{padding: '12px'}}>
                <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary btn-block mt-2">
                  <i className="fa fa-plus"></i> Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-8">
          <div className="row">

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  1. Informasi {this.state.tipe}
                </div>
                <div className="card-body">
                  <form>
                    <div className="form-group">
                      <label>Nama {this.state.tipe}</label>
                      <input className="form-control" type="text" value={this.state.title} name="title" onChange={e => this.setState({ [e.target.name]: e.target.value })} required placeholder="Enter" />
                    </div>
                    <div className="form-group">
                      <label>{this.state.tipe.charAt(0).toUpperCase() + this.state.tipe.slice(1)} akan dilaksanakan setelah</label>
                      <select value={this.state.quizAt} onChange={e => this.setState({ [e.target.name]: e.target.value })} name="quizAt" className="form-control col-sm-6">
                        <option value="" disabled selected>Pilih</option>
                        {
                          this.state.chapters.map(item => (
                            <option value={item.id}>{item.title}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label>Tanggal Mulai</label>
                        <input className="form-control" type="date" value={this.state.tanggalMulai} name="tanggalMulai" onChange={e => this.setState({ [e.target.name]: e.target.value })} required placeholder="Enter" />
                      </div>
                      <div className="col-sm-4">
                        <label>Tanggal Akhir</label>
                        <input className="form-control" type="date" value={this.state.tanggalAkhir} name="tanggalAkhir" onChange={e => this.setState({ [e.target.name]: e.target.value })} required placeholder="Enter" />
                      </div>
                    </div>

                    <div className="form-group mt-4">
                      <button onClick={this.saveKuis} type="button" className="btn btn-v2 btn-success">
                        <i className="fa fa-save"></i> Simpan
                      </button>
                      {
                        this.state.examId &&
                        <button onClick={this.deleteKuis} type="button" className="btn btn-v2 btn-danger float-right">
                          <i className="fa fa-trash"></i> Hapus
                        </button>
                      }
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  2. Import Pertanyaan
                </div>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  3. Semua Pertanyaan
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default Tugas;
