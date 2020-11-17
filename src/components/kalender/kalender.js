import React, { Component } from "react";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import API, {API_SERVER} from '../../repository/api';
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
    fullscreen:false,
  }
  
  fetchUserCalendar() {
    API.get(`${API_SERVER}v1/agenda/${Storage.get('user').data.user_id}`).then(
      (res) => {
        if (res.status === 200) {
          let data = res.data.result.map((elem) => {
            let start = new Date(elem.string_start);
            let end = new Date(elem.string_end);
            return {
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
          console.log('Data Kalender',this.state.event);
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
    // const lists = this.props.lists;
    // const ColoredDateCellWrapper = ({ children }) =>
    // React.cloneElement(React.Children.only(children), {
    //   style: {
    //     backgroundColor: 'lightblue',
    //   },
    // })
    return (
      <div >
      <ReactFullScreenElement
        fullScreen={this.state.fullscreen}
        allowScrollbar={false}
      >
        <div className="card p-10">
        <h3 className="f-w-900 f-18 fc-blue">Kalender</h3>
        <div style={{position:'absolute', top:10, right:this.state.fullscreen ? 30 : 10}}>
        <i onClick={()=> this.setState({fullscreen: !this.state.fullscreen})} className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'} style={{marginRight:'0px !important', fontSize:'20px', cursor:'pointer'}}></i>
        </div>
          <Calendar
            popup
            events={event}
            // defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 400 }}
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
          <div className="p-l-20 m-t-10">
            <span className="p-r-5" style={{ color: '#0091FF' }}>
              <i className="fa fa-square"></i>
            </span>
            Group Meeting
            <span className="p-r-5" style={{ color: '#e2890d', marginLeft:10 }}>
              <i className="fa fa-square"></i>
            </span>
            Webinar
          </div>
        </div>
        </ReactFullScreenElement>
      </div>
    );

    
  }
}


export default KalenderNew;
