import React, { Component } from "react";

import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { dataBar, dataUser, dataRadar, dataPie } from '../../modul/data';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class UjianAktif extends Component {
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

    return (
        <div className="row">
          <div className="col-sm-12">
            <div className="card" style={{ paddingBottom: 10}}>
              <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
              Exercise & Ujian Aktif
              </h3>

              <Pie
                data={dataPie}
                
              />
            </div>
          </div>

        </div>
      
    
    );
  }
}

export default UjianAktif;
