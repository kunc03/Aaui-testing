import React from 'react';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import ReactToPrint from 'react-to-print';

class ListSoal extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: '24px' }}>
        {
          this.props.lists.map((item, i) => (
            <div className="mb-2">
              <label>Pertanyaan <b>{i + 1}</b></label>
              <div className="soal mb-2" dangerouslySetInnerHTML={{ __html: item.tanya }} />

              {
                item.a &&
                <tr>
                  <td style={{ width: '24px' }}>A.</td>
                  <td>{item.a}</td>
                </tr>
              }
              {
                item.b &&
                <tr>
                  <td style={{ width: '24px' }}>B.</td>
                  <td>{item.b}</td>
                </tr>
              }
              {
                item.c &&
                <tr>
                  <td style={{ width: '24px' }}>C.</td>
                  <td>{item.c}</td>
                </tr>
              }
              {
                item.d &&
                <tr>
                  <td style={{ width: '24px' }}>D.</td>
                  <td>{item.d}</td>
                </tr>
              }
              {
                item.e &&
                <tr>
                  <td style={{ width: '24px' }}>E.</td>
                  <td>{item.e}</td>
                </tr>
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class Latihan extends React.Component {

  state = {
    tipe: this.props.tipe,
    mataPelajaran: [],

    openDetail: false,
    examId: '',
    examTitle: '',
    examSoal: [],

    tahunAjaran: '',
    listTahunAjaran: []

  }

  clearForm() {
    this.setState({
      openDetail: false,
      examId: '',
      examTitle: '',
      examSoal: []
    })
  }

  openDetail = e => {
    e.preventDefault();
    let examId = e.target.getAttribute('data-id');
    let examTitle = e.target.getAttribute('data-title');
    this.setState({ openDetail: true, examId, examTitle })
    this.fetchPertanyaan(examId);
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch pertanyaan`)

      this.setState({ examSoal: res.data.result })
    })
  }

  componentDidMount() {
    let d = new Date();
    // bulan diawali dengan 0 = januari, 11 = desember
    let month = d.getMonth();
    let tahunAjaran = month < 6 ? (d.getFullYear() - 1) + '/' + d.getFullYear() : d.getFullYear() + '/' + (d.getFullYear() + 1);

    let temp = [];
    for (var i = 0; i < 6; i++) {
      temp.push(`${d.getFullYear() - i}/${d.getFullYear() - i + 1}`)
    }
    this.setState({ tahunAjaran, listTahunAjaran: temp })

    this.fetchKuis(Storage.get('user').data.user_id, tahunAjaran);
  }

  fetchKuis(id, tahunAjaran) {
    API.get(`${API_SERVER}v2/${this.state.tipe}-murid/${id}?tahunAjaran=${tahunAjaran}`).then(res => {
      if (res.data.error) toast.warning(`Warning: fetch kuis murid`);

      this.setState({ mataPelajaran: res.data.result.kuis })
    })
  }

  selectTahunAjaran = e => {
    const { value } = e.target;
    this.setState({ tahunAjaran: value })
    this.fetchKuis(Storage.get('user').data.user_id, value);
  }

  render() {

    //console.log('state: ', this.state)

    return (
      <>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-body" style={{ padding: '12px' }}>

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


              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Description</th>
                    <th>Question</th>
                    <th>Deadline</th>
                    <th>Date Submit</th>
                    <th>Score</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.mataPelajaran.map((item, i) => (
                      <tr>
                        <td>{item.nama_pelajaran}</td>
                        <td>
                          <a href="#" onClick={this.openDetail} data-id={item.exam_id} data-title={item.title}>{item.exam_title}</a>
                        </td>
                        <td>{item.soal.length}</td>
                        <td>{moment(item.time_start).format('DD/MM/YYYY')} sampai {moment(item.time_finish).format('DD/MM/YYYY')}</td>
                        <td>{item.submitted.length ? moment(item.submitted[0].created_at).format('DD/MM/YYYY HH:mm') : '-'}</td>
                        <td>{item.submitted.length ? item.submitted[0].score : '-'}</td>
                        <td className="text-center">
                          <a
                            target="_blank"
                            href={`/ruangan/mengajar/${item.jadwal_id}/materi/${item.chapter_id}`}
                            className="btn btn-v2 btn-primary">
                            Open
                          </a>

                          {
                            /**
                            <Link to={`/murid/detail-${this.state.tipe}/${item.exam_id}`} className="btn btn-v2 btn-primary">
                            <i className="fa fa-share"></i> Open
                            </Link>
                            */
                          }

                          {
                            item.submitted.length ?
                              <Link to={`/murid/kerjakan-lagi/${item.exam_id}`} className="btn btn-v2 btn-info ml-2">Kerjakan Lagi</Link>
                            : null
                          }

                        </td>
                      </tr>
                    ))
                  }
                </tbody>

              </table>

              <Modal
                show={this.state.openDetail}
                onHide={() => this.clearForm()}
                dialogClassName="modal-lg"
              >
                <Modal.Body>
                  <h4 className="mb-3">{this.state.examTitle}</h4>

                  <ListSoal lists={this.state.examSoal} ref={e => (this.componentRef = e)} />

                  <button onClick={() => this.clearForm()} className="btn btn-v2 btn-primary mt-3">Close</button>

                  <ReactToPrint
                    trigger={() => {
                      // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                      // to the root node of the returned component as it will be overwritten.
                      return <button className="btn btn-v2 btn-primary mt-3 ml-2">Print this out!</button>;
                    }}
                    content={() => this.componentRef}
                  />

                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>

      </>
    );
  }

}

export default Latihan;
