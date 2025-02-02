import React, { Component } from "react";

import { Hidden } from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class Jadwals extends Component {
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
      <li >
        <div
          className="card-block"
          style={{ padding: "4px 25px" }}
        >
          <div className="row d-flex text-center">
            <div className="col-sm-4 card-cell-grey">
              <small className="f-w-600 f-12 text-c-grey ">
                02 Sep 2020
                </small>
            </div>
            <div className="col-sm-4 card-cell-darkgrey">
              <small className="f-w-600 f-12 text-c-grey ">
                85
                </small>
            </div>
            <div className="col-sm-4 card-cell-darkgrey">
              <small className="f-w-600 f-12 text-c-grey ">
                Bhs. Indonesia
                </small>
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
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Teaching Schedule</span></td>
                <td>02 Sep 2020</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Actual teaching</span></td>
                <td>54</td>
              </tr>
              <tr>
                <td><span className="f-w-800 f-14 text-c-grey " style={{ textTransform: 'uppercase' }}>Subject categories</span></td>
                <td>Bhs. Indonesia</td>
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
              Jadwal
              </h3>

            {/*RESPONSIVE IN THE CENTER 'WEB VIEW'*/}
            <Hidden only="xs">

              <div className="row d-flex text-center" style={{ padding: "12px 25px" }}>
                <div className="col-sm-4">
                  <span className="f-w-800 f-14 text-c-grey2 " style={{ textTransform: 'uppercase' }}>
                    Teaching Schedule
                      </span>
                </div>
                <div className="col-sm-4">
                  <span className="f-w-800 f-14 text-c-grey2 " style={{ textTransform: 'uppercase' }}>
                    Actual teaching
                      </span>
                </div>
                <div className="col-sm-4">
                  <span className="f-w-800 f-14 text-c-grey2 " style={{ textTransform: 'uppercase' }}>
                    Subject categories
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


    );
  }
}

export default Jadwals;
