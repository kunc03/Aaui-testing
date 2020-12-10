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
    jadwalId: this.props.match.params.id,
    pelajaranId: '',

    murid:[],
    kelas: {},
  };

  componentDidMount() {
    this.fetchOverview();
  }

  fetchOverview() {
    API.get(`${API_SERVER}v2/murid/jadwal/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning("Error fetch murid");

      this.setState({ murid: res.data.result })
    })

    API.get(`${API_SERVER}v2/murid/kelas-v1/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning("Error fetch murid");

      this.setState({ kelas: res.data.result })
    })

  }

  render() {
    console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4 className="f-w-900 f-18 fc-blue">Informasi Kelas</h4>
              <table>
                <tr>
                  <td style={{width: '180px'}}>Nama Kelas</td>
                  <td><b>{this.state.kelas.kelas_nama}</b></td>
                </tr>
                <tr>
                  <td>Semester</td>
                  <td><b>{this.state.kelas.semester}</b></td>
                </tr>
                <tr>
                  <td>Kurikulum</td>
                  <td><b>{this.state.kelas.kurikulum}</b></td>
                </tr>
                <tr>
                  <td>Tahun Ajaran</td>
                  <td><b>{this.state.kelas.tahun_ajaran}</b></td>
                </tr>
                <tr>
                  <td>Kapasitas Murid</td>
                  <td><b>{this.state.kelas.kapasitas} Murid</b></td>
                </tr>
              </table>

              <br/>
              <br/>

              <h4 className="f-w-900 f-18 fc-blue">Informasi Murid</h4>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>No. Induk</th>
                    <th>Tempat Lahir</th>
                    <th>Tanggal Lahir</th>
                    <th>Jenis Kelamin</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.murid.map((item, i) => (
                      <tr>
                        <td>{i+1}</td>
                        <td>{item.nama}</td>
                        <td>{item.no_induk}</td>
                        <td>{item.tempat_lahir}</td>
                        <td>{item.tanggal_lahir}</td>
                        <td>{item.jenis_kelamin}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Overview;
