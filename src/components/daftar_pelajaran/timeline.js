import React, { Component } from "react";
import Storage from '../../repository/storage';

import { Link } from 'react-router-dom'

import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'

class GuruUjian extends Component {
  state = {
    toDo: [],
    calendar: [],

    muridId: Storage.get('user').data.user_id,

    pengumuman: [],
    openPengumuman: false,
    pengumumanId: '',
    pengumumanNama: '',
    pengumumanIsi: '',
    pengumumanFile: [],
    tugas: [],
    ujian: [],
    jadwal: [],
    event: [],

    tahunAjaran: '',
    listTahunAjaran: []
  }

  fetchJadwal(userIdMurid, tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/murid/${userIdMurid}?tahunAjaran=${tahunAjaran}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch jadwal`)

      let hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      let tglIni = new Date();
      let hariIni = res.data.result.jadwal.filter(item => item.hari === hari[tglIni.getDay()]);

      this.setState({
        jadwal: hariIni,
        tugas: res.data.result.tugas,
        ujian: res.data.result.ujian,
      })
    })
  }

  fetchEvents(muridId) {
    API.get(`${API_SERVER}v2/events/murid/${muridId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch events`)

      console.log('events: ', res.data.result);

      let mengajar = res.data.result.mengajar
      .map(item => {
        let stTgl = moment(item.start_date).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.chapter_title}`,
          start: tglSt,
          end: tglSt,
          event: 'materi',
          absen: item.absen_jam,
          mapel: item.nama_pelajaran
        }
      })

      // console.log('events: ', res.data.result.mengajar)

      let ptc = res.data.result.ptc
      .map(item => {
        let stTgl = moment(item.tanggal_mulai).format('YYYY-MM-DD') + ' ' + item.waktu_mulai;
        let tglSt = new Date(stTgl)

        return {
          title: `${item.nama_ruangan}`,
          start: tglSt,
          end: tglSt,
          event: 'ptc'
        }
      })
      // console.log('events: ', ptc)


      let tugas = res.data.result.tugas
      .map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'tugas',
          submitted: item.submitted,
          mapel: item.nama_pelajaran
        }
      })
      console.log('events: ', res.data.result.tugas)


      let quiz = res.data.result.quiz
      .map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'kuis',
          absen: item.absen_jam,
          score: item.score,
          mapel: item.nama_pelajaran
        }
      })
      console.log('events: ', res.data.result.quiz)


      let ujian = res.data.result.ujian
      .map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt,
          event: 'ujian',
          absen: item.absen_jam,
          score: item.score,
          mapel: item.nama_pelajaran
        }
      })
      // console.log('events: ', ujian)


      let events = mengajar.concat(ptc.concat(tugas.concat(quiz.concat(ujian))));

      this.setState({ event: events })
    })
  }

  openPengumuman = e => {
    e.preventDefault();
    this.setState({
      openPengumuman: true,
      pengumumanId: e.target.getAttribute('data-id'),
      pengumumanNama: e.target.getAttribute('data-title'),
      pengumumanIsi: e.target.getAttribute('data-isi'),
      pengumumanFile: e.target.getAttribute('data-file') ? e.target.getAttribute('data-file').split(',') : []
    })
  }

  closePengumuman() {
    this.setState({
      openPengumuman: false,
      pengumumanId: '',
      pengumumanNama: '',
      pengumumanIsi: '',
      pengumumanFile: [],
    })
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

    this.fetchPengumuman();
    this.fetchJadwal(Storage.get('user').data.user_id, tahunAjaran)
    this.fetchEvents(Storage.get('user').data.user_id)
  }

  fetchPengumuman() {
    let url = null;
    if (this.state.level === "admin" || this.state.level === "superadmin") {
      url = `${API_SERVER}v1/pengumuman/company/${this.state.companyId}`;
    } else {
      url = `${API_SERVER}v1/pengumuman/role/${Storage.get('user').data.grup_id}`;
    }

    API.get(url).then(response => {
      this.setState({ pengumuman: response.data.result.reverse() });
    }).catch(function (error) {
      console.log(error);
    });
  }

  filterKegiatan = e => {
    let {value} = e.target;
    if(value === 'all') {
      this.fetchEvents(this.state.muridId)
    }
    else {

      let event = [...this.state.event].filter(item => item.event === value);
      this.setState({ event })
    }
  }

  filterClear = e => {
    this.fetchEvents(this.state.muridId)
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchJadwal(Storage.get('user').data.user_id, value)
  }


  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;

    console.log('this', this.state.event);

    let sort = this.state.event.sort((a, b) => a.start - b.start);
    console.log('sort', sort);

    return (
      <div class="col-sm-12 mt-2">
        <Card>
          <Card.Body>
            <h4 className="f-w-900 f-18 fc-blue mb-3">Progress</h4>
            <select onChange={this.selectTahunAjaran} value={this.state.tahunAjaran}>
              <option value="" selected disabled>Select</option>
              {
                this.state.listTahunAjaran.map(item => (
                  <option value={item}>{item}</option>
                ))
              }
            </select>
            <select style={{padding: '2px'}} onChange={this.filterKegiatan}>
              <option value="all">All</option>
              <option value="materi">Materi</option>
              <option value="tugas">Tugas</option>
              <option value="kuis">Kuis</option>
              <option value="ujian">Ujian</option>
            </select>
            <button class="ml-2" onClick={this.filterClear}>clear</button>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Kegiatan</th>
                  <th>Mata Pelajaran</th>
                  <th>Judul</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {
                  sort.map(item => (
                    <tr key={item.title+'-'+item.start}>
                      <td style={{textTransform: 'capitalize'}}>{item.event}</td>
                      <td>{item.mapel}</td>
                      <td>{item.title}</td>
                      <td>{moment(item.start).format('DD/MM/YYYY HH:mm')}</td>
                      <td>
                        {
                          item.hasOwnProperty('absen') ?
                          (item.absen ? <span class="label label-success">Selesai</span> : <span class="label label-danger">Belum</span>)
                          :
                          ((item.hasOwnProperty('submitted') && item.submitted.length === 1) ? <span class="label label-success">Selesai</span> : <span class="label label-danger">Belum</span>)
                        }
                      </td>
                      {
                        item.hasOwnProperty('submitted') &&
                        <td>{item.submitted.length === 1 ? item.submitted[0].score : '-'}</td>
                      }
                      {
                        item.hasOwnProperty('score') &&
                        <td>{item.score ? item.score : '-'}</td>
                      }
                      {
                        item.event === 'materi' &&
                        <td>-</td>
                      }
                    </tr>
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
