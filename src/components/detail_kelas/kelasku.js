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
    kelasKu: [],
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
      this.fetchMyKelas(Storage.get('user').data.user_id, tahunAjaran)
    }
    else {
      this.fetchMuridKu(Storage.get('user').data.user_id, tahunAjaran)
    }
  }

  fetchMyKelas(userId, tahunAjaran) {
    API.get(`${API_SERVER}v2/kelas/murid/${userId}`).then(res => {
      this.setState({ kelasKu: res.data.result.filter(item => item.tahun_ajaran == tahunAjaran) })
    })
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
      this.fetchMyKelas(Storage.get('user').data.user_id, value)
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
            <h4 className="f-w-900 f-18 fc-blue mb-3">Informasi Kelas</h4>

            <select style={{padding: '2px'}} className="mr-2" onChange={this.selectTahunAjaran} value={this.state.tahunAjaran} >
              <option value="" selected disabled>Select</option>
              {
                this.state.listTahunAjaran.map(item => (
                  <option value={item}>{item}</option>
                ))
              }
            </select>

            {
              this.state.kelasKu.map((item, i) => (
                <table className="table table-bordered mt-3">
                  <tr>
                    <td width="180px">Kelas</td>
                    <td><b>{item.kelas_nama}</b></td>
                  </tr>
                  <tr>
                    <td>Semester</td>
                    <td><b>{item.semester_name}</b></td>
                  </tr>
                  <tr>
                    <td>Tahun Ajaran</td>
                    <td><b>{item.tahun_ajaran}</b></td>
                  </tr>
                  <tr>
                    <td>Action</td>
                    <td>
                      <Link to={`/ruangan/kelas/${item.kelas_id}`} className="btn btn-v2 btn-primary">Masuk Ruangan</Link>
                    </td>
                  </tr>
                </table>
              ))
            }

          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default GuruUjian;
