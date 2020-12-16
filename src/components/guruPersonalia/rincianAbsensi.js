import React, { Component } from "react";

import {Hidden} from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class RincianAbsensi extends Component {
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
    }).catch(function(error) {
      console.log(error);
    });
  }



  render() {
    let { grup } = this.state;
    let statusCompany = ['active', 'nonactive'];

    let linkCompany = '';
    if(Storage.get('user').data.level === 'superadmin') {
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
                  senin/20/0/2020
                </small>
              </div>
              <div className="col-sm-4 card-cell-blue">
                <small className="f-w-600 f-12 text-c-white ">
                85
                </small>
              </div>
              <div className="col-sm-4 card-cell-red">
                <small className="f-w-600 f-12 text-c-white ">
                85
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
                <td><span className="f-w-800 f-14 text-c-grey " style={{textTransform : 'uppercase'}}>Hari</span></td>
                <td>senin 20/20/2020</td>
              </tr>
              <tr style={{backgroundColor: '#FF6384'}}>
                <td><span className="f-w-800 f-14 text-c-white " style={{textTransform : 'uppercase'}}>
                Aktif</span></td>
                <td><span className="f-w-800 f-14 text-c-white ">54</span></td>
              </tr>
              <tr style={{backgroundColor: '#0091FF'}}>
                <td><span className="f-w-800 f-14 text-c-white " style={{textTransform : 'uppercase'}}>
               Tidak Aktif</span></td>
                <td><span className="f-w-800 f-14 text-c-white ">54</span></td>
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
            <div className="card" style={{height: '650px', paddingBottom: 10}}>
              <span>
                <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
                  Rincian Absensi
                </h3>
                <button
                    className="btn btn-icademy-primary"
                    style={{ padding: "7px 8px !important", marginLeft:14 }}
                    >
                    Juli &nbsp; &nbsp; 
                    <i className="fa fa-caret-down"></i>
                    
                </button>
                <button
                    className="btn btn-icademy-primary"
                    style={{ padding: "7px 8px !important", marginLeft:14 }}
                    >
                    2020 &nbsp; &nbsp; 
                    <i className="fa fa-caret-down"></i>
                    
                </button>
              </span>

              {/*RESPONSIVE IN THE CENTER 'WEB VIEW'*/}
              <Hidden only="xs">
                
                  <div className="row d-flex text-center" style={{padding: "12px 25px"}}>
                    <div className="col-sm-4">
                      <span className="f-w-800 f-14 text-c-grey2 " style={{textTransform : 'uppercase'}}>
                        Hari
                      </span>
                    </div>
                    <div className="col-sm-4">
                      <span className="f-w-800 f-14 text-c-grey2 " style={{textTransform : 'uppercase'}}>
                      Aktif
                      </span>
                    </div>
                    <div className="col-sm-4">
                      <span className="f-w-800 f-14 text-c-grey2 " style={{textTransform : 'uppercase'}}>
                      Tidak Aktif
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

export default RincianAbsensi;
