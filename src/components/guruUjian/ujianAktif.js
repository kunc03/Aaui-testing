import React, { Component } from "react";

import { Hidden } from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

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

  }

  fetchJadwalKu() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}`).then(res => {
      if(res.data.error) console.log(`Error: fetch pelajaran`)

      let dd = res.data.result;
      let unique = [...new Map(dd.map(item => [item['pelajaran_id'], item])).values()];

      this.setState({ mataPelajaran: dd, jadwalPelajaran: unique, jadwalKu: res.data.result })
    })
  }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/guru/${Storage.get('user').data.user_id}`).then(res => {
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
    this.fetchJadwal();
    this.fetchJadwalKu();
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
                  {item.hari}, {item.jam_mulai} - {item.jam_selesai}
                </small>
              </div>
              <div className="col-sm-2">
                <Link to={`/guru/tugas/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                  <i className="fa fa-upload"></i> Tambah
                </Link>
              </div>
              <div className="col-sm-2">
                <Link to={`/guru/kuis/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                  <i className="fa fa-upload"></i> Tambah
                </Link>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  <Link to={`/guru/ujian/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                    <i className="fa fa-upload"></i> Tambah
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
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Informasi</span></td>
                <td>{item.hari}, {item.jam_mulai} - {item.jam_selesai}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Hari</span></td>
                <td><Link to={`/guru/tugas/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                  <i className="fa fa-upload"></i> Tambah Tugas
                </Link></td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Jam</span></td>
                <td><Link to={`/guru/kuis/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                  <i className="fa fa-upload"></i> Tambah Kuis
                </Link></td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Action</span></td>
                <td><Link to={`/guru/ujian/${item.jadwal_id}`} className="btn btn-v2 btn-primary">
                  <i className="fa fa-upload"></i> Tambah Ujian
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
              Tugas, Kuis, & Ujian
              </h3>

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
                    Informasi
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Tugas
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Kuis
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                    Ujian
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
