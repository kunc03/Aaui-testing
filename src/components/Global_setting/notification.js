import React from 'react';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from "react-toastify";

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
        <h3 className="f-w-bold f-18 mb-4 fc-blue p-l-20 ">Notification</h3>
        <div className="card">
          <div className="card-body">
            <div class="row ">
              <div className="col-sm-12" style={{ marginTop: '10px' }}>

                <div className="table-responsive" style={{ overflowX: 'hidden', overflowY: this.props.scrollHeight ? 'scroll' : 'auto', height: this.props.scrollHeight ? this.props.scrollHeight : 'auto' }}>
                  <table className="table table-hover">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #000' }}>
                        <td className="f-w-bold f-14" style={{ width: '45%' }}>Meeting</td>
                        <td align="center" className="f-w-bold f-14">Email</td>
                        <td align="center" className="f-w-bold f-14">Mobile</td>
                        <td align="center" className="f-w-bold f-14">Website</td>
                        <td align="center" className="f-w-bold f-14">Website</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Meeting Attendance Confirmation</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Meeting Schedule Changes</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-muted"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Reminder: The closest meeting</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                    </tbody>

                  </table>
                </div>

                <div className="table-responsive" style={{ overflowX: 'hidden', overflowY: this.props.scrollHeight ? 'scroll' : 'auto', height: this.props.scrollHeight ? this.props.scrollHeight : 'auto' }}>
                  <table className="table table-hover">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #000' }}>
                        <td className="f-w-bold f-14" style={{ width: '45%' }}>Training</td>
                        <td align="center" className="f-w-bold f-14">Email</td>
                        <td align="center" className="f-w-bold f-14">Mobile</td>
                        <td align="center" className="f-w-bold f-14">Website</td>
                        <td align="center" className="f-w-bold f-14">Website</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Pending Request / Assignment, Change of Training Schedule</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Reminder: Deadline Assignment</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-muted"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                    </tbody>

                  </table>
                </div>

                <div className="table-responsive" style={{ overflowX: 'hidden', overflowY: this.props.scrollHeight ? 'scroll' : 'auto', height: this.props.scrollHeight ? this.props.scrollHeight : 'auto' }}>
                  <table className="table table-hover">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #000' }}>
                        <td className="f-w-bold f-14" style={{ width: '45%' }}>Project Gantt Chart </td>
                        <td align="center" className="f-w-bold f-14">Email</td>
                        <td align="center" className="f-w-bold f-14">Mobile</td>
                        <td align="center" className="f-w-bold f-14">Website</td>
                        <td align="center" className="f-w-bold f-14">Website</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Status Changed ("Open" to "In Progress", etc.)</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >The task assigned to him</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-muted"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Update folder & file</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                        <td className="fc-muted f-14 f-w-300 p-t-20" >Reminder: Project</td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center">
                          <i className="fa fa-check fa-lg fc-skyblue"></i> &nbsp;
                          <i class="fa fa-microphone-slash fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                        <td align="center"><i className="fa fa-check fa-lg fc-skyblue"></i></td>
                      </tr>
                    </tbody>

                  </table>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    )
  }
}

export default NotificationSetting;
