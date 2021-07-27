import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment-timezone';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
;


class EventAgenda extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    infoClass: [],
    event: [],
    show: false,
    setShow: false
  }

  handleShow() {
    console.log(this.props.event, 'asdassdasd');
    this.setState({ setShow: true });
  }

  handleClose() {
    this.setState({ setShow: false });
  }

  confirmAttendance(confirmation) {
    let form = {
      confirmation: confirmation,
    }

    API.put(`${API_SERVER}v1/liveclass/confirmation/${this.state.infoClass.class_id}/${Storage.get('user').data.user_id}`, form).then(async res => {
      if (res.status === 200) {
        this.fetchMeetingInfo(this.state.infoClass.class_id)
        let start = new Date(this.state.infoClass.schedule_start);
        let end = new Date(this.state.infoClass.schedule_end);
        let form = {
          confirmation: confirmation,
          user: Storage.get('user').data.user,
          email: [],
          room_name: this.state.infoClass.room_name,
          is_private: this.state.infoClass.is_private,
          is_scheduled: this.state.infoClass.is_scheduled,
          schedule_start: `${moment.tz(this.state.infoClass.schedule_start, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (${moment.tz.guess(true)})`,
          schedule_end: `${moment.tz(this.state.infoClass.schedule_end, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} (${moment.tz.guess(true)})`,
          userInvite: [Storage.get('user').data.user_id],
          //url
          message: APPS_SERVER + 'redirect/meeting/information/' + this.state.infoClass.class_id,
          messageNonStaff: APPS_SERVER + 'meeting/' + this.state.infoClass.class_id
        }
        this.setState({ alertSuccess: true })
        API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              console.log('sukses konfirmasi')
            } else {
              alert('Email error');
            }
          }
        })
        let formNotif = {
          user_id: this.state.infoClass.moderator,
          type: 3,
          activity_id: this.state.infoClass.class_id,
          desc: Storage.get('user').data.user + ' will ' + (confirmation === 'Hadir' ? 'Present' : 'Not Present') + ' on the meeting : ' + this.state.infoClass.room_name,
          dest: `${APPS_SERVER}meeting/information/${this.state.infoClass.class_id}`,
        }
        API.post(`${API_SERVER}v1/notification/broadcast`, formNotif).then(res => {
          if (res.status === 200) {
            if (!res.data.error) {
              console.log('Sukses Notif')
            } else {
              console.log('Gagal Notif')
            }
          }
        })
      }
    })
  }
  fetchMeetingInfo(id) {
    API.get(`${API_SERVER}v1/liveclass/meeting-info/${id}`).then(res => {
      if (res.status === 200) {
        this.setState({
          infoClass: res.data.result[0],
          infoParticipant: res.data.result[1],
          countHadir: res.data.result[1].filter((item) => item.confirmation == 'Hadir').length,
          countTidakHadir: res.data.result[1].filter((item) => item.confirmation == 'Tidak Hadir').length,
          countTentative: res.data.result[1].filter((item) => item.confirmation == '').length,
          needConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id && item.confirmation == '').length,
          attendanceConfirmation: res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id).length >= 1 ? res.data.result[1].filter((item) => item.user_id == Storage.get('user').data.user_id)[0].confirmation : null
        })
      }
    })
  }

  componentDidMount() {
    console.log(this.props.event, 'asdasd')
    if (this.props.event.type === 3) {
      this.fetchMeetingInfo(this.props.event.activity_id);
    }
  }

  render() {
    const access_project_admin = this.props.access_project_admin;
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let infoDateStart = new Date(this.state.infoClass.schedule_start);
    let infoDateEnd = new Date(this.state.infoClass.schedule_end);
    const event = this.props.event;
    return (
      <div>
        {/* <div>
              {
                this.props.event.type === 3 ?
                <span onClick={this.handleShow.bind(this)}>{event.title}</span>
                :
                <span>{event.title}</span>
              }
            </div> */}

        <span>
          <em style={{ color: 'cyan' }}>
            <Link to={`${event.jadwal_id ? `/ruangan/mengajar/${event.jadwal_id}/materi/${event.chapter_id}` : ''}`}>{event.title}</Link>
          </em>
          {/* <p>{event.title} </p> */}
        </span>
      </div>
    );


  }
}


export default EventAgenda;
