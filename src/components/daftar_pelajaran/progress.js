import React, { Component } from "react";
import Storage from '../../repository/storage';

import { Link } from 'react-router-dom'

import { Row, Card, Modal, Form, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'

class GuruUjian extends Component {
  state = {
    userId: '',
    pelajaran: [],

    loading: true,
    silabus: []
  }

  componentDidMount() {
    let role = Storage.get('user').data.grup_name.toLowerCase();
    if(role == 'murid') {
      this.fetchPelajaran(Storage.get('user').data.user_id)
    }
    else {
      this.fetchMuridKu(Storage.get('user').data.user_id)
    }
  }

  fetchMuridKu(userId) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}`).then(res => {
      this.fetchPelajaran(res.data.result.user_id_murid)
    })
  }

  fetchPelajaran(userId) {
    API.get(`${API_SERVER}v2/jadwal-murid/${userId}?mapelOnly=true`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal murid`)

      this.setState({ pelajaran: res.data.result })
      if(res.data.result.length) {
        this.fetchSilabus(res.data.result[0].jadwal_id , userId)
      }
      else {
        toast.info(`Belum ada jadwal.`)
      }
    })
  }

  fetchSilabus(jadwalId, userId) {
    API.get(`${API_SERVER}v2/silabus/jadwal/${jadwalId}?userId=${userId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal one`)
      this.setState({ silabus: res.data.result, loading: false, });
    })
  }

  filterKegiatan = e => {
    let { value } = e.target;
    this.fetchSilabus(value);
  }

  filterClear = e => {
    console.log('filterClear')
  }

  render() {

    const { pelajaran, silabus } = this.state;

    console.log('state: ', this.state);

    return (
      <div class="col-sm-12 mt-2">
        <Card>
          <Card.Body>
            <h4 className="f-w-900 f-18 fc-blue">Progress</h4>

            <select style={{padding: '2px'}} onChange={this.filterKegiatan}>
              {
                pelajaran.map((item,i) => (
                  <option value={item.jadwal_id}>{item.mapel}</option>
                ))
              }
            </select>
            <button class="ml-2" onClick={this.filterClear}>clear</button>

            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Sesi</th>
                  <th>Kegiatan</th>
                  <th>Topik</th>
                  <th>Judul</th>
                  <th>Plan Date</th>
                  <th>Actual Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  silabus.map((item,i) => (
                    <>
                      <tr data-toggle='collapse' data-target={`#col${i}`}>
                        <td>{item.sesi}</td>
                        <td>{item.jenis == '0' ? 'Materi' : item.jenis == '1' ? 'Kuis' : 'Ujian'}</td>
                        <td>{item.topik}</td>
                        <td>{item.chapter_title}</td>
                        <td>{moment(item.start_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{item.absen_jam ? moment(item.absen_jam).format('DD/MM/YYYY HH:mm') : '-'}</td>
                        <td>-</td>
                      </tr>
                      <tr className='collapse' id={`col${i}`}>
                        <td colSpan='7'>
                          <section className="container-fluid">
                            {
                              item.tugas.length ?
                                <>
                                  <h5>Tugas</h5>
                                  <Row>
                                  {
                                    item.tugas.map((tugas, i) => (
                                      <Card className="col-sm-4">
                                        <Card.Body>
                                          <Card.Title>{tugas.exam_title}</Card.Title>
                                          <Card.Subtitle className="mb-2 text-muted">Tugas {`#${tugas.exam_id}`}</Card.Subtitle>
                                          <Card.Text className="float-right" style={{fontSize: '54px'}}>{tugas.score}</Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                          <ListGroupItem>Deadline <p className="float-right" style={{marginBottom: '0px'}}>{moment(tugas.time_finish).format('DD/MM/YYYY HH:mm')}</p></ListGroupItem>
                                          <ListGroupItem>Submit <p className="float-right" style={{marginBottom: '0px'}}>{tugas.submit_at ? moment(tugas.submit_at).format('DD/MM/YYYY HH:mm') : '-'}</p></ListGroupItem>
                                        </ListGroup>
                                      </Card>

                                    ))
                                  }
                                  </Row>
                                </>
                              : null
                            }


                            {
                              item.kuis.length ?
                              <>
                                <h5>Kuis</h5>
                                <Row>
                                  {
                                    item.kuis.map((tugas, i) => (
                                      <Card className="col-sm-4">
                                        <Card.Body>
                                          <Card.Title>{tugas.exam_title}</Card.Title>
                                          <Card.Subtitle className="mb-2 text-muted">Kuis {`#${tugas.exam_id}`}</Card.Subtitle>
                                          <Card.Text className="float-right" style={{fontSize: '54px'}}>{tugas.score}</Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                          <ListGroupItem>Deadline <p className="float-right" style={{marginBottom: '0px'}}>{moment(tugas.time_finish).format('DD/MM/YYYY HH:mm')}</p></ListGroupItem>
                                          <ListGroupItem>Correct <p className="float-right" style={{marginBottom: '0px'}}>{tugas.total_correct ? tugas.total_correct : '-'}</p></ListGroupItem>
                                          <ListGroupItem>Wrong <p className="float-right" style={{marginBottom: '0px'}}>{tugas.total_uncorrect ? tugas.total_uncorrect : '-'}</p></ListGroupItem>
                                          <ListGroupItem>Submit <p className="float-right" style={{marginBottom: '0px'}}>{tugas.submit_at ? moment(tugas.submit_at).format('DD/MM/YYYY HH:mm') : '-'}</p></ListGroupItem>
                                        </ListGroup>
                                      </Card>

                                    ))
                                  }
                                </Row>
                              </> : null
                            }

                            {
                              item.ujian.length ?
                              <>
                                <h5>Ujian</h5>
                                <Row>
                                  {
                                    item.ujian.map((tugas, i) => (
                                      <Card className="col-sm-4">
                                        <Card.Body>
                                          <Card.Title>{tugas.exam_title}</Card.Title>
                                          <Card.Subtitle className="mb-2 text-muted">Ujian {`#${tugas.exam_id}`}</Card.Subtitle>
                                          <Card.Text className="float-right" style={{fontSize: '54px'}}>{tugas.score}</Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                          <ListGroupItem>Deadline <p className="float-right" style={{marginBottom: '0px'}}>{moment(tugas.time_finish).format('DD/MM/YYYY HH:mm')}</p></ListGroupItem>
                                          <ListGroupItem>Correct <p className="float-right" style={{marginBottom: '0px'}}>{tugas.total_correct ? tugas.total_correct : '-'}</p></ListGroupItem>
                                          <ListGroupItem>Wrong <p className="float-right" style={{marginBottom: '0px'}}>{tugas.total_uncorrect ? tugas.total_uncorrect : '-'}</p></ListGroupItem>
                                          <ListGroupItem>Submit <p className="float-right" style={{marginBottom: '0px'}}>{tugas.submit_at ? moment(tugas.submit_at).format('DD/MM/YYYY HH:mm') : '-'}</p></ListGroupItem>
                                        </ListGroup>
                                      </Card>

                                    ))
                                  }
                                </Row>
                              </> : null
                            }

                          </section>
                        </td>
                      </tr>
                    </>
                  ))
                }
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default GuruUjian;
