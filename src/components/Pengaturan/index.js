import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import ModalEmail from './modalemail';
import { Link, NavLink, Switch, Route } from 'react-router-dom';
import ModalPassword from './modalpassword';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import Profile from '../Profile/index';
import Notification from "../Global_setting/notification"

import ProjectAdmin from '../Global_setting/projectAdmin';
import Secretary from '../Global_setting/secretary';
import Moderator from '../Global_setting/moderator';
import Speaker from '../Global_setting/speaker';
import Participant from '../Global_setting/participant';

const ZOOM_API_KEY        = "TRFWZeTPTQGtFcnhA_06fA"
const ZOOM_REDIRECT_URL   = "http://localhost:3000/zoom/callback"


class Pengaturan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      email: Storage.get('user').data.email,

      userId: Storage.get('user').data.user_id,
      confirm1: '',
      confirm2: '',
      confirm3: '',
      confirm4: '',
      confirm5: '',
      confirm6: '',
      confirm7: '',
      confirm8: '',
      confirm9: '',

      index: 0,
      security: true,
      profile: false,
      globalSetting: false,
      webinar: false,
      meeting: false,
      notification: false,
      gSetting: [],
      projectAdmin: true,
      secretary: false,
      moderator: false,
      speaker: false,
      participant: false,

      zoom: false,
      checkZoom: [],

      isModalResponse: false,
    };
  }

  handleModalResponse = (e) => {
    this.setState({ isModalResponse: false });
  };

  handleOnChangeInput = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    this.setState({ [name]: checked });
  };

  componentDidMount() {
    this.fetchData();
    this.fetchGlobalSettings(Storage.get('user').data.company_id);
    this.fetchSyncZoom(Storage.get('user').data.user_id)
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  fetchSyncZoom(userId) {
    API.get(`${API_SERVER}v3/zoom/user/${userId}`).then(res => {
      if (res.status === 200) {
        this.setState({ checkZoom: res.data.result })
      }
    })
  }

  onClickSubmitSetting = (e) => {
    let formData = {
      confirm_1: this.state.confirm1 ? '1' : '0',
      confirm_2: this.state.confirm2 ? '1' : '0',
      confirm_3: this.state.confirm3 ? '1' : '0',
      confirm_4: this.state.confirm4 ? '1' : '0',
      confirm_5: this.state.confirm5 ? '1' : '0',
      confirm_6: this.state.confirm6 ? '1' : '0',
      confirm_7: this.state.confirm7 ? '1' : '0',
      confirm_8: this.state.confirm8 ? '1' : '0',
      confirm_9: this.state.confirm9 ? '1' : '0',
    };

    API.put(`${API_SERVER}v1/setting/user/${this.state.userId}`, formData).then((res) => {
      if (res.status === 200) {
        this.setState({ isModalResponse: true });
      }
    });
  };

  fetchData() {
    let stringUrl = `${API_SERVER}v1/setting/user/${Storage.get('user').data.user_id}`;
    API.get(stringUrl).then((res) => {
      if (res.status === 200) {
        console.log('response: ', res.data.result);
        this.setState({
          confirm1: res.data.result.confirm_1 !== 1 ? false : true,
          confirm2: res.data.result.confirm_2 !== 1 ? false : true,
          confirm3: res.data.result.confirm_3 !== 1 ? false : true,
          confirm4: res.data.result.confirm_4 !== 1 ? false : true,
          confirm5: res.data.result.confirm_5 !== 1 ? false : true,
          confirm6: res.data.result.confirm_6 !== 1 ? false : true,
          confirm7: res.data.result.confirm_7 !== 1 ? false : true,
          confirm8: res.data.result.confirm_8 !== 1 ? false : true,
          confirm9: res.data.result.confirm_9 !== 1 ? false : true,
        });
        if (res.data.result.is_new_password === 0) {
          document.getElementById('changePass').click();
        }
      }
    });
  }

  tabTitle(a) {
    if (a === 'Project Admin') {
      this.setState({ projectAdmin: true, secretary: false, moderator: false, speaker: false, participant: false });
    } else if (a === 'secretary') {
      this.setState({ projectAdmin: false, secretary: true, moderator: false, speaker: false, participant: false });
    } else if ( a === 'moderator'){
      this.setState({ projectAdmin: false, secretary: false, moderator: true, speaker: false, participant: false})
    }
    else if ( a === 'speaker'){
      this.setState({ projectAdmin: false, secretary: false, moderator: false, speaker: true, participant: false})
    }
    else{
      this.setState({ projectAdmin: false, secretary: false, moderator: false, speaker: false, participant: true})
    }
  }
  tabChoice(a) {
    if (a === 'security') {
      this.setState({
        security: true,
        profile: false,
        webinar: false,
        meeting: false,
        notification: false,
        zoom: false
      });
    } else if (a === 'profile') {
      this.setState({
        security: false,
        profile: true,
        webinar: false,
        meeting: false,
        notification: false,
        zoom: false
      });
    } else if (a === 'webinar') {
      this.setState({
        security: false,
        profile: false,
        webinar: true,
        meeting: false,
        notification: false,
        zoom: false
      });
    } else if (a === 'meeting') {
      this.setState({
        security: false,
        profile: false,
        webinar: false,
        meeting: true,
        notification: false,
        zoom: false
      });
    }
    else if (a === 'zoom') {
      this.setState({
        security: false,
        profile: false,
        webinar: false,
        meeting: false,
        notification: false,
        zoom: true
      });
    }
    else  {
      this.setState({
        security: false,
        profile: false,
        webinar: false,
        meeting: false,
        notification: true,
        zoom: false
      });
    }
  }

  fetchGlobalSettings(companyId)
  {
    API.get(`${API_SERVER}v2/global-settings/check-access?company_id=${companyId}`).then(res =>{

      this.setState({ gSetting : res.data.result });
    })
  }

  deauthZoom(e) {
    API.delete(`${API_SERVER}v3/zoom/user/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        this.setState({ checkZoom: [] })
      }
    })
  }

  render() {
    console.log('response: ', this.state);
    let levelUser = Storage.get('user').data.level === 'client' ? false : true;

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: '#F6F6FD' }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">

                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-block">
                          {
                            levelUser ?
                          <div className="row m-b-100" style={{padding: '10px 20px'}}>
                            {/* {menus.map((item, i) => {
                              return (
                                <div className="col-xl-12 p-10 mb-3" style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                  onClick={this.tabChoice.bind(this, 'security')}>
                                  <span className={this.state.security ? 'fc-skyblue' : ''}> Security</span>
                                </div>
                              )
                            })} */}
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'security')}
                            >
                              <span className={this.state.security ? 'fc-skyblue' : ''}>Security</span>
                            </div>
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'profile')}
                            >
                              <span className={this.state.profile ? 'fc-skyblue' : ''}>Profile</span>
                            </div>
                            <div className="col-xl-12 p-10 mb-3">
                              <span className={this.state.globalSetting ? 'fc-skyblue' : ''}>Global Setting</span>
                            </div>

                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'webinar')}
                            >
                              <span style={{marginLeft : '20px'}} className={this.state.webinar ? 'fc-skyblue' : ''}>Webinar</span>
                            </div>
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'meeting')}
                            >
                              <span style={{ marginLeft: '20px'}} className={this.state.meeting ? 'fc-skyblue' : ''}>Meeting</span>
                            </div>

                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'notification')}
                            >
                              <span className={this.state.notification ? 'fc-skyblue' : ''}>Notification</span>
                            </div>
                                
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'zoom')}
                            >
                              <span className={this.state.zoom ? 'fc-skyblue' : ''}>Zoom Account</span>
                            </div>
                                
                          </div>
                          :
                          <div className="row m-b-100">
                            {/* {menus.map((item, i) => {
                              return (
                                <div className="col-xl-12 p-10 mb-3" style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                                  onClick={this.tabChoice.bind(this, 'security')}>
                                  <span className={this.state.security ? 'fc-skyblue' : ''}> Security</span>
                                </div>
                              )
                            })} */}
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'security')}
                            >
                              <span className={this.state.security ? 'fc-skyblue' : ''}>Security</span>
                            </div>
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'profile')}
                            >
                              <span className={this.state.profile ? 'fc-skyblue' : ''}>Profile</span>
                            </div>
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'notification')}
                            >
                              <span className={this.state.notification ? 'fc-skyblue' : ''}>Notification</span>
                            </div>
                                
                            <div
                              className="col-xl-12 p-10 mb-3"
                              style={{ borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}
                              onClick={this.tabChoice.bind(this, 'zoom')}
                            >
                              <span className={this.state.zoom ? 'fc-skyblue' : ''}>Zoom Account</span>
                            </div>
                            
                          </div>
                          }

                        </div>
                      </div>
                    </div>

                    <div className="col-sm-8">
                      <div className="row m-b-100">
                        <div className="col-xl-12">
                          {
                            this.state.zoom ?
                              <div className="card">
                                <div className="card-body">
                                  <h4 className="mb-3">Zoom Sync</h4>

                                  {
                                    this.state.checkZoom.length === 1 ?
                                      <button onClick={e => this.deauthZoom(e)} className="btn btn-danger rounded">Deauthentication</button>
                                      :
                                      <a className="btn btn-primary" href={`https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_API_KEY}&redirect_uri=${ZOOM_REDIRECT_URL}`}>
                                        Connect Zoom
                                      </a>
                                  }
                                </div>
                              </div>
                              : null
                          }

                          {this.state.security ? (
                            <div className="card">
                              <div className="card-block">
                                <div className="row m-b-100">
                                  <div className="col-xl-2">
                                    <h3 className="f-w-bold f-18 fc-blue mb-4">security</h3>
                                  </div>
                                  <div className="col-xl-10">
                                    <form>
                                      <div className="form-group">
                                        <label className="label-input" htmlFor>
                                          Email
                                        </label>
                                        <div className="input-group">
                                          <input
                                            type="email"
                                            disabled
                                            value={this.state.email}
                                            className="form-control"
                                            placeholder="Enter your Old Email"
                                            aria-label="emailModel"
                                            aria-describedby="basic-addon2"
                                          />
                                          <div className="input-group-append">
                                            <button
                                              className="btn btn-icademy-primary ml-2"
                                              data-toggle="modal"
                                              data-target="#modalEmail"
                                              type="button"
                                            >
                                              Edit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label className="label-input" htmlFor>
                                          New Password
                                        </label>
                                        <div className="input-group">
                                          <input
                                            type="password"
                                            className="form-control"
                                            placeholder="**********"
                                            aria-label="**********"
                                            aria-describedby="basic-addon2"
                                          />
                                          <div className="input-group-append">
                                            {/* <span
                                                  className="input-group-text"
                                                  id="basic-addon2"
                                                >
                                                  <i className="fa fa-eye text-c-grey" />
                                                </span> */}
                                            <button
                                              className="btn btn-icademy-primary ml-2"
                                              data-toggle="modal"
                                              data-target="#modalPassword"
                                              type="button"
                                              id="changePass"
                                            >
                                              Edit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={this.onClickSubmitSetting}
                                  className="btn btn-primary btn-block m-t-100 f-20 f-w-600"
                                >
                                  Simpan
                                </button>
                              </div>

                              <ModalEmail
                                show={this.state.isOpen}
                                onClose={this.toggleModal}
                                handleClose={this.toggleModal}
                              >
                                `Here's some content for the modal`
                              </ModalEmail>
                              <ModalPassword show={this.state.isOpen} onClose={this.toggleModal}>
                                `Here's some content for the modal`
                              </ModalPassword>

                              <Modal show={this.state.isModalResponse} onHide={this.handleModalResponse}>
                                <Modal.Body>
                                  <Modal.Title className="text-c-purple3 f-w-bold">Confirmation</Modal.Title>
                                  <p className="f-w-bold">Change user settings have been saved.</p>
                                  <button
                                    style={{ marginTop: '50px' }}
                                    type="button"
                                    className="btn btn-block f-w-bold"
                                    onClick={this.handleModalResponse}
                                  >
                                    Close
                                  </button>
                                </Modal.Body>
                              </Modal>
                            </div>
                          ) : this.state.profile ? (
                            <Profile />
                          ) : this.state.webinar ? (
                            <div className="row">
                              <div className="col">
                                <div className="row">
                                  <div className="col-sm-8">
                                    <h3 className="f-w-bold f-21 fc-blue mb-4">Global Settings | <span className="fc-black f-18">Webinar</span></h3>
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-xl-12">
                                    <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">


                                      <li className={`nav-item`} activeClassname="active">
                                        <div
                                          className="col-xl-12 p-10 mb-3"
                                          style={{ cursor: 'pointer' }}
                                          onClick={this.tabTitle.bind(this, 'Project Admin')}
                                        >
                                          <span className={this.state.projectAdmin ? 'fc-skyblue' : ''}>Project Admin</span>
                                        </div>
                                      </li>

                                      <li className={`nav-item`}>
                                        <div
                                          className="col-xl-12 p-10 mb-3"
                                          style={{ cursor: 'pointer' }}
                                          onClick={this.tabTitle.bind(this, 'secretary')}
                                        >
                                          <span className={this.state.secretary ? 'fc-skyblue' : ''}>Secretary</span>
                                        </div>
                                      </li>

                                      <li className={`nav-item`}>
                                        <div
                                          className="col-xl-12 p-10 mb-3"
                                          style={{ cursor: 'pointer' }}
                                          onClick={this.tabTitle.bind(this, 'moderator')}
                                        >
                                          <span className={this.state.moderator ? 'fc-skyblue' : ''}>Moderator</span>
                                        </div>
                                      </li>
                                      <li className={`nav-item`}>
                                        <div
                                          className="col-xl-12 p-10 mb-3"
                                          style={{ cursor: 'pointer' }}
                                          onClick={this.tabTitle.bind(this, 'speaker')}
                                        >
                                          <span className={this.state.speaker ? 'fc-skyblue' : ''}>Speaker</span>
                                        </div>
                                      </li>
                                      <li className={`nav-item`}>
                                        <div
                                          className="col-xl-12 p-10 mb-3"
                                          style={{ cursor: 'pointer' }}
                                          onClick={this.tabTitle.bind(this, 'participant')}
                                        >
                                          <span className={this.state.participant ? 'fc-skyblue' : ''}>Participant</span>
                                        </div>
                                      </li>
                                    </ul>

                                    { this.state.projectAdmin ?
                                      <ProjectAdmin />
                                      :
                                      this.state.secretary ?
                                      <Secretary />
                                      :
                                      this.state.moderator ?
                                      <Moderator sub="webinar" />
                                      :
                                      this.state.speaker ?
                                      <Speaker />
                                      :
                                      <Participant sub="webinar" />

                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            this.state.meeting ? (
                              <div className="row">
                                <div className="col">
                                  <div className="row">
                                    <div className="col-sm-8">
                                      <h3 className="f-w-bold f-21 fc-blue mb-4">Global Settings | <span className="fc-black f-18"> Meeting</span></h3>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-xl-12">
                                      <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">
                                        <li className={`nav-item`}>
                                          <div
                                            className="col-xl-12 p-10 mb-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.tabTitle.bind(this, 'Project Admin')}
                                          >
                                            <span className={this.state.projectAdmin ? 'fc-skyblue' : ''} activeClassname='active'>Project Admin</span>
                                          </div>
                                        </li>

                                        {/* <li className={`nav-item`}>
                                          <div
                                            className="col-xl-12 p-10 mb-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.tabTitle.bind(this, 'secretary')}
                                          >
                                            <span className={this.state.meeting ? 'fc-skyblue' : ''}>Secretary</span>
                                          </div>
                                        </li> */}
                                        <li className={`nav-item`}>
                                          <div
                                            className="col-xl-12 p-10 mb-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.tabTitle.bind(this, 'moderator')}
                                          >
                                            <span className={this.state.moderator ? 'fc-skyblue' : ''}>Moderator</span>
                                          </div>
                                        </li>
                                        {/* <li className={`nav-item`}>
                                          <div
                                            className="col-xl-12 p-10 mb-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.tabTitle.bind(this, 'speaker')}
                                          >
                                            <span className={this.state.meeting ? 'fc-skyblue' : ''}>Speaker</span>
                                          </div>
                                        </li> */}
                                        <li className={`nav-item`}>
                                          <div
                                            className="col-xl-12 p-10 mb-3"
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.tabTitle.bind(this, 'participant')}
                                          >
                                            <span className={this.state.participant ? 'fc-skyblue' : ''}>Participant</span>
                                          </div>
                                        </li>
                                      </ul>

                                      { this.state.projectAdmin ?
                                        <ProjectAdmin />
                                        :
                                        // this.state.secretary ?
                                        //   <Secretary />
                                        // :
                                        this.state.moderator ?
                                        <Moderator sub="meeting"/>
                                        :
                                        // this.state.speaker ?
                                        // <Speaker />
                                        // :
                                        <Participant sub="meeting" />

                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) :

                            <Notification />

                          )}
                        </div>
                      </div>
                    </div>
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

export default Pengaturan;
