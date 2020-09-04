import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import Storage from './../../../repository/storage';


class MeetingTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      meeting: []
      
    };
  }

  fetchMeeting(){
    let levelUser = Storage.get('user').data.level;
    let userId = Storage.get('user').data.user_id;
      API.get(`${API_SERVER}v1/liveclass/project/${levelUser}/${userId}/${this.props.projectId}`).then(res => {
        if (res.status === 200) {
          this.setState({
            meeting: res.data.result,
          })
        }
      })
  }

  componentDidMount(){
      this.fetchMeeting();
  }

  render() {
    const headerTabble = this.props.headerTabble;
    const bodyTabble = this.state.meeting;
    return (
            <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Meeting</strong>
                <button
                to='/user-create'
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important" }}
                >
                <i className="fa fa-plus"></i>
                
                Add New
                </button>
            </span>
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                    <td>Nama Meeting</td>
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
                            <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>Tidak ada</td>
                        </tr>
                        :
                        bodyTabble.map((item, i) => {
                            // let dateStart = new Date(new Date(item.schedule_start).toISOString().slice(0, 16).replace('T', ' '));
                            let dateStart = new Date(item.schedule_start);
                            let dateEnd = new Date(item.schedule_end);
                            let status='';
                            if ((new Date() >= dateStart && new Date() <= dateEnd) || item.is_scheduled == 0){
                                status='Open'
                            }
                            else{
                                status='Close'
                            }
                            return (
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">{item.room_name}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.name}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center" style={{color: status == 'Open' ? '#FA6400' : '#0091FF'}}>{status}</td>
                            <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.waktu_start+' - '+item.waktu_end : '-'}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.tanggal : '-'}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_private == 1 ? item.total_participant : '-'}</td>
                                <td className="fc-muted f-14 f-w-300" align="center" style={{borderRight: '1px solid #DDDDDD'}}>
                                <button className="btn btn-icademy-file" ><i className="fa fa-download fc-skyblue"></i> Download File</button>
                                </td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center"><a href="detail-project/80">Ubah</a></td>
                                <td className="fc-muted f-14 f-w-300 " align="center"><button className="btn btn-icademy-warning">Masuk</button></td>
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

export default MeetingTable;