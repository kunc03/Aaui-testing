import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import Storage from './../../../repository/storage';
import {headerTabble, bodyTabble, bodyTabbleWebinar, tasks, options} from './../data';

import TableMeetings from './meeting';
import TableWebinar from './webinar';
import GanttChart from './ganttChart';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      access_project_admin: false
      
    };
  }
  goBack(){
    this.props.history.goBack();
  }
  checkProjectAccess(){
    API.get(`${API_SERVER}v1/project-access/${this.props.match.params.project_id}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        let levelUser = Storage.get('user').data.level;
        if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client' ){
          this.setState({
            access_project_admin: true,
          })
        }
        else{
          this.setState({
            access_project_admin: false,
          })
        }
      }
    })
  }

  componentDidMount(){
    this.checkProjectAccess()
  }

  render() {
    
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                      onClick={this.goBack}
                    ></img>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      {/* Table Meeting */}
                      <TableMeetings access_project_admin={this.state.access_project_admin} headerTabble={headerTabble} bodyTabble={bodyTabble} projectId={this.props.match.params.project_id}/>
                      
                    </div>
                    <div className="col-xl-12">
                      {/* Table Webinar */}
                      <TableWebinar projectId={this.props.match.params.project_id} headerTabble={headerTabble} bodyTabble={bodyTabbleWebinar}/>
                      
                    </div>
                    <div className="col-xl-12">
                      {/* Table Meeting */}
                      {/* <GanttChart /> */}
                      
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
