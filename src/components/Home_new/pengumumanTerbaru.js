import React, { Component } from "react";
import Storage from '../../repository/storage';
import API, {API_SERVER} from '../../repository/api';
import { Link } from "react-router-dom";

import { bodyTabble} from '../../modul/data';
import Moment from 'moment-timezone';
import { toast } from "react-toastify";

class PengumumanTerbaru extends Component {
  state = {
    userId: Storage.get('user').data.user_id,
    toDoList: this.props.lists,
    toDo: '',
    header: [
      {title : 'Mata Pelajaran', width: null, status: true},
      {title : 'Topik', width: null, status: true},
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
                            <td className="fc-muted f-14 f-w-300 p-t-20"><b>{item.title}</b></td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">
                              <Link to={""}>
                                <span className=" f-12 fc-skyblue float-right">Lihat</span>
                              </Link></td>
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

export default PengumumanTerbaru;
