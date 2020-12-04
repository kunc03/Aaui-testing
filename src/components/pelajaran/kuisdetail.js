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
    jadwalId: this.props.match.params.id,
    examId: this.props.match.params.examId,
    infoExam: {},

    pertanyaan: [],

    mengumpulkan: [],
    belum: [],
  };

  fetchMengumpulkan(id) {
    API.get(`${API_SERVER}v2/guru/mengumpulkan-tugas/${this.state.jadwalId}/${id}`).then(res => {
      if(res.data.error) toast.warning(`Warning: fetch mengumpulkan tugas`)

      this.setState({ mengumpulkan: res.data.result.sudahMengumpulkan, belum: res.data.result.belumMengumpulkan })
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

  componentDidMount() {
    this.fetchExam(this.state.examId);
    this.fetchPertanyaan(this.state.examId);
    this.fetchMengumpulkan(this.state.examId);
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div className="row mt-3">

        <div className="col-sm-8">
          <div className="row">

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  Informasi
                </div>
                <div className="card-body">
                  <table className="table">
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
                  </table>
                </div>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  Semua Pertanyaan
                </div>
                <div className="card-body">
                  {
                    this.state.pertanyaan.map((item,i) => (
                      <div className="form-group">
                        <label>Pertanyaan <b>{i+1}</b></label>
                        <textarea name="tanya" className="form-control" rows="4" value={item.tanya} />

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
                              <div className="form-group">
                                <label>Jawaban</label>
                                <select name="jawaban" value={item.jawaban} className="form-control col-sm-3">
                                  <option value="" disabled selected>Pilih</option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="E">E</option>
                                </select>
                              </div>
                            </div>
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="col-sm-4">
          <div className="row">

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  Mengumpulkan
                </div>
                <div className="card-body" style={{padding: '5px'}}>
                  <div className="list-group list-group-flush">
                    {
                      this.state.mengumpulkan.map((item, i) => {
                          return (
                            <Link onClick={this.selectKuis} data-id={item.id} key={i} className="list-group-item list-group-item-action">
                              {item.nama}
                            </Link>
                          )
                      })
                    }
                  </div>

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

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header header-kartu">
                  Belum Mengumpulkan
                </div>
                <div className="card-body" style={{padding: '5px'}}>
                  <div className="list-group list-group-flush">
                    {
                      this.state.belum.map((item, i) => {
                          return (
                            <Link onClick={this.selectKuis} data-id={item.id} key={i} className="list-group-item list-group-item-action">
                              {item.nama}
                            </Link>
                          )
                      })
                    }
                  </div>
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
