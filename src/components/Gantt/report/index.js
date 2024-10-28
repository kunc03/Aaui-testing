import React, { Component } from "react";
import Storage from '../../../repository/storage';
import Gantt from '../Gantt';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import { MultiSelect } from 'react-sm-select';

class GanttReport extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      users: [],
      projects: [],
      valUsers: [],
      valProjects: []
    }
  }
  goBack(){
    this.props.history.goBack();
  }

  sortData = (name) => {
    let userdata = this.state.users;
    if (this.state.direction === 'ascending') {
      this.setState({direction: 'descending'})
    }
    else{
      this.setState({direction: 'ascending'})
    }
    let direction = this.state.direction
    userdata.sort((a,b)=>{
      if (a[name] < b[name]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if ([name] > b[name]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    this.setState({users:userdata});
}

  fetchUsers(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ myCompanyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

        API.get(`${API_SERVER}v1/user/company/${this.state.myCompanyId}`).then(response => {
          response.data.result.map(item => {
            this.state.users.push({value: item.user_id, label: item.name});
          });
          this.setState({valUsers : [Storage.get("user").data.user_id]})
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    });
  }

  fetchProject(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
          response.data.result.map(item => {
            this.state.projects.push({value: item.id, label: item.title});
          });
        }).catch(function(error) {
          console.log(error);
        });
      }
    })
  }

  changeUser = (val) => {
    this.setState({valUsers: val})
  }
  changeProject = (val) => {
    this.setState({valProjects: val})
  }
  componentDidMount(){
    this.fetchUsers()
    this.fetchProject()
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return(
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
                        <div className="gantt-container">
                          {
                          levelUser !== 'client' &&
                          <div className="row col-xl-12" style={{justifyContent:'flex-end', marginBottom:10}}>
                            <div style={{width:300, float:'right', backgroundColor:'#FFF', marginRight: 10}}>
                              <MultiSelect
                                id={`projects`}
                                options={this.state.projects}
                                value={this.state.valProjects}
                                onChange={valProjects => this.changeProject(valProjects)}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Filter Projects"
                                hasSelectAll
                              />
                            </div>
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
                          </div>
                          }
                          <div className="row col-xl-12" style={{width:'100%'}}>
                            <Gantt userId={this.state.valUsers} visibility='all' projectId={this.state.valProjects.length === 0 ? false : this.state.valProjects}/>
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
    )
  }
}

export default GanttReport;
