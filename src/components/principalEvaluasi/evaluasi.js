import React, { Component } from "react";
import { Bar } from 'react-chartjs-2';
import { dataEvaluasi } from '../../modul/data';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class Evaluasi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isCreateModal: false,
      delete: {
        modal: false,
        id: ''
      }
    };
  }


  triggerUpdate = e => this.setState({
    grup: [...this.state.grup, e]
  })

  /* action for delete */


  componentDidMount() {
    let link = `${API_SERVER}v1/company`;
    API.get(link).then(response => {
      this.setState({ grup: [{}] });
    }).catch(function (error) {
      console.log(error);
    });
  }



  render() {
    let { grup } = this.state;
    let statusCompany = ['active', 'nonactive'];

    let linkCompany = '';
    if (Storage.get('user').data.level === 'superadmin') {
      linkCompany = '/company-detail-super';
    } else {
      linkCompany = '/company-detail';
    }

    const MobileItem = ({ item }) => (
      <li>
        <div className="card-table">
          <div
            className="card-block"
            style={{ padding: "12px 35px" }}
          >
            <table className="table">
              {/* <tr>
                <td style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Responden</span></td>
                <td style={{ background: '#F5F5F5', border: '4px solid white' }}><b className="fc-skyblue">Siswa</b></td>
              </tr>
              <tr>
                <td style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  Jumlah Responden</span></td>
                <td style={{ background: '#F5F5F5', border: '4px solid white' }}><b className="fc-skyblue">54</b></td>
              </tr> */}
              <tr>
                <td style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  Mata Pelajaran</span></td>
                <td style={{ background: '#F5F5F5', border: '4px solid white' }}><b className="fc-skyblue">Matematika</b></td>
              </tr>
              <tr>
                <td style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  Guru</span></td>
                <td style={{ background: '#F5F5F5', border: '4px solid white' }}><b className="fc-skyblue">Adrian Simatupluo</b></td>
              </tr>
              <tr>
                <td style={{ background: '#FAFAFA', border: '4px solid white' }}><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  Ringkasan Evaluasi</span></td>
                <td style={{ background: '#F5F5F5', border: '4px solid white' }}><b className="fc-skyblue">1. Anak anak ips xii</b></td>
              </tr>
            </table>
          </div>
        </div>
      </li>
    );


    const ListMobile = ({ lists }) => (
      <ul className="list-cabang">
        {lists.map(list => (
          <MobileItem key={list.company_id} item={list} />
        ))}
      </ul>
    );

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card" style={{ paddingBottom: 10 }}>
            <div className="row">

              <div className="col-sm-12">

                <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
                  Laporan Evaluasi
                </h3>
                <div className="row">
                  <div className="col-sm-3">
                    <div className="form-group pl-5">
                      <label>Nama Guru</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- pilih --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>Tahun Ajaran</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- pilih --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>Kelas</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- pilih --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label>Download Laporan</label>
                    <a href='' target="_blank" className="btn btn-v2 btn-primary">
                      <i className="fa fa-download"></i>
                          Download
                        </a>
                  </div>
                </div>

              </div>

              <div className="col-sm-6 pl-5">
                <Bar data={dataEvaluasi} />
              </div>

              <div className="col-sm-6 p-l-5">
                <div style={{ overflowX: "auto" }}>
                  <ListMobile lists={grup} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    );
  }
}

export default Evaluasi;
