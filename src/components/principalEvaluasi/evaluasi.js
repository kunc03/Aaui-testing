import React, { Component } from "react";
import { Hidden } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { dataBar, dataPie } from '../../modul/data';
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
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}> Subject </span></td>
                <td>Matematika</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  asdasdasd</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  asdasd</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  asdasd</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  asdasd</span></td>
                <td>54</td>
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
                      <label>Subjects of Learning</label>
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
                      <label>Class</label>
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
                      <label>School year</label>
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
                </div>

              </div>

              <div className="col-sm-6 pl-5">
                <Bar data={dataBar} />
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
