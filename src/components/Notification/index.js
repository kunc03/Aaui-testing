import React, { Component } from "react";
import { Link } from 'react-router-dom';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import SocketContext from '../../socket';
const tabs = [
  { title: 'Notification' },
  { title: 'Reminder' },
];
class NotificationClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notificationData: [],
      tabIndex: 1,
      badgeNotif: 0,
      badgeRemind: 0,
    };
    this.tabAktivitas = this.tabAktivitas.bind(this);
  }

  tabAktivitas(a, b) {
    this.setState({ tabIndex: b + 1 });
  }

  componentDidMount() {
    this.fetchNotif();

    this.props.socket.on('broadcast', data => {
      this.fetchNotif()
    })
  }

  deleteNotif = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/notification/id/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) console.log(`Error delete`)

      this.fetchNotif();
    })
  }

  deleteAllNotif = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if (item.tag == 1) {
        temp.push(item.id)
      }
    });
    API.put(`${API_SERVER}v1/notification/id/${Storage.get('user').data.user_id}`, { notifIds: temp }).then(res => {
      if (res.data.error) console.log(`Error delete`)

      this.fetchNotif();
    })
  }

  readAllNotif = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if (item.tag == 1 && item.isread == 0) {
        temp.push(item.id)
      }
    });
    API.put(`${API_SERVER}v1/notification/read/all`, { userId: Storage.get('user').data.user_id, notifIds: temp }).then(res => {
      if (res.data.error) console.log('Error update')

      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
      this.fetchNotif();
    })
  }

  deleteAllReminder = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if (item.tag == 2) {
        temp.push(item.id)
      }
    });
    API.put(`${API_SERVER}v1/notification/id/${Storage.get('user').data.user_id}`, { notifIds: temp }).then(res => {
      if (res.data.error) console.log(`Error delete`)

      this.fetchNotif();
    })
  }

  readAllReminder = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if (item.tag == 2 && item.isread == 0) {
        temp.push(item.id)
      }
    });
    console.log('state: ', temp)
    API.put(`${API_SERVER}v1/notification/read/all`, { userId: Storage.get('user').data.user_id, notifIds: temp }).then(res => {
      if (res.data.error) console.log('Error update')

      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
      this.fetchNotif();
    })
  }

  fetchNotif() {
    API.get(`${API_SERVER}v1/notification/all/${Storage.get('user').data.user_id}`).then((res) => {
      const Notif = res.data.result[0].filter(item => item.isread === 0 && item.tag === 1);
      const Remind = res.data.result[0].filter(item => item.isread === 0 && item.tag === 2);
      // console.log('state: ', Notif);
      this.setState({
        notificationData: res.data.result[0],
        badgeNotif: Notif.length,
        badgeRemind: Remind.length
      });
    });
  }

  readNotif(id) {
    API.put(`${API_SERVER}v1/notification/read`, { id }).then(res => {
      if (res.data.error) console.log('Gagal read')

      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
      this.fetchNotif();
    })
  }

  konfirmasiHadir(id) {
    // console.log(`INI GW KLIK KONFRIMASI`)
    // console.log(`${API_SERVER}v1/ptc-room/konfirmasi/${id}/${Storage.get('user').data.user_id}`);
    API.put(`${API_SERVER}v1/ptc-room/konfirmasi/${id}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) console.log('Error: ', res.data.error);

      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
      this.fetchNotif();
    })
  }

  render() {
    const { notificationData } = this.state;

    const dataNotif = notificationData.filter(item => item.tag == 1);
    const dataRemind = notificationData.filter(item => item.tag == 2);
    // console.log(dataNotif, 'dadadadadadads')

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    {tabs.map((tab, index) => {
                      return (
                        <div className="col-xl-6 mb-3">
                          <Link
                            onClick={this.tabAktivitas.bind(this, tab, index)}
                          >
                            <div
                              className={
                                this.state.tabIndex === index + 1
                                  ? 'kategori-aktif'
                                  : 'kategori title-disabled'
                              }
                            >
                              {tab.title}
                            </div>
                          </Link>
                          {
                            tab.title === "Notification" ?
                              <span className="badge-notif" style={this.state.badgeNotif > 9 ? { padding: '1px 3px' } : { padding: '1px 6px' }}>{this.state.badgeNotif}</span>
                              :
                              <span className="badge-notif" style={this.state.badgeRemind > 9 ? { padding: '1px 3px' } : { padding: '1px 6px' }}>{this.state.badgeRemind}</span>
                          }

                        </div>
                      );
                    })}

                    {/* {console.log(this.state.tabIndex)} */}
                    {this.state.tabIndex === 1 ? (
                      // TAB NOTIFICATIOIN
                      <div className="col-sm-12" style={{ margin: '10px 10px 10px 0' }}>
                        {dataNotif.length === 0 ?
                          <span style={{ width: '-webkit-fill-available', marginTop: '15px', padding: 20 }}>
                            <b className="fc-blue ">No notifications at this time ...</b>
                          </span>
                          :
                          <span>
                            <button onClick={this.deleteAllNotif} className="btn btn-transparent ml-4"> Remove all</button>
                            <button onClick={this.readAllNotif} className="btn btn-transparent ml-2"> Read all</button>
                            {
                              dataNotif.map((item, i) => {
                                return (
                                  <div onClick={() => this.readNotif(item.id)} className="row" key={item.id} style={{ background: '#FFF', borderRadius: 4, padding: '12px', margin: '10px 10px 10px -15px' }}>
                                    <span style={{ width: '-webkit-fill-available' }}>
                                      {
                                        item.isread == 0 &&
                                        <span style={{ margin: '5px', padding: '1px 6px', borderRadius: '8px', color: 'white', background: 'red' }}>new</span>
                                      }
                                      <b className="fc-blue ">
                                        {item.type == 1 ? "Course" : item.type == 2 ? "Forum" : item.type == 3 ? "Meeting" :
                                          item.type == 4 ? "Pengumuman" : item.type == 5 ? "Task" : item.type == 6 ? "Files" :
                                            item.type == 7 ? "Training" : item.type == 8 ? "PTC" : "Notifikasi"}
                                      </b>
                                              &nbsp; &nbsp;
                                              <small>
                                        {moment.utc(item.created_at).format('HH:mm')} &nbsp;
                                                {moment.utc(item.created_at).format('DD/MM/YYYY')}
                                      </small>
                                      <p className="fc-muted mt-1">
                                        {item.description}
                                      </p>

                                      {
                                        item.destination &&
                                        <a href={item.destination == 'null' ? APPS_SERVER : item.destination == null ? APPS_SERVER : item.destination} className="btn btn-v2 btn-primary">Cek Sekarang</a>
                                      }
                                      {
                                        item.type == '8' && <button onClick={() => this.konfirmasiHadir(item.activity_id)} data-activity={item.activity_id} className="btn btn-v2 btn-primary">Konfirmasi Hadir</button>
                                      }
                                      <i className="fa fa-trash float-right" onClick={this.deleteNotif} data-id={item.id} style={{ cursor: 'pointer' }}></i>
                                    </span>

                                  </div>
                                )
                              })
                            }
                          </span>
                        }
                      </div>
                    ) :
                      (
                        // TABS REMINDER
                        <div className="col-sm-12" style={{ margin: '10px 10px 10px 0' }}>
                          {dataRemind.length === 0 ?
                            <span style={{ width: '-webkit-fill-available', marginTop: '15px', padding: 20 }}>
                              <b className="fc-blue ">There is no reminder at this time ...</b>
                            </span>
                            :
                            <span>
                              <button onClick={this.deleteAllReminder} className="btn btn-transparent ml-4"> Remove all</button>
                              <button onClick={this.readAllReminder} className="btn btn-transparent ml-2"> Read all</button>
                              {
                                dataRemind.map((item, i) => {
                                  return (
                                    <div onClick={() => this.readNotif(item.id)} className="row" key={item.id} style={{ background: '#FFF', borderRadius: 4, padding: '12px', margin: '10px 10px 10px -15px' }}>

                                      <span style={{ width: '-webkit-fill-available' }}>
                                        {
                                          item.isread == 0 &&
                                          <span style={{ margin: '5px', padding: '1px 6px', borderRadius: '8px', color: 'white', background: 'red' }}>new</span>
                                        }
                                        <b className="fc-blue ">
                                          {item.type == 1 ? "Course" : item.type == 2 ? "Forum" : item.type == 3 ? "Meeting" :
                                            item.type == 4 ? "Pengumuman" : item.type == 5 ? "Task" : item.type == 6 ? "Files" :
                                              item.type == 7 ? "Training" : "Notifikasi"}
                                        </b>
                                              &nbsp; &nbsp;
                                              <small>
                                          {moment.utc(item.created_at).format('HH:mm')} &nbsp;
                                                {moment.utc(item.created_at).format('DD/MM/YYYY')}
                                        </small>
                                        <p className="fc-muted mt-1">
                                          {item.description}
                                        </p>

                                        <a href={item.destination == 'null' ? APPS_SERVER : item.destination == null ? APPS_SERVER : item.destination} className="btn btn-v2 btn-primary">Check now</a>
                                        <i className="fa fa-trash float-right" onClick={this.deleteNotif} data-id={item.id} style={{ cursor: 'pointer' }}></i>
                                      </span>

                                    </div>
                                  )
                                })
                              }
                            </span>
                          }
                        </div>
                      )
                    }
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

export default Notification;
