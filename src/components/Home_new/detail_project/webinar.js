import React, { Component } from "react";
import { Link } from "react-router-dom";
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";


class WebinarTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      webinars: [],
      headerWebinars: [
        {title : 'Moderator', width: null, status: true},
        {title : 'Status', width: null, status: true},
        {title : 'Waktu', width: null, status: true},
        {title : 'Tanggal', width: null, status: true},
        {title : 'Peserta', width: null, status: true},
        {title : 'File Project', width: null, status: true},
      ]
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/webinar/list/${this.props.projectId}`).then(res => {
        if(res.data.error) toast.warning("Error fetch API");

        console.log('STATE: ', res.data);
        this.setState({ webinars: res.data.result });
    })
  }

  render() {
    const headerTabble = this.state.headerWebinars;
    const bodyTabble = this.state.webinars;

    return (
            <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Webinar</strong>

                <Link
                to={`/webinar/create/${this.props.projectId}`}
                className="btn btn-v2 btn-primary float-right"
                // onClick={()=>toast.warning('Webinar sedang dalam pembangunan')}
                >
                    <i className="fa fa-plus"></i>
                    Tambah
                </Link>
                <Link
                to={`/webinar/roles/${this.props.projectId}`}
                className="btn btn-v2 btn-primary float-right mr-2"
                // onClick={()=>toast.warning('Webinar sedang dalam pembangunan')}
                >
                    <i className="fa fa-cog"></i>
                    Roles
                </Link>
            </span>
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                    <td>Nama Webinar</td>
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
                            return (
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">{item.judul}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.project_id}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.jam_mulai} - {item.jam_selesai}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.tanggal}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.project_id}</td>
                                <td className="fc-muted f-14 f-w-300" align="center" style={{borderRight: '1px solid #DDDDDD'}}>
                                    <button className="btn btn-icademy-file" >
                                        <i className="fa fa-download fc-skyblue"></i> Download File
                                    </button>
                                </td>
                                <td className="fc-muted f-14 f-w-300 " align="center">
                                    <Link to={`/webinar/create/${item.project_id}`} className="btn mr-2">Ubah</Link>
                                    <Link to={`/webinar/riwayat/${item.project_id}`} className="btn btn-v2 btn-primary mr-2">Riwayat</Link>
                                    <Link to={`/webinar/live/${item.project_id}`} className="btn btn-v2 btn-warning">Masuk</Link>
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

export default WebinarTable;