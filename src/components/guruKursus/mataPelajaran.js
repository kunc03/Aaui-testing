import React, { Component } from "react";

import { Hidden } from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';
import moment from 'moment-timezone';

import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

class MataPelajaran extends Component {

  state = {
    mataPelajaran: [],

    isModalBuka: false,

    isModalSilabus: false,
    jadwalPelajaran: [],
    pelajaranId: '',
    dataSilabus: [],

    jadwalKu: [],

    tahunAjaran: '',
    listTahunAjaran: []

  }

  fetchJadwalKu(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if(res.data.error) console.log(`Error: fetch pelajaran`)

      let dd = res.data.result;
      let unique = [...new Map(dd.map(item => [item['pelajaran_id'], item])).values()];

      this.setState({ mataPelajaran: dd, jadwalPelajaran: unique, jadwalKu: res.data.result })
    })
  }

  fetchJadwal(tahunAjaran) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal`)

      this.setState({
        jadwalPelajaran: res.data.result,
      })
    })
  }

  fetchSilabus(pelajaranId) {
    API.get(`${API_SERVER}v2/silabus/pelajaran/${pelajaranId}`).then(res => {
      if(res.data.error) console.log(`Error: fetch overview`)

      this.setState({ dataSilabus: res.data.result });
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

    this.fetchJadwal(tahunAjaran);
    this.fetchJadwalKu(tahunAjaran);
  }

  clearForm() {
    this.setState({
      isModalSilabus: false,
      isModalBuka: false,
      pelajaranId: '',
      dataSilabus: [],
    })
  }

  selectPelajaran = e => {
    e.preventDefault();
    let pelajaranId = e.target.value;
    this.setState({ isModalSilabus: true, pelajaranId })
    this.fetchSilabus(pelajaranId);
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchJadwal(value);
    this.fetchJadwalKu(value);
  }

  render() {

    const Item = ({ item }) => (
      <li>
        <div className="card-table">
          <div
            className="card-block"
            style={{ padding: "12px 35px" }}
          >
            <div className="row d-flex text-center">
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  {item.nama_pelajaran}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  {item.kelas_nama}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  {item.nama_ruangan}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  {item.hari}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  {moment(item.jam_mulai, 'HH:mm').local().format('HH:mm')} - {moment(item.jam_selesai, 'HH:mm').local().format('HH:mm')}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  <Link to={`/guru/chapter/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                    <i className="fa fa-upload"></i> Upload Materi
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </li>
    );

    const MobileItem = ({ item }) => (
      <li>
        <div className="card-table">
          <div
            className="card-block"
            style={{ padding: "12px 35px" }}
          >
            <table className="table">
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}> Pelajaran </span></td>
                <td>{item.nama_pelajaran}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Kelas</span></td>
                <td>{item.kelas_nama}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Ruangan</span></td>
                <td>{item.nama_ruangan}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Hari</span></td>
                <td>{item.hari}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Jam</span></td>
                <td>{moment(item.jam_mulai, 'HH:mm').local().format('HH:mm')} - {moment(item.jam_selesai, 'HH:mm').local().format('HH:mm')}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Action</span></td>
                <td><Link to={`/guru/chapter/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                  <i className="fa fa-upload"></i> Upload Materi
                </Link></td>
              </tr>
            </table>
          </div>
        </div>
      </li>
    );

    const Lists = ({ lists }) => (
      <ul className="list-cabang">
        {lists.map(list => (
          <Item key={list.tanngal} item={list} />
        ))}
      </ul>
    );

    const ListMobile = ({ lists }) => (
      <ul className="list-cabang">
        {lists.map(list => (
          <MobileItem key={list.tanggal} item={list} />
        ))}
      </ul>
    );

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card" style={{ height: '550px', paddingBottom: 10 }}>
            <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
            Mata Pelajaran
            </h3>

            <div className="col-sm-2">
              <label>Tahun Ajaran</label>
              <select onChange={this.selectTahunAjaran} value={this.state.tahunAjaran} className="form-control" required>
                <option value="" selected disabled>Select</option>
                {
                  this.state.listTahunAjaran.map(item => (
                    <option value={item}>{item}</option>
                  ))
                }
              </select>
            </div>

            {/*RESPONSIVE IN THE CENTER 'WEB VIEW'*/}
            <Hidden only="xs">

              <div className="row d-flex text-center" style={{ padding: "12px 25px" }}>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Pelajaran
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Kelas
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Ruangan
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Hari
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Jam
                  </span>
                </div>
              </div>
              <div style={{ overflowX: "hidden" }}>
                <Lists lists={this.state.mataPelajaran} />
              </div>
            </Hidden>

            {/*RESPONSIVE IN THE CENTER 'MOBILE VIEW'*/}
            <Hidden only={['lg', 'md', 'sm', 'xl']}>
              <div style={{ overflowX: "auto" }}>
                <ListMobile lists={this.state.mataPelajaran} />
              </div>
            </Hidden>
          </div>
        </div>

      </div>


    );
  }
}

export default MataPelajaran;
