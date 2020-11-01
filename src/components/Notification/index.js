import React, { Component } from "react";
import API, {USER_ME, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';


class Notification extends Component {
  state = {
    notificationData : [],
      
  };

  async componentDidMount() {
    await API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        console.log('res company', res);
        if (res.data.error) {
          localStorage.clear();
          window.location.reload();
        }

        Storage.set('user', {
          data: {
            logo: res.data.result.logo,
            company_id: res.data.result.company_id,
            user_id: res.data.result.user_id,
            email: res.data.result.email,
            user: res.data.result.name,
            level: res.data.result.level,
            avatar: res.data.result.avatar
              ? res.data.result.avatar
              : '/assets/images/user/avatar-1.png',
          },
        });

        this.setState({
          logo: res.data.result.logo,
          myCompanyName: res.data.result.company_name,
          company_id: res.data.result.company_id,
          user: res.data.result.name,
          level: res.data.result.level,
          avatar: res.data.result.avatar
            ? res.data.result.avatar
            : '/assets/images/user/avatar-1.png',
        });

        if (this.state.level === 'client') {
          this.setState({ level: 'User' });
        }
      }
    });

    API.get(
      `${API_SERVER}v1/notification/unread/${Storage.get('user').data.user_id}`
    ).then((res) => {
      this.setState({ notificationData: res.data.result });
    });

    // this.fetchCompany();
  }

  render() {
    const {notificationData} = this.state;
    // const dataNotif = [
    //     {pengirim : 'Doni Mengomentari Postingan Anda', date : '5 Menit yang lalu', pesan: 'Hai bro lalul kska oe fak skjdfhd kakskdjhf aklsldf kdkh ka lskdfk al lskdfj '},
    //     {pengirim : 'Doni Mengomentari Postingan Anda', date : '5 Menit yang lalu', pesan: 'Hai bro lalul kska oe fak skjdfhd kakskdjhf aklsldf kdkh ka lskdfk al lskdfj '},
    //     {pengirim : 'Bobi Mengomentari Postingan Anda', date : '5 Menit yang lalu', pesan: 'Hai bro lalul kska oe fak skjdfhd kakskdjhf aklsldf kdkh ka lskdfk al lskdfj '},
    //     {pengirim : 'Putri Mengomentari Postingan Anda', date : '02:05PM 22/02/2020', pesan: 'Hai bro lalul kska oe fak skjdfhd kakskdjhf aklsldf kdkh ka lskdfk al lskdfj '},
    //     {pengirim : 'Doni Mengomentari Postingan Anda', date : '02:05PM 01/12/2020', pesan: 'Hai bro lalul kska oe fak skjdfhd kakskdjhf aklsldf kdkh ka lskdfk al lskdfj '}
    // ]
    console.log('data notifikasi cui', notificationData)
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-sm-8">
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
                                            <b className="fc-blue ">Meeting</b> &nbsp; &nbsp; 
                                            <small >
                                              {moment(item.created_at).tz('Asia/Jakarta').format('h:sA')} &nbsp; 
                                              {moment(item.created_at).tz('Asia/Jakarta').format('DD/MM/YYYY')}</small>
                                            <p className="fc-muted mt-1 mb-4">  {item.description.length < 74
                                                                                ? `${item.description}`
                                                                                : `${item.description.substring(0, 75)}...`}</p>
                                        </span>
                                        
                                      </div>
                                        // DAMIIII DATA NOTIFICATION
                                        // <span style={{borderBottom: '1.5px solid #dcdcdc', width: '-webkit-fill-available', marginTop: '15px', padding:20}}>
                                        //     <b className="fc-blue ">{item.pengirim}</b> &nbsp; &nbsp; <small>{item.date}</small>
                                        //     <p className="fc-muted mt-1 mb-4">  {item.pesan.length < 74
                                        //                                         ? `${item.pesan}`
                                        //                                         : `${item.pesan.substring(0, 75)}...`}</p>
                                        // </span>
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
