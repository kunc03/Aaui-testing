import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, {API_SERVER} from '../../repository/api';

import { bodyTabble} from '../../modul/data';
import Moment from 'moment-timezone';
import { toast } from "react-toastify";

class JadwalHariIni extends Component {
  state = {
    userId: Storage.get('user').data.user_id,
    toDoList: this.props.lists,
    toDo: '',
    header: [
      {title : 'Mata Pelajaran', width: null, status: true},
      {title : 'Topik', width: null, status: true},
      {title : 'Waktu', width: null, status: true},
      {title : 'Sesi', width: null, status: true},
    ]
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/todo/get/${this.state.userId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      this.setState({ toDoList: res.data.result, toDo: "" });
    });
  }

  render() {
    const headerTabble = this.state.header;

    return (
      <div className="row">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
                <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                {
                    headerTabble.map((item, i) => {
                        return (
                        <td align="center" width={item.width}>{item.title}</td>
                        )
                    })
                }
                <td colSpan="2" align="center">Aksi</td>
                </tr>
            </thead>
            <tbody>
                {
                    bodyTabble.length == 0 ?
                    <tr>
                        <td className="fc-muted f-14 f-w-300 p-t-20" colspan='8'>Tidak ada</td>
                    </tr>
                    :
                    bodyTabble.map((item, i) => {
                        let levelUser = Storage.get('user').data.level;
                        return (
                        <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                            <td className="fc-muted f-14 f-w-300 p-t-20">{item.title}</td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">Andre</td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.jam_mulai} - {item.jam_selesai}</td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.tanggal ? Moment.tz(item.tanggal, 'Asia/Jakarta').format("DD-MM-YYYY") : null}</td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">200</td>
                            <td className="fc-muted f-14 f-w-300" align="center" style={{borderRight: '1px solid #DDDDDD'}}>
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

export default JadwalHariIni;
