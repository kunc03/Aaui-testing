import React, { Component } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
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

  render() {
  //  console.log(this.props, 'props evenntttt')
    // const lists = this.props.lists;


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
