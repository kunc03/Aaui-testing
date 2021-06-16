import React from 'react';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from "react-toastify";

class ProjectAdmin extends React.Component {

  state = {
    projectAdmin: Storage.get('user').data.level === "admin" ? true : false,
    projectId: 0,

    general: [],
  }

  componentDidMount() {
    this.fetchAccess()
  }

  fetchAccess() {
    API.get(`${API_SERVER}v2/global-settings/${Storage.get('user').data.company_id}/speaker`).then((res) => {
      if (res.status === 200) {
        const general = res.data.result.filter((item) => item.sub === 'webinar' && item.level === 'admin' && item.role === 'speaker');
        this.setState({ general :  general });
      }
    });
  }
  changeStatus = e => {
    let id = e.target.getAttribute('data-id')
    let val = e.target.value
    API.put(`${API_SERVER}v2/global-settings/${id}`, {status: val === "1" ? 0 : 1}).then(res => {
      this.fetchAccess()
    })
  }

  render() {
    const { general } = this.state;

    return (

      <div className="pcoded-inner-content mt-3">
        <div className="card">
          <div className="card-body">
            <div class="row ">

              <div className="col-sm-12" style={{ marginTop: '10px' }}>
              <div className="box-text d-flex justify-content-between pr-3">
                  <h3 className="f-w-bold f-18 mb-4 p-l-20 ">General</h3>
                  <small className="f-12 mb-4 p-l-20 text-muted float-right ml-5">Last Updated</small>
                </div>

                <div className="wrap">
                  {
                    general.length == 0 ?
                      <div className="col-sm-12 mb-1">
                        Not available
                      </div>
                      :
                      general.map((item, i) => (
                        <div className="col-sm-12 mb-1">
                        <div className="row p-8 p-t-15 p-b-15" style={{ borderBottom: '1px solid #E6E6E6' }}>
                          <span to={`detail-project/${item.id}`} className={'col-sm-10'}>
                            <div className="box-project">
                              <div className=" f-w-800 f-16 fc-black">{item.name}</div>
                              {item.share_from && (
                                <span
                                  class="badge badge-pill badge-secondary"
                                  style={{ fontSize: 8, backgroundColor: '#007bff' }}
                                >
                                  {item.share_from}
                                </span>
                              )}
                            </div>
                          </span>
                          <span className="col-sm-1">
                            <label class="switch float-right">
                              <input
                                type="checkbox"
                                onChange={this.changeStatus}
                                data-id={item.id_access}
                                value={item.status}
                                checked={item.status}
                              ></input>
                              <span class="slider round"></span>
                            </label>
                          </span>
                          <span className="col-sm-1">
                            <small>{item.update_at}</small>
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