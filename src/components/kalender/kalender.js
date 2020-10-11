import React, { Component,useState } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer, Views  } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import {dataKalender} from '../../modul/data';
import API, {USER_ME, API_SERVER} from '../../repository/api';
import {OverlayTrigger, Modal} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';

const localizer = momentLocalizer(moment);
function Event({ event }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <div>
      <div>
    {/* console.log('nah ini dia',event); */}
      <span onClick={handleShow}>{event.title}</span>
      </div>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Masuk Meeting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-icademy-primary" onClick={handleClose}>
            <i className="fa fa-video"></i>
            Masuk
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

class KalenderNew extends Component {
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
          console.log('Data Kalender',this.state.event)
          // this.setState({ calendarItems: res.data.result });
        }
      }
    );
  }
  componentDidMount(){
    this.fetchUserCalendar();
  }
  render() {
    const {event} = this.state;
    const lists = this.props.lists;
    
    return (
      <div >
        <div className="card p-10">
        <h3 className="f-w-900 f-18 fc-blue">Kalender</h3>
          <Calendar
            popup
            events={event}
            // defaultDate={new Date()}
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
            components={{
              event: Event
            }}
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

export default KalenderNew;
