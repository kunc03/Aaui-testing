import React, { Component } from "react";

import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { dataBar, dataUser, dataRadar, dataPie } from '../../modul/data';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class InfoRapor extends Component {
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

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card" style={{ paddingBottom: 10 }}>
            <div className="row pt-3">
              <div className="col-sm-3 pl-5">
                <div className="form-group">
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

              <div className="col-sm-3">

                <div className="form-group" >
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
            </div>
          </div>
        </div>

      </div>


    );
  }
}

export default InfoRapor;
