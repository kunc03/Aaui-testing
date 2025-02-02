import React, { Component } from "react";

import { Hidden } from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class StatisKelas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isCreateModal: false,
      delete: {
        modal: false,
        id: ''
      },

      kinerja: [],

    };
  }


  triggerUpdate = e => this.setState({
    grup: [...this.state.grup, e]
  })

  /* action for delete */
  fetchKinerja() {
    API.get(`${API_SERVER}v2/principal/kpi-guru/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({ kinerja: res.data.result.filter(item => item.nama == Storage.get('user').data.user) })
    })
  }

  componentDidMount() {
    this.fetchKinerja()

    let link = `${API_SERVER}v2/principal/kpi-guru/${Storage.get('user').data.company_id}`;
    API.get(link).then(response => {
      console.log(response.data, 'response data baru')
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
            <div className="row d-flex ">
              <div className="col-sm-3">
                <small className="f-w-600 f-12 text-c-black">
                  {item.pelajaran}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-black">
                  {item.tahun_ajaran}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-black">
                  {item.semester}
                </small>
              </div>
              <div className="col-sm-2">
                <small className="f-w-600 f-12 text-c-black">
                  {item.kelas}
                </small>
              </div>
              <div className="col-sm-2">
                {
                  item.file ? <a href={item.file} target="_blank">Download</a> : 'Belum di upload'
                }
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
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Pelajaran</span></td>
                <td>{item.pelajaran}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Tahun Ajaran</span></td>
                <td>{item.tahun_ajaran}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Semester</span></td>
                <td>{item.semester}</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Kelas</span></td>
                <td>{item.kelas}</td>
              </tr>
              <tr>
                <td colSpan="2" className="text-center">
                  {
                    item.file ? <a href={item.file} target="_blank">Download</a> : 'Belum di upload'
                  }
                </td>
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
          <div className="card" style={{ height: '650px', paddingBottom: 10 }}>
            <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
              KPI
                <a className="float-right p-r-20 f-14">Export Excel</a>
            </h3>


            {/*RESPONSIVE IN THE CENTER 'WEB VIEW'*/}
            <Hidden only="xs">
              <div style={{ overflowX: "hidden" }}>
                <Lists lists={this.state.kinerja} />
              </div>
            </Hidden>

            {/*RESPONSIVE IN THE CENTER 'MOBILE VIEW'*/}
            <Hidden only={['lg', 'md', 'sm', 'xl']}>
              <div style={{ overflowX: "auto" }}>
                <ListMobile lists={this.state.kinerja} />
              </div>
            </Hidden>
          </div>
        </div>

      </div>


    );
  }
}

export default StatisKelas;
