import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import { 
	Tab, Tabs
} from 'react-bootstrap';

import Storage from './../../../repository/storage';
import {headerTabble, bodyTabble, bodyTabbleWebinar, dataFiles, headerFiles, tasks, options} from './../data';

import TableMeetings from './meeting';
import TableWebinar from './webinar';
import GanttChart from './ganttChart/index';
import TableFiles from './files';

const titleTabs = [
  {name: 'Semua'},
  {name: 'Meeting'},
  {name: 'Webinar'},
  {name: 'Timeline Chart'},
  {name: 'Files'}
]

export default class User extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      access_project_admin: false,
      contentAll : true,
      contentMeeting : true,
      contentWebinar : true,
      contentGanttChart : true,
      contentFiles : true,
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

  choiceTab(item){
    console.log(item,'tabbb wooiii')
    if(item === 'Semua') return this.setState({contentAll: true,contentMeeting: true,contentWebinar: true,contentGanttChart: true,contentFiles: true});
    if(item === 'Meeting') return this.setState({contentAll: false,contentMeeting: true,contentWebinar: false,contentGanttChart: false,contentFiles: false});
    if(item === 'Webinar') return this.setState({contentAll: false,contentMeeting: false,contentWebinar: true,contentGanttChart: false,contentFiles: false});
    if(item === 'Gantt Chart') return this.setState({contentAll: false,contentMeeting: false,contentWebinar: false,contentGanttChart: true,contentFiles: false});
    if(item === 'Files') return this.setState({contentAll: false,contentMeeting: false,contentWebinar: false,contentGanttChart: false,contentFiles: true});
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
                      {/* Tab */}
                      <div className="card mb-2" style={{padding: '20px 0px 0px 20px', alignItems:'flex-end'}}>
                          <Tabs defaultActiveKey="Semua" id="uncontrolled-tab-example" onSelect={this.choiceTab.bind(this)}>
                            {titleTabs.map(tab =>{
                              return (
                                <Tab eventKey={tab.name} title={tab.name} ></Tab>    
                              )
                            })}
                          </Tabs>
                      </div>
                    </div>
                    
                    <div className={this.state.contentMeeting ? "col-xl-12" : "hidden"}>
                      <TableMeetings access_project_admin={this.state.access_project_admin} headerTabble={headerTabble} bodyTabble={bodyTabble} projectId={this.props.match.params.project_id}/>
                    </div>
                    <div className={this.state.contentWebinar ? "col-xl-12" : "hidden"}>
                      <TableWebinar headerTabble={headerTabble} bodyTabble={bodyTabbleWebinar}/>
                    </div>
                    <div className={this.state.contentGanttChart ? "col-xl-12" : "hidden"}>
                      <GanttChart />
                    </div>
                    <div className={this.state.contentFiles ? "col-xl-12" : "hidden"}>
                      <TableFiles headerTabble={headerFiles} bodyTabble={dataFiles}/>
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
