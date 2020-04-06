import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { 
	Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image, 
	InputGroup, FormControl, Modal
} from 'react-bootstrap';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

import JitsiMeetComponent from './livejitsi';

import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class LiveStream extends Component {
	state = {
    classId: this.props.match.params.roomid,
    user: {},
    classRooms: {},
    
    isInvite: false,
    emailInvite: [],
    emailResponse: 'Masukkan email yang ingin di invite.',
    //multi select invite
    optionsInvite: [],
    valueInvite: [],
  }
  
  handleChange(emailInvite) {
    this.setState({emailInvite})
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

        //get and push multiselect option
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(response => {
          response.data.result.map(item => {
            this.state.optionsInvite.push({value: item.user_id, label: item.name});
          });
        })
        .catch(function(error) {
          console.log(error);
        });


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
			<div className="pcoded-content" style={{paddingTop: 20}}>
			<div className="pcoded-inner-content">
			<div className="main-body">
			<div className="page-wrapper">
			
        <Row>
              
          {/* <div className="col-md-4 col-xl-4 mb-3">
            <Link to={`/`} className="menu-mati">
              <div className="kategori title-disabled">
              <img src="/assets/images/component/kursusoff.png" className="img-fluid" alt="media" />
              &nbsp;
              Kursus & Materi
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-xl-4 mb-3">
            <Link to={`/forum`} className="menu-mati">
              <div className="kategori title-disabled">
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
          </div> */}

          <Col sm={12} style={{marginBottom: '20px'}}>
            <h3 className="f-20 f-w-800">
              {classRooms.room_name}
              <Link onClick={this.onClickInvite} to="#" className="float-right btn btn-sm btn-ideku" style={{padding: '5px 10px'}}>
                <i className="fa fa-user"></i>Invite People
              </Link>
            </h3>
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
                          <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Invite User
                          </Form.Label>
                          <MultiSelect
                            id="peserta"
                            options={this.state.optionsInvite}
                            value={this.state.valueInvite}
                            onChange={valueInvite => this.setState({ valueInvite })}
                            mode="tags"
                            removableTags={true}
                            hasSelectAll={true}
                            selectAllLabel="Pilih Semua"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih"
                          />
                          <Form.Text className="text-muted">
                            Pilih user yang ingin diundang.
                          </Form.Text>
                        </Form.Group>
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>Email</label>
                <TagsInput
                  value={this.state.emailInvite}
                  onChange={this.handleChange.bind(this)}
                  addOnPaste={true}
                  inputProps={{placeholder:'Email Peserta'}}
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