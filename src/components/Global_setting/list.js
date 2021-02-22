import React from 'react';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import ProjectAdmin from './projectAdmin'

const datas = [
  { title: 'Create and delete projects', width: null, status: false },
  { title: 'Creatting and deleting meeting room', width: null, status: true },
  { title: 'Status', width: null, status: false },
  { title: 'Time', width: null, status: false },
  { title: 'Date', width: null, status: true },
  { title: 'Participants', width: null, status: true },
  { title: 'File Project', width: null, status: false },
];

class ListAccess extends React.Component {

  state = {
    projectAdmin: Storage.get('user').data.level === "admin" ? true : false,
    grupId: this.props.match.params.grup_id,

    roles: {}
  }

  componentDidMount() {
    this.fetchRoles()
  }

  fetchRoles() {
    API.get(`${API_SERVER}v2/grup/${this.state.grupId}`).then(res => {
      if(res.status === 200 && res.data.result.length !== 0) {
        this.setState({ roles: res.data.result[0] })
      }
    })
  }

  render() {
    const { roles } = this.state;

    return (
      <>
        {
          this.state.grupId === "0" ? <ProjectAdmin /> :
          <div className="pcoded-inner-content mt-3">
            <div className="card">
              <div className="card-body">
                <div class="row ">
                  <div className="col-sm-12" style={{ marginTop: '10px' }}>
                    <h3 className="f-w-bold f-18 mb-4 p-l-20 ">{roles.grup_name}</h3>

                    <div className="wrap">
                      {
                        datas.length == 0 ?
                          <div className="col-sm-12 mb-1">
                            Not available
                          </div>
                          :
                          datas.map((item, i) => (
                            <div className="col-sm-12 mb-1">
                              <div className="row p-10 p-t-15 p-b-15" style={{ borderBottom: '1px solid #E6E6E6' }}>
                                <span to={`detail-project/${item.id}`} className={"col-sm-5"}>
                                  <div className="box-project">
                                    <div className=" f-w-800 f-16 fc-black">
                                      {item.title}
                                    </div>
                                    {item.share_from && <span class="badge badge-pill badge-secondary" style={{ fontSize: 8, backgroundColor: '#007bff' }}>{item.share_from}</span>}
                                  </div>
                                </span>
                                <span className="col-sm-7">
                                  <label class="switch float-right">
                                    <input type="checkbox" checked={item.status}></input>
                                    <span class="slider round"></span>
                                  </label>
                                </span>
                              </div>
                            </div>
                          ))
                      }

                    </div>
                  </div>

                  <div className="col-sm-12" style={{ marginTop: '10px' }}>
                    <h3 className="f-w-bold f-18 mb-4 mt-4 p-l-20 " style={{ borderBottom: '1px solid #000', padding: '10px' }}>Report
                     &nbsp; <i className="fa fa-caret-down"></i>
                    </h3>

                    <div className="wrap">
                      {
                        datas.length == 0 ?
                          <div className="col-sm-12 mb-1">
                            Not available
                      </div>
                          :
                          datas.map((item, i) => (
                            <div className="col-sm-12 mb-1">
                              <div className="row p-10 p-t-15 p-b-15" style={{ borderBottom: '1px solid #E6E6E6' }}>
                                <span to={`detail-project/${item.id}`} className={"col-sm-5"}>
                                  <div className="box-project">
                                    <div className=" f-w-800 f-16 fc-black">
                                      {item.title}
                                    </div>
                                    {item.share_from && <span class="badge badge-pill badge-secondary" style={{ fontSize: 8, backgroundColor: '#007bff' }}>{item.share_from}</span>}
                                  </div>
                                </span>
                                <span className="col-sm-7">
                                  <label class="switch float-right">
                                    <input type="checkbox" checked={item.status}></input>
                                    <span class="slider round"></span>
                                  </label>
                                </span>
                              </div>
                            </div>
                          ))
                      }

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        }
      </>
    )
  }
}

export default ListAccess;
