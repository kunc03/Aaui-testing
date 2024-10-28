import React from 'react';

import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
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

    overview: []
  };

  componentDidMount() {
    this.fetchOverview();
  }

  fetchOverview() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${this.state.jadwalId}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch jadwal one`)

      this.setState({ pelajaranId: res.data.result.pelajaran_id })
      API.get(`${API_SERVER}v2/silabus/pelajaran/${res.data.result.pelajaran_id}`).then(res => {
        if (res.data.error) console.log(`Error: fetch overview`)

        this.setState({ overview: res.data.result });
      })
    })
  }

  render() {
    // //console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4 className="f-w-900 f-18 fc-blue">Silabus</h4>

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ color: 'black' }} className="text-center">Sesi</th>
                    <th style={{ color: 'black' }} className="text-center">Topik</th>
                    <th style={{ color: 'black' }} className="text-center">Tujuan</th>
                    <th style={{ color: 'black' }} className="text-center">Files</th>
                    <th style={{ color: 'black' }} className="text-center">Periode</th>
                    <th style={{ color: 'black' }} className="text-center">Durasi</th>
                    <th style={{ color: 'black' }} className="text-center">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.overview.map((item, i) => {
                      if (item.jenis === 0) {
                        return (
                          <tr key={i}>
                            <td>{item.sesi}</td>
                            <td>{item.topik}</td>
                            <td>{item.tujuan}</td>
                            <td style={{ padding: '12px' }} className="text-center">
                              {
                                item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : '-'
                              }
                            </td>
                            <td>{item.periode}</td>
                            <td>{item.durasi} menit</td>
                            <td>{item.deskripsi}</td>
                          </tr>
                        )
                      } else {
                        return (
                          <tr key={i}>
                            <td>{item.sesi}</td>
                            <td colSpan="3" className="text-center">{item.jenis == 1 ? 'Kuis' : 'Ujian'}</td>
                            <td>{item.periode}</td>
                            <td>{item.durasi} menit</td>
                            <td>{item.deskripsi}</td>
                          </tr>
                        )
                      }
                    })
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
