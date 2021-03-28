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
    silabus: [],

    tahunAjaran: '',
    listTahunAjaran: []
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

    let role = Storage.get('user').data.grup_name.toLowerCase();
    if(role == 'murid') {
      this.setState({ userId: Storage.get('user').data.user_id })
      this.fetchPelajaran(Storage.get('user').data.user_id, tahunAjaran)
    }
    else {
      this.fetchMuridKu(Storage.get('user').data.user_id, tahunAjaran)
    }
  }

  fetchMuridKu(userId, tahunAjaran) {
    API.get(`${API_SERVER}v2/parents/my-murid/${userId}`).then(res => {
      this.setState({ userId: res.data.result.user_id_murid })
      this.fetchPelajaran(res.data.result.user_id_murid, tahunAjaran)
    })
  }

  fetchPelajaran(userId, tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-murid/${userId}?mapelOnly=true&tahunAjaran=${tahunAjaran}`).then(res => {
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
    this.fetchSilabus(value, this.state.userId);
  }

  filterClear = e => {
    console.log('filterClear')
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value, pelajaran: [] })
    let role = Storage.get('user').data.grup_name.toLowerCase();
    
    if(role == 'murid') {
      this.fetchPelajaran(Storage.get('user').data.user_id, value)
    }
    else {
      this.fetchMuridKu(Storage.get('user').data.user_id, value)
    }
  }

  render() {

    const { pelajaran, silabus } = this.state;

    console.log('state: ', this.state);

    return (
      <div class="col-sm-12 mt-2">
        <Card>
          <Card.Body>
            <h4 className="f-w-900 f-18 fc-blue mb-3">Progress</h4>

            <select style={{padding: '2px'}} className="mr-2" onChange={this.selectTahunAjaran} value={this.state.tahunAjaran} >
              <option value="" selected disabled>Select</option>
              {
                this.state.listTahunAjaran.map(item => (
                  <option value={item}>{item}</option>
                ))
              }
            </select>

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
                  <th></th>
                  <th>Sesi</th>
                  <th>Kegiatan</th>
                  <th>Topik</th>
                  <th>Judul</th>
                  <th>Kehadiran</th>
                  <th>Plan Date</th>
                  <th>Actual Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  silabus.map((item,i) => (
                    <>
                      <tr>
                        <td data-toggle='collapse' data-target={`#col${i}`} className="collapsed text-center">
                          {
                            item.tugas.length || item.kuis.length || item.ujian.length ?
                            <i className="fa"></i>
                            : null
                          }
                        </td>
                        <td>{item.sesi}</td>
                        <td>{item.jenis == '0' ? 'Materi' : item.jenis == '1' ? 'Kuis' : 'Ujian'}</td>
                        <td>{item.topik}</td>
                        <td>{item.chapter_title}</td>
                        <td>{item.absen_jam ? 'Hadir' : (new Date() <= new Date(moment(item.start_date).format('YYYY-MM-DD HH:mm'))) ? '-' : 'Tidak Hadir'}</td>
                        <td>{moment(item.start_date).format('DD/MM/YYYY HH:mm')}</td>
                        <td>{item.absen_jam ? moment(item.absen_jam).format('DD/MM/YYYY HH:mm') : '-'}</td>
                      </tr>
                      {
                        item.tugas.length || item.kuis.length || item.ujian.length ?
                        <tr className='collapse' id={`col${i}`}>
                          <td colSpan='8'>
                            <section className="container-fluid">
                              {
                                item.tugas.length ?
                                <>
                                <h5>Tugas</h5>
                                <Row>
                                  <table className="col-sm-12 table table-bordered">
                                    <thead>
                                      <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Deadline</th>
                                        <th>Submitted</th>
                                        <th>Score</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {
                                      item.tugas.map((tugas, i) => (
                                        <tr>
                                          <td>{tugas.exam_id}</td>
                                          <td>{tugas.exam_title}</td>
                                          <td>{moment(tugas.time_finish).format('DD/MM/YYYY HH:mm')}</td>
                                          <td>{tugas.submit_at ? moment(tugas.submit_at).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                          <td>{tugas.score ? tugas.score : '-'}</td>
                                        </tr>
                                      ))
                                    }
                                    </tbody>
                                  </table>
                                </Row>
                                </>
                              : null
                            }


                            {
                              item.kuis.length ?
                              <>
                              <h5>Kuis</h5>
                              <Row>
                                <table className="col-sm-12 table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Title</th>
                                      <th>Deadline</th>
                                      <th>Correct</th>
                                      <th>Wrong</th>
                                      <th>Submitted</th>
                                      <th>Score</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      item.kuis.map((tugas, i) => (
                                        <tr>
                                          <td>{tugas.exam_id}</td>
                                          <td>{tugas.exam_title}</td>
                                          <td>{moment(tugas.time_finish).format('DD/MM/YYYY HH:mm')}</td>
                                          <td>{tugas.total_correct ? tugas.total_correct : '-'}</td>
                                          <td>{tugas.total_uncorrect ? tugas.total_uncorrect : '-'}</td>
                                          <td>{tugas.submit_at ? moment(tugas.submit_at).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                          <td>{tugas.score ? tugas.score : '-'}</td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </table>
                              </Row>
                              </> : null
                            }

                            {
                              item.ujian.length ?
                              <>
                              <h5>Ujian</h5>
                              <Row>
                                <table className="col-sm-12 table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Title</th>
                                      <th>Deadline</th>
                                      <th>Correct</th>
                                      <th>Wrong</th>
                                      <th>Submitted</th>
                                      <th>Score</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      item.ujian.map((tugas, i) => (
                                        <tr>
                                          <td>{tugas.exam_id}</td>
                                          <td>{tugas.exam_title}</td>
                                          <td>{moment(tugas.time_finish).format('DD/MM/YYYY HH:mm')}</td>
                                          <td>{tugas.total_correct ? tugas.total_correct : '-'}</td>
                                          <td>{tugas.total_uncorrect ? tugas.total_uncorrect : '-'}</td>
                                          <td>{tugas.submit_at ? moment(tugas.submit_at).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                          <td>{tugas.score ? tugas.score : '-'}</td>
                                        </tr>

                                      ))
                                    }
                                  </tbody>
                                </table>
                              </Row>
                              </> : null
                            }

                          </section>
                        </td>
                        </tr>
                        : null
                      }
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
