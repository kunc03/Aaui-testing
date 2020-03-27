import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { 
	Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image, 
	InputGroup, FormControl, Modal
} from 'react-bootstrap';

import JitsiMeetComponent from './livejitsi';

import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class LiveStream extends Component {
	state = {
    classId: this.props.match.params.roomid,
    user: {},
    classRooms: {},
    
    isInvite: false,
    emailInvite: '',
    emailResponse: 'Masukkan email yang ingin di invite.'
  }
  
  handleCloseInvite = e => {
    this.setState({
      isInvite: false,
      emailInvite: "",
      emailResponse: "Masukkan email yang ingin di invite."
    });
  }

	handleCloseLive = e => {
		this.setState({ isLive: false, liveURL: '' })
  }

  componentDidMount() {
    this.fetchData();
    window.onbeforeunload = function() {
      return "Are you sure you want to leave?";
    };
  }
  
  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(async res => {
      if(res.status === 200) {
        let liveClass = await API.get(`${API_SERVER}v1/liveclass/id/${this.state.classId}`);
        console.log(liveClass,'asjkdaskjdkjashdkshaj');
        
                
        var data = liveClass.data.result
        /*mark api get new history course*/
        let form = {
          user_id : Storage.get('user').data.user_id,
          class_id : data.class_id,
          description : data.room_name,
          title : data.speaker
        }


        console.log('alsdlaksdklasjdlkasjdlk',form)
        API.post(`${API_SERVER}v1/api-activity/new-class`, form).then(console.log);

        this.setState({ user: res.data.result, classRooms: liveClass.data.result })
      }
    })
  }

  onClickInvite = e => {
    e.preventDefault();
    this.setState({ isInvite: true });
  }

  onClickSubmitInvite = e => {
    e.preventDefault();
    let form = {
      user: Storage.get('user').data.user,
      email: this.state.emailInvite,
      message: window.location.href
    }

    API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
      if(res.status === 200) {
        if(!res.data.error) {
          this.setState({
            isInvite: false,
            emailInvite: "",
            emailResponse: res.data.result
          });
        } else {
          this.setState({
            emailResponse: "Email tidak terkirim, periksa kembali email yang dimasukkan."
          });
        }
      }
    })
  }

	render() {

    const { classRooms, user } = this.state;

		return(
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
              Group Meeting
              </div>
            </Link>
          </div>

          <Col sm={12} style={{marginBottom: '20px'}}>
            <div className="kategori text-center" style={{marginBottom: '16px', cursor: 'pointer', color: '#bf337b'}} onClick={this.onClickInvite}>
              Invite People
            </div>
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

        <Modal
          show={this.state.isInvite}
          onHide={this.handleCloseInvite}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold">
              Invite People
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-vertical">
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={e => {
                    this.setState({
                      emailInvite: e.target.value
                    });
                  }}
                />
                <Form.Text>
                  {this.state.emailResponse}
                </Form.Text>
              </div>
            </div>

            <button
              style={{ marginTop: "30px" }}
              type="button"
              onClick={this.onClickSubmitInvite}
              className="btn btn-block btn-ideku f-w-bold"
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-block f-w-bold"
              onClick={this.handleCloseInvite}
            >
              Tidak
            </button>
          </Modal.Body>
        </Modal>

			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
		);
	}
}