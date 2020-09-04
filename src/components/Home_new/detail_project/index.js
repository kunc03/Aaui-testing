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

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      
    };
  }

  render() {

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <Link to="/" className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                    ></img>
                  </Link>
                  <div className="row">
                    <div className="col-xl-12">
                      {/* Table Meeting */}
                      <TableMeetings headerTabble={headerTabble} bodyTabble={bodyTabble} projectId={this.props.match.params.project_id}/>
                      
                    </div>
                    <div className="col-xl-12">
                      {/* Table Webinar */}
                      <TableWebinar headerTabble={headerTabble} bodyTabble={bodyTabbleWebinar}/>
                      
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
