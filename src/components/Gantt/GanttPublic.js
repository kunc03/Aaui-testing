import React, { Component } from 'react';
import Gantt from './Gantt';
import API, { API_SERVER } from '../../repository/api';
import { MultiSelect } from 'react-sm-select';
import Storage from '../../repository/storage';

export default class GanttPublic extends Component {

	state = {
		access_project_admin: false,
		visibility: 'all',
		users: [],
		valUsers: []
  	}
  checkProjectAccess() {
    API.get(`${API_SERVER}v1/project-access/${this.props.match.params.projectId}/${this.props.match.params.userId}`).then(res => {
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
  fetchUsers(){
        API.get(`${API_SERVER}v1/public/user/company/${this.props.match.params.companyId}`).then(response => {
          response.data.result.map(item => {
            this.state.users.push({value: item.user_id, label: item.name});
          });
        })
        .catch(function(error) {
          console.log(error);
        });
  }
  componentDidMount(){
	this.checkProjectAccess()
	this.fetchUsers()
  }
  changeVisibility = e => {
    this.setState({visibility: e.target.value})
  }
  changeUser = (val) => {
    this.setState({valUsers: val})
  }

	render() {
		let levelUser = Storage.get('user').data.level;
		return (
			<div>
			<div className="m-t-10 m-b-10">
			  <select value={this.state.visibility} onChange={this.changeVisibility} style={{float:'right', marginBottom: 10, width:200, height:40, marginLeft: 10, border: '1px solid #ced4da', borderRadius:'.25rem', color:'#949ca6'}}>
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
            <Gantt access_project_admin={this.state.access_project_admin} projectId={this.props.match.params.projectId} userId={this.state.valUsers.length === 0 ? false : this.state.valUsers} visibility={this.state.visibility}/>
			</div>
		);
	}

}