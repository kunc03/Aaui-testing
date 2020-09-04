import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import Storage from '../../../repository/storage';


class WebinarTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      
    };
  }

  render() {
    const headerTabble = this.props.headerTabble;
    const bodyTabble = this.props.bodyTabble;
    return (
            <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Webinar</strong>
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
                            <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>Tidak ada</td>
                        </tr>
                        :
                        bodyTabble.map((item, i) => {
                            return (
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">{item.title}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.pembicara}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
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

export default WebinarTable;