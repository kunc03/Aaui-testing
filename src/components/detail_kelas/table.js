import React, { Component } from "react";

import { Hidden } from '@material-ui/core';
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

class TableSilabus extends Component {
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
          <div className="card" style={{ height: '400px', paddingBottom: 10 }}>
            <div className="row">
              <div className="col-sm-2">
                <div className="mt-3 ml-3">
                  <img
                    alt=""
                    src="/assets/images/user/avatar-1.png"
                    className="rounded-circle img-profile mb-4"
                  />
                </div>
              </div>
              <div className="col-sm-10">
                <div className="row">
                  <div className="col-sm-6">
                    <table className="table mt-3 ">
                      <tr>
                        <td>Name </td>
                        <td style={{ backgroundColor: 'ghostwhite' }}><b>Adeyyansyah</b></td>
                      </tr>
                      <tr>
                        <td>NIK</td>
                        <td style={{ backgroundColor: 'ghostwhite' }}><b>3301062</b></td>
                      </tr>

                    </table>
                  </div>
                  <div className="col-sm-6">
                    <table className="table mt-3">
                      <tr>
                        <td>Subjects of Learning </td>
                        <td style={{ backgroundColor: 'ghostwhite' }}><b>Matematika</b></td>
                      </tr>
                      <tr>
                        <td>Class</td>
                        <td style={{ backgroundColor: 'ghostwhite' }}><b>II IPA</b></td>
                      </tr>

                    </table>
                  </div>

                  <div className="col-sm-12">
                    <table border="1" >
                      <tr style={{ background: ' gold', color: 'black' }} align="center">
                        <th className="fc-black" colspan="3">Presensi</th>
                      </tr>
                      <tr style={{ background: ' gold', color: 'black' }} align="center">
                        <th className="fc-black" >Hadir</th>
                        <th className="fc-black">Sakit</th>
                        <th className="fc-black">Sakit</th>
                      </tr>
                      <tr align="center">
                        <td>kiwi</td>
                        <td>cucumber</td>
                        <td>tomato</td>
                      </tr>
                    </table>
                  </div>

                  <div className="col-sm-12 mt-3">
                    <table className="table" border="1" >
                      <tr style={{ background: ' gold', color: 'black' }} align="center">
                        <th className="fc-black" colspan="3">Nilai Tugas</th>
                        <th className="fc-black" colspan="3">Nilai Kuis</th>
                        <th className="fc-black" rowspan="2">Nilai UTS</th>
                        <th className="fc-black" rowspan="2">Nilai UAS</th>
                        <th className="fc-black" rowspan="2">Rata-Rata Nilai </th>
                      </tr>
                      <tr style={{ background: ' gold', color: 'black' }} align="center">
                        <th className="fc-black" >1</th>
                        <th className="fc-black">2</th>
                        <th className="fc-black">3</th>

                        <th className="fc-black" >1</th>
                        <th className="fc-black">2</th>
                        <th className="fc-black">3</th>
                      </tr>
                      <tr align="center">
                        <td>25</td>
                        <td>88</td>
                        <td>66</td>

                        <td>25</td>
                        <td>88</td>
                        <td>66</td>

                        <td>66</td>
                        <td>25</td>
                        <td>88</td>
                      </tr>
                    </table>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default TableSilabus;
