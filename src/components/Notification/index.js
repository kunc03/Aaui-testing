import React, { Component } from "react";
import { Link } from 'react-router-dom';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import SocketContext from '../../socket';
const tabs = [
  { title: 'Notification' },
  // { title: 'Reminder' },
];
class NotificationClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notificationData: [],
      tabIndex: 1,
      badgeNotif: 0,
      badgeRemind: 0,
      filterType: '',
      filterNotification: '',
      notif : [],
      notifFilter : []
    };
    this.tabAktivitas = this.tabAktivitas.bind(this);
  }

  filterNotification = (e) => {
    e.preventDefault();
    this.setState({ filterNotification: e.target.value });
  }

  changeFilterType = e => {
    this.setState({ filterType: e.target.value })
  }

  tabAktivitas(a, b) {
    this.setState({ tabIndex: b + 1 });
  }

  componentDidMount() {
    this.fetchNotif();
    this.fetchCheckAccess(Storage.get('user').data.company_id, ['R_CONFIRMATION']);

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

  fetchCheckAccess(company_id, param)
  {
    API.get(`${API_SERVER}v2/notification-alert/check-access`, {company_id, param}).then(res => {
      if(res.status === 200){
        console.log(res.data.result, 'test')
        this.setState({ notif : res.data.result})
      }
    })
  }

  fetchNotification()
  {
   let url = '';
   let types = '';

   if ( types === 1 ) {
      url = `${API_SERVER}v2/notif?user_id=${Storage.get('user').data.user_id}&type=3&tag=1&types=1`
  } else if ( types === 2 ){
    url = `${API_SERVER}v2/notif?user_id=${Storage.get('user').data.user_id}&type=3&tag=1&types=2`
  }
  API.get(url).then(res => {
    if ( res.status === 200 ){
      this.setState({ notifFilter : res.data.result});
    }
  })
}


  render() {
    let { notificationData, filterType, filterNotification} = this.state;

    if (filterType != "") {
      notificationData = notificationData.filter(item => item.type == filterType);
    }
    if (filterNotification != "") {
      notificationData = notificationData.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterNotification, "gmi"))
      )
    }
    let dataNotif = notificationData.filter(item => item.tag === 1);
    const dataRemind = notificationData.filter(item => item.tag === 2);

    let meetingNotif = this.state.notifFilter.filter(item => item.types === 1 )
    if ( meetingNotif ){
      
    }

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <h3>Notifications</h3>
                    {/* {console.log(this.state.tabIndex)} */}
                    {this.state.tabIndex === 1 ? (
                      // TAB NOTIFICATIOIN
                      <div className="col-sm-12" style={{ margin: '10px 10px 10px 0' }}>
                        <div className="row">
                          <div className="col-sm-3">

                            <select value={this.state.filterType} onChange={this.changeFilterType} style={{ width: '100%', height: 40, border: '1px solid #ced4da', borderRadius: '.25rem', color: '#949ca6' }}>
                              <option value=''>All</option>
                              <option value='3'>Meeting</option>
                              <option value='4'>Announcement</option>
                              <option value='5'>Task</option>
                              <option value='6'>Files</option>
                            </select>
                          </div>
                          <div className="col-sm-3">
                            <input
                              type="text"
                              placeholder="Search"
                              onChange={this.filterNotification}
                              className="form-control" />
                          </div>
                          <div className="float-right">
                            <a href="" onClick={this.readAllNotif} className="btn btn-v2 btn-primary "> Read all</a>
                            <a href="" onClick={this.deleteAllNotif} className="btn btn-v2 btn-danger ml-3"> Remove all</a>
                          </div>
                        </div>
                        {dataNotif.length === 0 ?
                          <div style={{ width: '-webkit-fill-available', marginTop: '15px', padding: 20 }}>
                            <b className="fc-blue ">No notifications at this time ...</b>
                          </div>
                          :
                          <span>




                            {
                              dataNotif.map((item, i) => {
                                return (
                                  <div onClick={() => this.readNotif(item.id)} className="row" key={item.id} style={{ background: '#FFF', borderRadius: 4, padding: '12px', margin: '10px 10px 10px -15px' }}>
                                    <span style={{ width: '-webkit-fill-available', position:'relative' }}>
                                      {
                                        item.isread == 0 &&
                                        <span style={{ margin: '5px', padding: '1px 6px', borderRadius: '8px', color: 'white', background: 'red' }}>new</span>
                                      }
                                      <b className="fc-blue ">
                                        {item.type == 1 ? "Course" :
                                          item.type == 2 ? "Forum" :
                                            item.type == 3 ? "Meeting" :
                                              item.type == 4 ? "Pengumuman" :
                                                item.type == 5 ? "Task" :
                                                  item.type == 6 ? "Files" :
                                                    item.type == 7 ? "Webinar" :
                                                      item.type == 8 ? "PTC" :
                                                        item.type == 9 ? "Tugas" :
                                                          item.type == 10 ? "Kuis" :
                                                            item.type == 11 ? "Ujian" :
                                                              "Notifikasi"}
                                      </b>
                                      &nbsp; &nbsp;
                                      <small>
                                        {moment.utc(item.created_at).tz(moment.tz.guess(true)).format('HH:mm')} &nbsp;
                                        {moment.utc(item.created_at).tz(moment.tz.guess(true)).format('DD/MM/YYYY')}
                                      </small>
                                      <p className="fc-muted mt-1">
                                        {item.description}
                                      </p>

                                      {
                                        item.destination &&
                                        <a href={item.destination == 'null' ? APPS_SERVER : item.destination == null ? APPS_SERVER : item.destination} target="_blank" className="button-bordered-grey" style={{position:'absolute', bottom:'0px', right:'0px', fontSize:'10px', padding:'1px 4px'}}>Open</a>
                                      }
                                      {
                                        item.type == '8' && <button onClick={() => this.konfirmasiHadir(item.activity_id)} data-activity={item.activity_id} className="btn btn-v2 btn-primary">Konfirmasi Hadir</button>
                                      }
                                      <i className="fa fa-trash float-right" style={{position:'absolute', top:'0px', right:'0px', cursor:'pointer'}} onClick={this.deleteNotif} data-id={item.id}></i>
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
                          <select value={this.state.filterType} onChange={this.changeFilterType} style={{ width: 200, height: 40, border: '1px solid #ced4da', borderRadius: '.25rem', color: '#949ca6' }}>
                            <option value=''>All</option>
                            <option value='3'>Meeting</option>
                            <option value='4'>Announcement</option>
                            <option value='5'>Task</option>
                            <option value='6'>Files</option>
                          </select>
                          {dataRemind.length === 0 ?
                            <div style={{ width: '-webkit-fill-available', marginTop: '15px', padding: 20 }}>
                              <b className="fc-blue ">There is no reminder at this time ...</b>
                            </div>
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
                                          {item.type == 1 ? "Course" :
                                            item.type == 2 ? "Forum" :
                                              item.type == 3 ? "Meeting" :
                                                item.type == 4 ? "Pengumuman" :
                                                  item.type == 5 ? "Task" :
                                                    item.type == 6 ? "Files" :
                                                      item.type == 7 ? "Training" :
                                                        item.type == 8 ? "PTC" :
                                                          item.type == 9 ? "Tugas" :
                                                            item.type == 10 ? "Kuis" :
                                                              item.type == 11 ? "Ujian" :
                                                                "Notifikasi"}
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

const Notification = props => (
  <SocketContext.Consumer>
    {socket => <NotificationClass {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default Notification;
