import React, { Component } from "react";
import Storage from '../../repository/storage';
import { Link } from "react-router-dom";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import API, { API_SERVER } from '../../repository/api';
import Event from './_itemModalLearning';
import Agendas from './_agenda';
import ReactFullScreenElement from "react-fullscreen-element";
const localizer = momentLocalizer(moment);

class KalenderNew extends Component {
  state = {
    jadwal: [],
    event: this.props.lists ? this.props.lists : [],
    fullscreen: false,
    grupName: this.props.grupName ? this.props.grupName : Storage.get('user').data.grup_name.toLowerCase(),
    muridId: this.props.muridId ? this.props.muridId : Storage.get('user').data.user_id,
  }

  componentDidMount() {
    // this.fetchKalender();
    if (this.state.event.length === 0) {
      this.fetchJadwal();
    }
  }

  fetchJadwal() {
    API.get(`${API_SERVER}v2/events/${this.state.grupName}/${this.state.muridId}`).then(res => {
      if (res.data.error) console.log(`Error: fetch events`)

      let mengajar = res.data.result.mengajar && res.data.result.mengajar.map(item => {
        let stTgl = moment(item.start_date).format('YYYY-MM-DD HH:mm');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.kelas_nama} - ${item.nama_pelajaran} - ${item.chapter_title}`,
          start: tglSt,
          end: tglSt,
          chapter_id: item.chapter_id,
          jadwal_id: item.jadwal_id
        }
      })

      let ptc = res.data.result.ptc && res.data.result.ptc.map(item => {
        let stTgl = moment(item.tanggal_mulai).format('YYYY-MM-DD') + ' ' + item.waktu_mulai;
        let tglSt = new Date(stTgl)

        return {
          title: `${item.nama_ruangan}`,
          start: tglSt,
          end: tglSt
        }
      })

      let tugas = res.data.result.tugas && res.data.result.tugas.map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt
        }
      })

      let quiz = res.data.result.quiz && res.data.result.quiz.map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt
        }
      })

      let ujian = res.data.result.ujian && res.data.result.ujian.map(item => {
        let stTgl = moment(item.time_finish).format('YYYY-MM-DD');
        let tglSt = new Date(stTgl)

        return {
          title: `${item.exam_title}`,
          start: tglSt,
          end: tglSt
        }
      })

      let events = mengajar.concat(ptc.concat(tugas.concat(quiz.concat(ujian))));

      this.setState({ event: events })
    })
  }

  render() {
    const { event } = this.state;

    return (
      <div >
        <ReactFullScreenElement
          fullScreen={this.state.fullscreen}
          allowScrollbar={false}
        >
          <div className="card">
            <div className="card-body">
              <h3 className="f-w-900 f-18 fc-blue">Kalender & Jadwal</h3>
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
                views={['month', 'week', 'day', 'agenda']}
                components={{ event: Event, agenda: { event: Agendas } }}
              />
              <div className="p-l-20 m-t-10">
                <span className="p-r-5" style={{ color: '#0091FF' }}>
                  <i className="fa fa-square"></i>
                </span>
              Group Meeting
              <span className="p-r-5" style={{ color: '#e2890d', marginLeft: 10 }}>
                  <i className="fa fa-square"></i>
                </span>
                <span className="p-r-5" style={{ color: '#e2890d', marginLeft: 10 }}>
                  <i className="fa fa-square"></i>
                </span>
              Webinar
              <span className="float-right">
                  <Link to="/full-kalender">Lihat Selengkapnya</Link>
                </span>
              </div>
            </div>
          </div>
        </ReactFullScreenElement>
      </div>
    );


  }
}


export default KalenderNew;
