import React from 'react';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from "react-toastify";

import TableFiles from '../files/_files';

class Folder extends React.Component  {

  state = {
    projectAdmin: Storage.get('user').data.level === "admin" ? true : false,
    projectId: '',
    companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id
  }

  componentDidMount() {
    API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${Storage.get('user').data.company_id}`).then(response => {
      if(response.data.result.length) {
        this.setState({ projectId: response.data.result[0].id })
      } else {
        toast.warning(`Buat project terlebih dahulu.`)
      }
    })
  }

  render() {

    return (
      <div class="row mt-3">
        <div className="col-sm-12">
          {this.state.projectId && <TableFiles access_project_admin={this.state.projectAdmin} projectId={this.state.projectId} companyId={this.state.companyId} />}
        </div>
      </div>
    )
  }
}

export default Folder;
