import React from 'react';

import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import { Link } from 'react-router-dom';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Overview extends React.Component {

  state = {
    jadwalId: this.props.match.params.jadwalId,

    overview: '',
    preview: [],
    kuis: [],

    isModalDetail: false,
    examId: '',
    examTitle: '',
    examSoal: [],

    openTugas: false,
    infoTugas: {},
    pertanyaan: [],
  };

  componentDidMount() {
    this.fetchOverview();
  }

  fetchOverview() {
    API.get(`${API_SERVER}v2/pelajaran/preview/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning("Error fetch murid");

      this.setState({ preview: res.data.result })
    })

    API.get(`${API_SERVER}v2/jadwal-mengajar/${this.state.jadwalId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch overview`)

      this.setState({ overview: res.data.result.deskripsi });
    })

    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/all/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)

      this.setState({ kuis: res.data.result })
    })
  }

  selectTugas(item) {
    this.setState({ openTugas: true, infoTugas: item });
    this.fetchPertanyaan(item.exam_id);
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      this.setState({ pertanyaan: res.data.result})
    })
  }

  selectKuis(exam) {
    this.setState({ openTugas: true, infoTugas: exam });
    this.fetchPertanyaan(exam.exam_id);
  }

  selectUjian(exam) {
    this.setState({ openTugas: true, infoTugas: exam });
    this.fetchPertanyaan(exam.id);
  }

  render() {
    console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4 className="f-w-900 f-18 fc-blue">Preview</h4>

              <div class="container py-2">

                <div class="row">
                    <div class="col-auto text-center flex-column d-none d-sm-flex">
                        <div class="row h-50">
                            <div class="col">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                        </div>
                        <h5 class="m-2">
                            <span class="badge badge-pill bg-light border">&nbsp;</span>
                        </h5>
                        <div class="row h-50">
                            <div class="col border-right">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                        </div>
                    </div>
                    <div class="col py-2">
                        <div class="card">
                            <div class="card-body">
                                <h4 data-target="#tOverview" data-toggle="collapse" style={{marginBottom: '8px'}} class="card-title">Overview Pelajaran</h4>
                                <div class="collapse" id={`tOverview`}>
                                    <div style={{padding: '12px'}} dangerouslySetInnerHTML={{ __html: this.state.overview }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                  this.state.preview.map((item, i) => {

                      return (
                        <div class="row">
                            <div class="col-auto text-center flex-column d-none d-sm-flex">
                                <div class="row h-50">
                                    <div class="col border-right">&nbsp;</div>
                                    <div class="col">&nbsp;</div>
                                </div>
                                <h5 class="m-2">
                                    <span class="badge badge-pill bg-light border">&nbsp;</span>
                                </h5>
                                <div class="row h-50">
                                    <div class="col border-right">&nbsp;</div>
                                    <div class="col">&nbsp;</div>
                                </div>
                            </div>
                            <div class="col py-2">
                                <div class="card border-success shadow">
                                    <div class="card-body">
                                        <div class="float-right text-muted f-12">{moment(item.start_date).format('DD/MM/YYYY HH:mm')}</div>
                                        <h4 data-target={`#t${i}`} data-toggle="collapse" style={{marginBottom: '8px'}} class="card-title">{item.chapter_title ? item.chapter_title : item.exam_title}</h4>
                                        <div class="collapse" id={`t${i}`}>
                                          <div dangerouslySetInnerHTML={{ __html: item.chapter_body }} />

                                          {
                                            item.hasOwnProperty('attachment_id') && item.attachment_id !== null &&
                                            <ul className="list-group f-12">
                                              {
                                                item.hasOwnProperty('attachment_id') && item.attachment_id.split(',').map(item => (
                                                  <li className="list-group-item">
                                                  <a href={item} target="_blank">{item}</a>
                                                  </li>
                                                ))
                                              }
                                            </ul>
                                          }

                                          {
                                            (item.hasOwnProperty('tugas') && item.tugas.length > 0) && item.tugas.map(row => (
                                              <button onClick={() => this.selectTugas(row)} className="mt-2 btn btn-v2 btn-info mr-2">
                                                <i className="fa fa-share"></i> {row.exam_title}
                                              </button>
                                            ))
                                          }

                                          {
                                            item.hasOwnProperty('exam_id') &&
                                            <button onClick={() => this.selectKuis(item)} className="btn btn-v2 btn-info">
                                              <i className="fa fa-share"></i> Detail
                                            </button>
                                          }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      )
                  })
                }

                {
                  this.state.kuis.map((item,i) => (
                    <div class="row">
                      <div class="col-auto text-center flex-column d-none d-sm-flex">
                        <div class="row h-50">
                          <div class="col border-right">&nbsp;</div>
                          <div class="col">&nbsp;</div>
                        </div>
                        <h5 class="m-2">
                          <span class="badge badge-pill bg-light border">&nbsp;</span>
                        </h5>
                        <div class="row h-50">
                          <div class="col">&nbsp;</div>
                          <div class="col">&nbsp;</div>
                        </div>
                      </div>
                      <div class="col py-2">
                        <div class="card">
                          <div class="card-body">
                            <div class="float-right text-muted f-12">{moment(item.time_start).format('DD/MM/YYYY HH:mm')}</div>
                            <h4 class="card-title" data-target={`#tU${i}`} data-toggle="collapse">{item.title}</h4>
                            <div className="collapse" id={`tU${i}`}>
                              <button onClick={() => this.selectUjian(item)} className="btn btn-v2 btn-info">
                                <i className="fa fa-share"></i> Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }

              </div>

              <Modal
                show={this.state.openTugas}
                onHide={() => this.setState({ openTugas: false, infoTugas: {}, pertanyaan: [] })}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                    {this.state.infoTugas.exam_title ? this.state.infoTugas.exam_title : this.state.infoTugas.title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                  this.state.pertanyaan.map((item,i) => (
                    <div className="form-group">
                      <label>Pertanyaan <b>{i+1}</b></label>
                      <textarea name="tanya" className="form-control mb-3" rows="3" value={item.tanya} />

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
                  ))
                }
                </Modal.Body>
              </Modal>


            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Overview;
