import React from 'react';

import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import { Modal, OverlayTrigger, Tooltip, Tabs, Tab, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import SocketContext from '../../socket';

// Core viewer
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

class Overview extends React.Component {

  state = {
    jadwalId: this.props.match.params.id,

    overview: '',
    preview: [],
    kuis: [],

    openTugas: false,
    infoTugas: {},
    pertanyaan: [],

    loading: true
  };

  componentDidMount() {
    this.fetchOverview()
    this.fetchSilabus();
  }

  fetchSilabus() {
    API.get(`${API_SERVER}v2/silabus/jadwal/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal one`)
      this.setState({ preview: res.data.result, loading: false });
    })
  }

  // fetchOverview() {
  //   API.get(`${API_SERVER}v2/pelajaran/preview/${this.state.jadwalId}`).then(res => {
  //     if(res.data.error) toast.warning("Error fetch murid");
  //
  //     this.setState({ preview: res.data.result })
  //   })
  //
  //   API.get(`${API_SERVER}v2/jadwal-mengajar/${this.state.jadwalId}`).then(res => {
  //     if(res.data.error) console.log(`Error: fetch overview`)
  //
  //     this.setState({ overview: res.data.result.deskripsi });
  //   })
  //
  //   API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/all/${this.state.jadwalId}`).then(res => {
  //     if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)
  //
  //     this.setState({ kuis: res.data.result })
  //   })
  // }

  fetchOverview() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/${this.state.jadwalId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch overview`)

      this.setState({ overview: res.data.result.deskripsi });
    })
  }

  selectTugas(item) {
    this.setState({ openTugas: true, infoTugas: item });
    this.fetchPertanyaan(item.exam_id);
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      console.log('state: ', res.data.result)

      this.setState({ pertanyaan: res.data.result, fileExcel: Math.random().toString(36) })
    })
  }

  render() {
    console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4 className="f-w-900 f-18 fc-blue">Preview</h4>

              <div class="container py-2" style={{marginLeft: '24px'}}>

                <div class="row">
                    <div class="col-auto text-center flex-column d-none d-sm-flex">
                        <div class="row h-50">
                            <div class="col">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                        </div>
                        <h5 class="m-2">
                            <span class="badge badge-pill bg-success border">&nbsp;</span>
                        </h5>
                        <div class="row h-50">
                            <div class="col border-right">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                        </div>
                    </div>
                    <div class="col py-2">
                        <div class="card shadow">
                            <div class="card-body timeline-active">
                                <h4 data-target="#tOverview" data-toggle="collapse" style={{marginBottom: '8px'}} class="card-title collapsed"> <i className="fa fa-binoculars mr-3"></i> Overview Pelajaran</h4>
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
                                  <span className={`badge badge-pill bg-${item.hasOwnProperty('exam_id') ? (moment(item.start_date) < moment(new Date()) ? 'success' : 'light') : (moment(item.start_date) < moment(new Date()) ? 'success' : 'light')} border`}>&nbsp;</span>
                                </h5>
                                <div class="row h-50">
                                  <div class={`col ${i == (this.state.preview.length-1) ? '' : 'border-right'}`}>&nbsp;</div>
                                  <div class="col">&nbsp;</div>
                                </div>
                            </div>
                            <div class="col py-2">
                                <div class={`card shadow ${item.hasOwnProperty('exam_id') ? (moment(item.start_date) < moment(new Date()) ? 'timeline-active' : '') : (moment(item.start_date) < moment(new Date()) ? 'timeline-active' : '')} shadow`}>
                                    <div class="card-body">
                                        <div class="float-right text-muted f-12">
                                          {item.hasOwnProperty('exam_id') ? moment(item.start_date).format('DD/MM/YYYY HH:mm') : moment(item.start_date).format('DD/MM/YYYY HH:mm')}
                                        </div>
                                        {
                                          item.jenis == 0 ?
                                            <OverlayTrigger
                                              placement="top"
                                              delay={{ show: 250, hide: 400 }}
                                              overlay={<Tooltip>{item.chapter_title && item.start_date ? item.chapter_title : 'Materi dan tanggal belum diatur. Silahkan upload materi dan pilih tanggalnya di Tab Sesi.'}</Tooltip>}
                                            >
                                              <h4 data-target={`#t${i}`} data-toggle="collapse" className="card-title collapsed">
                                                {
                                                  [1,2].includes(item.jenis) ? <i className="fa fa-paste mr-3"></i> : <i className="fa fa-book-open mr-3"></i>
                                                }
                                                {item.chapter_title ? item.chapter_title : item.jenis == 1 ? 'Kuis' : item.jenis == 2 ? 'Ujian' : 'Materi'}
                                              </h4>
                                            </OverlayTrigger>
                                          : null
                                        }

                                        {
                                          item.jenis == 1 ?
                                            <OverlayTrigger
                                              placement="top"
                                              delay={{ show: 250, hide: 400 }}
                                              overlay={<Tooltip>{item.chapter_title && item.start_date ? item.chapter_title : 'Silahkan pilih kuis yang akan dikerjakan oleh murid pada tab Sesi.'}</Tooltip>}
                                            >
                                              <h4 data-target={`#t${i}`} data-toggle="collapse" className="card-title collapsed">
                                                {
                                                  [1,2].includes(item.jenis) ? <i className="fa fa-paste mr-3"></i> : <i className="fa fa-book-open mr-3"></i>
                                                }
                                                {item.chapter_title ? item.chapter_title : item.jenis == 1 ? 'Kuis' : item.jenis == 2 ? 'Ujian' : 'Materi'}
                                              </h4>
                                            </OverlayTrigger>
                                          : null
                                        }

                                        {
                                          item.jenis == 2 ?
                                            <OverlayTrigger
                                              placement="top"
                                              delay={{ show: 250, hide: 400 }}
                                              overlay={<Tooltip>{item.chapter_title && item.start_date ? item.chapter_title : 'Silahkan pilih ujian yang akan dikerjakan oleh murid pada tab Sesi.'}</Tooltip>}
                                            >
                                              <h4 data-target={`#t${i}`} data-toggle="collapse" className="card-title collapsed">
                                                {
                                                  [1,2].includes(item.jenis) ? <i className="fa fa-paste mr-3"></i> : <i className="fa fa-book-open mr-3"></i>
                                                }
                                                {item.chapter_title ? item.chapter_title : item.jenis == 1 ? 'Kuis' : item.jenis == 2 ? 'Ujian' : 'Materi'}
                                              </h4>
                                            </OverlayTrigger>
                                          : null
                                        }

                                        {
                                          item.topik &&
                                          <span>Topik : {item.topik}</span>
                                        }
                                        <div class="collapse mt-4" id={`t${i}`}>
                                          <div className="mb-3" dangerouslySetInnerHTML={{ __html: item.chapter_body }} />

                                          {
                                            (item.hasOwnProperty('tugas') && item.tugas.length > 0) && item.tugas.map(row => (
                                              <button disabled={moment(item.start_date) > moment(new Date())} onClick={() => this.selectTugas(row)} className="btn btn-v2 btn-info mr-2">
                                                <i className="fa fa-tasks"></i> Lihat {row.exam_title}
                                              </button>
                                            ))
                                          }

                                          {
                                            (item.hasOwnProperty('kuis') && item.kuis.length > 0) && item.kuis.map(row => (
                                              <button disabled={moment(item.start_date) > moment(new Date())} onClick={() => this.selectTugas(row)} className="btn btn-v2 btn-warning mr-2">
                                                <i className="fa fa-tasks"></i> Lihat {row.exam_title}
                                              </button>
                                            ))
                                          }

                                          {
                                            (item.hasOwnProperty('ujian') && item.ujian.length > 0) && item.ujian.map(row => (
                                              <button disabled={moment(item.start_date) > moment(new Date())} onClick={() => this.selectTugas(row)} className="btn btn-v2 btn-danger mr-2">
                                                <i className="fa fa-tasks"></i> Lihat {row.exam_title}
                                              </button>
                                            ))
                                          }

                                          {
                                            item.hasOwnProperty('chapter_id') && moment(item.start_date) < moment(new Date()) ?
                                            <a target='_blank' href={`/ruangan/mengajar/${this.state.jadwalId}/materi/${item.chapter_id}`} className="btn btn-v2 btn-success mr-2">
                                              <i className="fa fa-video"></i> Open
                                            </a>
                                            :
                                            null
                                          }

                                          {
                                            item.hasOwnProperty('exam_id') && moment(item.start_date) < moment(new Date()) ?
                                            <>
                                            <Link to={`/guru/detail-kuis/${this.state.jadwalId}/${item.exam_id}`} className="btn btn-v2 btn-info mr-2">
                                              <i className="fa fa-tasks"></i> Detail
                                            </Link>
                                            <a target='_blank' href={`/ruangan/mengajar/${this.state.jadwalId}/kuis/${item.exam_id}`} className="btn btn-v2 btn-success mr-2">
                                              <i className="fa fa-video"></i> Open
                                            </a>
                                            </>
                                            :
                                            null
                                          }
                                          {
                                            moment(item.start_date) > moment(new Date()) &&
                                            <h6 style={{color:'#F00', margin:5}}>The schedule hasn't started yet</h6>
                                          }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      )
                  })
                }

              </div>

              <Modal
                show={this.state.openTugas}
                onHide={() => this.setState({ openTugas: false, infoTugas: {}, pertanyaan: [] })}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                    {this.state.infoTugas.exam_title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Link to={`/guru/detail-${this.state.infoTugas.quiz == '0' ? 'ujian' : this.state.infoTugas.quiz == '1' ? 'kuis' : 'tugas'}/${this.state.jadwalId}/${this.state.infoTugas.exam_id}`} className="btn btn-v2 btn-primary mb-3">Lihat Detail</Link>
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
