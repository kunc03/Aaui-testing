import React, { Component } from "react";
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';

class Notification extends Component {
  state = {
    notificationData : [],
  };

  componentDidMount() {
    API.get(
      `${API_SERVER}v1/notification/unread/${Storage.get('user').data.user_id}`
    ).then((res) => {
      this.setState({ notificationData: res.data.result });
    });
  }

  render() {
    const {notificationData} = this.state;

    console.log('data notifikasi cui', this.state)

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-sm-12">
                        <div className="row">
                            <h4 className="fc-blue"><b> Notification </b></h4>
                        </div>

                        {notificationData.length === 0 ?
                            <span style={{ width: '-webkit-fill-available', marginTop: '15px', padding:20}}>
                                <b className="fc-blue ">Tidak ada notifikasi saat ini ...</b>
                            </span>
                        :
                            <span>
                            {
                                notificationData.map((item, i) => {
                                    return (
                                      <div className="row" style={{background:'#FFF', borderRadius:4, padding:20}}>

                                        <span style={{borderBottom: '1px solid #dcdcdc', width: '-webkit-fill-available'}}>
                                            <b className="fc-blue ">
                                            {item.type == 1 ? "Course" : item.type == 2 ? "Forum" : item.type == 3 ? "Meeting" : item.type == 4 ? "Pengumuman" : "Notifikasi"}
                                            </b>
                                            &nbsp; &nbsp;
                                            <small>
                                              {moment(item.created_at).tz('Asia/Jakarta').format('h:sA')} &nbsp;
                                              {moment(item.created_at).tz('Asia/Jakarta').format('DD/MM/YYYY')}
                                            </small>
                                            <p className="fc-muted mt-1">
                                              {item.description.length < 74 ? `${item.description}` : `${item.description.substring(0, 75)}...`}
                                            </p>

                                            <a href={item.destination} className="btn btn-v2 btn-primary mb-3">Cek Sekarang</a>
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

    );
  }
}

export default Notification;
