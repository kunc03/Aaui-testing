import React, { Component, useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';


import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';

import moment from 'moment';
import { dataKalender } from '../../modul/data';
import API, { USER_ME, API_SERVER } from '../../repository/api';

import Event from './_itemModal';
import ReactFullScreenElement from "react-fullscreen-element";
const localizer = momentLocalizer(moment);

class KalenderNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
    event: [],
    fullscreen: false,
  }

  fetchUserCalendar() {
    API.get(`${API_SERVER}v1/agenda/${Storage.get('user').data.user_id}`).then(
      (res) => {
        if (res.status === 200) {
          let data = res.data.result.map((elem) => {
            let start = new Date(elem.string_start);
            let end = new Date(elem.string_end);
            let create = new Date(elem.created_at);
            return {
              create: new Date(
                create.getFullYear(),
                create.getMonth(),
                create.getDate(),
                create.getHours(),
                create.getMinutes(),
                create.getSeconds()
              ),
              activity_id: elem.activity_id,
              type: elem.type,
              id: elem.id,
              title:
                elem.type === 1
                  ? elem.description
                  : elem.type === 2
                    ? elem.description
                    :
                    elem.type === 3
                      ? elem.description
                      : elem.description,
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
        }
      }
    );
  }
  componentDidMount() {
    this.fetchUserCalendar();
  }
  render() {
    const { t } = this.props
    const { event } = this.state;
    const lists = this.props.lists;
    // const ColoredDateCellWrapper = ({ children }) =>
    // React.cloneElement(React.Children.only(children), {
    //   style: {
    //     backgroundColor: 'lightblue',
    //   },
    // })
    return (
      <div >
        {/* FULL SCRENN CALENDER */}
        <ReactFullScreenElement
          fullScreen={this.state.fullscreen}
          allowScrollbar={false}
        >
        <div className="card">
          <div className="card-body">
          <div className="row">
              <div className='col-sm-8'>
                <div className="row">
                  <div style={{ padding: '10px 20px' }}>
                    <h3 className="f-w-900 f-18 fc-blue">
                      {t('calendar')}
                  </h3>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 text-right">
                <p className="m-b-0">
                  <Link to={"calendar"}>
                    <span className=" f-12 fc-skyblue">Maximize</span>
                  </Link>
                </p>
              </div>
            </div>
            <Calendar
              popup
              events={event}
              // defaultDate={new Date()}
              localizer={localizer}
              style={{ height: this.props.height ? this.props.height : 400 }}
              eventPropGetter={(event, start, end, isSelected) => {
                if (event.bgColor) {
                  return {
                    style: { backgroundColor: event.type === 3 ? '#0091FF' : '#e2890d' },
                  };
                }
                return {};
              }}
              views={['month', 'week', 'day', 'agenda']}
              components={{ event: Event }}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
            // min={new Date(2016, 10, 0, 2, 0, 0)}
            // scrollToTime={new Date(0, 0, 0, 0, 8, 0)}
            // step={3}
            // timeslots={10}
            />
            <div className="p-l-20 m-t-10">
              <span className="p-r-5" style={{ color: '#0091FF' }}>
                <i className="fa fa-square"></i>
              </span>
              Meeting

              <span className="p-r-5" style={{ color: '#e2890d', marginLeft: 10 }}>
                <i className="fa fa-square"></i>
              </span>
              Webinar

              {/* <span className="float-right">
                <Link to="/full-kalender">Lihat Selengkapnya</Link>
              </span> */}
            </div>
           </div>
          </div>
        </ReactFullScreenElement>
      </div >
    );


  }
}

const KalenderWithTranslation = withTranslation('common')(KalenderNew)

export default KalenderWithTranslation;
