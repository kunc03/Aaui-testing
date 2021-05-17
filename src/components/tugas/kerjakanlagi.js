import React from 'react';
import { Link } from 'react-router-dom';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify'

import Jawab from './jawab';

class MataPelajaran extends React.Component {

  state = {
    examId: this.props.match.params.examId,
    role: Storage.get('user').data.grup_name.toString().toLowerCase(),
    waktuPengerjaan: 0,

    infoExam: {}
  }

  fetchExam(examId) {
    API.get(`${API_SERVER}v2/exam/${examId}`).then(res => {
      this.setState({ infoExam: res.data.result })

      let cekLocal = localStorage.getItem('waktuPengerjaan')
      if(cekLocal) {
        this.setState({ waktuPengerjaan: parseInt(cekLocal) })
      }
      else {
        this.setState({ waktuPengerjaan: res.data.result.durasi * 60 })
      }
    })
  }

  componentDidMount() {
    this.fetchExam(this.state.examId)
  }

  render() {

    console.log('state: ', this.state)

    return (
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header">
            Kerjakan Lagi
          </div>

          <div className="card-body" style={{ padding: '12px' }}>

            {
              this.state.infoExam && this.state.waktuPengerjaan ?
              // this.state.infoExam ?
                <Jawab
                  waktuPengerjaan={this.state.waktuPengerjaan}
                  role={this.state.role}
                  tipe={this.state.infoExam.quiz === 0 ? 'ujian' : this.state.infoExam.quiz === 1 ? 'kuis' : 'tugas'}
                  examId={this.state.examId} />
                : null
            }

          </div>
        </div>
      </div>
    );
  }

}

export default MataPelajaran;
