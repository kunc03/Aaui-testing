import React, { Component } from "react";
import API, { API_SERVER, APPS_SERVER, USER_ME } from '../../repository/api';
// import '../ganttChart/node_modules/@trendmicro/react-dropdown/dist/react-dropdown.css';
import {
  Tab, Tabs
} from 'react-bootstrap';

import Storage from '../../repository/storage';

import TableMeetings from '../meeting/meeting';
import TableWebinar from '../webinar/webinar';
import GanttChart from '../ganttChart/index';
import TableFiles from '../files/_files';
import Gantt from '../Gantt';
import { MultiSelect } from 'react-sm-select';

const titleTabs = [
  { name: 'Semua' },
  { name: 'Meeting' },
  { name: 'Webinar' },
  { name: 'Timeline Chart' },
  { name: 'Files' }
]

export default class User extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);

    this.state = {
      projectName: '',
      dataUser: [],
      access_project_admin: false,
      contentAll: true,
      contentMeeting: true,
      contentWebinar: true,
      contentGanttChart: true,
      contentFiles: true,
      currentZoom: 'Days',
      visibility: 'public',
      users: [],
      valUsers: [],

      projectId: this.props.match.params.project_id,
      userId: Storage.get('user').data.user_id,
    };
  }

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }
  goBack() {
    this.props.history.goBack();
  }

  checkProjectAccess() {
    API.get(`${API_SERVER}v1/project-access/${this.state.projectId}/${this.state.userId}`).then(res => {
      if (res.status === 200) {
        let levelUser = Storage.get('user').data.level;
        if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client') {
          this.setState({
            access_project_admin: true,
          })
        }
        else {
          this.setState({
            access_project_admin: false,
          })
        }
      }
    })
  }

  getProject() {
    API.get(`${API_SERVER}v1/project-read/${this.state.projectId}`).then(res => {
      if (res.status === 200) {
        this.setState({ projectName: res.data.result.name })
      }
    })
  }

  choiceTab(item) {
    console.log(item, 'tabbb wooiii')
    if (item === 'Semua') return this.setState({ contentAll: true, contentMeeting: true, contentWebinar: true, contentGanttChart: true, contentFiles: true });
    if (item === 'Meeting') return this.setState({ contentAll: false, contentMeeting: true, contentWebinar: false, contentGanttChart: false, contentFiles: false });
    if (item === 'Webinar') return this.setState({ contentAll: false, contentMeeting: false, contentWebinar: true, contentGanttChart: false, contentFiles: false });
    if (item === 'Timeline Chart') return this.setState({ contentAll: false, contentMeeting: false, contentWebinar: false, contentGanttChart: true, contentFiles: false });
    if (item === 'Files') return this.setState({ contentAll: false, contentMeeting: false, contentWebinar: false, contentGanttChart: false, contentFiles: true });
  }

  fetchUsers(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ myCompanyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

        API.get(`${API_SERVER}v1/user/company/${this.state.myCompanyId}`).then(response => {
          response.data.result.map(item => {
            this.state.users.push({value: item.user_id, label: item.name});
          });
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    });
  }
  changeUser = (val) => {
    this.setState({valUsers: val})
  }
  componentDidMount(){
    this.checkProjectAccess()
    this.getProject()
    this.fetchUsers()
  }

  changeVisibility = e => {
    this.setState({visibility: e.target.value})
  }

  render() {
    const { currentZoom } = this.state;
    let levelUser = Storage.get('user').data.level;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="floating-back">
                    <a href={APPS_SERVER}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                    </a>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      {/* Tab */}
                      <div className="card mb-2" style={{ padding: '20px 0px 0px 20px', alignItems: 'flex-end' }}>
                        <div style={{ position: 'absolute', left: 20 }}>
                          <h4>{this.state.projectName}</h4>
                        </div>
                        <Tabs defaultActiveKey="All" id="uncontrolled-tab-example" onSelect={this.choiceTab.bind(this)}>
                          {titleTabs.map(tab => {
                            return (
                              <Tab eventKey={tab.name} title={tab.name} ></Tab>
                            )
                          })}
                        </Tabs>
                      </div>
                    </div>

                    <div className={this.state.contentMeeting ? "col-xl-12" : "hidden"}>
                      <TableMeetings access_project_admin={this.state.access_project_admin} projectId={this.state.projectId} />
                    </div>
                    <div className={this.state.contentWebinar ? "col-xl-12" : "hidden"}>
                      <TableWebinar access_project_admin={this.state.access_project_admin} projectId={this.state.projectId} />
                    </div>
                    <div className={this.state.contentGanttChart ? "col-xl-12" : "hidden"}>
                      {/* <GanttChart access_project_admin={this.state.access_project_admin} projectId={this.state.projectId} /> */}
                      <div className="gantt-container">
                        <div className="m-t-10 m-b-10">
                          <select value={this.state.visibility} onChange={this.changeVisibility} style={{float:'right', marginBottom: 10, width:200, height:40, marginLeft: 10}}>
                              {levelUser !== 'client' && <option value='all'>All</option>}
                              <option value='public'>Public</option>
                              <option value='private'>Private</option>
                          </select>
                          {levelUser !== 'client' &&
                          <div style={{width:300, float:'right', backgroundColor:'#FFF'}}>
                              <MultiSelect
                                id={`users`}
                                options={this.state.users}
                                value={this.state.valUsers}
                                onChange={valUsers => this.changeUser(valUsers)}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Filter Users"
                                hasSelectAll
                              />
                          </div>
                          }
                        </div>
                      <Gantt projectId={this.state.projectId} userId={this.state.valUsers.length === 0 ? false : this.state.valUsers} visibility={this.state.visibility}/>
                      </div>
                    </div>
                    <div className={this.state.contentFiles ? "col-xl-12" : "hidden"}>
                      <TableFiles access_project_admin={this.state.access_project_admin} projectId={this.state.projectId} />
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
