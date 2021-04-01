import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import MinCalender from 'react-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';

import moment from 'moment';
import { dataKalender } from '../../modul/data';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { OverlayTrigger, Modal } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import Event from './_itemModal';
import ReactFullScreenElement from "react-fullscreen-element";
const localizer = momentLocalizer(moment);

class FullKalenderNew extends Component {
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
    const { event } = this.state;
    // const ColoredDateCellWrapper = ({ children }) =>
    // React.cloneElement(React.Children.only(children), {
    //   style: {
    //     backgroundColor: 'lightblue',
    //   },
    // })
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  {/* FULL SCRENN CALENDER */}
                  <div className="floating-back">
                    <Link to={`/`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      />
                    </Link>
                  </div>

                  <div className="p-20" style={{ background: '#f3f3f3' }}>
                    <div className="f-w-900 f-18 fc-blue">
                      <button className="btn btn-icademy-primary">New Event</button>
                      <span className="float-right p-10">
                        <span><i className="fa fa-share"></i> Share &nbsp; </span>
                        <span><i className="fa fa-print"></i> Print &nbsp; </span>
                      </span>
                    </div>
                  </div>

                  <div className="row" style={{ margin: '0px' }}>
                    <div className="col-sm-2" style={{ background: '#f3f3f3' }}>
                      <MinCalender

                      />

                      <div className="fc-skyblue p-10"> <i className="fa fa-plus"></i> <b>Add Calendar</b></div>

                      <div className="p-10 "> <i className="fa fa-dropdown"></i> <b>My Calender</b></div>

                      <div className="p-10">
                        <p><input type="radio"></input> calendar </p>
                        <input type="radio"></input> Unitade Stade
                            </div>

                    </div>
                    <div className="col-sm-7">
                      <Calendar
                        popup
                        events={event}
                        // defaultDate={new Date()}
                        localizer={localizer}
                        style={{ height: '100%' }}
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
                      />
                    </div>
                    <div className="col-sm-3 borderLeftCalender">
                      <div className="p-10" >
                        <span className="f-w-900 f-18 fc-grey ">Fri, Feb 19</span>
                        <span className=" f-14 float-right">40</span>
                      </div>
                      <div className="" style={{ textAlign: 'center', marginTop: '15vh' }}>
                        <h4>Nothing Planed For Today </h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-l-20 m-t-10">
                    <span className="p-r-5" style={{ color: '#0091FF' }}>
                      <i className="fa fa-square"></i>
                    </span>
                          Group Meeting
                    <span className="p-r-5" style={{ color: '#e2890d', marginLeft: 10 }}>
                      <i className="fa fa-square"></i>
                    </span>
                          Webinar
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


export default FullKalenderNew;
