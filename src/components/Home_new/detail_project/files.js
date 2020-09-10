import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import Storage from '../../../repository/storage';
import { toast } from "react-toastify";


class FilesTable extends Component {
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
                <strong className="f-w-bold f-18 fc-skyblue ">Files</strong>
                <input 
                    type="text"
                    placeholder="Search"
                    className="form-control float-right col-sm-3"/>
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
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src='assets/images/component/folder.png' width="32"/> &nbsp;{item.title}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.pembicara}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.status}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center"><a href="detail-project/80">Ubah</a></td>
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

export default FilesTable;