import React from 'react';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from "react-toastify";

const datas = [
  { title: 'Create and delete projects', width: null, status: false },
  { title: 'Creatting and deleting meeting room', width: null, status: true },
  { title: 'Status', width: null, status: false },
  { title: 'Time', width: null, status: false },
  { title: 'Date', width: null, status: true },
  { title: 'Participants', width: null, status: true },
  { title: 'File Project', width: null, status: false },
];

class ProjectAdmin extends React.Component {

  state = {
    projectAdmin: Storage.get('user').data.level === "admin" ? true : false,
    projectId: 0
  }

  componentDidMount() {
    API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${Storage.get('user').data.company_id}`).then(response => {
      if (response.data.result.length) {
        this.setState({ projectId: response.data.result[0].id })
      } else {
        toast.warning(`Buat project terlebih dahulu.`)
      }
    })
  }

  render() {

    return (


      <div className="pcoded-inner-content mt-3">
        <div className="card">
          <div className="card-body">
            <div class="row ">
              <div className="col-sm-12" style={{ marginTop: '10px' }}>
                <h3 className="f-w-bold f-18 mb-4 p-l-20 ">Project Admin</h3>

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

    )
  }
}

export default ProjectAdmin;
