import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import MinCalender from 'react-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-calendar/dist/Calendar.css';
import { MultiSelect } from 'react-sm-select';
import ToggleSwitch from "react-switch";

import moment from 'moment';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { Card, Modal, Col, Row, Form } from 'react-bootstrap';
import Event from './_itemModal';
import { Editor } from '@tinymce/tinymce-react';

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
    agendaShow: false,
    limited: false,

    optionsProjectAdmin: [],
    valueProjectAdmin: [],
    valueUser: [],
  }

  onChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  toggleSwitch(checked) {
    this.setState({ limited: !this.state.limited });
  }

  handleShow() {
    this.setState({ agendaShow: true });
  }

  handleClose() {
    this.setState({ agendaShow: false });
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
                      {/* <span className="float-right p-10">
                        <span onClick={this.printHandler.bind(this)} style={{ cursor: 'pointer' }}><i className="fa fa-share"></i> Share &nbsp; </span>
                        <span><i className="fa fa-print"></i> Print &nbsp; </span>
                      </span> */}
                    </div>
                  </div>

                  <div id="print" className="row" style={{ margin: '0px' }}>
                    <div className="col-sm-2" style={{ background: '#f3f3f3' }}>
                      <MinCalender

                      />

                      <div className="fc-skyblue p-10"> <i className="fa fa-plus"></i> <b>Add Calendar</b></div>

                      <div className="p-10 "> <i className="fa fa-dropdown"></i> <b>My Calender</b></div>

                      <div className="p-10">
                        <span>
                          <input type="radio"></input> &nbsp;
                          <button className="btn btn-primary">Calendar</button>
                        </span>
                        <br />
                        <span>
                          <input type="radio"></input> &nbsp;
                          <button className="btn btn-primary" onClick={this.handleShow.bind(this)}>My Agenda</button>

                        </span>
                      </div>

                    </div>
                    <div className="col-sm-7" style={{ height: '500px' }}>
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

                      <div className="row" style={{ marginTop: '1vh' }}>
                        <div className="agenda-chat">
                          <span style={{ width: '-webkit-fill-available' }}>
                            <small>1.00 PM &nbsp; </small>
                            <b className="fc-blue "> Webinar Risiko </b>
                            <br />
                            <small className="fc-muted mt-1"> 30 min</small>
                          </span>
                        </div>
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

                <Modal show={this.state.agendaShow} onHide={this.handleClose.bind(this)} dialogClassName="modal-lg">
                  <Modal.Header closeButton>
                    <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                      My Agenda
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Card className="cardku">
                      <Card.Body>
                        <Row>
                          <Col sm={8}>
                            <Form.Group controlId="formJudul">
                              <Form.Label className="f-w-bold">
                                Add Title
                              </Form.Label>
                              <div className="input-group mb-4">
                                <input
                                  type="text"
                                  name="folderName"
                                  className="form-control"
                                  placeholder="Nama Agenda"
                                  onChange={this.onChangeInput}
                                  required
                                />
                              </div>
                            </Form.Group>

                            <Form.Group controlId="formJudul">
                              <Form.Label className="f-w-bold">
                                Team
                              </Form.Label>
                              <MultiSelect
                                id="moderator"
                                options={this.state.optionsProjectAdmin}
                                value={this.state.valueProjectAdmin}
                                onChange={valueProjectAdmin => this.setState({ valueProjectAdmin })}
                                mode="tags"
                                required
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Pilih "
                              />
                            </Form.Group>
                            <Form.Group controlId="formJudul">
                              <Form.Label className="f-w-bold">
                                All day
                              </Form.Label>
                              <div style={{ width: '100%' }}>
                                <Row>
                                  <Col sm={10}>
                                    <div className="input-group mb-4">
                                      <input
                                        type="date"
                                        className="form-control"
                                        onChange={this.onChangeInput}
                                        required
                                      />
                                    </div>
                                  </Col>
                                  <Col sm={2}>
                                    <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.limited} />

                                  </Col>
                                </Row>
                              </div>
                            </Form.Group>

                            <Editor
                              apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                              initialValue={this.state.body}
                              init={{
                                height: 200,
                                menubar: false,
                                plugins: [
                                  "advlist autolink lists link image charmap print preview anchor",
                                  "searchreplace visualblocks code fullscreen",
                                  "insertdatetime media table paste code help wordcount"
                                ],
                                toolbar:
                                  "undo redo | formatselect | bold italic backcolor | \
                                   alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help"
                              }}
                              onChange={this.onChangeTinyMce}
                            />

                          </Col>
                          <Col sm={4} style={{ height: '400px' }}>
                            <Calendar
                              selectable
                              localizer={localizer}
                              events={event}
                              defaultView={Views.DAY}
                              scrollToTime={new Date(1970, 1, 1, 6)}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                      <Modal.Footer>
                        <button
                          className="btn btm-icademy-primary btn-icademy-grey"
                          onClick={this.handleClose.bind(this)}
                        >
                          Close
                      </button>
                        <button
                          className="btn btn-icademy-primary"
                          onClick={this.handleClose.bind(this)}
                        >
                          <i className="fa fa-save"></i>
                        Save
                      </button>
                      </Modal.Footer>
                    </Card>
                  </Modal.Body>

                </Modal>

              </div>
            </div>
          </div>
        </div>
      </div >
    );


  }
}


export default FullKalenderNew;
