import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import MomentTZ from 'moment-timezone';
import API, {USER_ME, API_SERVER} from '../../repository/api';
const localizer = momentLocalizer(moment);


class EventNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    event: []
  }

  fetchUserCalendar() {
    API.get(`${API_SERVER}v1/agenda/${Storage.get('user').data.user_id}`).then(
      (res) => {
        if (res.status === 200) {
          let data = res.data.result.map((elem) => {
            let start = new Date(elem.string_start);
            let end = new Date(elem.string_end);
            return {
              id: elem.id,
              title:
                elem.type === 1
                  ? 'Ujian ' + elem.description
                  : elem.type === 2
                  ? 'Forum ' + elem.description
                  : 'Meeting ' + elem.description,
              start: new Date(
                start.getFullYear(),
                start.getMonth(),
                start.getDate(),
                start.getHours(),
                start.getMinutes(),
                start.getSeconds()
              ),
              end: new Date(
                end.getFullYear(),
                end.getMonth(),
                end.getDate(),
                end.getHours(),
                end.getMinutes(),
                end.getSeconds()
              ),
              bgColor:
                elem.type === 1 ? 'red' : elem.type === 2 ? 'purple' : 'cyan',
            };
          });
          this.setState({ event: data });
          console.log('ALVIN',this.state.event)
          // this.setState({ calendarItems: res.data.result });
        }
      }
    );
  }
  componentDidMount(){
    this.fetchUserCalendar();
  }
  render() {
  //  console.log(this.props, 'props evenntttt')
    const lists = this.props.lists;


    return (
      <div >
        <div className="card p-10">
        <h3 className="f-w-900 f-18 fc-blue">Kalender</h3>
          <Calendar
            popup
            events={this.state.event}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 400 }}
            eventPropGetter={(event, start, end, isSelected) => {
              if (event.bgColor) {
                return {
                  style: { backgroundColor: '#ffce56' },
                };
              }
              return {};
            }}
            views={['month', 'day']}
          />

          <div className="p-l-20">
            <span className="p-r-5" style={{ color: '#ffce56' }}>
              <i className="fa fa-square"></i>
            </span>
            Group Meeting
          </div>
        </div>
      </div>
    );
  }
}

export default EventNew;
