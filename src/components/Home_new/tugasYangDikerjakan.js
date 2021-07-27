import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, { API_SERVER } from '../../repository/api';

import { bodyTabble } from '../../modul/data';
import moment from 'moment-timezone';
import { toast } from "react-toastify";

class TugasYangDikerjakan extends Component {
  state = {
    userId: Storage.get('user').data.user_id,
    toDoList: this.props.lists,
    toDo: '',
    header: [
      { title: 'Subjects', width: null, status: true },
      { title: 'Batas waktu pengumpulan', width: null, status: true },
      { title: 'jumlah terkumpul', width: null, status: true },

    ]
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/todo/get/${this.state.userId}`).then(res => {
      if (res.data.error) toast.warning("Gagal fetch API");
      this.setState({ toDoList: res.data.result, toDo: "" });
    });
  }

  render() {
    const headerTabble = this.state.header;

    return (
      <div className="row">
        <div className="table-responsive">
          <table className="table table-hover" style={{ whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                {
                  headerTabble.map((item, i) => {
                    return (
                      <td align="center" width={item.width}><b>{item.title}</b></td>
                    )
                  })
                }
                <td colSpan="2" align="center"><b> Action </b></td>
              </tr>
            </thead>
            <tbody>
              {
                bodyTabble.length == 0 ?
                  <tr>
                    <td className="fc-muted f-14 f-w-300 p-t-20" colspan='8'>There is no</td>
                  </tr>
                  :
                  bodyTabble.map((item, i) => {
                    let levelUser = Storage.get('user').data.level;
                    return (
                      <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20">{item.title}</td>
                        <td className="fc-muted f-14 f-w-300 p-t-20" align="center">Andre</td>
                        <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{moment(item.jam_mulai, 'HH:mm').local().format('HH:mm')} - {moment(item.jam_selesai, 'HH:mm').local().format('HH:mm')}</td>
                        <td className="fc-muted f-14 f-w-300" align="center">
                          <button className="btn btn-icademy-file" >
                            <i className="fa fa-download fc-skyblue"></i> Download File
                                </button>
                        </td>
                      </tr>
                    )
                  })
              }

            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TugasYangDikerjakan;
