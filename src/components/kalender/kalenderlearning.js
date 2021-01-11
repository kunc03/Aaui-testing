import React, { Component } from "react";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import API, { API_SERVER } from '../../repository/api';
import Event from './_itemModal';
import ReactFullScreenElement from "react-fullscreen-element";
const localizer = momentLocalizer(moment);

class KalenderNew extends Component {
  state = {
    jadwal: [],
    event: [],
    fullscreen: false,
  }

  componentDidMount() {
    // this.fetchKalender();
    this.fetchJadwal();
  }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/jadwal-mengajar/${Storage.get('user').data.grup_name.toLowerCase()}/${Storage.get('user').data.user_id}`).then(res => {
      if(res.data.error) console.log(`Error: fetch pelajaran`)


      let hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      let tglIni = new Date();
      let hariIni = res.data.result.filter(item => item.hari === hari[tglIni.getDay()]);

      // var curr = new Date;
      // var first = curr.getDate() - curr.getDay();
      // var last = first + 6;
      //
      // var firstday = new Date(curr.setDate(first));
      // var lastday = new Date(curr.setDate(last));

      let events = hariIni.map(item => {
        return {
          title: `${item.kelas_nama} - ${item.nama_pelajaran}`,
          start: tglIni,
          end: tglIni
        }
      })

      this.setState({ event: events })
    })
  }

  fetchKalender() {
    let event = [
      // {title: 'Metting 1', start: new Date(), end: new Date()},
      // {title: 'Metting 2', start: new Date(), end: new Date()},
    ];

    this.setState({ event })
  }

  render() {
    console.log('state: ', this.state)
    const { event } = this.state;

    return (
      <div >
        <ReactFullScreenElement
          fullScreen={this.state.fullscreen}
          allowScrollbar={false}
        >
          <div className="card">
            <div className="card-body">
              <h3 className="f-w-900 f-18 fc-blue">Calendar & Schedule</h3>
              <div style={{ position: 'absolute', top: 10, right: this.state.fullscreen ? 30 : 10 }}>
                <i onClick={() => this.setState({ fullscreen: !this.state.fullscreen })} className={this.state.fullscreen ? 'fa fa-compress' : 'fa fa-expand'} style={{ marginRight: '0px !important', fontSize: '20px', cursor: 'pointer' }}></i>
              </div>

              <Calendar
                popup
                events={event}
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
                views={['month']}
                components={{ event: Event }}
              />

            </div>
          </div>
        </ReactFullScreenElement>
      </div>
    );


  }
}


export default KalenderNew;
