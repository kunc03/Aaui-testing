import React from 'react'
import ReactFullScreenElement from "react-fullscreen-element";
import Iframe from 'react-iframe';

import API, { API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone'
import { toast } from 'react-toastify'

class Mengajar extends React.Component {

  state = {
    role: this.props.role.toString().toLowerCase(),
    jadwalId: this.props.match.params.jadwalId,
    jenis: this.props.match.params.jenis,
    sesiId: this.props.match.params.sesiId,

    fullscreen: false,
    infoJadwal: {},
    infoChapter: {}
  }

  fetchJadwal(jadwalId) {
    API.get(`${API_SERVER}v2/jadwal-mengajar/id/${jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: ${res.data.result}`)

      this.setState({ infoJadwal: res.data.result })
    })
  }

  fetchChapter(chapterId) {
    API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
      if(res.data.error) toast.warning(`Warning: ${res.data.result}`);

      this.setState({ infoChapter: res.data.result })
    })
  }

  componentDidMount() {
    this.fetchJadwal(this.state.jadwalId)

    if(this.state.jenis === "chapter") {
      this.fetchChapter(this.state.sesiId);
    }
  }

  render() {

    console.log('state: ', this.state);

    return (
      <ReactFullScreenElement fullScreen={this.state.fullscreen} allowScrollbar={false}>
        <div className="page-wrapper">
          <div className="row">

            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="header-kartu">
                    {this.state.infoJadwal.nama_pelajaran}

                    <button onClick={() => window.close()} className="float-right btn btn-icademy-danger mr-2 mt-2">
                      <i className="fa fa-sign-out-alt"></i> Keluar
                    </button>
                    <button onClick={() => this.setState({ modalEnd: true })} className="float-right btn btn-icademy-danger mr-2 mt-2">
                      <i className="fa fa-stop-circle"></i> Akhiri
                    </button>
                    <button onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'float-right btn btn-icademy-warning mr-2' : 'float-right btn btn-icademy-primary mr-2 mt-2'}>
                      <i className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'}></i> {this.state.fullscreen ? 'Minimize' : 'Maximize'}
                    </button>
                    <button onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'float-right btn btn-icademy-warning mr-2' : 'float-right btn btn-icademy-primary mr-2 mt-2'}>
                      <i className={'fa fa-list-alt'}></i> Attendances
                    </button>
                  </h4>
                  <span>Pengajar : {this.state.infoJadwal.pengajar}</span>
                </div>
                <div className="card-body p-1">
                  <Iframe url={`https://carsworld.co.id/`}
                  width="100%"
                  height="600px"
                  display="initial"
                  frameBorder="0"
                  allow="fullscreen *; geolocation *; microphone *; camera *"
                  position="relative" />
                </div>
              </div>
            </div>

            <div className="col-sm-3">
            </div>

            <div className="col-sm-9">
            </div>

          </div>
        </div>
      </ReactFullScreenElement>
    )
  }

}

export default Mengajar;
