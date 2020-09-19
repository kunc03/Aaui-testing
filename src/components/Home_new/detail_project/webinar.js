import React, { Component } from "react";
import { Link } from "react-router-dom";
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from 'moment-timezone';
import { toast } from "react-toastify";


class WebinarTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      userId: Storage.get('user').data.user_id,
      users: [],
      dataUser: [],
      webinars: [],
      companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id,
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
    API.get(
        this.props.projectId ? `${API_SERVER}v2/webinar/list/${this.props.projectId}`
        : `${API_SERVER}v2/webinar/list-by-company/${this.state.companyId}`
        ).then(res => {
        if(res.data.error) {
            // toast.warning("Error fetch API");
        }
        else{
            this.setState({ webinars: res.data.result });
        }
    })
  }

  render() {
    const headerTabble = this.state.headerWebinars;
    const bodyTabble = this.state.webinars;
    const access_project_admin = this.props.access_project_admin;

    const StatusBadge = ({value}) => {
        if(value == 0) {
            return (
                <span class="badge badge-pill badge-warning">Belum Selesai</span>
            )
        } else if (value == 1) {
            return (
                <span class="badge badge-pill badge-success">Berlangsung</span>
            )
        } else if (value == 2) {
            return (
                <span class="badge badge-pill badge-primary">Selesai</span>
            )
        }
    }

    return (
            <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Webinar</strong>

                
                {access_project_admin == true ?
                <Link
                to={`/webinar/create/${this.props.projectId ? this.props.projectId : 0}`}
                >
                    <button
                    className="btn btn-icademy-primary float-right"
                    style={{ padding: "7px 8px !important", marginLeft:14 }}
                    >
                    <i className="fa fa-plus"></i>
                    
                    Tambah
                    </button>
                </Link>
                : null
                }
                {/* <Link
                to={`/webinar/roles/${this.props.projectId}`}
                className="btn btn-v2 btn-primary float-right mr-2"
                // onClick={()=>toast.warning('Webinar sedang dalam pembangunan')}
                >
                    <i className="fa fa-cog"></i>
                    Roles
                </Link> */}
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
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.moderator.name}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">
                                    <StatusBadge value={item.status} />
                                </td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.jam_mulai} - {item.jam_selesai}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.tanggal ? Moment.tz(item.tanggal, 'Asia/Jakarta').format("DD-MM-YYYY") : null}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.peserta.length}</td>
                                <td className="fc-muted f-14 f-w-300" align="center" style={{borderRight: '1px solid #DDDDDD'}}>
                                    <button className="btn btn-icademy-file" >
                                        <i className="fa fa-download fc-skyblue"></i> Download File
                                    </button>
                                </td>
                                <td className="fc-muted f-14 f-w-300 " align="center">
                                    {
                                        this.state.userId == item.sekretaris.user_id && 
                                        <Link to={`/webinar/add/${item.project_id}/${item.id}`} className="btn btn-v2 btn-success mr-2">Kelola</Link>
                                    }
                                    {
                                        access_project_admin && 
                                        <Link to={`/webinar/edit/${item.id}`} className="btn btn-v2 btn-success mr-2">Ubah</Link>
                                    }
                                    {
                                        item.status == 2 && 
                                        <Link to={`/webinar/riwayat/${item.project_id}`} className="btn btn-v2 btn-primary mr-2">Riwayat</Link>
                                    }
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