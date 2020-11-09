import React, { Component } from "react";
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import SocketContext from '../../socket';

class NotificationClass extends Component {
  state = {
    notificationData : [],
  };

  componentDidMount() {
    this.fetchNotif();

    this.props.socket.on('broadcast', data => {
      this.fetchNotif()
    })
  }

  deleteNotif = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/notification/id/${e.target.getAttribute('data-id')}`).then(res => {
      if(res.data.error) console.log(`Error delete`)

      this.fetchNotif();
    })
  }

  deleteAllNotif = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if(item.tag == 1) {
        temp.push(item.id)
      }
    });
    API.delete(`${API_SERVER}v1/notification/id/${Storage.get('user').data.user_id}`, {notifIds: temp}).then(res => {
      if(res.data.error) console.log(`Error delete`)

      this.fetchNotif();
    })
  }

  readAllNotif = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if(item.tag == 1 && item.isread == 0) {
        temp.push(item.id)
      }
    });
    API.put(`${API_SERVER}v1/notification/read/all`, {userId: Storage.get('user').data.user_id, notifIds: temp}).then(res => {
      if(res.data.error) console.log('Error update')

      this.props.socket.emit('send',{companyId: Storage.get('user').data.company_id})
      this.fetchNotif();
    })
  }

  deleteAllReminder = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if(item.tag == 2) {
        temp.push(item.id)
      }
    });
    API.delete(`${API_SERVER}v1/notification/id/${Storage.get('user').data.user_id}`, {notifIds: temp}).then(res => {
      if(res.data.error) console.log(`Error delete`)

      this.fetchNotif();
    })
  }

  readAllReminder = e => {
    e.preventDefault();
    let temp = [];
    this.state.notificationData.filter(item => {
      if(item.tag == 2 && item.isread == 0) {
        temp.push(item.id)
      }
    });
    API.put(`${API_SERVER}v1/notification/read/all`, {userId: Storage.get('user').data.user_id, notifIds: temp}).then(res => {
      if(res.data.error) console.log('Error update')

      this.props.socket.emit('send',{companyId: Storage.get('user').data.company_id})
      this.fetchNotif();
    })
  }

  fetchNotif() {
    API.get(
      `${API_SERVER}v1/notification/all/${Storage.get('user').data.user_id}`
    ).then((res) => {
      this.setState({ notificationData: res.data.result });
    });
  }

  readNotif(id) {
    API.put(`${API_SERVER}v1/notification/read`,{id}).then(res => {
      if(res.data.error) console.log('Gagal read')

      this.props.socket.emit('send',{companyId: Storage.get('user').data.company_id})
      this.fetchNotif();
    })
  }

  render() {
    const {notificationData} = this.state;
    const dataNotif = notificationData.filter(item => item.tag == 1);
    const dataRemind = notificationData.filter(item => item.tag == 2);

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-sm-6">
                        <div className="row">
                            <h4 className="fc-blue mb-2">
                              <b> Notification </b>
                              <button onClick={this.deleteAllNotif} className="btn btn-transparent ml-4"> Hapus semua</button>
                              <button onClick={this.readAllNotif} className="btn btn-transparent ml-2"> Baca semua</button>
                            </h4>
                        </div>

                        <div style={{margin: '10px 10px 10px 0'}}>
                        {dataNotif.length === 0 ?
                            <span style={{ width: '-webkit-fill-available', marginTop: '15px', padding:20}}>
                                <b className="fc-blue ">Tidak ada notifikasi saat ini ...</b>
                            </span>
                        :
                          <span>
                            {
                                dataNotif.map((item, i) => {
                                    return (
                                      <div onClick={() => this.readNotif(item.id)} className="row" key={item.id} style={{background:'#FFF', borderRadius:4, padding:'12px', margin: '10px 10px 10px -15px'}}>

                                        <span style={{width: '-webkit-fill-available'}}>
                                          {
                                            item.isread == 0 &&
                                            <span style={{margin: '5px', padding: '1px 6px', borderRadius: '8px', color: 'white', background: 'red'}}>new</span>
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

                                            <a href={item.destination == 'null' ? APPS_SERVER : item.destination == null ? APPS_SERVER : item.destination} className="btn btn-v2 btn-primary">Cek Sekarang</a>
                                            <i className="fa fa-trash float-right" onClick={this.deleteNotif} data-id={item.id} style={{cursor: 'pointer'}}></i>
                                        </span>

                                      </div>
                                    )
                                })
                            }
                            </span>
                        }
                        </div>
                    </div>

                    <div className='col-sm-6'>
                      <div className="row">
                          <h4 className="fc-blue mb-2">
                            <b> Reminder </b>
                            <button onClick={this.deleteAllReminder} className="btn btn-transparent ml-4"> Hapus semua</button>
                            <button onClick={this.readAllReminder} className="btn btn-transparent ml-2"> Baca semua</button>
                          </h4>
                      </div>

                      <div style={{margin: '10px 10px 10px 0'}}>
                      {dataRemind.length === 0 ?
                          <span style={{ width: '-webkit-fill-available', marginTop: '15px', padding:20}}>
                              <b className="fc-blue ">Tidak ada reminder saat ini ...</b>
                          </span>
                      :
                        <span>
                          {
                              dataRemind.map((item, i) => {
                                  return (
                                    <div onClick={() => this.readNotif(item.id)} className="row" key={item.id} style={{background:'#FFF', borderRadius:4, padding:'12px', margin: '10px 10px 10px -15px'}}>

                                      <span style={{width: '-webkit-fill-available'}}>
                                        {
                                          item.isread == 0 &&
                                          <span style={{margin: '5px', padding: '1px 6px', borderRadius: '8px', color: 'white', background: 'red'}}>new</span>
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

                                          <a href={item.destination == 'null' ? APPS_SERVER : item.destination == null ? APPS_SERVER : item.destination} className="btn btn-v2 btn-primary">Cek Sekarang</a>
                                          <i className="fa fa-trash float-right" onClick={this.deleteNotif} data-id={item.id} style={{cursor: 'pointer'}}></i>
                                      </span>

                                    </div>
                                  )
                              })
                          }
                          </span>
                      }
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

const Notification = props => (
  <SocketContext.Consumer>
    {socket => <NotificationClass {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default Notification;
