import React, { Component } from "react";

import { Hidden } from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class TableMurid extends Component {
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
          <div className="card" style={{ height: '400px', padding: 10 }}>
            <table className="table" border="1" >
              <tr style={{ background: ' gold', color: 'black' }} align="center">
                <th className="fc-black" rowspan="2">Nomor</th>
                <th className="fc-black" rowspan="2">Kelas</th>
                <th className="fc-black" rowspan="2">Nik</th>
                <th className="fc-black" rowspan="2">Nama Murid</th>
                <th className="fc-black" colspan="4">Rata-Rata </th>
                <th className="fc-black" rowspan="2">Nilai Akhir</th>
              </tr>
              <tr style={{ background: ' gold', color: 'black' }} align="center">


                <th className="fc-black" >1</th>
                <th className="fc-black">2</th>
                <th className="fc-black">3</th>
                <th className="fc-black">4</th>
              </tr>
              <tr align="center">
                <td>1</td>
                <td>12 IPS</td>

                <td>131321354545454</td>
                <td>Andrew</td>
                <td>66</td>

                <td>66</td>
                <td>25</td>
                <td>88</td>
                <td>88</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

    );
  }
}

export default TableMurid;
