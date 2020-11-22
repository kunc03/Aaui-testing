import React, { Component } from "react";
import TableWebinar from './webinar';
import Storage from '../../repository/storage';
import { headerTabble, bodyTabble } from '../../modul/data';

class MuridWebinar extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return (
      <div className="card p-20">
        <span className="mb-4">
          <strong className="f-w-bold f-18 fc-skyblue ">Daftar Liveclass / Webinar</strong>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
                  <td>Nama Webinar</td>
                  {
                    headerTabble.map((item, i) => {
                      return (
                        <td align="center" width={item.width}>{item.title}</td>
                      )
                    })
                  }
                  <td colSpan="2" align="center"> Action </td>
                </tr>
              </thead>
              <tbody>
                {
                  bodyTabble.length == 0 ?
                    <tr>
                      <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>There is no</td>
                    </tr>
                    :
                    bodyTabble.map((item, i) => {

                      return (
                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                          <td className="fc-muted f-14 f-w-300 p-t-20">{item.title}</td>
                          <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.name}</td>
                          <td className="fc-muted f-14 f-w-300 p-t-20" align="center" style={{ color: '#0091FF' }}>Aktif</td>
                          <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.waktu_start + ' - ' + item.waktu_end : '-'}</td>
                          <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_scheduled == 1 ? item.tanggal : '-'}</td>
                          <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.is_private == 1 ? item.total_participant : '-'}</td>

                          <td className="fc-muted f-14 f-w-300 " align="center"><button className={`btn btn-icademy-primary btn-icademy-warning`} >Masuk</button></td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
          </div>
        </span>
      </div>

    )
  }
}

export default MuridWebinar;
