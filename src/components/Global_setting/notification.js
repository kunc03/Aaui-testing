import React from 'react';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify';

const datas = [
  { title: 'Create and delete projects', width: null, status: true },
  { title: 'Creatting and deleting meeting room', width: null, status: true },
  { title: 'Status', width: null, status: false },
  { title: 'Time', width: null, status: false },
  { title: 'Date', width: null, status: true },
  { title: 'Participants', width: null, status: true },
  { title: 'File Project', width: null, status: false },
];

class NotificationSetting extends React.Component {
  state = {
    projectAdmin: Storage.get('user').data.level === 'admin' ? true : false,
    projectId: 0,
    meeting: [],
    training: [],
    ghantt: [],
  };

  componentDidMount() {
    API.get(
      `${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${
        Storage.get('user').data.company_id
      }`,
    ).then((response) => {
      if (response.data.result.length) {
        this.setState({ projectId: response.data.result[0].id });
      } else {
        toast.warning(`Buat project terlebih dahulu.`);
      }
    });
    this.fetchAccess();
  }

  fetchAccess() {
    let companyId = Storage.get('user').data.company_id;
    API.get(`${API_SERVER}v2/notification-alert/${companyId}/admin`).then((res) => {
      if (res.status === 200) {
        const meeting = res.data.result.filter((item) => item.sub === 'meeting');
        const training = res.data.result.filter((item) => item.sub === 'training');
        const ghantt = res.data.result.filter((item) => item.sub === 'gantt');

        this.setState({ meeting, training, ghantt });
      }
    });
  }

  changeStatusWebsite = (e) => {
    let id = e.target.getAttribute('data-id');
    let val = e.target.value;

    API.put(`${API_SERVER}v2/notification-alert/${id}/website`, { status_website: val === "1" ? 0 : 1}).then(res => {
      if(res.status === 200){
        this.fetchAccess();
      }
    })
  }

  changeStatusEmail = (e) => {
    let id = e.target.getAttribute('data-id');
    let val = e.target.value;

    API.put(`${API_SERVER}v2/notification-alert/${id}/email`, { status_website: val === "1" ? 0 : 1}).then(res => {
      if(res.status === 200){
        this.fetchAccess();
      }
    })
  }

  changeStatusMobile = (e) => {
    let id = e.target.getAttribute('data-id');
    let val = e.target.value;

    API.put(`${API_SERVER}v2/notification-alert/${id}/mobile`, { status_website: val === "1" ? 0 : 1}).then(res => {
      if(res.status === 200){
        this.fetchAccess();
      }
    })
  }

  

  render() {
    const { meeting, training, ghantt } = this.state;

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: '#F6F6FD' }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content mt-3">
              <h3 className="f-w-bold f-18 mb-4 fc-blue p-l-20 ">Notification</h3>
              <div className="card">
                <div className="card-body">
                  <div class="row ">
                    <div className="col-sm-12" style={{ marginTop: '10px' }}>
                      <div
                        className="table-responsive"
                        style={{
                          overflowX: 'hidden',
                          overflowY: this.props.scrollHeight ? 'scroll' : 'auto',
                          height: this.props.scrollHeight ? this.props.scrollHeight : 'auto',
                        }}
                      >
                        <table className="table table-hover">
                          <thead>
                            <tr style={{ borderBottom: '1px solid #000' }}>
                              <td className="f-w-bold f-14" style={{ width: '45%' }}>
                                Meeting
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Email
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Mobile
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Website
                              </td>
                              {/* <td align="center" className="f-w-bold f-14">
                                Website
                              </td> */}
                            </tr>
                          </thead>

                          {meeting.length === 0 ? (
                            <div className="col-sm-12 mb-1">Not available</div>
                          ) : (
                            meeting.map((item, i) => (
                              <tbody>
                                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                                  <td className="fc-muted f-14 f-w-300 p-t-20">{item.name}</td>
                                  <td align="center">
                                    <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusEmail}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusMobile}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusWebsite}
                                        data-id={item.id_access}
                                        value={item.status_website}
                                        checked={item.status_website}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </table>
                      </div>

                      <div
                        className="table-responsive"
                        style={{
                          overflowX: 'hidden',
                          overflowY: this.props.scrollHeight ? 'scroll' : 'auto',
                          height: this.props.scrollHeight ? this.props.scrollHeight : 'auto',
                        }}
                      >
                        <table className="table table-hover">
                          <thead>
                            <tr style={{ borderBottom: '1px solid #000' }}>
                              <td className="f-w-bold f-14" style={{ width: '45%' }}>
                                Training
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Email
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Mobile
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Website
                              </td>
                              {/* <td align="center" className="f-w-bold f-14">
                                Website
                              </td> */}
                            </tr>
                          </thead>
                          {training.length === 0 ? (
                            <div className="col-sm-12 mb-1">Not available</div>
                          ) : (
                            training.map((item, i) => (
                              <tbody>
                                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                                  <td className="fc-muted f-14 f-w-300 p-t-20">{item.name}</td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusEmail}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusMobile}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusWebsite}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </table>
                      </div>

                      <div
                        className="table-responsive"
                        style={{
                          overflowX: 'hidden',
                          overflowY: this.props.scrollHeight ? 'scroll' : 'auto',
                          height: this.props.scrollHeight ? this.props.scrollHeight : 'auto',
                        }}
                      >
                        <table className="table table-hover">
                          <thead>
                            <tr style={{ borderBottom: '1px solid #000' }}>
                              <td className="f-w-bold f-14" style={{ width: '45%' }}>
                                Project Gantt Chart{' '}
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Email
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Mobile
                              </td>
                              <td align="center" className="f-w-bold f-14">
                                Website
                              </td>
                              {/* <td align="center" className="f-w-bold f-14">
                                Website
                              </td> */}
                            </tr>
                          </thead>
                          {ghantt.length === 0 ? (
                            <div className="col-sm-12 mb-1">Not available</div>
                          ) : (
                            ghantt.map((item, i) => (
                              <tbody>
                                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                                  <td className="fc-muted f-14 f-w-300 p-t-20">{item.name}</td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusEmail}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusMobile}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td align="center">
                                  <label class="switch">
                                      <input
                                        type="checkbox"
                                        onChange={this.changeStatusWebsite}
                                        data-id={item.id_access}
                                        value={item.status}
                                        checked={item.status}
                                      ></input>
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                </tr>
                              </tbody>
                            ))
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotificationSetting;
