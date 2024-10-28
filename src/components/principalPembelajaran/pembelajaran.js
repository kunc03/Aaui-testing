import React, { Component } from "react";
import { Hidden } from '@material-ui/core';
import { Pie, Doughnut } from 'react-chartjs-2';
import { dataBar, dataPie } from '../../modul/data';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class Pembelajaran extends Component {
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
      this.setState({ grup: response.data.result });
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

    const Item = ({ item }) => (
      <li>
        <div className="card-table">
          <div
            className="card-block"
            style={{ padding: "12px 35px" }}
          >
            <div className="row d-flex text-center">
              <div className="col-sm-3">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  Matematika
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  85
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  85
                </small>
              </div>
              <div className="col-sm-3">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  85
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-grey-t ">
                  85
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
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}> Subject </span></td>
                <td>Matematika</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  jumlah user yang mengikuti mata pelajaran</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  jumlah user yang sudah 50% in progress mata pelajaran</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  jumlah user yang sudah selesai mata pelajaran</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                  jumlah user yang lulus exercise per mata pelajaran</span></td>
                <td>54</td>
              </tr>
            </table>
          </div>
        </div>
      </li>
    );

    const Lists = ({ lists }) => (
      <ul className="list-cabang">
        {lists.map(list => (
          <Item key={list.company_id} item={list} />
        ))}
      </ul>
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
                  Reports of all learning
                </h3>
                <div className="row">
                  <div className="col-sm-2">
                    <div className="form-group pl-5">
                      <label>Subjects of Learning</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- Select --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="form-group">
                      <label>Periode</label>
                      <input required name="tanggal_mulai" type="date" className="form-control" placeholder="enter" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2">
                    <div className="form-group pl-5">
                      <label>Subjects of Learning</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- Select --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="form-group">
                      <label>Class</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- Select --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <div className="form-group">
                      <label>School year</label>
                      <select
                        className="form-control"
                        required
                        name="quizAt"
                      >
                        <option value="">-- Select --</option>
                        <option value="1">Ssatu</option>
                        <option value="2">Dua</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              <div className="col-sm-6">

                <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
                  Student Learning Progress in Learning English
                </h3>
                <Doughnut
                  data={dataBar}

                />

              </div>



              <div className="col-sm-12 mt-5">
                <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
                  Download muridLaporanRapor
                </h3>

                {/*RESPONSIVE IN THE CENTER 'WEB VIEW'*/}
                <Hidden only="xs">

                  <div className="row d-flex text-center" style={{ padding: "12px 25px" }}>
                    <div className="col-sm-3">
                      <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Topic
                      </span>
                    </div>
                    <div className="col-sm-2">
                      <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Activities
                      </span>
                    </div>
                    <div className="col-sm-2">
                      <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Status
                      </span>
                    </div>
                    <div className="col-sm-3">
                      <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Access Date / Collection Limit
                      </span>
                    </div>
                    <div className="col-sm-2">
                      <span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>
                        Score
                      </span>
                    </div>
                  </div>
                  <div style={{ overflowX: "hidden" }}>
                    <Lists lists={grup} />
                  </div>
                </Hidden>

                {/*RESPONSIVE IN THE CENTER 'MOBILE VIEW'*/}
                <Hidden only={['lg', 'md', 'sm', 'xl']}>
                  <div style={{ overflowX: "auto" }}>
                    <ListMobile lists={grup} />
                  </div>
                </Hidden>

              </div>

            </div>
          </div>
        </div>
      </div>


    );
  }
}

export default Pembelajaran;
