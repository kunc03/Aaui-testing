import React, { Component } from "react";
import Storage from '../../../repository/storage';
import Gantt from '../Gantt';
import API, { API_SERVER, USER_ME } from '../../../repository/api';

class GanttReport extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      users: [],
      selectedUser: Storage.get("user").data.user_id
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
          this.setState({ users: response.data.result.reverse() });
          this.sortData('name');
        })
        .catch(function(error) {
          console.log(error);
        });
      }
    });
  }

  changeUser = (e) => {
    this.setState({selectedUser: e.target.value})
  }
  componentDidMount(){
    this.fetchUsers()
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
                            <select className="gantt-report-select" name="users" value={this.state.selectedUser} onChange={this.changeUser}>
                              {
                                this.state.users.map(item=>
                                <option value={item.user_id}>{item.name}</option>
                                )
                              }
                            </select>
                          }
                          <Gantt userId={this.state.selectedUser}/>
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
