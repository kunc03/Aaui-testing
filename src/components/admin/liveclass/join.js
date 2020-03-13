import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import {
  Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image,
  InputGroup, FormControl, Modal
} from 'react-bootstrap';

import JitsiMeetComponent from '../../liveclass/livejitsi';

import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class LiveClassAdminJoin extends Component {
  state = {
    classId: this.props.match.params.roomid,
    user: {},
    classRooms: {},
  }

  handleCloseLive = e => {
    this.setState({ isLive: false, liveURL: '' })
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if (res.status === 200) {
        let liveClass = await API.get(`${API_SERVER}v1/liveclass/id/${this.state.classId}`);
        this.setState({ user: res.data.result, classRooms: liveClass.data.result })
      }
    })
  }

  render() {

    const { classRooms, user } = this.state;
    console.log('state: ', this.state)

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <Row>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link to={`/`}>
                        <div className="kategori">
                          <img src="/assets/images/component/kursusoff.png" className="img-fluid" alt="media" />
                          &nbsp;
                          Kursus & Materi
              </div>
                      </Link>
                    </div>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link to={`/forum`}>
                        <div className="kategori">
                          <img src="/assets/images/component/forumoff.png" className="img-fluid" alt="media" />
                          &nbsp;
                          Forum
              </div>
                      </Link>
                    </div>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link to={`/liveclass`}>
                        <div className="kategori-aktif">
                          <img src="/assets/images/component/liveon.png" className="img-fluid" alt="media" />
                          &nbsp;
                          Live Class
              </div>
                      </Link>
                    </div>

                    <Col sm={12} style={{ marginBottom: '20px' }}>
                      {
                        user.name && classRooms.room_name &&
                        <JitsiMeetComponent
                          roomName={classRooms.room_name.replace(/\s/g, '')}
                          userName={user.name}
                          userEmail={user.email}
                          userAvatar={user.avatar} />
                      }
                    </Col>

                  </Row>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}